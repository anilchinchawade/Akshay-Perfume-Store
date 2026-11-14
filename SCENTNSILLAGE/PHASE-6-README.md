# SCENTNSILLAGE — Phase 6 Backend

## Included backend modules
- MongoDB/Mongoose connection and schemas: User, Product, Order, Review.
- Registration, login, logout, access/refresh token rotation, change password.
- HttpOnly cookies; access token in a short-lived cookie, refresh token hash stored server-side.
- Protected customer and admin middleware.
- Product catalogue API with text search, filters, sorting and pagination.
- Customer profile, order history and review history.
- Purchase-verified reviews with pending moderation.
- Razorpay order creation from server-side MongoDB product/variant prices, stock validation, signature verification and stock decrement.
- Admin dashboard metrics, order status updates, product creation/update and review moderation.
- Seed script with 20 perfume catalogue entries.

## 1. Configure MongoDB
Local MongoDB:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/scentnsillage
```
Or paste your MongoDB Atlas connection URI in `backend/.env`.

Copy `backend/.env.example` to `backend/.env`. Change both JWT secrets to distinct, random values of at least 32 characters. For production set `COOKIE_SECURE=true` and serve the site over HTTPS.

## 2. Install and seed
```bash
cd backend
npm install
npm run seed
npm run dev
```
The seed script inserts 20 sample products only when each slug is not already present.

## 3. Frontend
In another terminal:
```bash
cd frontend
npm install
npm run dev
```
The Vite dev server proxies `/api` to `http://localhost:5000`.

## 4. API routes
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/auth/me`
- `PATCH /api/v1/auth/change-password`
- `GET /api/v1/products`
- `GET /api/v1/products/featured`
- `GET /api/v1/products/:slug`
- `GET /api/v1/products/:slug/reviews`
- `GET/PATCH /api/v1/users/me`
- `GET /api/v1/users/me/orders`
- `GET /api/v1/users/me/reviews`
- `POST /api/v1/reviews`
- `POST /api/v1/payments/razorpay/order`
- `POST /api/v1/payments/razorpay/verify`
- `GET /api/v1/admin/dashboard`
- `GET /api/v1/admin/orders`
- `PATCH /api/v1/admin/orders/:id/status`
- `POST/PATCH /api/v1/admin/products`
- `PATCH /api/v1/admin/reviews/:id`

## 5. Create the first administrator
Register a normal account through the storefront, then in MongoDB Compass or mongosh update that account's role:
```javascript
db.users.updateOne(
  { email: "your-admin-email@example.com" },
  { $set: { role: "admin" } }
)
```
Do not expose an unauthenticated public admin-registration endpoint.

## 6. Razorpay test mode
Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `backend/.env`. The browser sends product IDs, variant IDs and quantities. The backend loads trusted product prices from MongoDB, calculates shipping and total, creates a local pending order and a Razorpay order. It verifies the HMAC signature server-side before marking the order paid and decrementing stock.

For production, also configure Razorpay webhooks and reconcile webhook events idempotently. Add transaction/compensation handling around payment and stock reservation, monitor failed fulfilment and refund flows, and ensure payment status is not based solely on the browser callback.

## 7. Security notes
- JWTs are never returned in JSON or stored in localStorage.
- Cookies are HttpOnly; enable Secure in production.
- Passwords are hashed with bcryptjs (12 rounds).
- Login/register rate limited.
- Admin routes require authenticated admin role.
- Review submission requires a paid order containing the reviewed product.
- Never trust customer IDs, prices, roles or review moderation state supplied by the browser.
- For cross-site deployments use a strict CSRF token strategy and SameSite=None; Secure cookies with explicit origin checks. Current same-site/lax defaults assume the storefront and API are deployed on the same site or same-site subdomains.

## Scope notes
This is a development-ready baseline, not a final audited production payment system. Add email verification, password reset, full CSRF protection, payment webhooks, database transactions/stock reservations, audit logs and comprehensive automated tests before launch.

## 8. Quick API smoke tests
After the server starts:
```bash
curl http://localhost:5000/api/v1/health
curl "http://localhost:5000/api/v1/products?page=1&limit=9"
curl http://localhost:5000/api/v1/products/amber-oud
```
For protected routes, sign in through the frontend so the browser receives the HttpOnly cookies. Use the browser's network panel to inspect JSON responses; do not copy cookie values into screenshots or logs.
