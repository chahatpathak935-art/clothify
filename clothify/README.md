# Clothify — Full-Stack Clothing E-Commerce Platform

A complete clothing store: React frontend, Node/Express + MongoDB backend, JWT auth,
size/color variant inventory, cart, Stripe checkout, and an admin panel.

```
clothify/
├── backend/     Node/Express API + MongoDB models
└── frontend/    React app (Tailwind CSS, React Router)
```

## What's included

- **Customer-facing store**: browse/filter products (category, gender, size, color, price),
  product detail pages with size & color selection, persistent cart, Stripe checkout, order
  history.
- **Auth**: email/password signup & login (JWT), customer vs admin roles.
- **Admin panel** (`/admin`): revenue/order/product stats, low-stock alerts, full product
  CRUD (with per-variant stock), order status management.
- **Inventory**: stock is tracked per size/color variant and safely decremented on order
  placement (prevents overselling).

## 1. Prerequisites

You'll need these installed locally:
- [Node.js](https://nodejs.org) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally, **or** a free
  [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster (recommended if you
  don't want to install MongoDB locally)
- A free [Stripe](https://dashboard.stripe.com/register) account (test mode is fine — no
  real charges)

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in:
- `MONGO_URI` — your local MongoDB URL or Atlas connection string
- `JWT_SECRET` — any long random string
- `STRIPE_SECRET_KEY` — from Stripe dashboard → Developers → API keys (starts with `sk_test_`)

Seed the database with 8 sample products and an admin account:

```bash
npm run seed
```

This creates the admin login: **admin@clothify.com / admin1234**

Start the API:

```bash
npm run dev
```

The API runs at `http://localhost:5000`. Visit `http://localhost:5000/api/health` to confirm
it's up.

## 3. Frontend setup

In a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

Open `.env` and fill in:
- `REACT_APP_STRIPE_PUBLISHABLE_KEY` — from Stripe dashboard (starts with `pk_test_`)

Start the app:

```bash
npm start
```

The store opens at `http://localhost:3000`.

## 4. Try it out

1. Sign up for a customer account, or log in as admin (`admin@clothify.com` / `admin1234`).
2. Browse `/shop`, filter by category/size/color, open a product, pick a size and color.
3. Add to cart, go to checkout, fill in a shipping address.
4. On the payment step, use Stripe's test card: **4242 4242 4242 4242**, any future
   expiry date, any 3-digit CVC, any postal code.
5. As admin, visit `/admin` for stats, `/admin/products` to add/edit/delete products and
   stock, and `/admin/orders` to update order status.

## 5. Deploying

- **Backend**: deploy to Render, Railway, Fly.io, or similar. Set the same environment
  variables from `.env`, and point `MONGO_URI` at an Atlas cluster (Atlas works from
  anywhere; a local MongoDB won't be reachable from a hosted server).
- **Frontend**: deploy to Vercel or Netlify. Set `REACT_APP_API_URL` to your deployed
  backend's URL (e.g. `https://your-api.onrender.com/api`) and
  `REACT_APP_STRIPE_PUBLISHABLE_KEY` to your Stripe publishable key.
- Update `CLIENT_URL` in the backend `.env` to your deployed frontend URL, so CORS allows it.
- For production, switch your Stripe keys from test to live mode.

## 6. Customizing

- **Branding/design**: colors, fonts, and layout tokens live in
  `frontend/tailwind.config.js` and `frontend/src/index.css`.
- **Product catalog**: edit or extend `backend/utils/seed.js`, or manage products live
  through the admin panel once the app is running.
- **Shipping/tax rules**: `SHIPPING_FLAT_RATE` and `TAX_RATE` constants in
  `backend/controllers/orderController.js`.

## Notes

- Passwords are hashed with bcrypt; never stored in plain text.
- JWTs are used for stateless auth; tokens are stored in the browser's localStorage on the
  frontend and sent as a Bearer token on each API request.
- This is a solid foundation, not a production-hardened system — before going live you'd
  want things like: input validation/rate limiting on the API, HTTPS, a proper image
  upload/CDN pipeline instead of raw image URLs, Stripe webhooks for payment confirmation
  (instead of trusting the client), and automated tests.
