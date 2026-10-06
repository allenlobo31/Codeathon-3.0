# Secure File Share: Backend

REST API for a secure file-sharing app. Users sign up, upload files, and create share links with an expiry time, an optional list of allowed emails, and an optional download limit. Every download attempt, allowed or denied, is logged.

## Tech stack

| Part | Used for |
|---|---|
| Node.js + Express 5 | HTTP API |
| MongoDB + Mongoose | Users, file records, shares, access logs |
| GridFS | File contents are stored inside MongoDB (not on disk) |
| JWT (`jsonwebtoken`) | Login sessions (`Authorization: Bearer <token>`) |
| bcryptjs | Password hashing |
| multer | Multipart uploads (memory storage, 50 MB limit) |
| qrcode | QR code for each share link |

## Run it

```bash
cd backend
npm install
npm run dev        # or: npm start
```

Create `backend/.env`:

```env
JWT_SECRET=change-me-to-a-long-random-string     # required, server won't start without it
MONGO_URI=mongodb://127.0.0.1:27017/file-share   # optional (this is the default)
PORT=5000                                        # optional
CLIENT_URL=http://localhost:5173                 # frontend URL: used for CORS and for share links
JWT_EXPIRES_IN=7d                                # optional
```

Base URL: `http://localhost:5000`. Only requests from `CLIENT_URL` pass CORS.

## Folder structure

```
backend/
  index.js            app setup + mounts every route
  config/db.js        MongoDB connection
  middleware/
    auth.js           requireAuth (login needed) and optionalAuth (login optional)
    upload.js         multer settings (50 MB, in memory)
  models/
    User.js  File.js  Share.js  AccessLog.js
  features/           ONE FILE PER FEATURE (each exports an Express router)
    signup.js  login.js  me.js
    upload.js  myFiles.js  downloadFile.js
    createShare.js  listShares.js  shareInfo.js  shareQr.js
    downloadShare.js  revokeShare.js  accessLogs.js
  utils/
    code.js           random 12-character share code
    status.js         live share status calculation
    token.js          JWT signing
    gridfs.js         save / stream files in MongoDB
    qr.js             share link + QR generation
    accessLog.js      writes download-attempt logs
    db.js             old JSON-file helper (unused)
  test.js             end-to-end test (node test.js)
```

New feature = new file in `features/`, then mount it in `index.js`.

## Conventions

- **Auth:** send `Authorization: Bearer <token>` on every route marked **Login**. The token comes from signup or login and lasts 7 days (no refresh).
- **Optional login:** routes marked **Optional** work without a token, but if a token is sent it must be valid (a bad or expired token returns `401`, it is not ignored).
- **Errors** always look like `{ "error": "message" }`, with an HTTP status code that matches.
- **Dates** are ISO strings in UTC (e.g. `"2026-10-06T12:00:00.000Z"`).
- **IDs:** `id` / `fileId` are MongoDB ObjectIds (strings). A share is identified by its `code`.
- **Not your resource:** looking up someone else's file or share returns `404`, the same as if it didn't exist.

## Share status

Never stored, always calculated on every request:

| status | meaning |
|---|---|
| `active` | usable |
| `expired` | past `expiresAt` |
| `revoked` | sender stopped it |
| `limit_reached` | `downloadCount` reached `maxDownloads` |

Priority if several apply: revoked, then expired, then limit_reached.

## Endpoint summary

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Create account |
| POST | `/api/auth/login` | Public | Log in |
| GET | `/api/auth/me` | Login | Current user |
| POST | `/api/files` | Login | Upload a file |
| GET | `/api/files` | Login | "My Files" (+ search) |
| GET | `/api/files/:id/download` | Login (owner) | Download own file |
| POST | `/api/shares` | Login | Create a share (code, link, QR) |
| GET | `/api/shares` | Login | Share history (search, filter, sort) |
| GET | `/api/shares/:code` | Optional | Info for the recipient page |
| GET | `/api/shares/:code/download` | Optional | Download via share (rules enforced) |
| PATCH | `/api/shares/:code/revoke` | Login (owner) | Revoke a share |
| GET | `/api/shares/:code/qr` | Login (owner) | QR code (JSON or PNG) |
| GET | `/api/shares/:code/logs` | Login (owner) | Access log of one share |
| GET | `/api/activity` | Login | Access log of all my shares |

---

## 1. Auth

### POST `/api/auth/signup`
```json
{ "name": "Sam", "email": "sam@x.com", "password": "Passw0rd!123", "confirmPassword": "Passw0rd!123" }
```
Rules: name 2-50 chars, valid email, password 8-64 chars, passwords must match.

**201**
```json
{ "token": "eyJ...", "user": { "id": "665f...", "name": "Sam", "email": "sam@x.com" } }
```
Errors: `400` (validation message), `409` `This email is already registered`.

### POST `/api/auth/login`
```json
{ "email": "sam@x.com", "password": "Passw0rd!123" }
```
**200**: same shape as signup. Errors: `400` missing fields, `401` `Invalid email or password` (same message for unknown email and wrong password).

### GET `/api/auth/me` (Login)
**200** `{ "id": "...", "name": "Sam", "email": "sam@x.com" }`. Use it on page load to check the stored token is still valid.

---

## 2. Files

### POST `/api/files` (Login)
`multipart/form-data` with one field named **`file`**. Max 50 MB.

**201**
```json
{ "id": "665f...", "originalName": "report.pdf", "size": 48213, "mimeType": "application/pdf", "createdAt": "2026-10-06T10:00:00.000Z" }
```
Errors: `400` `No file uploaded`, `401`, `413` file too large.

### GET `/api/files?q=report` (Login)
`q` is optional (case-insensitive search by file name). Newest first.

**200**
```json
[ { "id": "665f...", "originalName": "report.pdf", "size": 48213, "mimeType": "application/pdf", "createdAt": "...", "shareCount": 3 } ]
```

### GET `/api/files/:id/download` (Login, owner only)
Returns the file bytes with `Content-Disposition: attachment`. Errors: `400` invalid id, `404` not found or not yours.

---

## 3. Shares

### POST `/api/shares` (Login)
```json
{
  "fileId": "665f...",
  "expiryPreset": "24h",
  "allowedEmails": ["riya@x.com"],
  "maxDownloads": 5
}
```

| Field | Required | Notes |
|---|---|---|
| `fileId` | yes | must be one of your files |
| **expiry** | yes, **exactly one** of: | |
| `expiryPreset` | | `"1h"`, `"24h"`, `"7d"`, `"30d"` |
| `expiresInMinutes` | | positive number, e.g. `90` |
| `expiresAt` | | custom date & time, ISO string in the future (e.g. `"2026-12-31T18:30:00Z"`) |
| `allowedEmails` | no | array of emails (max 50). Empty or missing = anyone with the link. Otherwise only these logged-in emails can download. |
| `maxDownloads` | no | whole number 1-100000. Missing = unlimited. |

Expiry can be at most 365 days away.

**201**
```json
{
  "code": "k3J9xQ2mT8aB",
  "link": "http://localhost:5173/s/k3J9xQ2mT8aB",
  "qr": "data:image/png;base64,iVBOR...",
  "expiresAt": "2026-10-07T10:00:00.000Z",
  "allowedEmails": ["riya@x.com"],
  "maxDownloads": 5
}
```
`qr` can go straight into `<img src={qr} />`. Emails are trimmed, lower-cased and de-duplicated.
Errors: `400` (message says what's wrong), `401`, `404` file not found / not yours.

### GET `/api/shares` (Login): share history
Only your own shares.

| Query | Meaning |
|---|---|
| `q` | search by file name **or** recipient email |
| `status` | `active` / `expired` / `revoked` / `limit_reached` |
| `from`, `to` | created between these dates (`2026-10-01`; `to` is inclusive of the whole day) |
| `sort` | `createdAt` (default) / `expiresAt` / `downloadCount` / `fileName` |
| `order` | `desc` (default) / `asc` |

**200** (array)
```json
[{
  "code": "k3J9xQ2mT8aB",
  "link": "http://localhost:5173/s/k3J9xQ2mT8aB",
  "fileId": "665f...",
  "fileName": "report.pdf",
  "size": 48213,
  "recipients": ["riya@x.com"],
  "restricted": true,
  "createdAt": "...",
  "expiresAt": "...",
  "revokedAt": null,
  "maxDownloads": 5,
  "downloadCount": 2,
  "deniedAttempts": 1,
  "status": "active"
}]
```
Errors: `400` invalid `status` / `sort` / `order` / date.

### GET `/api/shares/:code` (Optional login): recipient page info
Call this when the recipient opens `/s/:code`.

**200**
```json
{
  "fileName": "report.pdf",
  "size": 48213,
  "expiresAt": "...",
  "status": "active",
  "restricted": true,
  "requiresLogin": false,
  "accessAllowed": true,
  "maxDownloads": 5,
  "remainingDownloads": 3
}
```
- On a **restricted** share, `fileName` and `size` are `null` unless the visitor is an allowed email (or the owner).
- `requiresLogin: true` means the share is restricted and no valid token was sent, so show the login page.
- `accessAllowed: false` and `requiresLogin: false` means logged in with an email that is not on the list.
- `remainingDownloads` is `null` when there is no limit.
- For the owner, `accessAllowed` is `true` on info, but the **download** still needs a listed email.
- `404` `Share not found` for an unknown code.

### GET `/api/shares/:code/download` (Optional login)
Streams the file (`Content-Disposition: attachment`). A successful call counts as one download. Rules are checked in this order, and **every outcome is logged**:

| Status | Body | Why |
|---|---|---|
| `410` | `{ "error": "...", "status": "revoked" }` | link revoked |
| `410` | `{ "error": "...", "status": "expired" }` | link expired |
| `410` | `{ "error": "...", "status": "limit_reached" }` | download limit used up |
| `401` | `{ "error": "Login required to open this file" }` | restricted, no token |
| `403` | `{ "error": "Your email is not allowed to open this file" }` | restricted, wrong email |
| `404` | `{ "error": "Share not found" }` | unknown code |

The `410` checks run before the login check, so a dead link answers `410` even for visitors who aren't logged in.

### PATCH `/api/shares/:code/revoke` (Login, owner)
No body. **200** `{ "code": "...", "status": "revoked", "revokedAt": "..." }`. It takes effect immediately and calling it twice is harmless. `404` if the share isn't yours.

### GET `/api/shares/:code/qr` (Login, owner)
- default: **200** `{ "code": "...", "link": "...", "qr": "data:image/png;base64,..." }`
- `?format=png`: the raw PNG image (`Content-Type: image/png`)

---

## 4. Download tracking

Every download attempt on a share (allowed or denied) creates a log row. Attempts on a code that doesn't exist are **not** logged.

### GET `/api/activity` (Login): all my shares
### GET `/api/shares/:code/logs` (Login, owner): one share

| Query | Meaning |
|---|---|
| `outcome` | `allowed` / `denied` |
| `reason` | `revoked`, `expired`, `limit_reached`, `login_required`, `email_not_allowed`, `file_missing` |
| `q` | search by the visitor's email |
| `from`, `to` | date range (same rules as history) |
| `page`, `limit` | paging (default `page=1`, `limit=50`, max `200`) |

**200**
```json
{
  "page": 1, "limit": 50, "total": 12,
  "logs": [{
    "at": "2026-10-06T10:15:00.000Z",
    "code": "k3J9xQ2mT8aB",
    "fileName": "report.pdf",
    "outcome": "denied",
    "reason": "email_not_allowed",
    "email": "omar@x.com",
    "userId": "665f...",
    "ip": "::1",
    "userAgent": "Mozilla/5.0 ..."
  }]
}
```
`email` and `userId` are `null` for visitors who weren't logged in. `reason` is `null` for allowed downloads. Newest first.

---

## Frontend integration guide

### Screens and the calls they need

| Screen | Calls |
|---|---|
| Sign up / Login | `POST /api/auth/signup`, `POST /api/auth/login`, then store the token |
| Protected pages | `GET /api/auth/me` on load; on `401` clear the token and go to login |
| Upload (drag-drop + progress) | `POST /api/files` |
| My Files | `GET /api/files`, `GET /api/files/:id/download` |
| Share dialog (presets / custom date, emails, limit) | `POST /api/shares`; show `link`, `code` and `qr` |
| Share history (search, filter, sort) | `GET /api/shares?...`; **Revoke** button calls `PATCH .../revoke`; status badge from `status` |
| Share details / tracking | `GET /api/shares/:code/logs` or `GET /api/activity` |
| Recipient page `/s/:code` | `GET /api/shares/:code`, then `GET .../download` |

### Recipient page logic (`/s/:code`)
1. Call `GET /api/shares/:code` (send the token if the user has one).
2. If `status` isn't `active`, show "expired / revoked / limit reached" and stop.
3. If `requiresLogin`, send the user to login and bring them back to `/s/:code`.
4. If `restricted && !accessAllowed`, show "this file wasn't shared with your email".
5. Otherwise show `fileName` and `size` with a **Download** button.

### Things the browser will trip on

**Upload progress bar:** `fetch` can't report upload progress. Use `XMLHttpRequest` (or axios `onUploadProgress`):
```js
function uploadFile(file, token, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API}/api/files`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText || '{}');
      xhr.status >= 200 && xhr.status < 300 ? resolve(data) : reject(new Error(data.error || 'Upload failed'));
    };
    xhr.onerror = () => reject(new Error('Network error'));
    const form = new FormData();
    form.append('file', file);   // field name must be "file"
    xhr.send(form);
  });
}
```

**Downloads need the token, so a plain `<a href>` won't work** (browsers can't add the `Authorization` header to a link). Fetch the file as a blob and save it:
```js
async function downloadShare(code, fileName, token) {
  const res = await fetch(`${API}/api/shares/${code}/download`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error((await res.json()).error);
  const url = URL.createObjectURL(await res.blob());
  const a = Object.assign(document.createElement('a'), { href: url, download: fileName });
  a.click();
  URL.revokeObjectURL(url);
}
```
Use `fileName` from `GET /api/shares/:code`, because browsers can't read the `Content-Disposition` header across origins unless the backend exposes it. (Optional: change the CORS line in `index.js` to `cors({ origin: ..., exposedHeaders: ['Content-Disposition'] })`.) Open shares can still use a plain link.

**Generic fetch helper:**
```js
async function api(path, { token, method = 'GET', json } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { ...(token && { Authorization: `Bearer ${token}` }), ...(json && { 'Content-Type': 'application/json' }) },
    body: json && JSON.stringify(json),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || 'Something went wrong'), { status: res.status, data });
  return data;
}
```

### Changes from the first version of this API
- Everything except `/api/shares/:code`, `/api/shares/:code/download` and the auth routes now needs a token.
- `POST /api/shares` takes `expiryPreset` / `expiresInMinutes` / `expiresAt` (exactly one) and returns `link` and `qr` as well as `code`.
- `GET /api/shares` returns only the logged-in user's shares, with extra fields (`recipients`, `link`, `maxDownloads`, `deniedAttempts`, ...), and a new status value `limit_reached`.
- Share info for restricted shares hides `fileName` / `size` unless the visitor is allowed.

## Known limits
- No refresh tokens (7-day token), no rate limiting, no password reset or email verification.
- No endpoint to delete files or shares.
- Downloads of a share by anonymous visitors are logged by IP only. Behind a proxy, set `app.set('trust proxy', true)` for correct IPs.
- A share's allowed emails are compared with the logged-in user's account email (emails are not verified at signup).

## Testing
- `node test.js` runs the end-to-end test (needs the server and MongoDB running; set `BASE_URL` if not on port 5000). It writes `test-report.json`.
- Import `FileShare-Backend.postman_collection.json` into Postman and run the folders in order.