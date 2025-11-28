from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.core.config import settings
from app.db.mongo import init_db

from app.api.v1.endpoints import progression, ws

# ... (existing code)

app.include_router(progression.router, prefix="/api/v1/progression", tags=["progression"])
app.include_router(ws.router, prefix="/api/v1/ws", tags=["websocket"])

@app.get("/")
async def root():
    return {"message": "Hello World"}
