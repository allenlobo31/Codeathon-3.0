# VaultX - Secure File Sharing Platform

VaultX is a secure file-sharing web application built for sharing files with expiry controls, email restrictions, download limits, and activity tracking. The project includes both a backend API and a frontend interface.

## Overview

This repository contains:

- Backend API built with Node.js and Express
- MongoDB database for storing users, files, shares, and access logs
- React frontend built with Vite
- Secure authentication using JWT
- File upload/download features
- Share link generation with QR codes and restrictions

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Lucide React

### Backend
- Node.js
- Express 5
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- multer
- qrcode

## Features

- User signup and login
- File upload with metadata tracking
- Secure file download
- Share links with:
  - expiration date
  - email restrictions
  - download limits
- Share status tracking
- QR code generation for share links
- Activity and access logs
- Share history dashboard
- Recipient download flow for shared files

## Project Structure

Codeathon-3.0/
├── backend/
│   ├── config/
│   ├── features/
│   ├── middleware/
│   ├── models/
│   ├── utils/
│   ├── .gitignore
│   ├── BACKEND.md
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .gitignore
│   ├── FRONTEND.md
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── ...
├── README.md
└── ...

## Prerequisites

Before running the app, make sure you have:

- Node.js (v18 or above recommended)
- npm
- MongoDB running locally or a MongoDB Atlas connection
- A terminal for running both frontend and backend

## Backend Setup

1. Open a terminal and go to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file inside `backend/`:

```env
JWT_SECRET=your_super_secret_key
MONGO_URI=mongodb://127.0.0.1:27017/file-share
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_EXPIRES_IN=7d
```

4. Start the backend:

```bash
npm run dev
```

or

```bash
npm start
```

The backend will run at:

```bash
http://localhost:5000
```

## Frontend Setup

1. Open a second terminal and go to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend:

```bash
npm run dev
```

The frontend will run at:

```bash
http://localhost:5173
```

## Run the Full Application

Start both services:

- Backend: `cd backend && npm install && npm run dev`
- Frontend: `cd frontend && npm install && npm run dev`

Then open:

```bash
http://localhost:5173
```

## Environment Notes

- The backend uses `CLIENT_URL` to allow frontend requests securely.
- MongoDB must be running before starting the API.
- If MongoDB is not installed locally, install MongoDB Community Edition and start it with `mongod`.

## API Documentation

Detailed API documentation is available in:

- `backend/BACKEND.md`
- `frontend/FRONTEND.md`

These files contain the endpoint structure, request payloads, and frontend/backend integration notes.

## Important Notes

This project is a codeathon build and may still have unfinished frontend integrations or TODO items. The root README currently documents remaining implementation tasks, but the core backend and frontend structure is already in place.

## License

This project is currently distributed without a formal license unless otherwise specified in the repository.

## Contributors

This project was developed as part of Codeathon 3.0.

---

If you want, I can also generate:
- a more polished GitHub-style README with badges and screenshots
- a shorter project README for submission
- or directly update the repository README file for you

How to run the project (quick version)

1. Start MongoDB
2. In backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env   # if you have example file; otherwise create .env manually
   npm run dev
   ```
3. In frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. Open:
   ```bash
   http://localhost:5173
   ```

If you want, I can also:
- make this into a cleaner GitHub README with badges and screenshots
- generate a README specifically for Hackathon/Codeathon submissions
- or actually write this into the repo README.md file for you.

# Remaining Implementations (TODOs)

The following features and API integrations are currently missing or incomplete in the frontend UI:



### History Page
- **Live Share History:** The `/history` page is currently using static mock data (`mockHistoryData`). This needs to be wired up to call `GET /api/shares` to display the actual logged-in user's share history.

### File Management (My Files)
- **My Files Page:** There is a "My Files" link in the navigation, but no page exists for it. It needs a page that calls `GET /api/files` to list all raw files uploaded by the user.
- **Direct File Downloads:** The UI needs a way to let users download their own raw files directly using `GET /api/files/:id/download` (currently, files can only be downloaded via a share code link).

### Share Insights & Analytics
- **QR Codes:** The backend provides QR codes for share links via `GET /api/shares/:code/qr`, but the UI does not display them anywhere.
- **Per-Share Logs:** The UI does not have a screen or modal to view access attempts for a specific share link (`GET /api/shares/:code/logs`).
- **Global Activity Logs:** The UI lacks an "Activity" page to view all download attempts across all of a user's shares (`GET /api/activity`).
