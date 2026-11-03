import { Container } from "@/components/common/Container";

export function AboutPage() {
  return (
    <Container>
      <section className="mx-auto max-w-3xl py-24 text-center">
        <p className="eyebrow">Our story</p>
        <h1 className="section-heading mt-4">Fragrance is personal.</h1>
        <p className="mt-6 text-base leading-8 text-muted">
          SCENTNSILLAGE is a destination for discovering fragrances that become part of your story.
          We believe the right scent can capture a feeling, bring back a memory and make an ordinary moment extraordinary.
        </p>
      </section>
    </Container>
  );
}
