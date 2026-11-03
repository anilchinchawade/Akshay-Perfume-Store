export const endpoints = {
  health: "/health",
  products: "/products",
  categories: "/categories",
  brands: "/brands",
  cart: "/cart",
  wishlist: "/wishlist",
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    me: "/auth/me"
  }
} as const;
