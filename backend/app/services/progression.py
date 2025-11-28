from app.models.user import User

class ProgressionService:
    @staticmethod
    async def add_xp(user: User, amount: int) -> User:
        user.xp += amount
        # Level up logic
        while user.xp >= user.xp_to_next_level:
            user.xp -= user.xp_to_next_level
            user.level += 1
            user.skill_points += 2
            # Exponential scaling: 100 * 1.5^(level-1)
            user.xp_to_next_level = int(100 * (1.5 ** (user.level - 1)))
        
        await user.save()
        return user

    @staticmethod
    async def add_win(user: User) -> User:
        user.wins += 1
        await user.save()
        return await ProgressionService.add_xp(user, 50)

    @staticmethod
    async def add_loss(user: User) -> User:
        user.losses += 1
        await user.save()
        return await ProgressionService.add_xp(user, 20)
    
    @staticmethod
    async def unlock_skill(user: User, unit_type: str, skill_id: str) -> User:
        if unit_type not in user.unlocked_skills:
            user.unlocked_skills[unit_type] = []
        
        if skill_id not in user.unlocked_skills[unit_type]:
            user.unlocked_skills[unit_type].append(skill_id)
            await user.save()
        return user

    @staticmethod
    async def spend_skill_point(user: User) -> bool:
        if user.skill_points > 0:
            user.skill_points -= 1
            await user.save()
            return True
        return False
