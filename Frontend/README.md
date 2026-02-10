## WEARERO – MERN E‑Commerce Application

This project is a full‑stack MERN e‑commerce application. The backend exposes a REST API built with Express and MongoDB, and the frontend is a React app bundled with Vite and styled with Tailwind CSS.

### Tech Stack
- Frontend: React, React Router, Redux Toolkit, Vite, Tailwind CSS
- Backend: Node.js, Express, MongoDB (Mongoose)
- Payments & Uploads: Stripe, Multer

### Project Structure
- `Backend/` – Express API (users, products, cart, orders, uploads, checkout)
- `Frontend/` – React SPA (pages, components, contexts, and API client)

### Prerequisites
- Node.js (LTS recommended)
- MongoDB instance (local or hosted)

### Setup & Run

1. Clone or download this repository, then open it in your editor.

2. Install backend dependencies and start the API:
	 ```bash
	 cd Backend
	 npm install
	 # configure environment variables in a .env file (e.g. MONGO_URI, PORT, Stripe keys)
	 npm run dev   # or: npm start
	 ```

3. Install frontend dependencies and start the React dev server:
	 ```bash
	 cd ../Frontend
	 npm install
	 npm run dev
	 ```

4. Open the URL printed by Vite (by default http://localhost:5173) and ensure the backend server URL configured in the frontend matches your API (e.g. http://localhost:3000).

### Scripts
- Backend
	- `npm run dev` – Start API with nodemon
	- `npm start` – Start API with Node
	- `npm run seed` – Seed database with initial data
- Frontend
	- `npm run dev` – Run Vite dev server
	- `npm run build` – Build for production
	- `npm run preview` – Preview production build
	- `npm run lint` – Run ESLint

### Notes
- Uploads are served from the backend `uploads/` directory.
- Payment webhooks and sensitive settings must be configured via environment variables; do not commit secrets to version control.
