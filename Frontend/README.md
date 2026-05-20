## WEARERO – MERN E‑Commerce Application

WEARERO is a full‑stack MERN e‑commerce application. The backend exposes a REST API built with Express and MongoDB, and the frontend is a React app bundled with Vite and styled with Tailwind‑style utility classes.

It supports customer shopping flows (browse, filter, cart, checkout, orders, wishlist) and admin management (products, users, orders), with real payments via Stripe and Cash on Delivery (COD). Product images are uploaded to Cloudinary with on-the-fly optimization.

### Tech Stack
- **Frontend**: React, React Router, Context API (Auth & Cart), Vite, Tailwind CSS, Framer Motion, Sonner toasts
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Payments & Uploads**: Stripe (Payment Intents + webhooks), Multer + Cloudinary (storage + optimization)

### Project Structure
- `Backend/` – Express API
	- `models/` – Mongoose models (User, Product, Cart, Order)
	- `routes/` – Route handlers (users, products, cart, orders, uploads, payment)
	- `config/db.js` – MongoDB connection helper
	- `config/cloudinary.js` – Cloudinary upload + image optimization helpers
	- `middleware/` – Auth middleware (JWT protect/admin)
	- `data/products.js` – Seed product catalog
	- `seeder.js` – Seeds admin user and products into MongoDB
	- `routes/uploadRoutes.js` – Cloudinary-backed image upload endpoints
- `Frontend/` – React SPA
	- `src/pages/` – Top‑level pages (Home, Collections, Auth, Profile, Orders, Admin)
	- `src/components/` – UI components (layout, products, cart, admin, common)
	- `src/context/` – `AuthContext` and `CartContext`
	- `src/lib/api.js` – API base URL helper

### Prerequisites
- Node.js (LTS recommended)
- MongoDB instance (local or hosted)
- Stripe account (for real card payments)

### Environment Configuration

#### Backend (`Backend/.env`)

Create a `.env` file in the `Backend` directory with values similar to:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/Wearero
JWT_SECRET=your_jwt_secret_here
FRONTEND_URL=http://localhost:5173

STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

- `PORT` – HTTP port for the API (defaults to 3000 if not set)
- `MONGO_URI` – MongoDB connection string
- `JWT_SECRET` – Secret used to sign JWTs
- `FRONTEND_URL` – Allowed origin for CORS (defaults to `http://localhost:5173`)
- `STRIPE_SECRET_KEY` – Stripe secret key for Payment Intents (backend only)
- `STRIPE_WEBHOOK_SECRET` – Optional Stripe webhook secret for verifying events
- `CLOUDINARY_CLOUD_NAME` – Cloudinary cloud name
- `CLOUDINARY_API_KEY` – Cloudinary API key
- `CLOUDINARY_API_SECRET` – Cloudinary API secret

#### Frontend (`Frontend/.env`)

Create a `.env` file in the `Frontend` directory with:

```env
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLIC_KEY=pk_test_your_publishable_key
```

- `VITE_API_URL` – Base URL to call the backend API
- `VITE_STRIPE_PUBLIC_KEY` – Stripe publishable key for the browser

### Setup & Run

1. **Clone or download** this repository, then open it in your editor.

2. **Backend – install dependencies and configure environment**:

	 ```bash
	 cd Backend
	 npm install
	 # create and fill .env based on the example above
	 ```

3. (Optional but recommended) **Seed the database** with initial data:

	 ```bash
	 npm run seed
	 ```

	 This creates an admin user and inserts sample products into MongoDB.

4. **Start the backend API**:

	 ```bash
	 npm run dev   # start with nodemon
	 # or
	 npm start     # start with node
	 ```

5. **Frontend – install dependencies and configure environment**:

	 ```bash
	 cd ../Frontend
	 npm install
	 # create and fill .env based on the example above
	 ```

6. **Start the React dev server**:

	 ```bash
	 npm run dev
	 ```

7. Open the URL printed by Vite (by default `http://localhost:5173`) and ensure `VITE_API_URL` points to your backend (e.g. `http://localhost:3000`).

8. (Optional) **Stripe webhooks**: if you want webhook events locally, forward them to `POST /api/payment/webhook` and set `STRIPE_WEBHOOK_SECRET` accordingly.

### Application Features

- **Customer**
	- Browse curated collections (best sellers, new arrivals, gender‑based collections)
	- Filter, sort, and search products with pagination
	- View detailed product pages with images, sizes, and colors
	- Add items to cart, update quantities, and view a cart drawer/summary
	- Guest cart support with merge-on-login behavior
	- Checkout with shipping address and choose a **payment method**:
		- **Stripe (card payment)** – real card payments via Stripe Payment Intents
		- **Cash on Delivery (COD)** – pay when the order is delivered
	- View order confirmation and order history (My Orders)
	- Manage profile and wishlist

- **Admin**
	- Secure admin area protected by role‑based auth
	- Manage products (create, edit, delete, including images and material field)
	- Drag-and-drop single or multi-image uploads to Cloudinary
	- Manage users
	- View and manage orders (status updates, mark as delivered)

### Payment Flow

- The **backend** uses Stripe’s Payment Intents API to create payment intents based on the cart items and prices.
- The **frontend** uses `@stripe/react-stripe-js` with `PaymentElement` to collect card details.
- Users can choose between **Stripe** and **Cash on Delivery** at checkout:
	- If Stripe is selected, the app confirms the Payment Intent and then creates an order marked as paid.
	- If COD is selected, the app creates an order with a pending payment status.

### Scripts

- **Backend**
	- `npm run dev` – Start API with nodemon
	- `npm start` – Start API with Node
	- `npm run seed` – Seed database with initial data

- **Frontend**
	- `npm run dev` – Run Vite dev server
	- `npm run build` – Build for production
	- `npm run preview` – Preview production build
	- `npm run lint` – Run ESLint

### Notes

- Image uploads are stored in Cloudinary and the API returns optimized URLs.
- If `VITE_API_URL` is not set, the frontend falls back to `http://localhost:3000` and logs a warning.
- Environment files (`.env`) are not committed; you must create them locally.
- Keep Stripe keys and JWT secrets private and never commit them to version control.
