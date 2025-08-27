from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Business(db.Model):
    __tablename__ = 'businesses'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    address = db.Column(db.String(300), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    zip_code = db.Column(db.String(20))
    phone = db.Column(db.String(20))
    website = db.Column(db.String(200))
    category = db.Column(db.String(100), nullable=False)
    minority_type = db.Column(db.String(100), nullable=False)  # Black-owned, Hispanic-owned, etc.
    is_verified = db.Column(db.Boolean, default=False)
    google_place_id = db.Column(db.String(200))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    image_url = db.Column(db.String(500))
    hours = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with reviews
    reviews = db.relationship('Review', backref='business', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Business {self.name}>'

    @property
    def average_rating(self):
        if not self.reviews:
            return 0
        return sum(review.rating for review in self.reviews) / len(self.reviews)

    @property
    def review_count(self):
        return len(self.reviews)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'zip_code': self.zip_code,
            'phone': self.phone,
            'website': self.website,
            'category': self.category,
            'minority_type': self.minority_type,
            'is_verified': self.is_verified,
            'google_place_id': self.google_place_id,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'image_url': self.image_url,
            'hours': self.hours,
            'average_rating': round(self.average_rating, 1),
            'review_count': self.review_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def to_dict_with_reviews(self):
        data = self.to_dict()
        data['reviews'] = [review.to_dict() for review in self.reviews]
        return data

