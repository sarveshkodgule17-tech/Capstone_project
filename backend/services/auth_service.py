from fastapi import HTTPException, status
from schemas.user import UserCreate, UserLogin
from utils.security import get_password_hash, verify_password, create_access_token
from database.mongodb import users_collection
from bson import ObjectId

async def create_user(user: UserCreate):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_data = user.model_dump()
    user_data["password"] = get_password_hash(user.password)
    
    result = await users_collection.insert_one(user_data)
    
    return {"id": str(result.inserted_id), "name": user.name, "email": user.email, "role": user.role}

async def authenticate_user(email: str, password: str):
    db_user = await users_collection.find_one({"email": email})
    if not db_user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if not verify_password(password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(subject=str(db_user["_id"]), role=db_user.get("role", "patient"))
    return {"access_token": access_token, "token_type": "bearer", "user": {"id": str(db_user["_id"]), "role": db_user["role"]}}

async def update_user_profile(user_id: str, profile_data: dict):
    update_data = {k: v for k, v in profile_data.items() if v is not None}
    if not update_data:
        return None
    
    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )
    
    updated_user = await users_collection.find_one({"_id": ObjectId(user_id)})
    return {
        "id": str(updated_user["_id"]),
        "name": updated_user.get("name"),
        "email": updated_user.get("email"),
        "role": updated_user.get("role")
    }

async def reset_password(email: str, new_password: str):
    db_user = await users_collection.find_one({"email": email})
    if not db_user:
        raise HTTPException(status_code=404, detail="Email not found")
    
    hashed_password = get_password_hash(new_password)
    await users_collection.update_one(
        {"email": email},
        {"$set": {"password": hashed_password}}
    )
    return True
