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
