import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/features/products/components/ProductCard";
import { productService } from "@/features/products/services/productService";
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
          <div className="mt-12 space-y-16">
            <HomeCollection title="New arrivals" subtitle="The latest additions to your fragrance wardrobe." collection="new" />
            <HomeCollection title="Bestsellers" subtitle="Customer favourites worth discovering." collection="bestsellers" />
            <HomeCollection title="Featured perfumes" subtitle="A considered edit from SCENTNSILLAGE." collection="featured" />
            <HomeCollection title="Discovery sets" subtitle="Explore more than one scent before choosing your signature." collection="discovery-sets" />
            <CustomCollectionSections />
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


type HomeCollectionKey = "new" | "bestsellers" | "featured" | "discovery-sets";

function HomeCollection({ title, subtitle, collection }: { title: string; subtitle: string; collection: HomeCollectionKey }) {
  const { data: items = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["home-collection", collection],
    queryFn: () => productService.getCollection(collection, 4),
    staleTime: 60_000,
  });

  return (
    <section aria-labelledby={`home-${collection}`}>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Curated for you</p>
          <h3 id={`home-${collection}`} className="mt-2 font-display text-3xl">{title}</h3>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
        </div>
        <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em]">Explore all <ArrowRight size={15} /></Link>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6" aria-label={`Loading ${title}`}>
          {Array.from({ length: 4 }, (_, index) => <div key={index} className="animate-pulse"><div className="aspect-[4/5] bg-beige"/><div className="mt-4 h-4 w-2/3 bg-beige"/><div className="mt-2 h-3 w-1/3 bg-beige"/></div>)}
        </div>
      ) : isError ? (
        <div role="alert" className="border border-red-300 p-6 text-center"><p className="text-sm">We couldn't load this collection right now.</p><button type="button" onClick={() => void refetch()} className="mt-3 text-xs font-semibold uppercase tracking-widest underline">Try again</button></div>
      ) : items.length ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6">{items.map(product => <ProductCard key={product.id} product={product} />)}</div>
      ) : (
        <div className="border border-ink/10 px-6 py-10 text-center"><p className="font-display text-xl">More fragrances coming soon</p><p className="mt-2 text-sm text-muted">There are no products in this collection yet.</p></div>
      )}
    </section>
  );
}


function CustomCollectionSections() {
  const { data: collections = [], isLoading, isError } = useQuery({
    queryKey: ["home-custom-collections"],
    queryFn: () => productService.getCustomCollections(),
    staleTime: 60_000,
  });
  if (isLoading) return <div className="h-24 animate-pulse bg-beige" aria-label="Loading curated collections" />;
  if (isError || collections.length === 0) return null;
  return <div className="space-y-16">{collections.map(collection => <section key={collection.slug} aria-labelledby={`custom-${collection.slug}`}>
    {collection.bannerImage && <img src={collection.bannerImage} alt="" loading="lazy" className="mb-6 max-h-64 w-full object-cover" />}
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">The SCENTNSILLAGE edit</p><h3 id={`custom-${collection.slug}`} className="mt-2 font-display text-3xl">{collection.title}</h3>{collection.description && <p className="mt-2 max-w-2xl text-sm text-muted">{collection.description}</p>}</div><Link to="/shop" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em]">Explore all <ArrowRight size={15} /></Link></div>
    {collection.products.length > 0 ? <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6">{collection.products.slice(0, 4).map(product => <ProductCard key={product.id} product={product} />)}</div> : <div className="border border-ink/10 px-6 py-8 text-center text-sm text-muted">This collection is being curated. Check back soon.</div>}
  </section>)}</div>;
}
