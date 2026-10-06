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
