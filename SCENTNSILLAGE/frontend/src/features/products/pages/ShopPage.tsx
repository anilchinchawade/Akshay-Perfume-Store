import { useMemo, useState } from "react";
import { Grid2X2, List, SlidersHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Container } from "@/components/common/Container";
import { ProductCard } from "@/features/products/components/ProductCard";
import { ProductFilters } from "@/features/products/components/ProductFilters";
import { ProductSearch } from "@/features/products/components/ProductSearch";
import { useProductFilters } from "@/features/products/hooks/useProductFilters";
import { productService } from "@/features/products/services/productService";

export function ShopPage() {
  const { filters, updateFilters, clearFilters } = useProductFilters();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const queryKey = useMemo(() => ["products", filters], [filters]);
  const { data, isLoading, isError, error, refetch } = useQuery({ queryKey, queryFn: () => productService.getProducts(filters) });
  const page = data?.page ?? filters.page;
  const totalPages = data?.totalPages ?? 1;

  return (
    <Container><section className="py-12 sm:py-16">
      <div className="text-center"><p className="eyebrow">The fragrance wardrobe</p><h1 className="section-heading mt-3">Discover the collection</h1><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted">Explore scents for every mood, moment and memory.</p></div>
      <div className="mx-auto mt-10 max-w-2xl"><ProductSearch value={filters.search} onSearch={search => updateFilters({ search, page: 1 })}/></div>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-y border-ink/10 py-4"><p className="text-sm text-muted">{data?.total ?? 0} fragrances</p><div className="flex items-center gap-3">
        <button className="inline-flex items-center gap-2 text-xs uppercase tracking-wider lg:hidden" onClick={() => setMobileFiltersOpen(open => !open)}><SlidersHorizontal size={15}/> Filters</button>
        <label className="flex items-center gap-2 text-xs"><span className="hidden sm:inline">Sort by</span><select aria-label="Sort products" value={filters.sortBy} onChange={event => updateFilters({ sortBy: event.target.value as typeof filters.sortBy })} className="bg-transparent py-2 outline-none"><option value="featured">Featured</option><option value="newest">Newest</option><option value="popularity">Popularity</option><option value="rating">Top rated</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label>
        <div className="hidden items-center border-l border-ink/10 pl-3 sm:flex"><button aria-label="Grid view" aria-pressed={view === "grid"} className={`p-2 ${view === "grid" ? "text-gold" : "text-muted"}`} onClick={() => setView("grid")}><Grid2X2 size={17}/></button><button aria-label="List view" aria-pressed={view === "list"} className={`p-2 ${view === "list" ? "text-gold" : "text-muted"}`} onClick={() => setView("list")}><List size={18}/></button></div>
      </div></div>
      <div className="grid gap-8 py-8 lg:grid-cols-[230px_1fr]"><div className={`${mobileFiltersOpen ? "block" : "hidden"} lg:block`}><ProductFilters filters={filters} onChange={updateFilters} onClear={clearFilters}/></div><div>
        {isLoading ? <div className="grid grid-cols-2 gap-5 md:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="animate-pulse"><div className="aspect-[4/5] bg-beige"/><div className="mt-4 h-4 w-2/3 bg-beige"/><div className="mt-2 h-3 w-1/3 bg-beige"/></div>)}</div>
          : isError ? <div role="alert" className="border border-red-300 p-8 text-center"><p className="font-display text-2xl">We couldn't load the collection.</p><p className="mt-2 text-sm text-muted">{error instanceof Error ? error.message : "Please try again."}</p><button className="mt-4 underline" onClick={() => void refetch()}>Try again</button></div>
          : data?.items.length ? <><div className={view === "grid" ? "grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 md:grid-cols-3" : "flex flex-col"}>{data.items.map(product => <ProductCard key={product.id} product={product} view={view}/>)}</div><div className="mt-12 flex items-center justify-center gap-5"><button disabled={page <= 1} onClick={() => updateFilters({ page: page - 1 })} className="text-xs uppercase tracking-wider disabled:opacity-30">Previous</button><span className="text-sm">{page} / {totalPages}</span><button disabled={page >= totalPages} onClick={() => updateFilters({ page: page + 1 })} className="text-xs uppercase tracking-wider disabled:opacity-30">Next</button></div></>
          : <div className="border border-ink/10 py-20 text-center"><p className="font-display text-2xl">No fragrances found</p><p className="mt-2 text-sm text-muted">Try another search or remove a filter.</p><button onClick={clearFilters} className="mt-5 text-xs font-semibold uppercase tracking-widest underline">Clear filters</button></div>}
      </div></div>
    </section></Container>
  );
}
