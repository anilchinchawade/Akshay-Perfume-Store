# SCENTNSILLAGE – Phase 9.3 Incremental Patch

## Included
- Admin-managed custom collections with manual, automatic, and hybrid modes.
- Collection title, slug, description, banner URL, publish toggle, and display order.
- Ordered manual product selections plus optional automatic rules (flag/category/brand/gender).
- Public custom collection endpoints and homepage rendering.
- Admin navigation and collection editor.

## Apply
1. Stop backend and frontend development servers.
2. Extract this ZIP.
3. Merge the `SCENTNSILLAGE` folder into your existing project and replace matching files.
4. Backend: run `npm run build`, then `npm run dev`.
5. Frontend: run `npm run build`, then `npm run dev`.

## API endpoints
- Admin: GET/POST `/api/v1/admin/collections`, PATCH/DELETE `/api/v1/admin/collections/:id` (admin-authenticated).
- Storefront: GET `/api/v1/products/custom-collections`, GET `/api/v1/products/custom-collections/:slug`.

## Notes
- Banner image accepts an image URL; use a Cloudinary secure URL. This patch does not expose Cloudinary secrets or change the existing upload-signature flow.
- Manual product selections are stored as Product ObjectId references and retain their selected order.
- Hybrid mode requires at least one manual product and one automatic rule. Automatic rules are combined as AND conditions. Manual products appear first, followed by non-duplicate automatic matches.
- Only active products and active collections are exposed on the storefront.
- The original Phase 9.1 product editor and Phase 9.2 automatic collection endpoints are preserved.
