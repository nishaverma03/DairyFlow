# DairyFlow

## Project layout

- frontend/src/App.jsx manages application state, login, and navigation.
- frontend/src/pages contains the dashboard, administration, customer, and settings screens.
- frontend/src/components/layout holds the shared navbar and footer.
- frontend/src/auth contains frontend authentication code.
- frontend/src/data contains sample records and defaults.
- backend/app/main.py creates the FastAPI application and configures CORS.
- backend/app/api/routes.py defines the endpoints.
- backend/app/database.py connects to PostgreSQL when a database operation is requested.

## Run on Windows

Open two PowerShell windows in the project root.

**Frontend**

```powershell
cd frontend
npm.cmd ci
npm.cmd run dev
```

**Backend**

On a fresh checkout, create a virtual environment with `python -m venv .venv` inside the backend directory first.

```powershell
cd backend
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

Open http://127.0.0.1:8000/docs for the API. Visit /db-test to check the configured database.

## Management API

With DATABASE_URL empty or unset, the backend creates backend/dairyflow.sqlite3.
For Neon, set DATABASE_URL and restart. Each database has its own data.
The API creates its tables on startup. Use one application worker for initial setup.

Set DAIRYFLOW_MANAGER_KEY in backend/.env to a strong random key (see .env.example).
Open http://127.0.0.1:8000/docs, click **Authorize**, and enter the key.
Keep this key on the manager's machine. The browser demo has its own local data.

- GET/PUT /api/rates/{day} reads or sets the default INR price per litre, effective from that date. The initial default is 60.
- POST /api/customers accepts name, a ten-digit phone number, milk in litres, and an optional rate. An omitted rate uses the current default.
- GET /api/customers lists active customers. GET/PUT/DELETE /api/customers/{id} reads, edits or archives one. Phone numbers remain reserved for archived accounts.
- PUT /api/customers/{id}/attendance/{day} accepts {"status":"Present"} or {"status":"Absent"}. DELETE clears the mark. Use YYYY-MM-DD dates.
- GET /api/customers/{id}/attendance/{year}/{month} returns the marked dates.
- GET /api/reports/{year}/{month} totals delivered litres and estimated INR charges per customer. Each present day uses the quantity and rate saved at first marking. Changing a customer later preserves earlier estimates. Archived customer history remains available.
