# SCENTNSILLAGE — Phase 9.1: Visual Product Management

This is an incremental patch. Copy the files into the matching paths in your existing project and allow the files to merge/overwrite.

## Included changes

- Replaces the JSON product editor with a visual product form.
- Supports product identity, descriptions, perfume attributes, fragrance notes, seasonal/occasion tags, multiple size variants, pricing, compare-at pricing, stock, SKU, merchandising flags, and active/publish status.
- Adds image uploads directly to Cloudinary using a server-generated signature. The Cloudinary API secret stays on the backend.
- Adds a product preview before saving.
- Keeps the existing product list, search, edit, deactivate, admin authentication, and query invalidation behavior.
- Validates product fields on the backend before create/update.

## 1. Apply the patch

Copy the contents of the ZIP's `SCENTNSILLAGE` folder into your existing project folder:

`D:\Anil\Perfume Store Project for Akshay\SCENTNSILLAGE`

Overwrite only the matching files. Do not delete other files.

## 2. Configure Cloudinary

Create a Cloudinary account if you do not already have one. From the Cloudinary console, copy the Cloud name, API Key, and API Secret.

Add these values to `backend/.env` (do not share this file or commit it):

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Restart the backend after changing `.env`:

```powershell
cd "D:\Anil\Perfume Store Project for Akshay\SCENTNSILLAGE\backend"
npm run dev
```

The signature route is protected by the existing `requireAuth` and `requireAdmin` middleware. The browser receives only the upload signature, API key, timestamp and folder; it never receives the API secret.

## 3. Start the frontend

```powershell
cd "D:\Anil\Perfume Store Project for Akshay\SCENTNSILLAGE\frontend"
npm run dev
```

Sign in with an admin account and open `/admin/products`.

## 4. Test in this order

1. Open Add product and enter name, brand, category, descriptions and perfume details.
2. Add at least one size variant and enter price, stock and SKU.
3. Upload one or more image files. Wait until upload finishes.
4. Click Preview and inspect the product summary/images.
5. Return to the editor and save.
6. Confirm the product appears in the admin list.
7. Edit the same product, change a field, save, and confirm the change.
8. Confirm the public shop can display the product if it is active.

## Notes and boundaries

- This patch uses the existing product model and current product flags (`isNew`, `isBestseller`, `isFeatured`, `isDiscoverySet`). It does not yet add a separate manually curated collection model or collection-management screen. That is the next planned phase (Phase 9.2/9.3).
- The preview is an admin-side approximation, not a pixel-identical rendering of the public product detail page.
- Existing seed data remains unchanged.
- The source ZIP supplied for this phase did not include package manifests or `.env` files. No npm dependencies are added by this patch. A full TypeScript build could not be run against the uploaded source package.
- Cloudinary upload restrictions, image transformations, deletion lifecycle, and production monitoring should be hardened before launch.
