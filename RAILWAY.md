# Deploying Gridlock to Railway

This guide outlines how to deploy the Gridlock monorepo to Railway.app. The project consists of three services:
1. **Backend** (Python/FastAPI)
2. **Socket Server** (Node.js/Socket.io)
3. **Frontend** (React/Vite)

## Prerequisites
- A [Railway](https://railway.app/) account.
- [Railway CLI](https://docs.railway.app/guides/cli) installed (optional, but recommended).
- Returns to this repository.

## Deployment Steps

### 1. Create a New Project
1. Log in to Railway.
2. Click **+ New Project** > **Deploy from GitHub repo**.
3. Select your repository.

### 2. Configure Services
Railway might try to auto-detect one service. You will need to add the other two manually or configure the monorepo structure.

#### Service A: Backend
- **Root Directory**: `/backend`
- **Build Command**: (Leave empty, uses Dockerfile)
- **Start Command**: (Leave empty, uses Dockerfile)
- **Watch Paths**: `/backend/**`

#### Service B: Socket Server
- **Root Directory**: `/server`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Watch Paths**: `/server/**`
- **Variables**:
    - `PORT`: `3001` (or let Railway assign one, but you must assume standard exp) -> Railway sets `PORT` automatically.

#### Service C: Frontend
- **Root Directory**: `/` (Root)
- **Build Command**: `npm run build`
- **Start Command**: `npm run preview` (or serve `dist` folder) -> *Better*: Use a Static Site deployment if available, or just node container serving it.
    - *Recommendation*: Use `npm run dev` is not for prod. For production, standard Vite serves static files. Railway works well with `npm run build` and serving the `dist` folder via a simple server or Nginx.
    - *Alternative*: Since it's just static, `npm run build` is enough if using Railway's Static Site deployment. Setup: Settings > Deploy > Static Site.
- **Variables**:
    - `VITE_API_URL`: `https://<YOUR_BACKEND_URL>` (No trailing slash usually, or specific /api/v1 if code requires) -> Code appends `/api/v1` so provide root URL.
    - `VITE_SOCKET_URL`: `https://<YOUR_SOCKET_SERVER_URL>`
    - **Note**: If running `npm run preview` in production, `vite.config.ts` has been updated to allow `gridlock.up.railway.app`. If you use a custom domain, add it to `allowedHosts` in `vite.config.ts`.

### 3. Linking Services
1. Deploy **Backend** and **Socket Server** first.
2. Get their Public Domains from Railway Settings.
3. Go to **Frontend** service > **Variables**.
4. Add `VITE_API_URL` with the Backend URL.
5. Add `VITE_SOCKET_URL` with the Socket Server URL.
6. Redeploy **Frontend**.

## Local Development
To run locally with production-like settings:
1. Create `.env` in root:
   ```
   VITE_API_URL=http://localhost:8000
   VITE_SOCKET_URL=http://localhost:3001
   ```
2. Run config as usual.
