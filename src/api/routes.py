"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash



api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/signup', methods=['POST'])
def handle_signup():
    data = request.get_json()
    name=data.get('name')
    email= data.get('email')
    password = data.get('password')
    is_active = data.get('is_active', True)

    user = User.query.filter_by(email=email).first()

    if user:
        return jsonify({"message":"user already exists"}), 409

    if not email or not password or not name:
        return jsonify({"message":"all fields required"}), 401

    hashed_password= generate_password_hash(password)
    new_user = User(name=name, email=email, hash_password=hashed_password, is_active=is_active)

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message":"user created"}), 201

    except Exception as e:
        db.session.rollback() 
        print(f"Error creating user: {e}")
        return jsonify({"message": "Failed to create user"}), 500
    
@api.route('/login', methods=['POST'])
def handle_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user_found = User.query.filter_by(email=email).first()

    if not user_found:
        return jsonify({'message': 'email not found'})

    if check_password_hash(user_found.hash_password, password):
        access_token = create_access_token(identity=str(user_found.id))

        return jsonify({'message': 'login successfull', "current_user": user_found.serialize(), 'token': access_token}), 200
    else:
        return jsonify({'message': 'password incorrect'}), 400

@api.route('/dashboard', methods=['GET']) 
@jwt_required() 
def get_dashboard_data():
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404 

    user_accounts = [account.serialize() for account in user.accounts]
    return jsonify({
        "message": f"Welcome to {user.name}'s dashboard!",
        "user_email": user.email,
        "accounts": user_accounts
    }), 200
