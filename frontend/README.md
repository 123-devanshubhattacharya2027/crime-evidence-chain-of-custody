# Crime Evidence Management System — Frontend

React 19 + Vite + Tailwind CSS 4 interface for the ASP.NET Core Crime Evidence API.

## Run locally

```powershell
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite (normally http://localhost:5173).

The API client currently targets `http://localhost:5087/api` in `src/services/api.js`.
Start the ASP.NET Core API separately and ensure its CORS policy permits the Vite origin.

## Production build

```powershell
npm run build
```

The frontend is kept at the repository root in this version. There is no second frontend copy under `backend/CrimeEvidence.API`.
