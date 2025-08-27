from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from .user import db

class Subscription(db.Model):
    __tablename__ = 'subscriptions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    business_id = db.Column(db.Integer, db.ForeignKey('businesses.id'), nullable=True)
    
    # Subscription details
    subscription_type = db.Column(db.String(50), nullable=False)  # 'user_premium', 'business_basic', 'business_premium', 'business_enterprise'
    status = db.Column(db.String(20), default='active')  # 'active', 'cancelled', 'expired', 'past_due'
    
    # Stripe integration
    stripe_customer_id = db.Column(db.String(100), nullable=True)
    stripe_subscription_id = db.Column(db.String(100), nullable=True)
    stripe_price_id = db.Column(db.String(100), nullable=True)
    
    # Billing details
    current_period_start = db.Column(db.DateTime, default=datetime.utcnow)
    current_period_end = db.Column(db.DateTime, nullable=False)
    trial_end = db.Column(db.DateTime, nullable=True)
    
    # Pricing
    amount = db.Column(db.Float, nullable=False)  # Amount in dollars
    currency = db.Column(db.String(3), default='USD')
    interval = db.Column(db.String(20), default='month')  # 'month', 'year'
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    cancelled_at = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    user = db.relationship('User', backref='subscriptions')
    business = db.relationship('Business', backref='subscription', uselist=False)
    
    def __init__(self, user_id, subscription_type, amount, **kwargs):
        self.user_id = user_id
        self.subscription_type = subscription_type
        self.amount = amount
        
        # Set default end date (1 month from now)
        if 'current_period_end' not in kwargs:
            if kwargs.get('interval', 'month') == 'year':
                self.current_period_end = datetime.utcnow() + timedelta(days=365)
            else:
                self.current_period_end = datetime.utcnow() + timedelta(days=30)
        
        # Set trial period if specified
        if kwargs.get('trial_days'):
            self.trial_end = datetime.utcnow() + timedelta(days=kwargs['trial_days'])
        
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'business_id': self.business_id,
            'subscription_type': self.subscription_type,
            'status': self.status,
            'amount': self.amount,
            'currency': self.currency,
            'interval': self.interval,
            'current_period_start': self.current_period_start.isoformat() if self.current_period_start else None,
            'current_period_end': self.current_period_end.isoformat() if self.current_period_end else None,
            'trial_end': self.trial_end.isoformat() if self.trial_end else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'cancelled_at': self.cancelled_at.isoformat() if self.cancelled_at else None,
            'is_trial': self.is_trial(),
            'is_active': self.is_active(),
            'days_remaining': self.days_remaining()
        }
    
    def is_trial(self):
        """Check if subscription is in trial period"""
        if not self.trial_end:
            return False
        return datetime.utcnow() < self.trial_end
    
    def is_active(self):
        """Check if subscription is currently active"""
        if self.status != 'active':
            return False
        
        # Check if in trial period
        if self.is_trial():
            return True
        
        # Check if current period is valid
        return datetime.utcnow() < self.current_period_end
    
    def days_remaining(self):
        """Get days remaining in current period"""
        if self.is_trial():
            return (self.trial_end - datetime.utcnow()).days
        
        if self.current_period_end:
            remaining = (self.current_period_end - datetime.utcnow()).days
            return max(0, remaining)
        
        return 0
    
    def cancel(self):
        """Cancel the subscription"""
        self.status = 'cancelled'
        self.cancelled_at = datetime.utcnow()
        db.session.commit()
    
    def renew(self):
        """Renew subscription for next period"""
        if self.interval == 'year':
            self.current_period_start = self.current_period_end
            self.current_period_end = self.current_period_end + timedelta(days=365)
        else:
            self.current_period_start = self.current_period_end
            self.current_period_end = self.current_period_end + timedelta(days=30)
        
        self.status = 'active'
        self.updated_at = datetime.utcnow()
        db.session.commit()

class PaymentHistory(db.Model):
    __tablename__ = 'payment_history'
    
    id = db.Column(db.Integer, primary_key=True)
    subscription_id = db.Column(db.Integer, db.ForeignKey('subscriptions.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Payment details
    stripe_payment_intent_id = db.Column(db.String(100), nullable=True)
    stripe_invoice_id = db.Column(db.String(100), nullable=True)
    
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), default='USD')
    status = db.Column(db.String(20), nullable=False)  # 'succeeded', 'failed', 'pending', 'refunded'
    
    # Metadata
    payment_date = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.String(200), nullable=True)
    
    # Relationships
    subscription = db.relationship('Subscription', backref='payments')
    user = db.relationship('User', backref='payments')
    
    def to_dict(self):
        return {
            'id': self.id,
            'subscription_id': self.subscription_id,
            'amount': self.amount,
            'currency': self.currency,
            'status': self.status,
            'payment_date': self.payment_date.isoformat() if self.payment_date else None,
            'description': self.description
        }

