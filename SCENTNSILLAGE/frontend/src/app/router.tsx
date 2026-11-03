import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { HomePage } from "@/features/home/pages/HomePage";
import { ShopPage } from "@/features/products/pages/ShopPage";
import { AboutPage } from "@/features/static/pages/AboutPage";
import { NotFoundPage } from "@/features/static/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/shop", element: <ShopPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "*", element: <NotFoundPage /> }
    ]
  }
]);
