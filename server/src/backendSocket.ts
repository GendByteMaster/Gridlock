import WebSocket from 'ws';

class BackendSocket {
    private ws: WebSocket | null = null;
    private reconnectInterval: number = 5000;
    private url: string = 'ws://localhost:8000/api/v1/ws/server';

    constructor() {
        try {
            this.connect();
        } catch (error) {
            console.error('Failed to initialize BackendSocket:', error);
        }
    }

    private connect() {
        this.ws = new WebSocket(this.url);

        this.ws.on('open', () => {
            console.log('✅ Connected to Python Backend via WebSocket');
        });

        this.ws.on('close', () => {
            console.log('❌ Disconnected from Python Backend. Reconnecting in 5s...');
            this.ws = null;
            setTimeout(() => this.connect(), this.reconnectInterval);
        });

        this.ws.on('error', (error) => {
            console.error('WebSocket error:', error.message);
        });
    }

    public sendGameResult(winnerId: string, loserId: string) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'game_result',
                winner_id: winnerId,
                loser_id: loserId
            }));
            console.log(`Sent game result: Winner ${winnerId}, Loser ${loserId}`);
        } else {
            console.warn('Cannot send game result: WebSocket not connected');
        }
    }
}

export const backendSocket = new BackendSocket();
