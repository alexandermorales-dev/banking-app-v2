"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from decimal import Decimal
import random
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from api.models import Transaction, db, User, Account
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
    is_admin = data.get('is_admin', False)


    user = User.query.filter_by(email=email).first()

    if user:
        return jsonify({"message":"user already exists"}), 409

    if not email or not password or not name:
        return jsonify({"message":"all fields required"}), 400

    hashed_password= generate_password_hash(password)
    new_user = User(name=name, email=email, hash_password=hashed_password, is_active=is_active, is_admin=is_admin)

    

    try:
        db.session.add(new_user)
        db.session.commit()
        
        new_account = Account(
        user_id=new_user.id, # Link to the newly created user
        account_number=str(random.randint(1000000000, 9999999999)), # Generates a random 10-digit number
        account_type='checking', 
        balance=Decimal('0.00'), 
        currency='USD',
        status='active'
    )
        db.session.add(new_account)
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

    if not email:
        return jsonify({'message': 'Please type your email first'}), 404
    
    if not user_found:
        return jsonify({'message': 'Email not found, please create an account first'}),404

    if check_password_hash(user_found.hash_password, password):
        access_token = create_access_token(identity=str(user_found.id))
        user_obj = user_found.serialize()

        return jsonify({'message': 'login successfull', "current_user": user_obj, 'token': access_token}), 200
    else:
        return jsonify({'message': 'password incorrect'}), 400

@api.route('/dashboard', methods=['GET']) 
@jwt_required() 
def get_dashboard_data():
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404 

    account= Account.query.filter_by(user_id=user.id).first()
    acct_number = account.account_number

    all_transactions = [mov.serialize() for mov in account.transactions]

    deposits = []
    withdrawals = [ ]

    for mov in all_transactions: 
        if mov['type'] == 'deposit':
            deposits.append(mov['amount'])
    
    for mov in all_transactions: 
        if mov['type'] == 'withdraw':
            withdrawals.append(mov['amount'])
    
    total_deposits = 0
    total_withdrawals = 0

    for deposit in deposits:
        total_deposits += float(deposit)

    for withdrawal in withdrawals:
        total_withdrawals += float(withdrawal)

    return jsonify({
        "message": f"Welcome to {user.name}'s dashboard!",
        "user_email": user.email,
        "balance": account.balance, 
        'deposits': total_deposits, 
        'withdrawals': total_withdrawals, 
        'account_number': acct_number, 
        'all_transactions': all_transactions
    }), 200

@api.route('/transactions', methods=['POST']) 
@jwt_required() 
def add_transaction():
    data = request.get_json()
    transaction_type = data.get('type')
    transaction_amount = data.get('amount')
    recipient_email = data.get('recipientEmail')

    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    account = Account.query.filter_by(user_id = user.id).first()


    if not account:
        return jsonify({"message":"account not found"}), 400
    
    if transaction_type == 'deposit' and transaction_amount > 0:
 
        account.balance += transaction_amount
        new_transaction = Transaction(account_id=account.id, type=transaction_type, amount=transaction_amount)
        db.session.add(new_transaction)
        db.session.commit()

    if transaction_type == 'withdraw' and account.balance > transaction_amount:

        account.balance -= transaction_amount
        new_transaction = Transaction(account_id=account.id, type=transaction_type, amount=transaction_amount)
        db.session.add(new_transaction)
        db.session.commit()


    if transaction_type == 'transfer' and account.balance >transaction_amount and user.email != recipient_email:
        recipient = User.query.filter_by(email = recipient_email ).first()
        print(recipient, recipient_email)

        account.balance -= transaction_amount
        new_transaction = Transaction(account_id=account.id, type=transaction_type, amount=transaction_amount)

        recipient_acct = Account.query.filter_by(user_id = recipient.id).first()

        recipient_transaction_mov = Transaction(account_id=recipient_acct.id, type = 'deposit', amount = transaction_amount)

        recipient_acct.balance += transaction_amount
        db.session.add(new_transaction)
        db.session.add(recipient_transaction_mov)
        db.session.commit()
    

    all_transactions = [transaction.serialize() for transaction in account.transactions]
    
    deposits = []
    withdrawals = []
    for transaction in all_transactions:
        if transaction['type'] == 'deposit':
            deposits.append(transaction['amount'])
        if transaction['type'] == 'withdraw':
            withdrawals.append(transaction['amount'])

    total_deposits = 0
    total_withdrawals = 0

    for deposit in deposits:
        total_deposits += float(deposit)

    for withdrawal in withdrawals:
        total_withdrawals += float(withdrawal)
    
    

    return jsonify({'message': 'transaction successfully made', 'new_balance': account.balance, 'transactions': all_transactions, 'total_deposits': total_deposits, 'total_withdrawals': total_withdrawals}), 201

@api.route('/user/<int:id>', methods=['DELETE']) 
@jwt_required() 
def delete_user(id):
    current_user_id = int(get_jwt_identity())
    user = User.query.get(id)
    print(f"URL ID: {id}, Type: {type(id)}")
    print(f"JWT User ID: {current_user_id}, Type: {type(current_user_id)}")


    if current_user_id != id:
        return jsonify({'message': 'you are not allowed to delete user'}), 403

    if not user:
        return jsonify({'message': 'user not found'}), 404
    
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message':'user deleted'}), 200
