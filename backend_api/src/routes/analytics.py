from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta, date
from sqlalchemy import func, desc
import json
from ..models.user import db, User
from ..models.business import Business
from ..models.subscription import Subscription
from ..models.analytics import UserActivity, BusinessAnalytics, PlatformMetrics, SearchAnalytics

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/track-activity', methods=['POST'])
def track_activity():
    """Track user activity for analytics"""
    try:
        data = request.get_json()
        
        activity = UserActivity(
            user_id=data.get('user_id'),
            session_id=data.get('session_id', 'anonymous'),
            activity_type=data.get('activity_type'),
            page_url=data.get('page_url'),
            referrer=data.get('referrer'),
            business_id=data.get('business_id'),
            search_query=data.get('search_query'),
            category=data.get('category'),
            location=data.get('location'),
            user_agent=request.headers.get('User-Agent'),
            ip_address=request.remote_addr,
            device_type=data.get('device_type'),
            duration=data.get('duration')
        )
        
        db.session.add(activity)
        db.session.commit()
        
        # Update business analytics if business interaction
        if data.get('business_id') and data.get('activity_type') in ['view_business', 'phone_click', 'website_click', 'direction_request']:
            update_business_analytics(data.get('business_id'), data.get('activity_type'))
        
        return jsonify({'success': True, 'message': 'Activity tracked'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/track-search', methods=['POST'])
def track_search():
    """Track search queries and results"""
    try:
        data = request.get_json()
        
        search = SearchAnalytics(
            user_id=data.get('user_id'),
            session_id=data.get('session_id', 'anonymous'),
            query=data.get('query'),
            category=data.get('category'),
            location=data.get('location'),
            filters_used=json.dumps(data.get('filters', {})),
            results_count=data.get('results_count', 0),
            clicked_business_id=data.get('clicked_business_id'),
            click_position=data.get('click_position')
        )
        
        db.session.add(search)
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Search tracked'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/business/<int:business_id>/analytics', methods=['GET'])
def get_business_analytics(business_id):
    """Get analytics for a specific business"""
    try:
        # Get date range from query params
        days = int(request.args.get('days', 30))
        start_date = date.today() - timedelta(days=days)
        
        # Get business analytics
        analytics = BusinessAnalytics.query.filter(
            BusinessAnalytics.business_id == business_id,
            BusinessAnalytics.date >= start_date
        ).order_by(BusinessAnalytics.date.desc()).all()
        
        # Calculate totals
        total_views = sum(a.profile_views for a in analytics)
        total_unique_visitors = sum(a.unique_visitors for a in analytics)
        total_search_appearances = sum(a.search_appearances for a in analytics)
        total_phone_clicks = sum(a.phone_clicks for a in analytics)
        total_website_clicks = sum(a.website_clicks for a in analytics)
        total_direction_requests = sum(a.direction_requests for a in analytics)
        
        # Get recent activity
        recent_activity = UserActivity.query.filter(
            UserActivity.business_id == business_id,
            UserActivity.timestamp >= datetime.now() - timedelta(days=days)
        ).order_by(UserActivity.timestamp.desc()).limit(50).all()
        
        # Get search queries that led to this business
        search_queries = db.session.query(
            SearchAnalytics.query,
            func.count(SearchAnalytics.id).label('count')
        ).filter(
            SearchAnalytics.clicked_business_id == business_id,
            SearchAnalytics.search_time >= datetime.now() - timedelta(days=days)
        ).group_by(SearchAnalytics.query).order_by(desc('count')).limit(10).all()
        
        return jsonify({
            'success': True,
            'business_id': business_id,
            'date_range': {
                'start_date': start_date.isoformat(),
                'end_date': date.today().isoformat(),
                'days': days
            },
            'totals': {
                'profile_views': total_views,
                'unique_visitors': total_unique_visitors,
                'search_appearances': total_search_appearances,
                'phone_clicks': total_phone_clicks,
                'website_clicks': total_website_clicks,
                'direction_requests': total_direction_requests
            },
            'daily_analytics': [a.to_dict() for a in analytics],
            'recent_activity': [a.to_dict() for a in recent_activity],
            'top_search_queries': [{'query': q[0], 'count': q[1]} for q in search_queries]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/business/<int:business_id>/performance', methods=['GET'])
def get_business_performance(business_id):
    """Get business performance metrics and insights"""
    try:
        business = Business.query.get(business_id)
        if not business:
            return jsonify({'error': 'Business not found'}), 404
        
        # Get performance data for last 30 days
        thirty_days_ago = date.today() - timedelta(days=30)
        sixty_days_ago = date.today() - timedelta(days=60)
        
        # Current period analytics
        current_analytics = BusinessAnalytics.query.filter(
            BusinessAnalytics.business_id == business_id,
            BusinessAnalytics.date >= thirty_days_ago
        ).all()
        
        # Previous period analytics for comparison
        previous_analytics = BusinessAnalytics.query.filter(
            BusinessAnalytics.business_id == business_id,
            BusinessAnalytics.date >= sixty_days_ago,
            BusinessAnalytics.date < thirty_days_ago
        ).all()
        
        # Calculate metrics
        current_views = sum(a.profile_views for a in current_analytics)
        previous_views = sum(a.profile_views for a in previous_analytics)
        views_change = ((current_views - previous_views) / max(previous_views, 1)) * 100
        
        current_searches = sum(a.search_appearances for a in current_analytics)
        previous_searches = sum(a.search_appearances for a in previous_analytics)
        search_change = ((current_searches - previous_searches) / max(previous_searches, 1)) * 100
        
        # Get category ranking
        category_businesses = Business.query.filter_by(category=business.category).all()
        business_scores = []
        
        for biz in category_businesses:
            recent_analytics = BusinessAnalytics.query.filter(
                BusinessAnalytics.business_id == biz.id,
                BusinessAnalytics.date >= thirty_days_ago
            ).all()
            
            score = sum(a.profile_views + a.search_appearances for a in recent_analytics)
            business_scores.append((biz.id, score))
        
        business_scores.sort(key=lambda x: x[1], reverse=True)
        category_rank = next((i + 1 for i, (bid, _) in enumerate(business_scores) if bid == business_id), len(business_scores))
        
        return jsonify({
            'success': True,
            'business_id': business_id,
            'performance': {
                'profile_views': {
                    'current': current_views,
                    'previous': previous_views,
                    'change_percent': round(views_change, 1)
                },
                'search_appearances': {
                    'current': current_searches,
                    'previous': previous_searches,
                    'change_percent': round(search_change, 1)
                },
                'category_ranking': {
                    'rank': category_rank,
                    'total_in_category': len(category_businesses),
                    'category': business.category
                }
            },
            'insights': generate_business_insights(business_id, current_analytics, previous_analytics)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/platform/metrics', methods=['GET'])
def get_platform_metrics():
    """Get platform-wide metrics (admin only)"""
    try:
        days = int(request.args.get('days', 30))
        start_date = date.today() - timedelta(days=days)
        
        # Get platform metrics
        metrics = PlatformMetrics.query.filter(
            PlatformMetrics.date >= start_date
        ).order_by(PlatformMetrics.date.desc()).all()
        
        # Calculate current totals
        total_users = User.query.count()
        active_subscriptions = Subscription.query.filter_by(status='active').count()
        total_businesses = Business.query.count()
        
        # Recent activity summary
        recent_searches = SearchAnalytics.query.filter(
            SearchAnalytics.search_time >= datetime.now() - timedelta(days=days)
        ).count()
        
        recent_views = UserActivity.query.filter(
            UserActivity.activity_type == 'view_business',
            UserActivity.timestamp >= datetime.now() - timedelta(days=days)
        ).count()
        
        return jsonify({
            'success': True,
            'current_totals': {
                'total_users': total_users,
                'active_subscriptions': active_subscriptions,
                'total_businesses': total_businesses,
                'recent_searches': recent_searches,
                'recent_views': recent_views
            },
            'daily_metrics': [m.to_dict() for m in metrics]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/user/<int:user_id>/activity', methods=['GET'])
def get_user_activity(user_id):
    """Get user activity history"""
    try:
        days = int(request.args.get('days', 30))
        start_date = datetime.now() - timedelta(days=days)
        
        activities = UserActivity.query.filter(
            UserActivity.user_id == user_id,
            UserActivity.timestamp >= start_date
        ).order_by(UserActivity.timestamp.desc()).limit(100).all()
        
        # Activity summary
        activity_counts = db.session.query(
            UserActivity.activity_type,
            func.count(UserActivity.id).label('count')
        ).filter(
            UserActivity.user_id == user_id,
            UserActivity.timestamp >= start_date
        ).group_by(UserActivity.activity_type).all()
        
        return jsonify({
            'success': True,
            'user_id': user_id,
            'activities': [a.to_dict() for a in activities],
            'activity_summary': [{'type': ac[0], 'count': ac[1]} for ac in activity_counts]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def update_business_analytics(business_id, activity_type):
    """Update business analytics based on activity"""
    try:
        today = date.today()
        
        # Get or create today's analytics record
        analytics = BusinessAnalytics.query.filter_by(
            business_id=business_id,
            date=today
        ).first()
        
        if not analytics:
            analytics = BusinessAnalytics(business_id=business_id, date=today)
            db.session.add(analytics)
        
        # Update metrics based on activity type
        if activity_type == 'view_business':
            analytics.profile_views += 1
        elif activity_type == 'phone_click':
            analytics.phone_clicks += 1
        elif activity_type == 'website_click':
            analytics.website_clicks += 1
        elif activity_type == 'direction_request':
            analytics.direction_requests += 1
        elif activity_type == 'favorite':
            analytics.favorites_added += 1
        
        db.session.commit()
        
    except Exception as e:
        db.session.rollback()
        print(f"Error updating business analytics: {e}")

def generate_business_insights(business_id, current_analytics, previous_analytics):
    """Generate insights and recommendations for business"""
    insights = []
    
    current_views = sum(a.profile_views for a in current_analytics)
    previous_views = sum(a.profile_views for a in previous_analytics)
    
    if current_views > previous_views * 1.2:
        insights.append({
            'type': 'positive',
            'title': 'Growing Visibility',
            'message': f'Your profile views increased by {((current_views - previous_views) / max(previous_views, 1)) * 100:.1f}% this month!'
        })
    elif current_views < previous_views * 0.8:
        insights.append({
            'type': 'suggestion',
            'title': 'Boost Your Visibility',
            'message': 'Consider updating your business photos or adding special offers to increase engagement.'
        })
    
    # Add more insight logic here
    
    return insights

