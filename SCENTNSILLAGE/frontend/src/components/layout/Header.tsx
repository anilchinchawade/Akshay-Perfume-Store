import { Link, NavLink } from "react-router-dom";
import { Menu, Search, ShoppingBag, UserRound, Heart } from "lucide-react";
import { Container } from "@/components/common/Container";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCartOpen } from "@/store/slices/cartSlice";
import { setMobileMenuOpen } from "@/store/slices/uiSlice";

const navItems = [
  { label: "Shop All", to: "/shop" },
  { label: "Our Story", to: "/about" },
  { label: "Find Your Scent", to: "/find-your-scent" }
];

export function Header() {
  const dispatch = useAppDispatch();
  const wishlistCount = useAppSelector(state => state.wishlist.items.length);
  const customer = useAppSelector(state => state.auth.user);
  const itemCount = useAppSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <>
      <div className="bg-ink px-4 py-2 text-center text-[10px] tracking-[0.2em] text-white sm:text-xs">
        COMPLIMENTARY SHIPPING ON ORDERS ABOVE ₹2,500
      </div>
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-ivory/95 backdrop-blur">
        <Container>
          <div className="grid h-[76px] grid-cols-[1fr_auto_1fr] items-center">
            <button
              className="justify-self-start p-2 lg:hidden"
              aria-label="Open navigation menu"
              onClick={() => dispatch(setMobileMenuOpen(true))}
            >
              <Menu size={21} />
            </button>
            <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className="nav-link">
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <Link to="/" className="brand-mark justify-self-center" aria-label="SCENTNSILLAGE home">
              SCENTNSILLAGE
              <span>THE ART OF FRAGRANCE</span>
            </Link>
            <div className="flex items-center justify-self-end gap-1 sm:gap-3">
              <button className="icon-button hidden sm:inline-flex" aria-label="Search">
                <Search size={19} />
              </button>
              <Link to={customer ? "/account" : "/login"} className="icon-button hidden sm:inline-flex" aria-label={customer ? "My account" : "Sign in"}>
                <UserRound size={19} />
              </Link>
              <button
                className="icon-button relative"
                aria-label={`Shopping bag with ${itemCount} items`}
                onClick={() => dispatch(setCartOpen(true))}
              >
                <ShoppingBag size={19} />
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] text-white">
                  {itemCount}
                </span>
              </button>
            </div>
          </div>
        </Container>
      </header>
      <MobileMenu />
    </>
  );
}

function MobileMenu() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.mobileMenuOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 lg:hidden" onClick={() => dispatch(setMobileMenuOpen(false))}>
      <nav
        className="h-full w-[min(86%,360px)] bg-ivory p-7 shadow-2xl"
        aria-label="Mobile navigation"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-10 flex items-center justify-between">
          <span className="font-display text-xl">SCENTNSILLAGE</span>
          <button className="text-sm" onClick={() => dispatch(setMobileMenuOpen(false))}>Close</button>
        </div>
        <div className="flex flex-col gap-6">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="font-display text-2xl"
              onClick={() => dispatch(setMobileMenuOpen(false))}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
