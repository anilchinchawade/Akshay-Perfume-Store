import { Container } from "@/components/common/Container";

export function ShopPage() {
  return (
    <Container>
      <section className="py-20">
        <p className="eyebrow">The collection</p>
        <h1 className="section-heading mt-3">Shop fragrances</h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
          Our fragrance catalogue, filters, sorting and product cards will be implemented in Phase 3.
        </p>
        <div className="mt-10 border-y border-ink/10 py-12 text-center">
          <p className="font-display text-2xl">A collection worth exploring.</p>
          <p className="mt-2 text-sm text-muted">The product discovery experience is coming in the next phase.</p>
        </div>
      </section>
    </Container>
  );
}
