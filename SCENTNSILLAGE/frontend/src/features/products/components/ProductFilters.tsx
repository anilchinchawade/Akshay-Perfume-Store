import type { ProductFilters as Filters } from "@/features/products/types/product.types";

const brands = ["Maison Aurelle", "Atelier No. 9", "Orris & Oak", "Blue Hour", "SCENTNSILLAGE"];
const families = ["Floral", "Woody", "Oriental", "Fresh", "Citrus", "Musky", "Aquatic", "Gourmand", "Green", "Aromatic"];
const selectClass = "mt-2 w-full border border-ink/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-gold";
const labelClass = "text-xs font-semibold uppercase tracking-[0.13em]";

export function ProductFilters({ filters, onChange, onClear }: { filters: Filters; onChange: (updates: Partial<Filters>) => void; onClear: () => void }) {
  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between"><h2 className="font-display text-xl">Refine your search</h2><button className="text-xs text-muted underline" onClick={onClear}>Clear all</button></div>
      <label className="block"><span className={labelClass}>Brand</span><select className={selectClass} value={filters.brand} onChange={event => onChange({ brand: event.target.value })}><option value="">All brands</option>{brands.map(brand => <option key={brand}>{brand}</option>)}</select></label>
      <label className="block"><span className={labelClass}>Gender</span><select className={selectClass} value={filters.gender} onChange={event => onChange({ gender: event.target.value })}><option value="">All</option><option value="women">Women</option><option value="men">Men</option><option value="unisex">Unisex</option></select></label>
      <label className="block"><span className={labelClass}>Scent family</span><select className={selectClass} value={filters.scentFamily} onChange={event => onChange({ scentFamily: event.target.value })}><option value="">All families</option>{families.map(family => <option key={family}>{family}</option>)}</select></label>
      <div><p className={labelClass}>Price range (₹)</p><div className="mt-2 grid grid-cols-2 gap-2"><input aria-label="Minimum price" type="number" min="0" placeholder="Min" className={selectClass} value={filters.minPrice} onChange={event => onChange({ minPrice: event.target.value })}/><input aria-label="Maximum price" type="number" min="0" placeholder="Max" className={selectClass} value={filters.maxPrice} onChange={event => onChange({ maxPrice: event.target.value })}/></div></div>
      <label className="block"><span className={labelClass}>Bottle size</span><select className={selectClass} value={filters.size} onChange={event => onChange({ size: event.target.value })}><option value="">Any size</option><option value="5">5 ml samples</option><option value="30">30 ml</option><option value="50">50 ml</option><option value="100">100 ml</option></select></label>
      <label className="block"><span className={labelClass}>Customer rating</span><select className={selectClass} value={filters.minRating} onChange={event => onChange({ minRating: event.target.value })}><option value="">Any rating</option><option value="4">4 stars & above</option><option value="4.5">4.5 stars & above</option></select></label>
      <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={filters.availability === "in-stock"} onChange={event => onChange({ availability: event.target.checked ? "in-stock" : "" })} className="accent-[#b28a52]"/>In stock only</label>
    </aside>
  );
}
