import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService, type AdminProduct } from "../services/adminService";

type ProductDraft = {
  id: string; name: string; slug: string; brand: string; category: string;
  description: string; shortDescription: string; gender: "men" | "women" | "unisex";
  concentration: "EDT" | "EDP" | "Parfum" | "Cologne";
  scentFamily: string[]; notes: { top: string[]; middle: string[]; base: string[] };
  season: string[]; occasion: string[]; longevity: string; sillage: string;
  variants: { id: string; size: number; unit: "ml"; price: number; compareAtPrice?: number; stock: number; sku: string }[];
  images: { url: string; alt: string }[];
  isNew: boolean; isBestseller: boolean; isFeatured: boolean; isDiscoverySet: boolean;
  authenticityGuaranteed: boolean; batchInformation: string; isActive: boolean;
};

const emptyDraft = (): ProductDraft => ({
  id: "", name: "", slug: "", brand: "", category: "Eau de Parfum",
  description: "", shortDescription: "", gender: "unisex", concentration: "EDP",
  scentFamily: [], notes: { top: [], middle: [], base: [] }, season: [], occasion: [],
  longevity: "Long-lasting", sillage: "Moderate",
  variants: [{ id: "30ml", size: 30, unit: "ml", price: 999, stock: 10, sku: "SNS-NEW-30" }],
  images: [], isNew: true, isBestseller: false, isFeatured: false,
  isDiscoverySet: false, authenticityGuaranteed: true, batchInformation: "", isActive: true
});

const splitList = (value: string) => value.split(",").map(item => item.trim()).filter(Boolean);
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function uploadToCloudinary(file: File) {
  const result = await adminService.cloudinarySignature();
  const signature = result.data;
  const body = new FormData();
  body.append("file", file);
  body.append("api_key", signature.apiKey);
  body.append("timestamp", String(signature.timestamp));
  body.append("folder", signature.folder);
  body.append("signature", signature.signature);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`, { method: "POST", body });
  const payload = await response.json() as { secure_url?: string; error?: { message?: string } };
  if (!response.ok || !payload.secure_url) throw new Error(payload.error?.message || "Cloudinary image upload failed.");
  return payload.secure_url;
}

const inputClass = "mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#a17b45]";
const labelClass = "block text-sm font-medium text-stone-700";

export function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft);
  const [editing, setEditing] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const qc = useQueryClient();

  const q = useQuery({ queryKey: ["admin", "products", search], queryFn: () => adminService.products(search) });
  const save = useMutation({
    mutationFn: () => {
      // const payload = { ...draft, id: editing ? draft.id : (draft.id || `sns-${slugify(draft.name)}`), slug: slugify(draft.slug || draft.name) };
      const payload = {
  ...draft,
  id: editing ? draft.id : (draft.id || `sns-${slugify(draft.name)}`),
  slug: slugify(draft.slug),
};
      return adminService.saveProduct(payload as unknown as Record<string, unknown>, editing || undefined);
    },
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["admin", "products"] }),
        qc.invalidateQueries({ queryKey: ["admin", "dashboard"] }),
        qc.invalidateQueries({ queryKey: ["products"] })
      ]);
      // setShowForm(false); setEditing(""); setDraft(emptyDraft()); setPreview(false);
      setShowForm(false);
setEditing("");
setDraft(emptyDraft());
setPreview(false);
setSlugManuallyEdited(false);
    }
  });
  const deactivate = useMutation({
    mutationFn: adminService.deactivateProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "products"] })
  });

  const startingPrice = useMemo(() => Math.min(...draft.variants.map(variant => variant.price || 0)), [draft.variants]);
  function update<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
    setDraft(current => ({ ...current, [key]: value }));
  }
  // function edit(product: AdminProduct) {
  //   setEditing(product.id);
  //   setDraft({
  //     ...emptyDraft(), ...product,
  //     notes: { top: product.notes?.top ?? [], middle: product.notes?.middle ?? [], base: product.notes?.base ?? [] },
  //     variants: product.variants.map(variant => ({ ...variant, unit: "ml" as const })),
  //     images: product.images ?? []
  //   });
  //   setShowForm(true); setPreview(false);
  // }
  function edit(product: AdminProduct) {
  setEditing(product.id);
  setSlugManuallyEdited(true);

  setDraft({
    ...emptyDraft(),
    ...product,
    notes: {
      top: product.notes?.top ?? [],
      middle: product.notes?.middle ?? [],
      base: product.notes?.base ?? [],
    },
    variants: product.variants.map(variant => ({
      ...variant,
      unit: "ml" as const,
    })),
    images: product.images ?? [],
  });

  setShowForm(true);
  setPreview(false);
}
  // function addNew() {
  //   setEditing(""); setDraft(emptyDraft()); setShowForm(true); setPreview(false); setUploadError("");
  // }

  function addNew() {
  setEditing("");
  setDraft(emptyDraft());
  setSlugManuallyEdited(false);
  setShowForm(true);
  setPreview(false);
  setUploadError("");
}
  async function handleImageFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true); setUploadError("");
    try {
      const uploaded = await Promise.all(Array.from(files).map(uploadToCloudinary));
      update("images", [...draft.images, ...uploaded.map((url, index) => ({ url, alt: `${draft.name || "Perfume"} product image ${index + 1}` }))]);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }
  function submit() {
    // if (!draft.name.trim() || !draft.brand.trim() || !draft.description.trim() || !draft.variants.length) {
    //   alert("Please enter product name, brand, description and at least one size variant.");
    //   return;
    // }
    if (
  !draft.name.trim() ||
  !draft.brand.trim() ||
  !draft.description.trim() ||
  !draft.variants.length ||
  slugify(draft.slug).length < 2
) {
  alert(
    "Please enter a valid product name, brand, description, slug and at least one size variant."
  );
  return;
}
    save.mutate();
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-xs uppercase tracking-[.2em] text-[#a17b45]">Catalogue</p><h1 className="mt-2 font-serif text-3xl">Products</h1></div>
        <button onClick={showForm ? () => setShowForm(false) : addNew} className="rounded-lg bg-[#242321] px-4 py-2.5 text-sm text-white">{showForm ? "Close editor" : "Add product"}</button>
      </div>

      {showForm && (
        <section className="mb-7 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="font-serif text-2xl">{editing ? "Edit product" : "Create a product"}</h2><p className="mt-1 text-xs text-stone-500">Enter product information, upload images and preview the listing before saving.</p></div>
            <button type="button" onClick={() => setPreview(value => !value)} className="rounded-lg border border-[#a17b45] px-4 py-2 text-sm text-[#8c6634]">{preview ? "Back to editor" : "Preview product"}</button>
          </div>

          {preview ? (
            <div className="rounded-xl bg-[#f7f3ec] p-5">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="grid grid-cols-2 gap-2">
                  {draft.images.length ? draft.images.map((image, index) => <img key={`${image.url}-${index}`} src={image.url} alt={image.alt} className="aspect-square w-full rounded-lg object-cover" />) : <div className="col-span-2 flex aspect-square items-center justify-center rounded-lg bg-[#e7dccb] text-sm text-stone-500">No product images uploaded</div>}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#9a7440]">{draft.brand || "Brand"}</p>
                  <h3 className="mt-2 font-serif text-3xl">{draft.name || "Product name"}</h3>
                  <p className="mt-2 text-sm text-stone-600">{draft.shortDescription || "Short product description"}</p>
                  <p className="mt-5 text-2xl">₹{Number.isFinite(startingPrice) ? startingPrice.toLocaleString("en-IN") : "—"}</p>
                  <p className="mt-4 text-sm text-stone-600">{draft.concentration} · {draft.gender} · {draft.category}</p>
                  <p className="mt-3 text-sm leading-6">{draft.description}</p>
                  <div className="mt-4 space-y-1 text-sm text-stone-600"><p><b>Top:</b> {draft.notes.top.join(", ") || "—"}</p><p><b>Heart:</b> {draft.notes.middle.join(", ") || "—"}</p><p><b>Base:</b> {draft.notes.base.join(", ") || "—"}</p></div>
                  <p className="mt-4 text-xs text-stone-500">Preview only — this is not the exact final storefront layout.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <label className={labelClass}>
  Product name
  <input
    className={inputClass}
    value={draft.name}
    onChange={e => {
      const name = e.target.value;

      setDraft(current => ({
        ...current,
        name,
        slug: slugManuallyEdited
          ? current.slug
          : slugify(name),
      }));
    }}
  />
</label>
                <label className={labelClass}>Brand<input className={inputClass} value={draft.brand} onChange={e => update("brand", e.target.value)} /></label>
                <label className={labelClass}>
  Slug
  <input
    className={inputClass}
    value={draft.slug}
    onChange={e => {
      setSlugManuallyEdited(true);
      update("slug", slugify(e.target.value));
    }}
  />
  <span className="mt-1 block text-xs text-stone-500">
    Generated automatically from product name. You can also customize it.
  </span>
</label>
                <label className={labelClass}>Category<input className={inputClass} value={draft.category} onChange={e => update("category", e.target.value)} /></label>
                <label className={labelClass}>Gender<select className={inputClass} value={draft.gender} onChange={e => update("gender", e.target.value as ProductDraft["gender"])}><option value="unisex">Unisex</option><option value="men">Men</option><option value="women">Women</option></select></label>
                <label className={labelClass}>Concentration<select className={inputClass} value={draft.concentration} onChange={e => update("concentration", e.target.value as ProductDraft["concentration"])}>{["EDT", "EDP", "Parfum", "Cologne"].map(value => <option key={value}>{value}</option>)}</select></label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className={labelClass}>Short description<textarea className={inputClass} rows={2} maxLength={240} value={draft.shortDescription} onChange={e => update("shortDescription", e.target.value)} /></label>
                <label className={labelClass}>Full description<textarea className={inputClass} rows={3} value={draft.description} onChange={e => update("description", e.target.value)} /></label>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className={labelClass}>Scent families (comma separated)<input className={inputClass} value={draft.scentFamily.join(", ")} onChange={e => update("scentFamily", splitList(e.target.value))} /></label>
                <label className={labelClass}>Seasons (comma separated)<input className={inputClass} value={draft.season.join(", ")} onChange={e => update("season", splitList(e.target.value))} /></label>
                <label className={labelClass}>Occasions (comma separated)<input className={inputClass} value={draft.occasion.join(", ")} onChange={e => update("occasion", splitList(e.target.value))} /></label>
                <label className={labelClass}>Top notes<input className={inputClass} value={draft.notes.top.join(", ")} onChange={e => update("notes", { ...draft.notes, top: splitList(e.target.value) })} /></label>
                <label className={labelClass}>Heart notes<input className={inputClass} value={draft.notes.middle.join(", ")} onChange={e => update("notes", { ...draft.notes, middle: splitList(e.target.value) })} /></label>
                <label className={labelClass}>Base notes<input className={inputClass} value={draft.notes.base.join(", ")} onChange={e => update("notes", { ...draft.notes, base: splitList(e.target.value) })} /></label>
                <label className={labelClass}>Longevity<input className={inputClass} value={draft.longevity} onChange={e => update("longevity", e.target.value)} /></label>
                <label className={labelClass}>Sillage<input className={inputClass} value={draft.sillage} onChange={e => update("sillage", e.target.value)} /></label>
                <label className={labelClass}>Batch information<input className={inputClass} value={draft.batchInformation} onChange={e => update("batchInformation", e.target.value)} /></label>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">Size, price and inventory</h3><button type="button" onClick={() => update("variants", [...draft.variants, { id: `${50 + draft.variants.length * 10}ml`, size: 50 + draft.variants.length * 10, unit: "ml", price: 1499, stock: 0, sku: `SNS-${Date.now()}` }])} className="text-sm text-[#956d37] underline">Add size variant</button></div>
                <div className="space-y-3">{draft.variants.map((variant, index) => <div key={`${variant.id}-${index}`} className="grid gap-3 rounded-lg border border-stone-200 p-3 sm:grid-cols-5">
                  <label className={labelClass}>Size (ml)<input type="number" min="1" className={inputClass} value={variant.size} onChange={e => update("variants", draft.variants.map((item, i) => i === index ? { ...item, size: Number(e.target.value), id: `${e.target.value}ml` } : item))} /></label>
                  <label className={labelClass}>Price (₹)<input type="number" min="0" className={inputClass} value={variant.price} onChange={e => update("variants", draft.variants.map((item, i) => i === index ? { ...item, price: Number(e.target.value) } : item))} /></label>
                  <label className={labelClass}>Compare at (₹)<input type="number" min="0" className={inputClass} value={variant.compareAtPrice ?? ""} onChange={e => update("variants", draft.variants.map((item, i) => i === index ? { ...item, compareAtPrice: e.target.value ? Number(e.target.value) : undefined } : item))} /></label>
                  <label className={labelClass}>Stock<input type="number" min="0" className={inputClass} value={variant.stock} onChange={e => update("variants", draft.variants.map((item, i) => i === index ? { ...item, stock: Number(e.target.value) } : item))} /></label>
                  <div className="flex items-end justify-between gap-2"><label className={`${labelClass} flex-1`}>SKU<input className={inputClass} value={variant.sku} onChange={e => update("variants", draft.variants.map((item, i) => i === index ? { ...item, sku: e.target.value } : item))} /></label><button type="button" disabled={draft.variants.length === 1} onClick={() => update("variants", draft.variants.filter((_, i) => i !== index))} className="mb-2 text-xs text-red-600 disabled:opacity-30">Remove</button></div>
                </div>)}</div>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">Product images</h3>
                <input type="file" accept="image/*" multiple onChange={e => void handleImageFiles(e.target.files)} className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#242321] file:px-4 file:py-2 file:text-white" />
                <p className="mt-1 text-xs text-stone-500">Images upload directly to Cloudinary using a short-lived server signature. Configure Cloudinary environment variables first.</p>
                {uploading && <p className="mt-2 text-sm text-stone-600">Uploading images…</p>}
                {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">{draft.images.map((image, index) => <div key={`${image.url}-${index}`} className="relative"><img src={image.url} alt={image.alt} className="aspect-square w-full rounded-lg object-cover" /><button type="button" onClick={() => update("images", draft.images.filter((_, i) => i !== index))} className="absolute right-2 top-2 rounded-full bg-white px-2 py-1 text-xs text-red-600 shadow">Remove</button></div>)}</div>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-3 rounded-lg bg-stone-50 p-4 text-sm">
                {([["isNew", "New arrival"], ["isBestseller", "Best seller"], ["isFeatured", "Featured"], ["isDiscoverySet", "Discovery set"], ["authenticityGuaranteed", "Authenticity guaranteed"], ["isActive", "Publish / active"]] as const).map(([key, text]) => <label key={key} className="flex items-center gap-2"><input type="checkbox" checked={draft[key]} onChange={e => update(key, e.target.checked)} />{text}</label>)}
              </div>

              {save.isError && <p className="text-sm text-red-600">{(save.error as Error).message}</p>}
              <div className="flex flex-wrap gap-3 border-t border-stone-100 pt-4">
                <button type="button" onClick={() => setPreview(true)} className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm">Preview</button>
                <button type="button" disabled={save.isPending || uploading} onClick={submit} className="rounded-lg bg-[#242321] px-5 py-2.5 text-sm text-white disabled:opacity-50">{save.isPending ? "Saving…" : editing ? "Update product" : "Save product"}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(""); setDraft(emptyDraft()); }} className="rounded-lg px-4 py-2.5 text-sm text-stone-600">Cancel</button>
              </div>
            </div>
          )}
        </section>
      )}

      <div className="mb-4"><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, brand or product ID" className="w-full max-w-md rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm" /></div>
      <div className="overflow-x-auto rounded-xl border border-black/5 bg-white">
        <table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-stone-50 text-xs uppercase text-stone-500"><tr><th className="p-4">Product</th><th>Brand</th><th>Starting price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{q.data?.data.products.map(product => <tr key={product._id} className="border-t border-stone-100"><td className="p-4"><p className="font-medium">{product.name}</p><p className="text-xs text-stone-400">{product.id}</p></td><td>{product.brand}</td><td>₹{Math.min(...(product.variants || []).map(variant => variant.price)).toLocaleString("en-IN")}</td><td>{(product.variants || []).reduce((total, variant) => total + variant.stock, 0)}</td><td><span className={product.isActive ? "text-green-700" : "text-stone-400"}>{product.isActive ? "Active" : "Inactive"}</span></td><td><button onClick={() => edit(product)} className="mr-3 text-[#9a7440] underline">Edit</button>{product.isActive && <button onClick={() => { if (confirm(`Deactivate ${product.name}?`)) deactivate.mutate(product.id); }} className="text-red-600 underline">Deactivate</button>}</td></tr>)}</tbody>
        </table>
        {q.isLoading && <p className="p-6 text-sm text-stone-500">Loading products…</p>}
        {q.isError && <p className="p-6 text-sm text-red-600">{(q.error as Error).message}</p>}
        {q.data?.data.products.length === 0 && <p className="p-6 text-sm text-stone-500">No products found.</p>}
      </div>
    </div>
  );
}
