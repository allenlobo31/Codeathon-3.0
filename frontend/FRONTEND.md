# VaultX Frontend Documentation

This document outlines the architecture, routing, and API integration requirements for the VaultX frontend application. It serves as a guide for seamlessly connecting the frontend UI with the backend services.

## Overview
- **Framework:** React 19 + Vite
- **Styling:** Vanilla CSS (custom VaultX theme: glassmorphism, lime green accents) alongside Tailwind v4 for utility classes.
- **Routing:** Handled manually via `window.location.pathname` in `App.jsx`.

## Directory Structure
- `src/`
  - `App.jsx`: Main application container and routing logic.
  - `api.js`: Centralized file for all backend API calls using `fetch()`.
  - `components/`: Contains functional components for specific pages (`SendFilePage`, `ReceiveFilePage`, `UploadForm`, `DownloadPage`, etc.).
  - `Home.jsx`, `SignIn.jsx`, `SignUp.jsx`, `History.jsx`: Root-level page components for the VaultX theme.
  - `*.css`: Theme-specific stylesheets (`Home.css`, `Auth.css`, `History.css`).

## Frontend Routes (UI)
The application currently supports the following client-side routes:
- `/` - Homepage (VaultX Theme)
- `/signin` - Authentication Sign In Page (UI only)
- `/signup` - Authentication Sign Up Page (UI only)
- `/history` - Transfer History Page (Currently uses mock data)
- `/send` - Page to upload and send a secure file
- `/receive` - Page to enter a share code and receive a file
- `/s/:code` - The direct link recipient view to download a shared file

---

## Backend API Endpoints

All frontend-to-backend communication is centralized in `src/api.js`. The frontend expects the backend API to be running on `http://localhost:5000` (or configured via `VITE_API_URL`). 

To fully connect the frontend, the backend must implement the following endpoints:

### 1. Upload a File
- **Endpoint:** `POST /api/files`
- **Content-Type:** `multipart/form-data`
- **Body:** Form data containing the `file` object.
- **Expected Response:** JSON containing the newly created `fileId` and metadata.

### 2. Create a Share Link
- **Endpoint:** `POST /api/shares`
- **Content-Type:** `application/json`
- **Body:** 
  ```json
  {
    "fileId": "<string or number>",
    "expiresInMinutes": "<number>"
  }
  ```
- **Expected Response:** JSON containing the share metadata, particularly the unique share `code`.

### 3. Get Share Information
- **Endpoint:** `GET /api/shares/:code`
- **Description:** Retrieves metadata about a specific share link before downloading (e.g., file name, size, expiration).
- **Expected Response:** JSON containing share and file details.

### 4. Download File
- **Endpoint:** `GET /api/shares/:code/download`
- **Description:** This is not fetched via AJAX; it is used directly as an `href` link for the browser to trigger a file download. The backend should return the file stream with appropriate `Content-Disposition: attachment` headers.

### 5. List Shares
- **Endpoint:** `GET /api/shares?q=<search_term>&status=<status>`
- **Description:** Retrieves a list of active/past shares for the current user.
- **Query Parameters:** 
  - `q` (optional): Search string.
  - `status` (optional): Filter by status.
- **Expected Response:** JSON array of share objects.

### 6. Revoke a Share
- **Endpoint:** `PATCH /api/shares/:code/revoke`
- **Description:** Manually expires or revokes a generated share link.
- **Expected Response:** JSON confirming the revocation (e.g., `{ "success": true }`).

---

## Upcoming Integrations (TODO)

Currently, some parts of the UI are static and await backend integration:
1. **Authentication:** The `/signin` and `/signup` pages are fully designed but not connected to an auth API. The backend will need endpoints like `POST /api/auth/login` and `POST /api/auth/register` to support this.
2. **History Page:** The `/history` route currently relies on `mockHistoryData` inside `History.jsx`. This should be wired to use the `GET /api/shares` endpoint once authentication and user-specific history are implemented in the backend.
