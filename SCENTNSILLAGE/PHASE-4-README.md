# SCENTNSILLAGE — Phase 4

## What's included
- Persistent cart with quantity controls, stock caps, subtotal and shipping calculation.
- Wishlist saved in browser storage.
- Checkout form with Zod validation for Indian mobile numbers and PIN codes.
- Razorpay Checkout integration using server-created orders and server-side HMAC signature verification.
- Order confirmation screen.
- Header wishlist count and product-card/product-detail wishlist actions.

## Run the project
Use the Phase 3 project folder as the complete base; this archive contains the full project with Phase 4 changes.

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
Copy `backend/.env.example` to `backend/.env`, set your Razorpay test credentials, then:
```bash
cd backend
npm install
npm run dev
```

Open:
- `http://localhost:5173/cart`
- `http://localhost:5173/wishlist`
- `http://localhost:5173/checkout`

## Razorpay test setup
1. Create a Razorpay account and use Test Mode.
2. Copy the Test Key ID and Key Secret into `backend/.env`.
3. Never put `RAZORPAY_KEY_SECRET` in any `VITE_` variable or frontend source.
4. Start the backend before attempting checkout.

## Important production-readiness notes
This phase wires the checkout UI and Razorpay order/signature flow. The Phase 6 backend must calculate the payable amount from trusted MongoDB product prices, validate inventory, create a pending order before payment, and mark it paid only after verified payment/webhook reconciliation. The current `/payments/razorpay/order` route accepts an amount from the browser for integration testing and is not safe to use for real customer payments until that server-side price calculation is implemented. The confirmation screen currently stores a temporary order summary in session storage; persistent order history arrives in Phase 5/6.

## Shipping rule in this phase
- ₹99 shipping below ₹2,500.
- Complimentary shipping at or above ₹2,500.

## Routes
- `/cart`
- `/wishlist`
- `/checkout`
- `/order-confirmation/:reference`
