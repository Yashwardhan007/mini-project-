import hashlib
import json
import os
import logging
from datetime import datetime

# --- CONFIGURATION ---
DB_FILE = "users.json"
LOG_FILE = "security.log"
MAX_ATTEMPTS = 3

# Setup logging
logging.basicConfig(
    filename=LOG_FILE,
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def hash_password(password):
    """Hashes a password using SHA-256."""
    return hashlib.sha256(password.encode()).hexdigest()

def load_users():
    """Loads users from the JSON file."""
    if not os.path.exists(DB_FILE):
        # Create default user if file doesn't exist
        default_users = {
            "admin": {
                "password": hash_password("password123"),
                "attempts": 0,
                "locked": False
            }
        }
        save_users(default_users)
        return default_users
    
    with open(DB_FILE, "r") as f:
        return json.load(f)

def save_users(users):
    """Saves users to the JSON file."""
    with open(DB_FILE, "w") as f:
        json.dump(users, f, indent=4)

def login():
    """Main login logic."""
    print("\n" + "="*30)
    print(" IAM SECURITY LOGIN SYSTEM ")
    print("="*30)
    
    username = input("Username: ")
    password = input("Password: ")
    
    users = load_users()
    
    if username not in users:
        print("Invalid username or password.")
        logging.warning(f"Failed login attempt: Unknown user '{username}'")
        return

    user_data = users[username]
    
    # Check if account is already locked
    if user_data["locked"]:
        print("Account locked for security reasons.")
        logging.error(f"Access denied: Account '{username}' is locked.")
        return

    hashed_input = hash_password(password)
    
    if hashed_input == user_data["password"]:
        # Successful login
        print(f"\nLogin successful! Welcome, {username}.")
        user_data["attempts"] = 0 # Reset attempts on success
        save_users(users)
        logging.info(f"Successful login: User '{username}'")
    else:
        # Failed login
        user_data["attempts"] += 1
        attempts_left = MAX_ATTEMPTS - user_data["attempts"]
        
        if user_data["attempts"] >= MAX_ATTEMPTS:
            user_data["locked"] = True
            print("Login failed. Account locked for security reasons.")
            logging.critical(f"Account locked: User '{username}' reached max attempts.")
        else:
            print(f"Login failed. Attempts left: {attempts_left}")
            logging.warning(f"Failed login attempt: User '{username}' (Attempt {user_data['attempts']})")
        
        save_users(users)

if __name__ == "__main__":
    while True:
        login()
        choice = input("\nTry again? (y/n): ").lower()
        if choice != 'y':
            break
    print("\nExiting system. Stay secure!")
