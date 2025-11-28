from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.user import User 

async def init_db():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    database = client[settings.MONGODB_DB_NAME]
    
    # Initialize Beanie with the document models
    await init_beanie(
        database=database,
        document_models=[
            User,
        ]
    )
