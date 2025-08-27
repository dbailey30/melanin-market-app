import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
from src.models.user import db
from src.models.business import Business
from src.models.review import Review

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Enable CORS for all routes
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Create tables
with app.app_context():
    db.create_all()
    
    # Add sample data if database is empty
    if Business.query.count() == 0:
        sample_businesses = [
            Business(
                name="Soul Food Kitchen",
                description="Authentic Southern cuisine with a modern twist",
                address="123 Main Street",
                city="Buffalo",
                state="NY",
                zip_code="14201",
                phone="(716) 555-0123",
                website="https://soulfoodkitchen.com",
                category="Restaurant",
                minority_type="Black-owned",
                is_verified=True,
                image_url="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
                hours="Mon-Sat: 11AM-9PM, Sun: 12PM-8PM"
            ),
            Business(
                name="Abuela's Market",
                description="Fresh produce and authentic Hispanic groceries",
                address="456 Elm Avenue",
                city="Rochester",
                state="NY",
                zip_code="14604",
                phone="(585) 555-0456",
                website="https://abuelasmarket.com",
                category="Grocery Store",
                minority_type="Hispanic-owned",
                is_verified=True,
                image_url="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
                hours="Daily: 8AM-8PM"
            ),
            Business(
                name="Harmony Hair Salon",
                description="Professional hair care and styling services",
                address="789 Oak Street",
                city="Syracuse",
                state="NY",
                zip_code="13202",
                phone="(315) 555-0789",
                website="https://harmonyhair.com",
                category="Beauty & Personal Care",
                minority_type="Black-owned",
                is_verified=True,
                image_url="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
                hours="Tue-Sat: 9AM-6PM"
            ),
            Business(
                name="Tech Solutions Plus",
                description="IT consulting and computer repair services",
                address="321 Pine Road",
                city="Buffalo",
                state="NY",
                zip_code="14202",
                phone="(716) 555-0321",
                website="https://techsolutionsplus.com",
                category="Technology",
                minority_type="Asian-owned",
                is_verified=True,
                image_url="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
                hours="Mon-Fri: 9AM-6PM"
            ),
            Business(
                name="Mama Rosa's Pizzeria",
                description="Family-owned Italian restaurant serving authentic pizza",
                address="654 Maple Drive",
                city="Rochester",
                state="NY",
                zip_code="14605",
                phone="(585) 555-0654",
                website="https://mamarosas.com",
                category="Restaurant",
                minority_type="Hispanic-owned",
                is_verified=True,
                image_url="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
                hours="Daily: 11AM-10PM"
            ),
            Business(
                name="Urban Threads Boutique",
                description="Trendy clothing and accessories for modern professionals",
                address="987 Cedar Lane",
                city="Syracuse",
                state="NY",
                zip_code="13203",
                phone="(315) 555-0987",
                website="https://urbanthreads.com",
                category="Retail",
                minority_type="Black-owned",
                is_verified=True,
                image_url="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
                hours="Mon-Sat: 10AM-8PM, Sun: 12PM-6PM"
            )
        ]
        
        for business in sample_businesses:
            db.session.add(business)
        
        db.session.commit()
        print("Sample data added successfully!")

# API Routes
@app.route('/api/businesses')
def get_businesses():
    try:
        city = request.args.get('city', '')
        state = request.args.get('state', '')
        category = request.args.get('category', '')
        
        query = Business.query
        
        if city:
            query = query.filter(Business.city.ilike(f'%{city}%'))
        if state:
            query = query.filter(Business.state.ilike(f'%{state}%'))
        if category:
            query = query.filter(Business.category.ilike(f'%{category}%'))
            
        businesses = query.all()
        
        return jsonify({
            'success': True,
            'businesses': [business.to_dict() for business in businesses],
            'total': len(businesses)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/businesses/<int:business_id>')
def get_business(business_id):
    try:
        business = Business.query.get_or_404(business_id)
        return jsonify({
            'success': True,
            'business': business.to_dict()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/user/<int:user_id>/subscriptions')
def get_user_subscriptions(user_id):
    # Mock subscription data for demo
    return jsonify({
        'success': True,
        'subscriptions': []
    })

@app.route('/api/analytics/track', methods=['POST'])
def track_analytics():
    # Mock analytics tracking for demo
    return jsonify({
        'success': True,
        'message': 'Analytics tracked'
    })

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

