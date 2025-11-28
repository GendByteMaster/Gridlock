from fastapi import APIRouter, HTTPException, Path
from app.models.user import User
from app.services.progression import ProgressionService
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    username: str

class GameResultRequest(BaseModel):
    result: str # "win" or "loss"

class UnlockSkillRequest(BaseModel):
    unit_type: str
    skill_id: str

@router.post("/login", response_model=User)
async def login(request: LoginRequest):
    user = await User.find_one(User.username == request.username)
    if not user:
        user = User(username=request.username)
        await user.insert()
    return user

@router.get("/{user_id}", response_model=User)
async def get_profile(user_id: str = Path(...)):
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/{user_id}/game-result", response_model=User)
async def game_result(request: GameResultRequest, user_id: str = Path(...)):
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if request.result == "win":
        return await ProgressionService.add_win(user)
    elif request.result == "loss":
        return await ProgressionService.add_loss(user)
    else:
        raise HTTPException(status_code=400, detail="Invalid result")

@router.post("/{user_id}/unlock-skill", response_model=User)
async def unlock_skill(request: UnlockSkillRequest, user_id: str = Path(...)):
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if already unlocked
    if request.unit_type in user.unlocked_skills and request.skill_id in user.unlocked_skills[request.unit_type]:
         raise HTTPException(status_code=400, detail="Skill already unlocked")

    # Check if user has skill points
    if user.skill_points <= 0:
        raise HTTPException(status_code=400, detail="Not enough skill points")

    # Unlock skill
    await ProgressionService.unlock_skill(user, request.unit_type, request.skill_id)
    
    # Spend point
    await ProgressionService.spend_skill_point(user)
    
    return user
