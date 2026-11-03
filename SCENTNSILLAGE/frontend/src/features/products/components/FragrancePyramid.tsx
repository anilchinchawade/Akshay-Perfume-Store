import type { FragranceNotes } from "@/features/products/types/product.types";

const layers = [
  { key: "top", title: "Top notes", description: "The first impression" },
  { key: "middle", title: "Middle notes", description: "The heart of the fragrance" },
  { key: "base", title: "Base notes", description: "The lasting foundation" }
] as const;

export function FragrancePyramid({ notes }: { notes: FragranceNotes }) {
  return (
    <section aria-labelledby="fragrance-notes-title"><p className="eyebrow">The composition</p><h2 id="fragrance-notes-title" className="mt-2 font-display text-3xl">The fragrance notes</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">{layers.map((layer, index) => <div key={layer.key} className="border border-ink/10 bg-white/35 p-5"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-beige font-display text-lg">{index + 1}</div><h3 className="font-display text-xl">{layer.title}</h3><p className="mt-1 text-xs text-muted">{layer.description}</p><div className="mt-4 flex flex-wrap gap-2">{notes[layer.key].map(note => <span key={note} className="bg-[#eee8df] px-2.5 py-1.5 text-xs">{note}</span>)}</div></div>)}</div>
    </section>
  );
}
