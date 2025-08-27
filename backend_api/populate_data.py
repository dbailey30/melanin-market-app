#!/usr/bin/env python3
"""
Script to populate the database with sample minority-owned businesses
for Buffalo, Rochester, and Syracuse, NY for Melanin Market app
"""

import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from src.main import app
from src.models.user import db, User
from src.models.business import Business
from src.models.review import Review

def create_sample_data():
    """Create sample businesses and reviews"""
    
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        # Create sample users
        users = [
            User(username='alex_johnson', email='alex@example.com'),
            User(username='maria_garcia', email='maria@example.com'),
            User(username='james_smith', email='james@example.com'),
            User(username='sarah_wilson', email='sarah@example.com'),
            User(username='david_brown', email='david@example.com')
        ]
        
        for user in users:
            db.session.add(user)
        
        db.session.commit()
        
        # Sample businesses for Syracuse, NY
        syracuse_businesses = [
            {
                'name': 'Asempe Kitchen',
                'description': 'Authentic African cuisine with modern flair. We specialize in traditional dishes from Ghana and Nigeria, prepared with fresh, locally-sourced ingredients.',
                'address': '123 Main St',
                'city': 'Syracuse',
                'state': 'NY',
                'zip_code': '13210',
                'phone': '(315) 555-0123',
                'website': 'www.asempekitchen.com',
                'category': 'Restaurant',
                'minority_type': 'Black-owned',
                'latitude': 43.0481,
                'longitude': -76.1474,
                'image_url': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop',
                'hours': 'Tue-Sun 5:00 PM - 10:00 PM',
                'is_verified': True
            },
            {
                'name': 'Harmony Music Studio',
                'description': 'Professional music lessons, recording studio, and live performance venue. Supporting local artists and musicians.',
                'address': '456 University Ave',
                'city': 'Syracuse',
                'state': 'NY',
                'zip_code': '13210',
                'phone': '(315) 555-0456',
                'website': 'www.harmonymusicstudio.com',
                'category': 'Entertainment',
                'minority_type': 'Black-owned',
                'latitude': 43.0481,
                'longitude': -76.1474,
                'image_url': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop',
                'hours': 'Mon-Fri 10:00 AM - 8:00 PM, Sat-Sun 12:00 PM - 6:00 PM',
                'is_verified': True
            },
            {
                'name': 'Fresh Market Grocery',
                'description': 'Community grocery store featuring fresh produce, international foods, and locally-sourced products.',
                'address': '789 Westcott St',
                'city': 'Syracuse',
                'state': 'NY',
                'zip_code': '13210',
                'phone': '(315) 555-0789',
                'website': 'www.freshmarketgrocery.com',
                'category': 'Grocery Store',
                'minority_type': 'Hispanic-owned',
                'latitude': 43.0481,
                'longitude': -76.1474,
                'image_url': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
                'hours': 'Mon-Sun 7:00 AM - 9:00 PM',
                'is_verified': True
            },
            {
                'name': 'Elite Lawn Care Services',
                'description': 'Professional landscaping, lawn maintenance, and garden design services for residential and commercial properties.',
                'address': '321 Salina St',
                'city': 'Syracuse',
                'state': 'NY',
                'zip_code': '13202',
                'phone': '(315) 555-0321',
                'website': 'www.elitelawncare.com',
                'category': 'Professional Services',
                'minority_type': 'Hispanic-owned',
                'latitude': 43.0481,
                'longitude': -76.1474,
                'image_url': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop',
                'hours': 'Mon-Fri 7:00 AM - 5:00 PM, Sat 8:00 AM - 3:00 PM',
                'is_verified': True
            }
        ]
        
        # Sample businesses for Buffalo, NY
        buffalo_businesses = [
            {
                'name': 'Soul Food Kitchen',
                'description': 'Traditional soul food recipes passed down through generations. Comfort food that feeds the soul.',
                'address': '567 Elmwood Ave',
                'city': 'Buffalo',
                'state': 'NY',
                'zip_code': '14222',
                'phone': '(716) 555-0567',
                'website': 'www.soulfoodkitchenbuf.com',
                'category': 'Restaurant',
                'minority_type': 'Black-owned',
                'latitude': 42.8864,
                'longitude': -78.8784,
                'image_url': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop',
                'hours': 'Tue-Sun 12:00 PM - 9:00 PM',
                'is_verified': True
            },
            {
                'name': 'Buffalo Comedy Club',
                'description': 'Live comedy shows featuring local and touring comedians. Open mic nights every Thursday.',
                'address': '890 Delaware Ave',
                'city': 'Buffalo',
                'state': 'NY',
                'zip_code': '14209',
                'phone': '(716) 555-0890',
                'website': 'www.buffalocomedyclub.com',
                'category': 'Entertainment',
                'minority_type': 'Black-owned',
                'latitude': 42.8864,
                'longitude': -78.8784,
                'image_url': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=400&fit=crop',
                'hours': 'Wed-Sat 7:00 PM - 11:00 PM',
                'is_verified': True
            },
            {
                'name': 'AutoCare Detailing',
                'description': 'Professional car detailing and automotive care services. Interior and exterior cleaning, waxing, and protection.',
                'address': '123 Service Rd',
                'city': 'Buffalo',
                'state': 'NY',
                'zip_code': '14215',
                'phone': '(716) 555-0123',
                'website': 'www.autocaredetailing.com',
                'category': 'Automotive',
                'minority_type': 'Hispanic-owned',
                'latitude': 42.8864,
                'longitude': -78.8784,
                'image_url': 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&h=400&fit=crop',
                'hours': 'Mon-Fri 8:00 AM - 6:00 PM, Sat 9:00 AM - 4:00 PM',
                'is_verified': True
            }
        ]
        
        # Sample businesses for Rochester, NY
        rochester_businesses = [
            {
                'name': 'Latina Flavors',
                'description': 'Authentic Latin American cuisine featuring dishes from Mexico, El Salvador, and Puerto Rico.',
                'address': '234 Park Ave',
                'city': 'Rochester',
                'state': 'NY',
                'zip_code': '14607',
                'phone': '(585) 555-0234',
                'website': 'www.latinaflavorsroc.com',
                'category': 'Restaurant',
                'minority_type': 'Hispanic-owned',
                'latitude': 43.1566,
                'longitude': -77.6088,
                'image_url': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=400&fit=crop',
                'hours': 'Mon-Thu 11:00 AM - 9:00 PM, Fri-Sat 11:00 AM - 10:00 PM',
                'is_verified': True
            },
            {
                'name': 'Rochester Jazz Lounge',
                'description': 'Live jazz performances every weekend featuring local and touring musicians. Full bar and light appetizers.',
                'address': '678 Main St',
                'city': 'Rochester',
                'state': 'NY',
                'zip_code': '14604',
                'phone': '(585) 555-0678',
                'website': 'www.rochesterjazzlounge.com',
                'category': 'Entertainment',
                'minority_type': 'Black-owned',
                'latitude': 43.1566,
                'longitude': -77.6088,
                'image_url': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop',
                'hours': 'Thu-Sat 7:00 PM - 1:00 AM',
                'is_verified': True
            },
            {
                'name': 'Corner Market Fresh',
                'description': 'Neighborhood grocery store with fresh produce, international foods, and specialty items.',
                'address': '321 Monroe Ave',
                'city': 'Rochester',
                'state': 'NY',
                'zip_code': '14607',
                'phone': '(585) 555-0321',
                'website': 'www.cornermarketfresh.com',
                'category': 'Grocery Store',
                'minority_type': 'Asian-owned',
                'latitude': 43.1566,
                'longitude': -77.6088,
                'image_url': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
                'hours': 'Mon-Sun 6:00 AM - 10:00 PM',
                'is_verified': True
            }
        ]
        
        # Combine all businesses
        all_businesses = syracuse_businesses + buffalo_businesses + rochester_businesses
        
        # Create business objects
        business_objects = []
        for biz_data in all_businesses:
            business = Business(**biz_data)
            db.session.add(business)
            business_objects.append(business)
        
        db.session.commit()
        
        # Create sample reviews
        sample_reviews = [
            # Reviews for Asempe Kitchen
            {'business_id': 1, 'user_id': 1, 'rating': 5, 'review_text': 'Amazing food and wonderful service! The jollof rice was incredible.'},
            {'business_id': 1, 'user_id': 2, 'rating': 4, 'review_text': 'Great atmosphere and authentic flavors. Will definitely be back!'},
            {'business_id': 1, 'user_id': 3, 'rating': 5, 'review_text': 'Best African restaurant in Syracuse. Highly recommended!'},
            
            # Reviews for Fashion Forward Boutique
            {'business_id': 2, 'user_id': 2, 'rating': 4, 'review_text': 'Love the unique selection and friendly staff.'},
            {'business_id': 2, 'user_id': 4, 'rating': 5, 'review_text': 'Found the perfect dress for my event. Great quality!'},
            
            # Reviews for City Pizza Co
            {'business_id': 3, 'user_id': 1, 'rating': 4, 'review_text': 'Excellent pizza with creative toppings. Fast delivery too.'},
            {'business_id': 3, 'user_id': 5, 'rating': 5, 'review_text': 'Family favorite! The kids love the pepperoni pizza.'},
            
            # Reviews for other businesses
            {'business_id': 4, 'user_id': 3, 'rating': 5, 'review_text': 'Professional and caring staff. Great wellness services.'},
            {'business_id': 5, 'user_id': 4, 'rating': 4, 'review_text': 'Delicious comfort food that reminds me of home.'},
            {'business_id': 6, 'user_id': 5, 'rating': 5, 'review_text': 'Beautiful authentic artwork. Supporting local artists!'},
        ]
        
        for review_data in sample_reviews:
            review = Review(**review_data)
            db.session.add(review)
        
        db.session.commit()
        
        print(f"Successfully created {len(users)} users")
        print(f"Successfully created {len(all_businesses)} businesses")
        print(f"Successfully created {len(sample_reviews)} reviews")
        print("\nBusinesses by city:")
        print(f"Syracuse: {len(syracuse_businesses)}")
        print(f"Buffalo: {len(buffalo_businesses)}")
        print(f"Rochester: {len(rochester_businesses)}")

if __name__ == '__main__':
    create_sample_data()
    print("\nDatabase populated successfully!")

