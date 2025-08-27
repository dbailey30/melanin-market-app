from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=True)
    
    # Subscription and payment integration
    stripe_customer_id = db.Column(db.String(100), nullable=True)
    
    # Profile information
    phone = db.Column(db.String(20), nullable=True)
    location = db.Column(db.String(100), nullable=True)
    preferences = db.Column(db.Text, nullable=True)  # JSON string for user preferences
    
    # Account status
    is_active = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'name': self.name,
            'phone': self.phone,
            'location': self.location,
            'is_active': self.is_active,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }
    
    def has_active_subscription(self, subscription_type=None):
        """Check if user has any active subscription or specific type"""
        from .subscription import Subscription
        
        query = Subscription.query.filter_by(user_id=self.id, status='active')
        if subscription_type:
            query = query.filter_by(subscription_type=subscription_type)
        
        active_subs = query.all()
        return any(sub.is_active() for sub in active_subs)
    
    def get_subscription_features(self):
        """Get all features available to user based on active subscriptions"""
        from .subscription import Subscription
        
        features = set()
        active_subs = Subscription.query.filter_by(user_id=self.id, status='active').all()
        
        for sub in active_subs:
            if sub.is_active():
                if sub.subscription_type == 'user_premium':
                    features.update(['unlimited_search', 'advanced_filters', 'ad_free', 'exclusive_deals'])
                elif sub.subscription_type.startswith('business'):
                    features.update(['business_analytics', 'enhanced_listing', 'customer_reviews'])
                    if sub.subscription_type in ['business_premium', 'business_enterprise']:
                        features.update(['priority_placement', 'promotional_tools'])
                    if sub.subscription_type == 'business_enterprise':
                        features.update(['multi_location', 'custom_branding', 'dedicated_support'])
        
        return list(features)
