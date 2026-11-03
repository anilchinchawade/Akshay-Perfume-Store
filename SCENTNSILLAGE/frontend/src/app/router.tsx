import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { HomePage } from "@/features/home/pages/HomePage";
import { NotFoundPage } from "@/features/static/pages/NotFoundPage";

const ShopPage = lazy(() => import("@/features/products/pages/ShopPage").then(module => ({ default: module.ShopPage })));
const ProductDetailPage = lazy(() => import("@/features/products/pages/ProductDetailPage").then(module => ({ default: module.ProductDetailPage })));
const FragranceQuizPage = lazy(() => import("@/features/fragrance-quiz/pages/FragranceQuizPage").then(module => ({ default: module.FragranceQuizPage })));
const AboutPage = lazy(() => import("@/features/static/pages/AboutPage").then(module => ({ default: module.AboutPage })));

function RouteLoader() {
  return <div className="mx-auto min-h-[50vh] max-w-6xl animate-pulse px-6 py-20"><div className="h-8 w-1/3 bg-beige"/><div className="mt-6 h-64 bg-beige"/></div>;
}

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/shop", element: <Suspense fallback={<RouteLoader />}><ShopPage /></Suspense> },
      { path: "/product/:slug", element: <Suspense fallback={<RouteLoader />}><ProductDetailPage /></Suspense> },
      { path: "/find-your-scent", element: <Suspense fallback={<RouteLoader />}><FragranceQuizPage /></Suspense> },
      { path: "/about", element: <Suspense fallback={<RouteLoader />}><AboutPage /></Suspense> },
      { path: "*", element: <NotFoundPage /> }
    ]
  }
]);
