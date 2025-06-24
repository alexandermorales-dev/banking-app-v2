from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import BigInteger # For larger integer IDs if needed, otherwise db.Integer is fine
from sqlalchemy.dialects.postgresql import UUID # For PostgreSQL UUIDs if preferred for IDs
import uuid # For generating UUIDs if using them

db = SQLAlchemy()

class User(db.Model):
    """
    User model representing individuals using the banking application.
    """
    id = db.Column(db.Integer, primary_key=True) 
    name = db.Column(db.String(120), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    hash_password = db.Column(db.String(255), unique=False, nullable=False)
    is_admin = db.Column(db.Boolean(), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    # Relationship to accounts: One User can have many Accounts
    accounts = db.relationship('Account', backref='user', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        """
        Serializes user data, excluding the password hash.
        """
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "is_admin": self.is_admin
            # Do not serialize the password, it's a security breach
        }

class Account(db.Model):
    """
    Account model representing a bank account owned by a user.
    """
    id = db.Column(db.Integer, primary_key=True) # Using Integer for simplicity, UUID could be used
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    account_number = db.Column(db.String(50), unique=True, nullable=False)
    account_type = db.Column(db.String(50), nullable=False) # e.g., 'checking', 'savings'
    balance = db.Column(db.Numeric(19, 4), nullable=False, default=0.0000) # Numeric for financial precision
    currency = db.Column(db.String(3), nullable=False, default='EUR') # e.g., 'EUR', 'USD'
    status = db.Column(db.String(50), nullable=False, default='active') # e.g., 'active', 'closed'
    opened_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    closed_at = db.Column(db.DateTime, nullable=True)

    # Relationship to transactions: One Account can have many Transactions
    # Added foreign_keys argument to explicitly define the join condition
    transactions = db.relationship(
        'Transaction',
        foreign_keys='Transaction.account_id', # Specify the foreign key for this relationship
        backref='account',
        lazy=True,
        cascade='all, delete-orphan'
    )

    def __repr__(self):
        return f'<Account {self.account_number} ({self.account_type})>'

    def serialize(self):
        """
        Serializes account data.
        """
        return {
            "id": self.id,
            "user_id": self.user_id,
            "account_number": self.account_number,
            "account_type": self.account_type,
            "balance": str(self.balance), # Convert Numeric to string for JSON serialization
            "currency": self.currency,
            "status": self.status,
            "opened_at": self.opened_at.isoformat() if self.opened_at else None,
            "closed_at": self.closed_at.isoformat() if self.closed_at else None,
        }

class Transaction(db.Model):
    """
    Transaction model representing a financial movement on an account.
    """
    id = db.Column(db.Integer, primary_key=True) # Using Integer for simplicity, UUID could be used
    account_id = db.Column(db.Integer, db.ForeignKey('account.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False) # e.g., 'deposit', 'withdrawal', 'transfer_out', 'transfer_in'
    amount = db.Column(db.Numeric(19, 4), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    transaction_date = db.Column(db.DateTime, default=db.func.current_timestamp())
    status = db.Column(db.String(50), nullable=False, default='completed') # e.g., 'completed', 'pending', 'failed'
    related_account_id = db.Column(db.Integer, db.ForeignKey('account.id'), nullable=True) # For transfers between accounts

    # Optional: Relationship to the related account for transfers
    # Note: Using remote_side to specify which side of the relationship is "remote"
    related_account = db.relationship(
        'Account',
        foreign_keys=[related_account_id],
        backref='related_transactions', # A different backref name to avoid conflict
        lazy=True
    )

    def __repr__(self):
        return f'<Transaction {self.id} ({self.type}) - {self.amount} on Account {self.account_id}>'

    def serialize(self):
        """
        Serializes transaction data.
        """
        return {
            "id": self.id,
            "account_id": self.account_id,
            "type": self.type,
            "amount": str(self.amount), # Convert Numeric to string for JSON serialization
            "description": self.description,
            "transaction_date": self.transaction_date.isoformat() if self.transaction_date else None,
            "status": self.status,
            "related_account_id": self.related_account_id,
        }

