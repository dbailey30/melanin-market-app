from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from .user import db

class UserActivity(db.Model):
    __tablename__ = 'user_activities'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # Nullable for anonymous users
    session_id = db.Column(db.String(100), nullable=False)
    
    # Activity details
    activity_type = db.Column(db.String(50), nullable=False)  # 'search', 'view_business', 'review', 'favorite', 'signup', 'login'
    page_url = db.Column(db.String(200), nullable=True)
    referrer = db.Column(db.String(200), nullable=True)
    
    # Target information
    business_id = db.Column(db.Integer, db.ForeignKey('businesses.id'), nullable=True)
    search_query = db.Column(db.String(200), nullable=True)
    category = db.Column(db.String(50), nullable=True)
    location = db.Column(db.String(100), nullable=True)
    
    # Technical details
    user_agent = db.Column(db.String(300), nullable=True)
    ip_address = db.Column(db.String(45), nullable=True)
    device_type = db.Column(db.String(20), nullable=True)  # 'mobile', 'desktop', 'tablet'
    
    # Timestamps
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    duration = db.Column(db.Integer, nullable=True)  # Time spent in seconds
    
    # Relationships
    user = db.relationship('User', backref='activities')
    business = db.relationship('Business', backref='activity_logs')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'session_id': self.session_id,
            'activity_type': self.activity_type,
            'page_url': self.page_url,
            'business_id': self.business_id,
            'search_query': self.search_query,
            'category': self.category,
            'location': self.location,
            'device_type': self.device_type,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'duration': self.duration
        }

class BusinessAnalytics(db.Model):
    __tablename__ = 'business_analytics'
    
    id = db.Column(db.Integer, primary_key=True)
    business_id = db.Column(db.Integer, db.ForeignKey('businesses.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    
    # View metrics
    profile_views = db.Column(db.Integer, default=0)
    unique_visitors = db.Column(db.Integer, default=0)
    search_appearances = db.Column(db.Integer, default=0)
    
    # Engagement metrics
    phone_clicks = db.Column(db.Integer, default=0)
    website_clicks = db.Column(db.Integer, default=0)
    direction_requests = db.Column(db.Integer, default=0)
    favorites_added = db.Column(db.Integer, default=0)
    
    # Review metrics
    reviews_received = db.Column(db.Integer, default=0)
    average_rating = db.Column(db.Float, default=0.0)
    
    # Search metrics
    search_ranking_avg = db.Column(db.Float, default=0.0)
    category_ranking = db.Column(db.Integer, default=0)
    
    # Relationships
    business = db.relationship('Business', backref='analytics')
    
    def to_dict(self):
        return {
            'id': self.id,
            'business_id': self.business_id,
            'date': self.date.isoformat() if self.date else None,
            'profile_views': self.profile_views,
            'unique_visitors': self.unique_visitors,
            'search_appearances': self.search_appearances,
            'phone_clicks': self.phone_clicks,
            'website_clicks': self.website_clicks,
            'direction_requests': self.direction_requests,
            'favorites_added': self.favorites_added,
            'reviews_received': self.reviews_received,
            'average_rating': self.average_rating,
            'search_ranking_avg': self.search_ranking_avg,
            'category_ranking': self.category_ranking
        }

class PlatformMetrics(db.Model):
    __tablename__ = 'platform_metrics'
    
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    
    # User metrics
    total_users = db.Column(db.Integer, default=0)
    new_users = db.Column(db.Integer, default=0)
    active_users = db.Column(db.Integer, default=0)
    premium_users = db.Column(db.Integer, default=0)
    
    # Business metrics
    total_businesses = db.Column(db.Integer, default=0)
    new_businesses = db.Column(db.Integer, default=0)
    premium_businesses = db.Column(db.Integer, default=0)
    
    # Activity metrics
    total_searches = db.Column(db.Integer, default=0)
    total_views = db.Column(db.Integer, default=0)
    total_reviews = db.Column(db.Integer, default=0)
    
    # Revenue metrics
    daily_revenue = db.Column(db.Float, default=0.0)
    subscription_revenue = db.Column(db.Float, default=0.0)
    
    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.isoformat() if self.date else None,
            'total_users': self.total_users,
            'new_users': self.new_users,
            'active_users': self.active_users,
            'premium_users': self.premium_users,
            'total_businesses': self.total_businesses,
            'new_businesses': self.new_businesses,
            'premium_businesses': self.premium_businesses,
            'total_searches': self.total_searches,
            'total_views': self.total_views,
            'total_reviews': self.total_reviews,
            'daily_revenue': self.daily_revenue,
            'subscription_revenue': self.subscription_revenue
        }

class SearchAnalytics(db.Model):
    __tablename__ = 'search_analytics'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    session_id = db.Column(db.String(100), nullable=False)
    
    # Search details
    query = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50), nullable=True)
    location = db.Column(db.String(100), nullable=True)
    filters_used = db.Column(db.Text, nullable=True)  # JSON string of filters
    
    # Results
    results_count = db.Column(db.Integer, default=0)
    clicked_business_id = db.Column(db.Integer, db.ForeignKey('businesses.id'), nullable=True)
    click_position = db.Column(db.Integer, nullable=True)  # Position of clicked result
    
    # Timestamps
    search_time = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='searches')
    clicked_business = db.relationship('Business', backref='search_clicks')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'session_id': self.session_id,
            'query': self.query,
            'category': self.category,
            'location': self.location,
            'results_count': self.results_count,
            'clicked_business_id': self.clicked_business_id,
            'click_position': self.click_position,
            'search_time': self.search_time.isoformat() if self.search_time else None
        }

