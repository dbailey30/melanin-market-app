from flask import Blueprint, jsonify, request
from src.models.review import Review, db
from src.models.business import Business
from src.models.user import User

review_bp = Blueprint('review', __name__)

@review_bp.route('/businesses/<int:business_id>/reviews', methods=['GET'])
def get_business_reviews(business_id):
    """Get all reviews for a specific business"""
    business = Business.query.get_or_404(business_id)
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    reviews = Review.query.filter_by(business_id=business_id).paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )
    
    return jsonify({
        'reviews': [review.to_dict() for review in reviews.items],
        'total': reviews.total,
        'pages': reviews.pages,
        'current_page': page,
        'per_page': per_page,
        'has_next': reviews.has_next,
        'has_prev': reviews.has_prev,
        'business': business.to_dict()
    })

@review_bp.route('/businesses/<int:business_id>/reviews', methods=['POST'])
def create_review(business_id):
    """Create a new review for a business"""
    business = Business.query.get_or_404(business_id)
    data = request.json
    
    # Validate rating
    rating = data.get('rating')
    if not rating or not isinstance(rating, int) or rating < 1 or rating > 5:
        return jsonify({'error': 'Rating must be an integer between 1 and 5'}), 400
    
    # For now, we'll create a default user if none exists
    # In a real app, this would come from authentication
    user_id = data.get('user_id', 1)
    user = User.query.get(user_id)
    if not user:
        # Create a default user
        user = User(username='Anonymous', email='anonymous@example.com')
        db.session.add(user)
        db.session.commit()
        user_id = user.id
    
    # Check if user already reviewed this business
    existing_review = Review.query.filter_by(
        business_id=business_id, 
        user_id=user_id
    ).first()
    
    if existing_review:
        return jsonify({'error': 'User has already reviewed this business'}), 400
    
    review = Review(
        business_id=business_id,
        user_id=user_id,
        rating=rating,
        review_text=data.get('review_text', '').strip()
    )
    
    db.session.add(review)
    db.session.commit()
    
    return jsonify(review.to_dict()), 201

@review_bp.route('/reviews/<int:review_id>', methods=['GET'])
def get_review(review_id):
    """Get a specific review"""
    review = Review.query.get_or_404(review_id)
    return jsonify(review.to_dict())

@review_bp.route('/reviews/<int:review_id>', methods=['PUT'])
def update_review(review_id):
    """Update a review"""
    review = Review.query.get_or_404(review_id)
    data = request.json
    
    # Validate rating if provided
    if 'rating' in data:
        rating = data['rating']
        if not isinstance(rating, int) or rating < 1 or rating > 5:
            return jsonify({'error': 'Rating must be an integer between 1 and 5'}), 400
        review.rating = rating
    
    if 'review_text' in data:
        review.review_text = data['review_text'].strip()
    
    db.session.commit()
    return jsonify(review.to_dict())

@review_bp.route('/reviews/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    """Delete a review"""
    review = Review.query.get_or_404(review_id)
    db.session.delete(review)
    db.session.commit()
    return '', 204

@review_bp.route('/users/<int:user_id>/reviews', methods=['GET'])
def get_user_reviews(user_id):
    """Get all reviews by a specific user"""
    user = User.query.get_or_404(user_id)
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    reviews = Review.query.filter_by(user_id=user_id).paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )
    
    return jsonify({
        'reviews': [review.to_dict() for review in reviews.items],
        'total': reviews.total,
        'pages': reviews.pages,
        'current_page': page,
        'per_page': per_page,
        'has_next': reviews.has_next,
        'has_prev': reviews.has_prev,
        'user': user.to_dict()
    })

