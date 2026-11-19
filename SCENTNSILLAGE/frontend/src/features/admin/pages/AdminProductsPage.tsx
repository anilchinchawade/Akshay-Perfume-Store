// import { useState } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { adminService } from "../services/adminService";
// const starter = { id: "", name: "", slug: "", brand: "", category: "Eau de Parfum", description: "", shortDescription: "", gender: "unisex", concentration: "EDP", scentFamily: ["Woody"], notes: { top: ["Bergamot"], middle: ["Jasmine"], base: ["Musk"] }, season: ["All Season"], occasion: ["Daily Wear"], longevity: "6-8 hours", sillage: "Moderate", variants: [{ id: "50ml", size: 50, unit: "ml", price: 2999, stock: 10, sku: "SNS-NEW-50" }], images: [] };
// export function AdminProductsPage() {
//     const [search, setSearch] = useState(""); const [json, setJson] = useState(JSON.stringify(starter, null, 2)); const [editing, setEditing] = useState(""); const [showForm, setShowForm] = useState(false); const qc = useQueryClient();
//     const q = useQuery({ queryKey: ["admin", "products", search], queryFn: () => adminService.products(search) });
//     const save = useMutation({ mutationFn: () => adminService.saveProduct(JSON.parse(json), editing || undefined), onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "products"] }); qc.invalidateQueries({ queryKey: ["admin", "dashboard"] }); setShowForm(false); setEditing(""); } });
//     const deactivate = useMutation({ mutationFn: adminService.deactivateProduct, onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "products"] }) });
//     function edit(p: any) { const { _id, ...payload } = p; setEditing(p.id); setJson(JSON.stringify(payload, null, 2)); setShowForm(true); }
//     return <div><div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs uppercase tracking-[.2em] text-[#a17b45]">Catalogue</p><h1 className="mt-2 font-serif text-3xl">Products</h1></div><button onClick={() => { setEditing(""); setJson(JSON.stringify(starter, null, 2)); setShowForm(v => !v) }} className="rounded-lg bg-[#242321] px-4 py-2.5 text-sm text-white">{showForm ? "Close form" : "Add product"}</button></div>
//         {showForm && <section className="mb-6 rounded-xl border bg-white p-5"><h2 className="mb-2 font-semibold">{editing ? "Edit product JSON" : "New product JSON"}</h2><p className="mb-3 text-xs text-stone-500">Provide all required product fields, including at least one variant. The JSON structure follows the Product model.</p><textarea value={json} onChange={e => setJson(e.target.value)} rows={18} className="w-full rounded-lg border border-stone-300 p-3 font-mono text-xs" /><div className="mt-3 flex items-center gap-3"><button disabled={save.isPending} onClick={() => { try { JSON.parse(json); save.mutate() } catch { alert("Invalid JSON. Please correct it before saving.") } }} className="rounded-lg bg-[#242321] px-4 py-2 text-sm text-white disabled:opacity-50">{save.isPending ? "Saving…" : "Save product"}</button>{save.isError && <span className="text-sm text-red-600">{(save.error as Error).message}</span>}</div></section>}
//         <div className="mb-4"><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, brand or product ID" className="w-full max-w-md rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm" /></div>
//         <div className="overflow-x-auto rounded-xl border border-black/5 bg-white"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-stone-50 text-xs uppercase text-stone-500"><tr><th className="p-4">Product</th><th>Brand</th><th>Starting price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead><tbody>{q.data?.data.products.map(p => <tr key={p._id} className="border-t border-stone-100"><td className="p-4"><p className="font-medium">{p.name}</p><p className="text-xs text-stone-400">{p.id}</p></td><td>{p.brand}</td><td>₹{Math.min(...(p.variants || []).map(v => v.price))}</td><td>{(p.variants || []).reduce((n, v) => n + v.stock, 0)}</td><td><span className={p.isActive ? "text-green-700" : "text-stone-400"}>{p.isActive ? "Active" : "Inactive"}</span></td><td><button onClick={() => edit(p)} className="mr-3 text-[#9a7440] underline">Edit</button>{p.isActive && <button onClick={() => { if (confirm(`Deactivate ${p.name}?`)) deactivate.mutate(p.id) }} className="text-red-600 underline">Deactivate</button>}</td></tr>)}</tbody></table>{q.isLoading && <p className="p-6 text-sm text-stone-500">Loading products…</p>}{q.isError && <p className="p-6 text-sm text-red-600">{(q.error as Error).message}</p>}{q.data?.data.products.length === 0 && <p className="p-6 text-sm text-stone-500">No products found.</p>}</div>
//     </div>;
// }


import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService, type AdminProduct } from "../services/adminService";


// interface AdminProduct {
//   _id?: string;
//   id: string;
//   name: string;
//   brand: string;
//   isActive: boolean;
//   variants: {
//     price: number;
//     stock: number;
//   }[];
//   [key: string]: unknown;
// }

const starter = {
  id: "",
  name: "",
  slug: "",
  brand: "",
  category: "Eau de Parfum",
  description: "",
  shortDescription: "",
  gender: "unisex",
  concentration: "EDP",
  scentFamily: ["Woody"],
  notes: {
    top: ["Bergamot"],
    middle: ["Jasmine"],
    base: ["Musk"]
  },
  season: ["All Season"],
  occasion: ["Daily Wear"],
  longevity: "6-8 hours",
  sillage: "Moderate",
  variants: [
    {
      id: "50ml",
      size: 50,
      unit: "ml",
      price: 2999,
      stock: 10,
      sku: "SNS-NEW-50"
    }
  ],
  images: []
};

export function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [json, setJson] = useState(JSON.stringify(starter, null, 2));
  const [editing, setEditing] = useState("");
  const [showForm, setShowForm] = useState(false);

  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["admin", "products", search],
    queryFn: () => adminService.products(search)
  });

  const save = useMutation({
    mutationFn: () =>
      adminService.saveProduct(JSON.parse(json), editing || undefined),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      setShowForm(false);
      setEditing("");
    }
  });

  const deactivate = useMutation({
    mutationFn: adminService.deactivateProduct,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["admin", "products"] })
  });

  function edit(p: AdminProduct) {
  const payload = Object.fromEntries(
    Object.entries(p).filter(([key]) => key !== "_id")
  );

  setEditing(p.id);
  setJson(JSON.stringify(payload, null, 2));
  setShowForm(true);
}

    
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[.2em] text-[#a17b45]">
            Catalogue
          </p>
          <h1 className="mt-2 font-serif text-3xl">Products</h1>
        </div>

        <button
          onClick={() => {
            setEditing("");
            setJson(JSON.stringify(starter, null, 2));
            setShowForm(v => !v);
          }}
          className="rounded-lg bg-[#242321] px-4 py-2.5 text-sm text-white"
        >
          {showForm ? "Close form" : "Add product"}
        </button>
      </div>

      {showForm && (
        <section className="mb-6 rounded-xl border bg-white p-5">
          <h2 className="mb-2 font-semibold">
            {editing ? "Edit product JSON" : "New product JSON"}
          </h2>

          <p className="mb-3 text-xs text-stone-500">
            Provide all required product fields, including at least one
            variant. The JSON structure follows the Product model.
          </p>

          <textarea
            value={json}
            onChange={e => setJson(e.target.value)}
            rows={18}
            className="w-full rounded-lg border border-stone-300 p-3 font-mono text-xs"
          />

          <div className="mt-3 flex items-center gap-3">
            <button
              disabled={save.isPending}
              onClick={() => {
                try {
                  JSON.parse(json);
                  save.mutate();
                } catch {
                  alert("Invalid JSON. Please correct it before saving.");
                }
              }}
              className="rounded-lg bg-[#242321] px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {save.isPending ? "Saving…" : "Save product"}
            </button>

            {save.isError && (
              <span className="text-sm text-red-600">
                {(save.error as Error).message}
              </span>
            )}
          </div>
        </section>
      )}

      <div className="mb-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name, brand or product ID"
          className="w-full max-w-md rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-black/5 bg-white">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th className="p-4">Product</th>
              <th>Brand</th>
              <th>Starting price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {q.data?.data.products.map((p: AdminProduct) => (
              <tr key={p._id ?? p.id} className="border-t border-stone-100">
                <td className="p-4">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-stone-400">{p.id}</p>
                </td>

                <td>{p.brand}</td>

                <td>
                  ₹{Math.min(...(p.variants || []).map(v => v.price))}
                </td>

                <td>
                  {(p.variants || []).reduce((n, v) => n + v.stock, 0)}
                </td>

                <td>
                  <span
                    className={
                      p.isActive ? "text-green-700" : "text-stone-400"
                    }
                  >
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td>
                  <button
                    onClick={() => edit(p)}
                    className="mr-3 text-[#9a7440] underline"
                  >
                    Edit
                  </button>

                  {p.isActive && (
                    <button
                      onClick={() => {
                        if (confirm(`Deactivate ${p.name}?`)) {
                          deactivate.mutate(p.id);
                        }
                      }}
                      className="text-red-600 underline"
                    >
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {q.isLoading && (
          <p className="p-6 text-sm text-stone-500">
            Loading products…
          </p>
        )}

        {q.isError && (
          <p className="p-6 text-sm text-red-600">
            {(q.error as Error).message}
          </p>
        )}

        {q.data?.data.products.length === 0 && (
          <p className="p-6 text-sm text-stone-500">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}
