import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MiniCart } from "@/components/layout/MiniCart";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-ivory text-ink">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
      <MiniCart />
    </div>
  );
}
