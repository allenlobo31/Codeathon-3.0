# Codeathon-3.0

## Integration Status

The project consists of a React/Vite frontend and a Node/Express backend. Currently, some parts of the frontend are static or not yet fully wired to the backend API.

### Unused Backend Endpoints

The following backend endpoints are available but are **not currently used** by the frontend UI:

**Authentication:**
- `GET /api/auth/me` (API logic exists, but no persistent global auth state is implemented in App.jsx yet)

**File Management:**
- `GET /api/files` (Frontend has a "My Files" link but no functional page yet)
- `GET /api/files/:id/download` (Files are only downloaded via share codes currently)

**Share Insights & Features:**
- `GET /api/shares/:code/qr` (QR code generation is not yet hooked up in the UI)
- `GET /api/shares/:code/logs` (Per-share access logs are not yet visible in the UI)
- `GET /api/activity` (Global access logs are not yet visible in the UI)

To complete the application, these endpoints need to be integrated into `frontend/src/api.js` and hooked up to the respective React components (`SignIn.jsx`, `SignUp.jsx`, `History.jsx`, etc.).
