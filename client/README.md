# EV Co-ownership - Frontend Scaffold

This is a starter Vite + React frontend scaffold for the EV Co-ownership & cost-sharing system.
It is minimal but wired to call the backend at `/api/v1` (proxy configured in vite.config.js).

Quick start:
1. Extract the ZIP
2. `cd frontend_scaffold`
3. `npm install`
4. `npm run dev`
5. Backend assumed at http://localhost:5000 (or edit proxy / VITE_API_BASE_URL)

What is included:
- Vite config with proxy to `/api`
- Basic pages: Login, Dashboard, Vehicles list, Vehicle detail
- Axios client with token handling
- AuthProvider (context) to manage user state
- MUI theme + NavBar
- Example components and utils

Next steps (I can implement):
- Booking calendar + booking flow
- Ownership management pages
- Costs & payments pages
- Admin/staff dashboard and reports
