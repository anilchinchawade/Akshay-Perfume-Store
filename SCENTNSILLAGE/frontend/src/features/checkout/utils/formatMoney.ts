export const formatMoney = (amount: number) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0
}).format(amount);
export const FREE_SHIPPING_THRESHOLD = 2500;
export const SHIPPING_FEE = 99;
