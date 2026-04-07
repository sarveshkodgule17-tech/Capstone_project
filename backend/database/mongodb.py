import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "myopia_db")

client = AsyncIOMotorClient(MONGODB_URI)
db = client[DB_NAME]

# Collections
users_collection = db["users"]
patients_collection = db["patients"]
reports_collection = db["reports"]
clinical_data_collection = db["clinical_data"]
chat_history_collection = db["chat_history"]

def get_db():
    return db
