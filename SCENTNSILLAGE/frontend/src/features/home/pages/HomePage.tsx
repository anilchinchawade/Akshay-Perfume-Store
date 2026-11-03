import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/common/Button";

export function HomePage() {
  return (
    <>
      <section className="relative isolate min-h-[620px] overflow-hidden bg-[#d8c9b6]">
        <img
          src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=2200&q=85"
          alt="Elegant perfume bottle in a warm, softly lit setting"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#211d19]/75 via-[#211d19]/35 to-transparent" />
        <Container>
          <div className="flex min-h-[620px] max-w-2xl flex-col justify-center py-20 text-white">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#e4c99f] sm:text-xs">
              A world of beautiful fragrance
            </p>
            <h1 className="font-display text-5xl leading-[1.08] sm:text-6xl lg:text-7xl">
              A scent that<br />stays with you.
            </h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/80 sm:text-base">
              Explore a considered collection of fragrances, chosen to make every moment unforgettable.
            </p>
            <div className="mt-9">
              <Link to="/shop">
                <Button variant="secondary" className="border-white text-white hover:border-gold hover:bg-gold">
                  Discover the collection <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">The art of choosing</p>
            <h2 className="section-heading mt-4">More than a fragrance.<br />A signature.</h2>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-muted">
              From luminous fresh notes to deep and captivating woods, discover fragrances that tell your story.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <CollectionTile
              title="Fresh & luminous"
              subtitle="Bright notes for everyday moments"
              image="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80"
            />
            <CollectionTile
              title="Warm & sensual"
              subtitle="A richer expression of elegance"
              image="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80"
            />
            <CollectionTile
              title="Discover & delight"
              subtitle="Find a new favourite in every vial"
              image="https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=900&q=80"
            />
          </div>
        </Container>
      </section>

      <section className="bg-[#eae2d7] py-20">
        <Container>
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="eyebrow">A little guidance goes a long way</p>
              <h2 className="section-heading mt-4">Your next favourite<br />is waiting to be found.</h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-muted">
                Tell us what you love. Our fragrance finder will help you explore scents that suit your taste and your day.
              </p>
              <Link to="/find-your-scent" className="mt-7 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em]">
                Find your scent <ArrowRight size={16} />
              </Link>
            </div>
            <img
              src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=1100&q=85"
              alt="Perfume bottle and botanical fragrance ingredients"
              className="aspect-[5/4] w-full object-cover"
              loading="lazy"
            />
          </div>
        </Container>
      </section>
    </>
  );
}

function CollectionTile({ title, subtitle, image }: { title: string; subtitle: string; image: string }) {
  return (
    <Link to="/shop" className="group block">
      <div className="overflow-hidden bg-[#e8dfd3]">
        <img src={image} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <h3 className="mt-5 font-display text-2xl">{title}</h3>
      <p className="mt-1 text-sm text-muted">{subtitle}</p>
    </Link>
  );
}
