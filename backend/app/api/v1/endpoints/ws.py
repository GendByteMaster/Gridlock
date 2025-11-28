from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.progression import ProgressionService
from app.models.user import User
import json
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.websocket("/server")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    logger.info("Node.js server connected via WebSocket")
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "game_result":
                winner_id = message.get("winner_id")
                loser_id = message.get("loser_id")
                
                if winner_id and loser_id:
                    logger.info(f"Processing game result: Winner {winner_id}, Loser {loser_id}")
                    
                    # Update winner
                    winner = await User.get(winner_id)
                    if winner:
                        await ProgressionService.add_win(winner)
                        
                    # Update loser
                    loser = await User.get(loser_id)
                    if loser:
                        await ProgressionService.add_loss(loser)
                        
    except WebSocketDisconnect:
        logger.info("Node.js server disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
