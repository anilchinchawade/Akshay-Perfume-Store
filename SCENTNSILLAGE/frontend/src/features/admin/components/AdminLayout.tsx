import { NavLink, Outlet, Link } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Users, MessageSquare, Store } from "lucide-react";
const links = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/reviews", label: "Reviews", icon: MessageSquare }
];
export function AdminLayout() {
  return <div className="min-h-screen bg-[#f7f5f0] text-[#242321]">
    <header className="flex items-center justify-between border-b border-black/10 bg-white px-5 py-4 md:px-8"><Link to="/" className="font-serif text-xl tracking-wide">SCENTNSILLAGE <span className="ml-2 text-xs font-sans tracking-widest text-[#a17b45]">ADMIN</span></Link><Link to="/" className="flex items-center gap-2 text-sm text-stone-600"><Store size={16}/> View store</Link></header>
    <div className="mx-auto grid max-w-[1500px] md:grid-cols-[230px_1fr]">
      <aside className="border-b border-black/10 bg-white p-4 md:min-h-[calc(100vh-65px)] md:border-b-0 md:border-r md:p-5"><p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[.2em] text-stone-400">Management</p><nav className="flex gap-2 overflow-x-auto md:flex-col">{links.map(({to,label,icon:Icon,end})=><NavLink key={to} to={to} end={end} className={({isActive})=>`flex shrink-0 items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${isActive?"bg-[#242321] text-white":"text-stone-600 hover:bg-stone-100"}`}><Icon size={17}/>{label}</NavLink>)}</nav></aside>
      <main className="min-w-0 p-5 md:p-8"><Outlet/></main>
    </div>
  </div>;
}
