from flask import Blueprint, jsonify, request
from sqlalchemy import or_, and_
from src.models.business import Business, db
from src.models.review import Review

business_bp = Blueprint('business', __name__)

@business_bp.route('/businesses', methods=['GET'])
def get_businesses():
    """Get businesses with optional filtering"""
    # Get query parameters
    city = request.args.get('city')
    state = request.args.get('state')
    category = request.args.get('category')
    minority_type = request.args.get('minority_type')
    search = request.args.get('search')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    # Build query
    query = Business.query
    
    # Apply filters
    if city:
        query = query.filter(Business.city.ilike(f'%{city}%'))
    if state:
        query = query.filter(Business.state.ilike(f'%{state}%'))
    if category and category.lower() != 'all':
        query = query.filter(Business.category.ilike(f'%{category}%'))
    if minority_type:
        query = query.filter(Business.minority_type.ilike(f'%{minority_type}%'))
    if search:
        query = query.filter(or_(
            Business.name.ilike(f'%{search}%'),
            Business.description.ilike(f'%{search}%'),
            Business.category.ilike(f'%{search}%')
        ))
    
    # Paginate results
    businesses = query.paginate(
        page=page, 
        per_page=per_page, 
        error_out=False
    )
    
    return jsonify({
        'businesses': [business.to_dict() for business in businesses.items],
        'total': businesses.total,
        'pages': businesses.pages,
        'current_page': page,
        'per_page': per_page,
        'has_next': businesses.has_next,
        'has_prev': businesses.has_prev
    })

@business_bp.route('/businesses/<int:business_id>', methods=['GET'])
def get_business(business_id):
    """Get a specific business with reviews"""
    business = Business.query.get_or_404(business_id)
    return jsonify(business.to_dict_with_reviews())

@business_bp.route('/businesses', methods=['POST'])
def create_business():
    """Create a new business"""
    data = request.json
    
    business = Business(
        name=data['name'],
        description=data.get('description'),
        address=data['address'],
        city=data['city'],
        state=data['state'],
        zip_code=data.get('zip_code'),
        phone=data.get('phone'),
        website=data.get('website'),
        category=data['category'],
        minority_type=data['minority_type'],
        google_place_id=data.get('google_place_id'),
        latitude=data.get('latitude'),
        longitude=data.get('longitude'),
        image_url=data.get('image_url'),
        hours=data.get('hours')
    )
    
    db.session.add(business)
    db.session.commit()
    return jsonify(business.to_dict()), 201

@business_bp.route('/businesses/<int:business_id>', methods=['PUT'])
def update_business(business_id):
    """Update a business"""
    business = Business.query.get_or_404(business_id)
    data = request.json
    
    # Update fields
    for field in ['name', 'description', 'address', 'city', 'state', 'zip_code', 
                  'phone', 'website', 'category', 'minority_type', 'google_place_id',
                  'latitude', 'longitude', 'image_url', 'hours']:
        if field in data:
            setattr(business, field, data[field])
    
    db.session.commit()
    return jsonify(business.to_dict())

@business_bp.route('/businesses/<int:business_id>', methods=['DELETE'])
def delete_business(business_id):
    """Delete a business"""
    business = Business.query.get_or_404(business_id)
    db.session.delete(business)
    db.session.commit()
    return '', 204

@business_bp.route('/search', methods=['GET'])
def search_businesses():
    """Search businesses by location"""
    city = request.args.get('city', '').strip()
    state = request.args.get('state', '').strip()
    
    if not city:
        return jsonify({'error': 'City parameter is required'}), 400
    
    query = Business.query.filter(Business.city.ilike(f'%{city}%'))
    
    if state:
        query = query.filter(Business.state.ilike(f'%{state}%'))
    
    businesses = query.all()
    
    return jsonify({
        'businesses': [business.to_dict() for business in businesses],
        'total': len(businesses),
        'location': f"{city}, {state}" if state else city
    })

@business_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all business categories"""
    categories = db.session.query(Business.category).distinct().all()
    return jsonify([category[0] for category in categories if category[0]])

@business_bp.route('/cities', methods=['GET'])
def get_cities():
    """Get all cities with businesses"""
    cities = db.session.query(Business.city, Business.state).distinct().all()
    return jsonify([f"{city}, {state}" for city, state in cities if city and state])

