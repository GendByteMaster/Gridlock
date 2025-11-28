from beanie import Document
from pydantic import Field
from typing import Dict, List

class User(Document):
    username: str
    level: int = 1
    xp: int = 0
    xp_to_next_level: int = 100
    skill_points: int = 3
    wins: int = 0
    losses: int = 0
    unlocked_skills: Dict[str, List[str]] = Field(default_factory=lambda: {
        "Vanguard": ["slash", "dash"],
        "Coreframe": ["slash", "dash"],
        "Sentinel": ["slash", "shove"],
        "Arcanist": ["slash"],
        "Phantom": ["dash"],
        "Fabricator": ["shove"]
    })

    class Settings:
        name = "users"
