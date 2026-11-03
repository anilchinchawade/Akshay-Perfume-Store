# SCENTNSILLAGE — Phase 5

## Delivered
- Login and registration forms with Zod validation.
- Auth state held in Redux memory only; JWTs are expected in HttpOnly cookies.
- Session bootstrap calls `GET /auth/me` on app start.
- Protected account, order-history and review-history routes.
- Profile editing and logout UI.
- Product review submission with 1–5 stars and moderation status.
- Customer order list with order/payment statuses and tracking number.
- Header account shortcut reflects signed-in state.

## Frontend routes
- `/login`
- `/register`
- `/account`
- `/account/orders`
- `/account/reviews`
- Product detail pages now include customer reviews and a review form.

## API contracts required (implemented in Phase 6 backend)
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `PATCH /api/v1/auth/change-password`
- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me`
- `GET /api/v1/users/me/orders`
- `GET /api/v1/users/me/reviews`
- `POST /api/v1/reviews`
- `GET /api/v1/products/:slug/reviews`

All authenticated endpoints must use secure HttpOnly access/refresh cookies, CSRF protection for state-changing requests, rate limiting on login/register, password hashing with Argon2id or bcrypt, and server-side ownership checks.

## Run
```bash
cd frontend
npm install
npm run dev
```
The login, registration, profile, orders and reviews pages require the Phase 6 backend endpoints. Until then, these API calls will return 404 from the Phase 4 backend. Do not store JWTs in localStorage/sessionStorage.

## Review integrity
The backend must allow a customer to review only products they have purchased and received (or enforce the business policy chosen by the store). Review text must be validated, moderated, and safely rendered. Never trust a client-supplied customer ID or review status.
