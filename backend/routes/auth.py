from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from schemas.user import UserCreate, UserUpdate, PasswordReset
from services.auth_service import create_user, authenticate_user, update_user_profile, reset_password
from utils.dependencies import get_current_user
from database.mongodb import users_collection

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=dict)
async def signup(user: UserCreate):
    new_user = await create_user(user)
    return {
        "status": "success",
        "data": new_user,
        "message": "User registered successfully"
    }

# The Swagger UI 'Authorize' button specifically requires an OAuth2 style token login
@router.post("/login", response_model=dict)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    token_data = await authenticate_user(form_data.username, form_data.password)
    # Swagger UI's internal logic strictly requires access_token to be at the top level of the JSON response
    return {
        "access_token": token_data["access_token"],
        "token_type": token_data["token_type"],
        "status": "success",
        "message": "Login successful"
    }

@router.get("/profile", response_model=dict)
async def get_profile(current_user: dict = Depends(get_current_user)):
    return {
        "status": "success",
        "data": {
            "id": str(current_user["_id"]),
            "name": current_user.get("name"),
            "email": current_user.get("email"),
            "role": current_user.get("role")
        },
        "message": "Profile retrieved successfully"
    }

@router.put("/profile", response_model=dict)
async def update_profile(user_update: UserUpdate, current_user: dict = Depends(get_current_user)):
    updated_user = await update_user_profile(str(current_user["_id"]), user_update.model_dump(exclude_unset=True))
    if not updated_user:
        return {
            "status": "success",
            "data": {
                "id": str(current_user["_id"]),
                "name": current_user.get("name"),
                "email": current_user.get("email"),
                "role": current_user.get("role")
            },
            "message": "No changes made"
        }
    
    return {
        "status": "success",
        "data": updated_user,
        "message": "Profile updated successfully"
    }

@router.post("/reset-password", response_model=dict)
async def reset_password_route(payload: PasswordReset):
    await reset_password(payload.email, payload.new_password)
    return {
        "status": "success",
        "message": "Password updated successfully"
    }

@router.get("/doctors", response_model=dict)
async def get_doctors(current_user: dict = Depends(get_current_user)):
    """Returns all registered doctors — used by patient form to assign a doctor."""
    cursor = users_collection.find({"role": "doctor"}, {"_id": 1, "name": 1, "email": 1})
    doctors = await cursor.to_list(length=200)
    result = [{"id": str(d["_id"]), "name": d.get("name", ""), "email": d.get("email", "")} for d in doctors]
    return {
        "status": "success",
        "data": result,
        "message": "Doctors fetched successfully"
    }
