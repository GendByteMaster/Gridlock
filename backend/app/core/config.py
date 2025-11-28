from pydantic_settings import BaseSettings
from pydantic import MongoDsn, RedisDsn, computed_field
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "My Backend"
    API_V1_STR: str = "/api/v1"
    
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "app_db"
    
    REDIS_URL: str = "redis://localhost:6379"
    
    class Config:
        env_file = ".env"

settings = Settings()
