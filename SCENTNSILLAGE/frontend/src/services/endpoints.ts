
export const endpoints = {
 health:"/health",products:"/products",categories:"/categories",brands:"/brands",cart:"/cart",wishlist:"/wishlist",
 auth:{login:"/auth/login",register:"/auth/register",logout:"/auth/logout",me:"/auth/me",refresh:"/auth/refresh",changePassword:"/auth/change-password"},
 users:{me:"/users/me",orders:"/users/me/orders",reviews:"/users/me/reviews"},
 payments:{createOrder:"/payments/razorpay/order",verify:"/payments/razorpay/verify"},
 reviews:"/reviews",admin:{dashboard:"/admin/dashboard",orders:"/admin/orders",products:"/admin/products"}
} as const;
