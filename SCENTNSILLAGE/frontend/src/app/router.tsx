import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { HomePage } from "@/features/home/pages/HomePage";
import { NotFoundPage } from "@/features/static/pages/NotFoundPage";

const ShopPage = lazy(() => import("@/features/products/pages/ShopPage").then(module => ({ default: module.ShopPage })));
const ProductDetailPage = lazy(() => import("@/features/products/pages/ProductDetailPage").then(module => ({ default: module.ProductDetailPage })));
const FragranceQuizPage = lazy(() => import("@/features/fragrance-quiz/pages/FragranceQuizPage").then(module => ({ default: module.FragranceQuizPage })));
const AboutPage = lazy(() => import("@/features/static/pages/AboutPage").then(module => ({ default: module.AboutPage })));
const CartPage = lazy(() => import("@/features/cart/pages/CartPage").then(module => ({ default: module.CartPage })));
const WishlistPage = lazy(() => import("@/features/wishlist/pages/WishlistPage").then(module => ({ default: module.WishlistPage })));
const CheckoutPage = lazy(() => import("@/features/checkout/pages/CheckoutPage").then(module => ({ default: module.CheckoutPage })));
const OrderConfirmationPage = lazy(() => import("@/features/checkout/pages/OrderConfirmationPage").then(module => ({ default: module.OrderConfirmationPage })));
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage").then(module => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage").then(module => ({ default: module.RegisterPage })));
const AccountPage = lazy(() => import("@/features/account/pages/AccountPage").then(module => ({ default: module.AccountPage })));
const OrdersPage = lazy(() => import("@/features/account/pages/OrdersPage").then(module => ({ default: module.OrdersPage })));
const MyReviewsPage = lazy(() => import("@/features/reviews/pages/MyReviewsPage").then(module => ({ default: module.MyReviewsPage })));
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";

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
      { path: "/cart", element: <Suspense fallback={<RouteLoader />}><CartPage /></Suspense> },
      { path: "/wishlist", element: <Suspense fallback={<RouteLoader />}><WishlistPage /></Suspense> },
      { path: "/checkout", element: <Suspense fallback={<RouteLoader />}><CheckoutPage /></Suspense> },
      { path: "/order-confirmation/:reference", element: <Suspense fallback={<RouteLoader />}><OrderConfirmationPage /></Suspense> },
      { path: "/login", element: <Suspense fallback={<RouteLoader />}><LoginPage /></Suspense> },
      { path: "/register", element: <Suspense fallback={<RouteLoader />}><RegisterPage /></Suspense> },
      { path: "/account", element: <ProtectedRoute><Suspense fallback={<RouteLoader />}><AccountPage /></Suspense></ProtectedRoute> },
      { path: "/account/orders", element: <ProtectedRoute><Suspense fallback={<RouteLoader />}><OrdersPage /></Suspense></ProtectedRoute> },
      { path: "/account/reviews", element: <ProtectedRoute><Suspense fallback={<RouteLoader />}><MyReviewsPage /></Suspense></ProtectedRoute> },
      { path: "*", element: <NotFoundPage /> }
    ]
  }
]);
