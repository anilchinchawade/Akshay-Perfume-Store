# SCENTNSILLAGE

Luxury perfume storefront monorepo scaffold.

## Requirements
- Node.js 20.19+ or 22.12+
- npm 10+
- MongoDB Atlas connection string (optional for the health endpoint)

## Structure
- `frontend/` React + Vite + TypeScript + Tailwind CSS v4
- `backend/` Express 5 + TypeScript API

## Run locally

### 1. Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Open http://localhost:5173

### 2. Backend (separate terminal)
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
API health: http://localhost:5000/api/v1/health

The frontend uses `/api` as its API base URL. Vite proxies `/api` to the backend on port 5000.

## Environment files
Never commit `.env` files. Only commit `.env.example`. Configure production secrets in your hosting provider.

## Notes
This phase creates the application foundation and initial shell. Product catalogue, real authentication, MongoDB models, checkout and Razorpay flows are implemented in later phases.

## Phase 3: product discovery
The storefront now includes a local typed catalogue adapter with 12 sample perfume products. It powers:
- `/shop` product grid/list, filters, sorting, pagination and debounced autocomplete
- `/product/:slug` product details, size variants, stock display, image zoom, fragrance pyramid and similar products
- `/find-your-scent` preference quiz and ranked recommendations

The local catalogue is demonstration data. In Phase 6, replace `frontend/src/features/products/services/productService.ts` with calls to the MongoDB-backed `/api/v1/products` endpoints while keeping the same product types and UI contract.

## Phase 3 routes
- `http://localhost:5173/shop`
- `http://localhost:5173/product/amber-oud`
- `http://localhost:5173/find-your-scent`


## Phase 4
See [PHASE-4-README.md](./PHASE-4-README.md) for cart, wishlist, checkout, and Razorpay setup.


## Phase 5
See [PHASE-5-README.md](./PHASE-5-README.md) for authentication, account, order history and review routes.
