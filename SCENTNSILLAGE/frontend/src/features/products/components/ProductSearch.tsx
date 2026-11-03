import { useEffect, useState, type FormEvent } from "react";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useDebounce } from "@/features/products/hooks/useDebounce";
import { productService } from "@/features/products/services/productService";
import type { Product } from "@/features/products/types/product.types";

export function ProductSearch({ value, onSearch }: { value: string; onSearch: (value: string) => void }) {
  const [input, setInput] = useState(value);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(input, 300);
  useEffect(() => setInput(value), [value]);
  useEffect(() => {
    let active = true;
    if (!debounced.trim()) { setSuggestions([]); return; }
    productService.getSuggestions(debounced).then(items => { if (active) setSuggestions(items); });
    return () => { active = false; };
  }, [debounced]);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); onSearch(input.trim()); setOpen(false); };

  return (
    <div className="relative w-full max-w-xl">
      <form onSubmit={submit} className="flex border-b border-ink/25"><Search size={18} className="my-auto mr-3 text-muted"/><input value={input} onChange={event => { setInput(event.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={event => { if (event.key === "Escape") setOpen(false); }} placeholder="Search perfumes, brands or notes..." aria-label="Search perfumes, brands or fragrance notes" aria-expanded={open && suggestions.length > 0} className="min-h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-muted/70"/>{input && <button type="button" aria-label="Clear search" onClick={() => { setInput(""); onSearch(""); setSuggestions([]); }}><X size={16}/></button>}<button className="ml-3 text-[10px] font-semibold uppercase tracking-widest">Search</button></form>
      {open && suggestions.length > 0 && <div className="absolute left-0 right-0 top-full z-30 border border-ink/10 bg-ivory p-2 shadow-xl">{suggestions.map(product => <Link key={product.id} to={`/product/${product.slug}`} onClick={() => setOpen(false)} className="flex items-center gap-3 p-2 hover:bg-beige/50"><img src={product.images[0]?.url} alt="" className="h-12 w-10 object-cover"/><span className="min-w-0"><span className="block truncate text-sm">{product.name}</span><span className="block text-xs text-muted">{product.brand} · {product.scentFamily.join(", ")}</span></span></Link>)}</div>}
    </div>
  );
}
