from flask import Blueprint, request, jsonify
import stripe
import os
from datetime import datetime, timedelta
from ..models.user import db, User
from ..models.subscription import Subscription, PaymentHistory

payment_bp = Blueprint('payment', __name__)

# Stripe configuration
stripe.api_key = os.getenv('STRIPE_SECRET_KEY', 'sk_test_51234567890abcdef')  # Use test key for development

# Subscription pricing configuration
SUBSCRIPTION_PLANS = {
    'user_premium': {
        'name': 'Premium User',
        'price': 7.99,
        'interval': 'month',
        'features': ['Unlimited searches', 'Advanced filters', 'Ad-free experience', 'Exclusive deals']
    },
    'business_basic': {
        'name': 'Business Basic',
        'price': 29.00,
        'interval': 'month',
        'features': ['Enhanced listing', 'Basic analytics', 'Customer reviews', 'Priority support']
    },
    'business_premium': {
        'name': 'Business Premium',
        'price': 59.00,
        'interval': 'month',
        'features': ['All Basic features', 'Advanced analytics', 'Promotional tools', 'Priority placement']
    },
    'business_enterprise': {
        'name': 'Business Enterprise',
        'price': 99.00,
        'interval': 'month',
        'features': ['All Premium features', 'Multi-location management', 'Custom branding', 'Dedicated support']
    }
}

@payment_bp.route('/subscription-plans', methods=['GET'])
def get_subscription_plans():
    """Get available subscription plans"""
    return jsonify({
        'success': True,
        'plans': SUBSCRIPTION_PLANS
    })

@payment_bp.route('/create-payment-intent', methods=['POST'])
def create_payment_intent():
    """Create a Stripe payment intent for subscription"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        plan_type = data.get('plan_type')
        
        if not user_id or not plan_type:
            return jsonify({'error': 'Missing user_id or plan_type'}), 400
        
        if plan_type not in SUBSCRIPTION_PLANS:
            return jsonify({'error': 'Invalid plan type'}), 400
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        plan = SUBSCRIPTION_PLANS[plan_type]
        amount = int(plan['price'] * 100)  # Convert to cents
        
        # Create or get Stripe customer
        if not user.stripe_customer_id:
            customer = stripe.Customer.create(
                email=user.email,
                name=user.name,
                metadata={'user_id': user_id}
            )
            user.stripe_customer_id = customer.id
            db.session.commit()
        
        # Create payment intent
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency='usd',
            customer=user.stripe_customer_id,
            metadata={
                'user_id': user_id,
                'plan_type': plan_type
            }
        )
        
        return jsonify({
            'success': True,
            'client_secret': intent.client_secret,
            'payment_intent_id': intent.id
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/create-subscription', methods=['POST'])
def create_subscription():
    """Create a new subscription after successful payment"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        plan_type = data.get('plan_type')
        payment_intent_id = data.get('payment_intent_id')
        business_id = data.get('business_id')  # Optional, for business subscriptions
        
        if not all([user_id, plan_type, payment_intent_id]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        plan = SUBSCRIPTION_PLANS.get(plan_type)
        if not plan:
            return jsonify({'error': 'Invalid plan type'}), 400
        
        # Verify payment intent
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        if intent.status != 'succeeded':
            return jsonify({'error': 'Payment not completed'}), 400
        
        # Check for existing active subscription of same type
        existing_sub = Subscription.query.filter_by(
            user_id=user_id,
            subscription_type=plan_type,
            status='active'
        ).first()
        
        if existing_sub and existing_sub.is_active():
            return jsonify({'error': 'User already has an active subscription of this type'}), 400
        
        # Create subscription
        subscription = Subscription(
            user_id=user_id,
            business_id=business_id,
            subscription_type=plan_type,
            amount=plan['price'],
            interval=plan['interval'],
            trial_days=7 if plan_type.startswith('business') else None  # 7-day trial for business plans
        )
        
        db.session.add(subscription)
        db.session.flush()  # Get the subscription ID
        
        # Create payment history record
        payment = PaymentHistory(
            subscription_id=subscription.id,
            user_id=user_id,
            stripe_payment_intent_id=payment_intent_id,
            amount=plan['price'],
            status='succeeded',
            description=f'{plan["name"]} subscription'
        )
        
        db.session.add(payment)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'subscription': subscription.to_dict(),
            'message': 'Subscription created successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/user/<int:user_id>/subscriptions', methods=['GET'])
def get_user_subscriptions(user_id):
    """Get all subscriptions for a user"""
    try:
        subscriptions = Subscription.query.filter_by(user_id=user_id).all()
        return jsonify({
            'success': True,
            'subscriptions': [sub.to_dict() for sub in subscriptions]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/subscription/<int:subscription_id>', methods=['GET'])
def get_subscription(subscription_id):
    """Get subscription details"""
    try:
        subscription = Subscription.query.get(subscription_id)
        if not subscription:
            return jsonify({'error': 'Subscription not found'}), 404
        
        return jsonify({
            'success': True,
            'subscription': subscription.to_dict()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/subscription/<int:subscription_id>/cancel', methods=['POST'])
def cancel_subscription(subscription_id):
    """Cancel a subscription"""
    try:
        subscription = Subscription.query.get(subscription_id)
        if not subscription:
            return jsonify({'error': 'Subscription not found'}), 404
        
        subscription.cancel()
        
        return jsonify({
            'success': True,
            'message': 'Subscription cancelled successfully'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/user/<int:user_id>/payment-history', methods=['GET'])
def get_payment_history(user_id):
    """Get payment history for a user"""
    try:
        payments = PaymentHistory.query.filter_by(user_id=user_id).order_by(PaymentHistory.payment_date.desc()).all()
        return jsonify({
            'success': True,
            'payments': [payment.to_dict() for payment in payments]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/subscription/<int:subscription_id>/features', methods=['GET'])
def get_subscription_features(subscription_id):
    """Get features available for a subscription"""
    try:
        subscription = Subscription.query.get(subscription_id)
        if not subscription:
            return jsonify({'error': 'Subscription not found'}), 404
        
        plan = SUBSCRIPTION_PLANS.get(subscription.subscription_type)
        if not plan:
            return jsonify({'error': 'Invalid subscription type'}), 400
        
        return jsonify({
            'success': True,
            'subscription_type': subscription.subscription_type,
            'is_active': subscription.is_active(),
            'features': plan['features'],
            'plan_details': plan
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/user/<int:user_id>/has-feature', methods=['POST'])
def check_user_feature_access(user_id):
    """Check if user has access to a specific feature"""
    try:
        data = request.get_json()
        feature_type = data.get('feature_type')  # 'premium_search', 'analytics', 'priority_placement', etc.
        
        if not feature_type:
            return jsonify({'error': 'Missing feature_type'}), 400
        
        # Get user's active subscriptions
        active_subscriptions = Subscription.query.filter_by(
            user_id=user_id,
            status='active'
        ).all()
        
        has_access = False
        subscription_details = []
        
        for sub in active_subscriptions:
            if sub.is_active():
                subscription_details.append({
                    'type': sub.subscription_type,
                    'expires': sub.current_period_end.isoformat() if sub.current_period_end else None
                })
                
                # Check feature access based on subscription type
                if feature_type == 'premium_search' and sub.subscription_type == 'user_premium':
                    has_access = True
                elif feature_type == 'analytics' and sub.subscription_type.startswith('business'):
                    has_access = True
                elif feature_type == 'priority_placement' and sub.subscription_type in ['business_premium', 'business_enterprise']:
                    has_access = True
                elif feature_type == 'multi_location' and sub.subscription_type == 'business_enterprise':
                    has_access = True
        
        return jsonify({
            'success': True,
            'has_access': has_access,
            'feature_type': feature_type,
            'subscriptions': subscription_details
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/webhook', methods=['POST'])
def stripe_webhook():
    """Handle Stripe webhooks for subscription events"""
    try:
        payload = request.get_data()
        sig_header = request.headers.get('Stripe-Signature')
        endpoint_secret = os.getenv('STRIPE_WEBHOOK_SECRET', 'whsec_test123')
        
        try:
            event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
        except ValueError:
            return jsonify({'error': 'Invalid payload'}), 400
        except stripe.error.SignatureVerificationError:
            return jsonify({'error': 'Invalid signature'}), 400
        
        # Handle different event types
        if event['type'] == 'payment_intent.succeeded':
            # Payment succeeded
            payment_intent = event['data']['object']
            # Update payment history or subscription status
            
        elif event['type'] == 'invoice.payment_failed':
            # Payment failed
            invoice = event['data']['object']
            # Update subscription status to past_due
            
        elif event['type'] == 'customer.subscription.deleted':
            # Subscription cancelled
            subscription = event['data']['object']
            # Update local subscription status
        
        return jsonify({'success': True})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

