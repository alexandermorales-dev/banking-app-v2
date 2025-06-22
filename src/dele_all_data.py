# dele_all_data.py

import os
import sys
from decimal import Decimal # Import Decimal for working with monetary values

# Add the 'src' directory to Python's path so it can find 'api'
# This assumes dele_all_data.py is directly inside the 'src' folder
current_dir = os.path.dirname(os.path.abspath(__file__)) # This resolves to /workspaces/banking-app-v2/src
sys.path.insert(0, current_dir) # Add 'src' to the Python path

from flask import Flask
from api.models import db, User, Account, Transaction # Now this import should work correctly

# --- Set up a minimal Flask app context ---
app = Flask(__name__)

# Configure your database URI (make sure it matches your main.py setup)
# Use the DATABASE_URL environment variable if set, otherwise default to SQLite
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    # Replace 'postgres://' with 'postgresql://' for SQLAlchemy compatibility
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    # Default to SQLite for local development if DATABASE_URL is not set
    # Ensure this path matches the one in your main.py if you're using SQLite
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

# Disable SQLAlchemy event tracking for performance (recommended for Flask apps)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the SQLAlchemy 'db' object with the Flask app
db.init_app(app)

# --- Perform the deletion within the app context ---
with app.app_context():
    print("WARNING: This script will PERMANENTLY DELETE ALL DATA in your User, Account, and Transaction tables.")
    confirm = input("Are you absolutely sure you want to proceed? Type 'yes' to confirm: ")

    if confirm.lower() == 'yes':
        try:
            print("Deleting all records...")

            # Order matters due to foreign key constraints:
            # Delete from child tables first (Transaction, then Account), then parent (User).
            # This avoids foreign key constraint errors when deleting parents first.

            # Delete all transactions
            num_transactions_deleted = db.session.query(Transaction).delete()
            print(f"Deleted {num_transactions_deleted} transactions.")

            # Delete all accounts
            num_accounts_deleted = db.session.query(Account).delete()
            print(f"Deleted {num_accounts_deleted} accounts.")

            # Delete all users
            num_users_deleted = db.session.query(User).delete()
            print(f"Deleted {num_users_deleted} users.")

            # Commit the changes to the database to make them permanent
            db.session.commit()
            print("All data successfully deleted from User, Account, and Transaction tables.")
            print("Note: This method deletes rows but does NOT reset auto-incrementing primary key IDs.")
            print("For a full ID reset, using 'TRUNCATE TABLE ... RESTART IDENTITY CASCADE;' SQL command is needed.")

        except Exception as e:
            # Rollback the session if any error occurs to ensure data consistency
            db.session.rollback()
            print(f"An error occurred during deletion: {e}")
            # Import and print traceback for more detailed error information
            import traceback
            traceback.print_exc()
    else:
        print("Deletion cancelled.")