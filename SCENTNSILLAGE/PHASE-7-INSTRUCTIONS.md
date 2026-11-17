# SCENTNSILLAGE – Phase 7 incremental patch

This archive contains only new files and the two files that must be replaced/updated. It is designed for the Phase 6 project.

## 1. Apply the patch

Extract the `SCENTNSILLAGE` folder from this archive into your existing project root:

`D:\Anil\Perfume Store Project for Akshay\SCENTNSILLAGE`

Allow Windows to merge folders and replace files when prompted.

### New frontend files
- `frontend/src/features/admin/services/adminService.ts`
- `frontend/src/features/admin/components/AdminRoute.tsx`
- `frontend/src/features/admin/components/AdminLayout.tsx`
- `frontend/src/features/admin/pages/AdminDashboardPage.tsx`
- `frontend/src/features/admin/pages/AdminProductsPage.tsx`
- `frontend/src/features/admin/pages/AdminOrdersPage.tsx`
- `frontend/src/features/admin/pages/AdminReviewsPage.tsx`
- `frontend/src/features/admin/pages/AdminCustomersPage.tsx`

### Modified files
- `frontend/src/app/router.tsx` – registers admin-only routes.
- `backend/src/routes/admin.ts` – adds product listing/deactivation, review listing and customer listing; retains dashboard, orders, product create/update and review moderation.

No new npm dependencies are required.

## 2. Important note before replacing backend admin.ts

The Phase 6 ZIP contains an older copy of `admin.ts` with a malformed literal `\\n` in its first line. This patch provides a corrected complete file. It also includes the dashboard and order routes previously discussed. Replace your current `backend/src/routes/admin.ts` with the patch version only if your current file is the Phase 6 version. If you have made additional custom changes since Phase 6, back up and merge them first.

## 3. Start the application

Terminal 1:

```powershell
cd "D:\Anil\Perfume Store Project for Akshay\SCENTNSILLAGE\backend"
npm run dev
```

Terminal 2:

```powershell
cd "D:\Anil\Perfume Store Project for Akshay\SCENTNSILLAGE\frontend"
npm run dev
```

Sign in using the administrator account you already promoted in MongoDB Compass, then open:

`http://localhost:5173/admin`

## 4. Product create/edit format

The Products page uses a JSON editor because the perfume Product model contains many domain-specific fields (notes, scent family, variants, stock, images, etc.). The editor starts with a valid-shaped example. Update the product `id`, `slug`, SKU, and image data before creating a real catalogue item. Keep the required model fields and at least one variant.

Product deactivation is a soft-delete (`isActive: false`); it does not physically delete product records, preserving order history.

## 5. Verification checklist

- Visit `/admin` as an administrator: dashboard metrics should load.
- Visit `/admin` as a customer: app should redirect to `/account`.
- Visit `/admin/products`: search, edit JSON, add and deactivate products.
- Visit `/admin/orders`: change status and optionally enter a tracking number.
- Visit `/admin/reviews`: approve/reject pending reviews.
- Visit `/admin/customers`: search registered customer accounts.

## 6. Scope and production notes

This is the Phase 7 administration UI/API increment, not a complete production security audit. The admin APIs are protected by the existing `requireAuth` and `requireAdmin` middleware. Review payment reconciliation, audit logging, server-side product validation, rate limits, backups, and deployment security before enabling real payments or public production traffic.
