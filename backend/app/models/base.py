from beanie import Document
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# You can add common fields or base classes here if needed
# For now, we'll just keep it simple or use it for shared mixins

class TimeStampedModel(BaseModel):
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
