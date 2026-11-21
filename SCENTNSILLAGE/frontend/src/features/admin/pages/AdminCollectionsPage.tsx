import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService, type AdminCollection, type AdminCollectionRule, type AdminProduct, type CollectionMode } from "../services/adminService";

const inputClass = "mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#a17b45]";
const labelClass = "block text-sm font-medium text-stone-700";
const emptyDraft = () => ({ title: "", slug: "", description: "", bannerImage: "", mode: "manual" as CollectionMode, rule: {} as AdminCollectionRule, productIds: [] as string[], isActive: true, sortOrder: 0 });
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function AdminCollectionsPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState(emptyDraft);
  const collectionsQuery = useQuery({ queryKey: ["admin", "collections"], queryFn: async () => (await adminService.collections()).data.collections });
  const productsQuery = useQuery({ queryKey: ["admin", "collection-products", search], queryFn: async () => (await adminService.products(search, 50)).data.products, enabled: showForm });
  const save = useMutation({
    mutationFn: () => adminService.saveCollection({ ...draft, slug: slugify(draft.slug || draft.title), rule: draft.rule }, editing || undefined),
    onSuccess: async () => {
      await Promise.all([qc.invalidateQueries({ queryKey: ["admin", "collections"] }), qc.invalidateQueries({ queryKey: ["products", "custom-collections"] }), qc.invalidateQueries({ queryKey: ["home-custom-collections"] })]);
      setShowForm(false); setEditing(""); setDraft(emptyDraft());
    },
  });
  const remove = useMutation({ mutationFn: adminService.deleteCollection, onSuccess: async () => { await Promise.all([qc.invalidateQueries({ queryKey: ["admin", "collections"] }), qc.invalidateQueries({ queryKey: ["home-custom-collections"] })]); } });
  const products = productsQuery.data ?? [];
  const selectedCount = draft.productIds.length;
  const selectedProducts = draft.productIds.map(id => ({ id, product: products.find(product => product._id === id) }));
  const needsManual = draft.mode === "manual" || draft.mode === "hybrid";
  const needsRule = draft.mode === "automatic" || draft.mode === "hybrid";
  const canSave = draft.title.trim().length >= 2 && slugify(draft.slug || draft.title).length >= 2 && (!needsManual || selectedCount > 0) && (!needsRule || Boolean(draft.rule.flag || draft.rule.category?.trim() || draft.rule.brand?.trim() || draft.rule.gender));

  function startCreate() { setEditing(""); setDraft(emptyDraft()); setShowForm(true); }
  function startEdit(collection: AdminCollection) {
    setEditing(collection._id);
    setDraft({ title: collection.title, slug: collection.slug, description: collection.description ?? "", bannerImage: collection.bannerImage ?? "", mode: collection.mode, rule: collection.rule ?? {}, productIds: (collection.productIds ?? []).map(String), isActive: collection.isActive, sortOrder: collection.sortOrder ?? 0 });
    setShowForm(true);
  }
  function updateRule<K extends keyof AdminCollectionRule>(key: K, value: AdminCollectionRule[K] | undefined) {
    setDraft(current => ({ ...current, rule: { ...current.rule, [key]: value } }));
  }
  function toggleProduct(id: string) {
    setDraft(current => ({ ...current, productIds: current.productIds.includes(id) ? current.productIds.filter(value => value !== id) : [...current.productIds, id] }));
  }
  function moveProduct(index: number, direction: -1 | 1) {
    setDraft(current => {
      const next = [...current.productIds];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...current, productIds: next };
    });
  }

  return <div>
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs uppercase tracking-[.2em] text-[#a17b45]">Store merchandising</p><h1 className="mt-2 font-serif text-3xl">Collections</h1><p className="mt-2 text-sm text-stone-500">Build curated storefront collections using manual product picks, automatic rules, or both.</p></div><button type="button" onClick={() => showForm ? setShowForm(false) : startCreate()} className="rounded-lg bg-[#242321] px-4 py-2.5 text-sm text-white">{showForm ? "Close editor" : "Create collection"}</button></div>

    {showForm && <section className="mb-8 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="mb-5"><h2 className="font-serif text-2xl">{editing ? "Edit collection" : "New custom collection"}</h2><p className="mt-1 text-xs text-stone-500">Custom collections appear on the storefront when active.</p></div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className={labelClass}>Collection title<input className={inputClass} value={draft.title} onChange={event => setDraft(current => ({ ...current, title: event.target.value, slug: current.slug || slugify(event.target.value) }))} placeholder="Summer Fragrance Edit" /></label>
        <label className={labelClass}>URL slug<input className={inputClass} value={draft.slug} onChange={event => setDraft(current => ({ ...current, slug: event.target.value }))} placeholder="summer-fragrance-edit" /></label>
        <label className={`${labelClass} md:col-span-2`}>Description<textarea className={inputClass} rows={2} value={draft.description} onChange={event => setDraft(current => ({ ...current, description: event.target.value }))} placeholder="A short introduction to this edit" /></label>
        <label className={`${labelClass} md:col-span-2`}>Banner image URL<input className={inputClass} value={draft.bannerImage} onChange={event => setDraft(current => ({ ...current, bannerImage: event.target.value }))} placeholder="https://... (Cloudinary image URL recommended)" /></label>
        <label className={labelClass}>Collection mode<select className={inputClass} value={draft.mode} onChange={event => setDraft(current => ({ ...current, mode: event.target.value as CollectionMode }))}><option value="manual">Manual – selected products only</option><option value="automatic">Automatic – rule-based products</option><option value="hybrid">Hybrid – manual picks + automatic matches</option></select></label>
        <label className={labelClass}>Display order<input type="number" min="0" className={inputClass} value={draft.sortOrder} onChange={event => setDraft(current => ({ ...current, sortOrder: Math.max(0, Number(event.target.value) || 0) }))} /></label>
      </div>

      {needsRule && <div className="mt-6 rounded-lg border border-stone-200 p-4"><h3 className="font-semibold">Automatic product rules</h3><p className="mt-1 text-xs text-stone-500">Products matching all selected rules are included automatically.</p><div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className={labelClass}>Product flag<select className={inputClass} value={draft.rule.flag ?? ""} onChange={event => updateRule("flag", (event.target.value || undefined) as AdminCollectionRule["flag"])}><option value="">Any flag</option><option value="isNew">New arrivals</option><option value="isBestseller">Bestsellers</option><option value="isFeatured">Featured</option><option value="isDiscoverySet">Discovery sets</option></select></label>
        <label className={labelClass}>Gender<select className={inputClass} value={draft.rule.gender ?? ""} onChange={event => updateRule("gender", (event.target.value || undefined) as AdminCollectionRule["gender"])}><option value="">Any gender</option><option value="men">Men</option><option value="women">Women</option><option value="unisex">Unisex</option></select></label>
        <label className={labelClass}>Category<input className={inputClass} value={draft.rule.category ?? ""} onChange={event => updateRule("category", event.target.value || undefined)} placeholder="Eau de Parfum" /></label>
        <label className={labelClass}>Brand<input className={inputClass} value={draft.rule.brand ?? ""} onChange={event => updateRule("brand", event.target.value || undefined)} placeholder="Brand name" /></label>
      </div></div>}

      {needsManual && <div className="mt-6 rounded-lg border border-stone-200 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-semibold">Manually selected products</h3><p className="mt-1 text-xs text-stone-500">Selected products retain the order shown below.</p></div><span className="text-xs font-semibold text-[#8c6634]">{selectedCount} selected</span></div><input className={`${inputClass} mt-4`} value={search} onChange={event => setSearch(event.target.value)} placeholder="Search products by name, brand or ID" />
        {productsQuery.isLoading ? <p className="py-5 text-sm text-stone-500">Loading products…</p> : <div className="mt-3 grid max-h-72 gap-2 overflow-y-auto sm:grid-cols-2">{products.map((product: AdminProduct) => <label key={product._id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-stone-100 p-3 text-sm hover:bg-stone-50"><input type="checkbox" checked={draft.productIds.includes(product._id)} onChange={() => toggleProduct(product._id)} /><span className="min-w-0"><span className="block truncate font-medium">{product.name}</span><span className="block truncate text-xs text-stone-500">{product.brand} · {product.category}</span></span></label>)}</div>}
        {productsQuery.isError && <p role="alert" className="mt-3 text-sm text-red-700">Unable to load products. Try again.</p>}
        {draft.productIds.length > 0 && <div className="mt-5 border-t border-stone-200 pt-4"><h4 className="text-sm font-semibold">Selected display order</h4><ol className="mt-2 space-y-2">{selectedProducts.map(({ id, product }, index) => <li key={id} className="flex items-center justify-between gap-3 rounded-lg bg-stone-50 px-3 py-2 text-sm"><span className="min-w-0 truncate">{index + 1}. {product ? `${product.name} — ${product.brand}` : `Selected product (${id})`}</span><span className="flex shrink-0 gap-1"><button type="button" aria-label="Move product up" disabled={index === 0} onClick={() => moveProduct(index, -1)} className="rounded border border-stone-300 px-2 py-1 disabled:opacity-30">↑</button><button type="button" aria-label="Move product down" disabled={index === draft.productIds.length - 1} onClick={() => moveProduct(index, 1)} className="rounded border border-stone-300 px-2 py-1 disabled:opacity-30">↓</button></span></li>)}</ol></div>}
      </div>}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.isActive} onChange={event => setDraft(current => ({ ...current, isActive: event.target.checked }))} /> Publish collection on storefront</label><div className="flex gap-2"><button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-stone-300 px-4 py-2 text-sm">Cancel</button><button type="button" disabled={!canSave || save.isPending} onClick={() => save.mutate()} className="rounded-lg bg-[#242321] px-5 py-2 text-sm text-white disabled:opacity-40">{save.isPending ? "Saving…" : editing ? "Save changes" : "Create collection"}</button></div></div>
      {save.isError && <p role="alert" className="mt-3 text-sm text-red-700">{save.error instanceof Error ? save.error.message : "Unable to save collection."}</p>}
      {!canSave && <p className="mt-3 text-xs text-amber-700">Complete the required manual product selections or automatic rules for the selected mode.</p>}
    </section>}

    {collectionsQuery.isLoading ? <p className="py-10 text-sm text-stone-500">Loading collections…</p> : collectionsQuery.isError ? <div role="alert" className="rounded-lg border border-red-200 bg-white p-5 text-sm text-red-700">Unable to load collections. Refresh the page and try again.</div> : (collectionsQuery.data ?? []).length === 0 ? <div className="rounded-xl border border-dashed border-stone-300 bg-white p-10 text-center"><h2 className="font-serif text-xl">No custom collections yet</h2><p className="mt-2 text-sm text-stone-500">Create your first collection to curate a special fragrance edit.</p></div> : <div className="grid gap-4 lg:grid-cols-2">{(collectionsQuery.data ?? []).map((collection: AdminCollection) => <article key={collection._id} className="rounded-xl border border-stone-200 bg-white p-5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="font-serif text-xl">{collection.title}</h2><p className="mt-1 text-xs text-stone-500">/{collection.slug}</p></div><span className={`shrink-0 rounded-full px-3 py-1 text-xs ${collection.isActive ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>{collection.isActive ? "Published" : "Draft"}</span></div><p className="mt-3 line-clamp-2 text-sm text-stone-600">{collection.description || "No description"}</p><div className="mt-4 flex flex-wrap gap-2 text-xs"><span className="rounded bg-stone-100 px-2 py-1 capitalize">{collection.mode}</span><span className="rounded bg-stone-100 px-2 py-1">{collection.productIds?.length ?? 0} manual picks</span><span className="rounded bg-stone-100 px-2 py-1">Order {collection.sortOrder}</span></div><div className="mt-5 flex gap-2"><button type="button" onClick={() => startEdit(collection)} className="rounded-lg border border-stone-300 px-4 py-2 text-sm">Edit</button><button type="button" disabled={remove.isPending} onClick={() => { if (window.confirm(`Delete “${collection.title}”?`)) remove.mutate(collection._id); }} className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-700">Delete</button></div></article>)}</div>}
  </div>;
}
