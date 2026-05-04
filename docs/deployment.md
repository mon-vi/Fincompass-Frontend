# Deployment And Backend Integration

## Backend

The frontend is configured to talk to the deployed Render backend:

```text
https://fincompass-backend.onrender.com
```

Frontend endpoint constants add `/api/v1` centrally. Keep `VITE_API_BASE_URL` as the backend origin:

```bash
VITE_API_BASE_URL=https://fincompass-backend.onrender.com
```

If `/api/v1` is accidentally included in `VITE_API_BASE_URL`, the frontend normalizes it away before adding endpoint paths. This prevents duplicate URLs such as `/api/v1/api/v1/...`.

Expected final URLs:

```text
https://fincompass-backend.onrender.com/api/v1/auth/login
https://fincompass-backend.onrender.com/api/v1/auth/register
https://fincompass-backend.onrender.com/api/v1/dashboard
```

## Local Frontend

Local Vite origin:

```text
http://localhost:5173
```

Create `.env.local` from `.env.example` and keep:

```bash
VITE_API_BASE_URL=https://fincompass-backend.onrender.com
VITE_API_TIMEOUT=10000
VITE_APP_NAME=FinCompass
VITE_APP_ENV=development
```

`.env.local` is intentionally ignored by Git.

## Vercel Frontend

Production frontend origin:

```text
https://fincompass-frontend.vercel.app
```

Set this Vercel environment variable for Production, Preview, and Development builds as appropriate:

```bash
VITE_API_BASE_URL=https://fincompass-backend.onrender.com
```

Vite reads `VITE_*` variables at build time, so redeploy after changing Vercel environment values.

## Render Backend CORS/Sanctum

Configure the Render backend to allow both local and deployed frontend origins:

```bash
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://fincompass-frontend.vercel.app
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:5173,127.0.0.1,fincompass-frontend.vercel.app
FRONTEND_URL=https://fincompass-frontend.vercel.app
```

Adding localhost does not break production. It only permits local browser requests during development.

## SPA Route Fallback

`vercel.json` rewrites every route to `/index.html`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Direct visits to `/login`, `/register`, `/dashboard`, and other React Router routes should load the app rather than returning a Vercel 404.

## Auth Contract

Login sends:

```json
{ "email": "user@example.com", "password": "password" }
```

Register sends:

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password",
  "password_confirmation": "password"
}
```

The frontend maps this backend response envelope:

```json
{
  "success": true,
  "message": "OK",
  "data": {
    "user": {},
    "token": "plain-token"
  }
}
```

The token is stored in local storage under `fincompass:token` and sent on authenticated requests as:

```text
Authorization: Bearer <token>
```

## Onboarding Smoke Path

Step 1 financial goals advances through:

```text
POST /api/v1/onboarding/advance
```

It does not call missing goal-specific endpoints. Later onboarding steps persist supported backend records before advancing:

```text
POST /api/v1/income
POST /api/v1/debts
POST /api/v1/expenses/bulk
```

After onboarding, dashboard fetches:

```text
GET /api/v1/dashboard
```

## Development Debugging

In development only, failed API requests are logged to the browser console with method, full URL, status, and backend response body. Production builds do not emit these debug logs.
