# SCENTNSILLAGE — Phase 8: Testing, Deployment & Go-Live

This is an incremental patch. Copy/merge the `backend/` and `frontend/` folders into the existing SCENTNSILLAGE project. It does not replace your application.

## 1. Runtime recommendation

Use Node.js 22 LTS (22.12 or newer) and npm 10+. Your earlier terminal showed Node 26.13.0; use Node 22 LTS for a predictable deployment runtime. After switching Node versions, run `node -v` and `npm -v`.

## 2. Apply the files

- Merge `backend/package.json` with your existing backend package file. The only intended change is the `smoke` script.
- Copy `backend/scripts/smoke-test.mjs`.
- Copy `backend/.env.production.example` to your deployment environment settings as a reference. Do not commit real `.env` files.
- Copy `frontend/vercel.json`.
- Copy `frontend/.env.production.example` as a reference.

No new npm dependencies are required.

## 3. Local verification

Start MongoDB Community Server first. In terminal 1:

```powershell
cd backend
npm install
npm run build
npm run lint
npm run dev
```

In terminal 2:

```powershell
cd frontend
npm install
npm run build
npm run lint
```

In terminal 3, while the backend is running:

```powershell
cd backend
npm run smoke
```

The smoke test checks:
- `GET /api/v1/health` returns HTTP 200 and `success: true`.
- `GET /api/v1/products?page=1&limit=5` returns HTTP 200 and `success: true`.
- `GET /api/v1/admin/dashboard` rejects an unauthenticated request with HTTP 401 or 403.

The smoke test does not create orders, charge cards, or prove a full payment flow.

## 4. Manual end-to-end test checklist

Run these tests in a test database and Razorpay test mode, never against real customer data:

1. Register a customer with a unique email.
2. Log out, log in, refresh the page and confirm the session is restored.
3. Confirm a customer cannot open `/admin` or call `/api/v1/admin/dashboard`.
4. Promote a dedicated test account to admin in MongoDB Compass; sign out and sign back in.
5. Confirm admin can view dashboard, products, orders, customers and reviews.
6. Add a test product, edit it, then deactivate it. Confirm it no longer appears in the public catalogue.
7. Add an item to cart, change quantity, remove it, and verify totals.
8. Submit invalid checkout details and confirm validation messages appear.
9. Complete a Razorpay test payment and confirm order/payment status in MongoDB.
10. Verify stock is correct after payment, including concurrent attempts to buy the last item.
11. Submit a review for a purchased product; verify it remains pending until admin approval.
12. Test mobile widths (360px, 390px, 768px) and desktop (1280px+).
13. Test refresh/deep links on `/shop`, `/product/:slug`, `/account/orders` and `/admin`.
14. Check browser console and backend logs for unexpected errors.

## 5. Production deployment outline

Recommended split deployment:
- MongoDB Atlas: database.
- Render: Express API.
- Vercel: Vite/React frontend.
- Cloudinary: product images.
- Razorpay: production payment account only after payment safeguards and webhook work are complete.

### MongoDB Atlas
1. Create a production cluster and a dedicated database user.
2. Restrict network access to the backend host's outbound IP ranges where practical. Avoid `0.0.0.0/0` unless you understand the exposure and have no narrower option.
3. Copy the Atlas connection string into the backend secret `MONGODB_URI`.
4. Use a separate database from development and test.

### Render backend
1. Create a Web Service connected to the repository.
2. Set the Root Directory to `backend`.
3. Build Command: `npm ci && npm run build`
4. Start Command: `npm start`
5. Set Health Check Path: `/api/v1/health`.
6. Add the variables listed in `backend/.env.production.example`.
7. Set `CLIENT_ORIGIN` to the exact deployed storefront origin (including `https://`, no trailing slash).
8. Set `NODE_ENV=production`, `COOKIE_SECURE=true`, strong distinct JWT secrets, Atlas URI and production Razorpay credentials only when ready.

If your hosting provider does not support `npm ci` because there is no committed lockfile, generate and commit `package-lock.json` from the backend folder first. Do the same for frontend.

### Vercel frontend
1. Import the repository into Vercel.
2. Set Root Directory to `frontend`.
3. Framework preset: Vite.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Set `VITE_API_BASE_URL` to the API base URL ending in `/api/v1`, for example `https://api.example.com/api/v1`.
7. Set `VITE_STORE_NAME=SCENTNSILLAGE`.
8. Deploy and test all deep links. `frontend/vercel.json` supplies SPA fallback routing.

### Cookie and domain requirement
The current authentication cookies use `SameSite=Lax`. Prefer a custom domain arrangement such as `www.example.com` for the frontend and `api.example.com` for the API so both are same-site subdomains, and configure credentialed CORS for the exact frontend origin. Do not assume unrelated Vercel and Render hostnames will share cookies reliably. If you must use cross-site hosts, implement and test an explicit CSRF strategy and `SameSite=None; Secure` cookies before launch; do not simply loosen CORS.

## 6. Mandatory production blockers

The Phase 6 payment code verifies the browser callback signature, but it is not a complete production payment lifecycle. Before accepting real payments, implement and test:
- Razorpay webhook signature verification using the raw request body.
- Idempotent webhook event processing and payment/order reconciliation.
- Stock reservation or transaction/compensation handling so a customer cannot be charged and then lose the item due to a stock race.
- Failed payment, timeout, cancellation, refund and duplicate callback handling.
- Operational alerts and a manual reconciliation procedure.

Also complete before launch:
- CSRF protection appropriate to the final cookie/domain setup.
- Password reset and email verification flows.
- Admin audit logs and least-privilege admin account controls.
- Automated integration tests for authentication, orders, stock and payment.
- Privacy policy, terms, shipping/return/refund policy and customer support contact.
- Backups and a tested restore procedure for MongoDB.
- Cloudinary upload restrictions and image-size/type validation.
- Production monitoring, error reporting and log redaction.

Do not store secrets in frontend `VITE_*` variables. Anything prefixed with `VITE_` is public in the browser bundle.

## 7. Launch decision

Do not switch Razorpay to live credentials until the mandatory payment blockers above are implemented and independently tested. A successful build and smoke test confirm basic deployment health only; they are not a security audit or production certification.
