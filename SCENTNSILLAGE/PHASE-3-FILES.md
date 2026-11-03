# Phase 3 file map

## New product domain files
- `frontend/src/features/products/types/product.types.ts`
- `frontend/src/features/products/data/products.ts`
- `frontend/src/features/products/services/productService.ts`
- `frontend/src/features/products/hooks/useDebounce.ts`
- `frontend/src/features/products/hooks/useProductFilters.ts`
- `frontend/src/features/products/components/ProductCard.tsx`
- `frontend/src/features/products/components/ProductFilters.tsx`
- `frontend/src/features/products/components/ProductSearch.tsx`
- `frontend/src/features/products/components/FragrancePyramid.tsx`
- `frontend/src/features/products/pages/ShopPage.tsx`
- `frontend/src/features/products/pages/ProductDetailPage.tsx`

## New fragrance quiz
- `frontend/src/features/fragrance-quiz/pages/FragranceQuizPage.tsx`

## Updated existing file
- `frontend/src/app/router.tsx`

## Demo catalogue adapter
`productService.ts` currently reads from the typed `products.ts` catalogue. It implements the same filter/search/sort/pagination operations expected from the REST API. Replace this adapter with API calls when the backend product endpoints are implemented in Phase 6.
