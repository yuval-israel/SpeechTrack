# SpeechTrack Frontend (React + Vite)

## Quick Start
1. Install Node 18+
2. `npm i`
3. Create `.env` with `VITE_API_URL=http://localhost:8000`
4. `npm run dev` and open the shown URL

### Audio file routes
The audio `<audio>` elements reference `/api/...` paths. When running locally, you can proxy them by starting vite with:
- `VITE_API_URL=http://localhost:8000`
and add a dev server proxy in vite.config.js if needed.
