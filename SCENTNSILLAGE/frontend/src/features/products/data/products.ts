import type { Product } from "@/features/products/types/product.types";

const image = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;
const batch = "Batch details are printed on the bottle packaging.";

export const products: Product[] = [
  {
    id: "p-001", name: "Amber Oud", slug: "amber-oud", brand: "Maison Aurelle", category: "Oriental",
    description: "A warm, enveloping composition where luminous spice meets polished woods. Amber Oud opens with bright bergamot and saffron before settling into rose and a softly smoky oud base.",
    shortDescription: "A warm embrace of spice, rose and precious woods.", gender: "unisex", concentration: "EDP", scentFamily: ["Woody", "Oriental"],
    notes: { top: ["Bergamot", "Saffron"], middle: ["Rose", "Jasmine"], base: ["Oud", "Amber", "Musk"] },
    season: ["Autumn", "Winter"], occasion: ["Evening", "Special occasion"], longevity: "Long-lasting", sillage: "Strong",
    variants: [{ id: "v-001-30", size: 30, unit: "ml", price: 999, stock: 18, sku: "AMO-30" }, { id: "v-001-50", size: 50, unit: "ml", price: 1699, stock: 14, sku: "AMO-50" }, { id: "v-001-100", size: 100, unit: "ml", price: 2499, stock: 9, sku: "AMO-100" }],
    images: [{ url: image("photo-1594035910387-fea47794261f"), alt: "Amber perfume bottle" }, { url: image("photo-1592945403244-b3fbafd7f539"), alt: "Amber fragrance still life" }],
    rating: 4.8, reviewCount: 126, popularity: 98, isNew: false, isBestseller: true, isFeatured: true, isDiscoverySet: false, authenticityGuaranteed: true, batchInformation: batch
  },
  {
    id: "p-002", name: "Velvet Rose", slug: "velvet-rose", brand: "Atelier No. 9", category: "Floral",
    description: "A modern rose fragrance with a delicate petal-like opening, a velvety floral heart and a creamy musk finish.", shortDescription: "Soft rose petals wrapped in creamy musk.",
    gender: "women", concentration: "EDP", scentFamily: ["Floral", "Musky"], notes: { top: ["Pink Pepper", "Pear"], middle: ["Damask Rose", "Peony"], base: ["White Musk", "Cashmere Wood"] },
    season: ["Spring", "Autumn"], occasion: ["Everyday", "Date night"], longevity: "Moderate", sillage: "Moderate",
    variants: [{ id: "v-002-30", size: 30, unit: "ml", price: 1199, stock: 20, sku: "VER-30" }, { id: "v-002-50", size: 50, unit: "ml", price: 1899, stock: 11, sku: "VER-50" }, { id: "v-002-100", size: 100, unit: "ml", price: 2899, stock: 0, sku: "VER-100" }],
    images: [{ url: image("photo-1608571423902-eed4a5ad8108"), alt: "Rose-inspired fragrance" }], rating: 4.6, reviewCount: 84, popularity: 87, isNew: true, isBestseller: false, isFeatured: true, isDiscoverySet: false, authenticityGuaranteed: true, batchInformation: batch
  },
  {
    id: "p-003", name: "Citrus Atelier", slug: "citrus-atelier", brand: "Maison Aurelle", category: "Citrus",
    description: "An energetic citrus blend made for bright mornings. Sparkling lemon and mandarin lead into aromatic neroli with a clean cedarwood finish.", shortDescription: "Bright citrus and aromatic woods for fresh starts.",
    gender: "unisex", concentration: "EDT", scentFamily: ["Citrus", "Fresh"], notes: { top: ["Lemon", "Mandarin"], middle: ["Neroli", "Basil"], base: ["Cedarwood", "White Musk"] },
    season: ["Summer", "Spring"], occasion: ["Everyday", "Office"], longevity: "Moderate", sillage: "Soft",
    variants: [{ id: "v-003-30", size: 30, unit: "ml", price: 899, stock: 25, sku: "CIA-30" }, { id: "v-003-50", size: 50, unit: "ml", price: 1499, stock: 16, sku: "CIA-50" }, { id: "v-003-100", size: 100, unit: "ml", price: 2199, stock: 12, sku: "CIA-100" }],
    images: [{ url: image("photo-1615634260167-c8cdede054de"), alt: "Fresh citrus perfume" }], rating: 4.4, reviewCount: 61, popularity: 75, isNew: true, isBestseller: false, isFeatured: false, isDiscoverySet: false, authenticityGuaranteed: true, batchInformation: batch
  },
  {
    id: "p-004", name: "Sandalwood Dusk", slug: "sandalwood-dusk", brand: "Orris & Oak", category: "Woody",
    description: "A meditative blend of creamy sandalwood, cardamom and soft incense. Quietly confident, comforting and beautifully textured.", shortDescription: "Creamy sandalwood with a whisper of incense.",
    gender: "unisex", concentration: "Parfum", scentFamily: ["Woody", "Oriental"], notes: { top: ["Cardamom", "Black Pepper"], middle: ["Iris", "Incense"], base: ["Sandalwood", "Tonka Bean", "Amber"] },
    season: ["Autumn", "Winter"], occasion: ["Evening", "Special occasion"], longevity: "Very long-lasting", sillage: "Strong",
    variants: [{ id: "v-004-30", size: 30, unit: "ml", price: 1499, stock: 12, sku: "SAD-30" }, { id: "v-004-50", size: 50, unit: "ml", price: 2399, stock: 8, sku: "SAD-50" }],
    images: [{ url: image("photo-1595425970377-c9703cf48b6d"), alt: "Woody fragrance bottle" }], rating: 4.9, reviewCount: 43, popularity: 91, isNew: false, isBestseller: true, isFeatured: true, isDiscoverySet: false, authenticityGuaranteed: true, batchInformation: batch
  },
  {
    id: "p-005", name: "Azure Coast", slug: "azure-coast", brand: "Blue Hour", category: "Fresh",
    description: "A breezy aquatic fragrance with crisp marine accords, aromatic herbs and driftwood. Designed for warm days and easy layering.", shortDescription: "A clean ocean breeze with aromatic freshness.",
    gender: "men", concentration: "EDT", scentFamily: ["Fresh", "Aquatic"], notes: { top: ["Sea Salt", "Grapefruit"], middle: ["Lavender", "Clary Sage"], base: ["Driftwood", "Ambergris Accord"] },
    season: ["Summer", "Spring"], occasion: ["Everyday", "Office"], longevity: "Moderate", sillage: "Moderate",
    variants: [{ id: "v-005-30", size: 30, unit: "ml", price: 999, stock: 17, sku: "AZC-30" }, { id: "v-005-50", size: 50, unit: "ml", price: 1599, stock: 13, sku: "AZC-50" }, { id: "v-005-100", size: 100, unit: "ml", price: 2299, stock: 7, sku: "AZC-100" }],
    images: [{ url: image("photo-1590736969955-71cc94901144"), alt: "Fresh blue fragrance bottle" }], rating: 4.3, reviewCount: 39, popularity: 69, isNew: false, isBestseller: false, isFeatured: false, isDiscoverySet: false, authenticityGuaranteed: true, batchInformation: batch
  },
  {
    id: "p-006", name: "Midnight Vetiver", slug: "midnight-vetiver", brand: "Orris & Oak", category: "Woody",
    description: "Earthy vetiver is lifted by bergamot and black pepper, then grounded by patchouli and smooth leather. A polished evening signature.", shortDescription: "Earthy vetiver, pepper and refined leather.",
    gender: "men", concentration: "EDP", scentFamily: ["Woody", "Aromatic"], notes: { top: ["Bergamot", "Black Pepper"], middle: ["Vetiver", "Geranium"], base: ["Patchouli", "Leather", "Cedar"] },
    season: ["Autumn", "Winter"], occasion: ["Office", "Evening"], longevity: "Long-lasting", sillage: "Strong",
    variants: [{ id: "v-006-30", size: 30, unit: "ml", price: 1099, stock: 14, sku: "MIV-30" }, { id: "v-006-50", size: 50, unit: "ml", price: 1799, stock: 10, sku: "MIV-50" }],
    images: [{ url: image("photo-1592945403244-b3fbafd7f539"), alt: "Dark woody fragrance" }], rating: 4.7, reviewCount: 72, popularity: 89, isNew: false, isBestseller: true, isFeatured: false, isDiscoverySet: false, authenticityGuaranteed: true, batchInformation: batch
  },
  {
    id: "p-007", name: "Jasmine Veil", slug: "jasmine-veil", brand: "Atelier No. 9", category: "Floral",
    description: "White jasmine petals meet orange blossom and a luminous, clean musk. Delicate yet expressive, with a soft trail.", shortDescription: "White florals and luminous skin-like musk.",
    gender: "women", concentration: "EDP", scentFamily: ["Floral", "Fresh"], notes: { top: ["Mandarin", "Orange Blossom"], middle: ["Jasmine Sambac", "Tuberose"], base: ["White Musk", "Blonde Woods"] },
    season: ["Spring", "Summer"], occasion: ["Everyday", "Date night"], longevity: "Moderate", sillage: "Moderate",
    variants: [{ id: "v-007-30", size: 30, unit: "ml", price: 1099, stock: 19, sku: "JAV-30" }, { id: "v-007-50", size: 50, unit: "ml", price: 1799, stock: 15, sku: "JAV-50" }],
    images: [{ url: image("photo-1596462502278-27bfdc403348"), alt: "Floral fragrance" }], rating: 4.5, reviewCount: 55, popularity: 77, isNew: true, isBestseller: false, isFeatured: true, isDiscoverySet: false, authenticityGuaranteed: true, batchInformation: batch
  },
  {
    id: "p-008", name: "Spiced Tonka", slug: "spiced-tonka", brand: "Maison Aurelle", category: "Oriental",
    description: "A warm scent built around tonka bean, cinnamon and vanilla, balanced with dry woods for a smooth finish.", shortDescription: "Comforting tonka, vanilla and gentle spice.",
    gender: "unisex", concentration: "Parfum", scentFamily: ["Oriental", "Gourmand"], notes: { top: ["Cinnamon", "Bitter Orange"], middle: ["Tonka Bean", "Heliotrope"], base: ["Vanilla", "Benzoin", "Cedarwood"] },
    season: ["Autumn", "Winter"], occasion: ["Evening", "Special occasion"], longevity: "Very long-lasting", sillage: "Very strong",
    variants: [{ id: "v-008-30", size: 30, unit: "ml", price: 1399, stock: 10, sku: "SPT-30" }, { id: "v-008-50", size: 50, unit: "ml", price: 2299, stock: 8, sku: "SPT-50" }, { id: "v-008-100", size: 100, unit: "ml", price: 3399, stock: 5, sku: "SPT-100" }],
    images: [{ url: image("photo-1616949755610-8c9bbc08f138"), alt: "Warm amber perfume" }], rating: 4.8, reviewCount: 91, popularity: 95, isNew: false, isBestseller: true, isFeatured: true, isDiscoverySet: false, authenticityGuaranteed: true, batchInformation: batch
  },
  {
    id: "p-009", name: "The Discovery Edit", slug: "the-discovery-edit", brand: "SCENTNSILLAGE", category: "Discovery Set",
    description: "A curated wardrobe of five sample fragrances spanning fresh, floral, woody and warm scent families. An easy way to explore before choosing a full bottle.", shortDescription: "Five fragrance samples. One new favourite waiting.",
    gender: "unisex", concentration: "EDP", scentFamily: ["Fresh", "Floral", "Woody", "Oriental"], notes: { top: ["Citrus", "Pink Pepper"], middle: ["Rose", "Jasmine"], base: ["Musk", "Amber", "Woods"] },
    season: ["Spring", "Summer", "Autumn", "Winter"], occasion: ["Everyday", "Travel"], longevity: "Moderate", sillage: "Moderate",
    variants: [{ id: "v-009-set", size: 5, unit: "ml", price: 799, stock: 30, sku: "TDE-SET" }],
    images: [{ url: image("photo-1590736969955-71cc94901144"), alt: "Perfume discovery set" }], rating: 4.7, reviewCount: 34, popularity: 83, isNew: true, isBestseller: false, isFeatured: true, isDiscoverySet: true, authenticityGuaranteed: true, batchInformation: "Sample set batch information is printed on the packaging."
  },
  {
    id: "p-010", name: "Green Fig", slug: "green-fig", brand: "Blue Hour", category: "Fresh",
    description: "Green fig leaf, crisp pear and soft woods create a fresh, gently creamy fragrance with a relaxed Mediterranean feel.", shortDescription: "Green fig and pear with soft, sunlit woods.",
    gender: "unisex", concentration: "EDT", scentFamily: ["Fresh", "Green"], notes: { top: ["Pear", "Fig Leaf"], middle: ["Coconut Water", "Violet Leaf"], base: ["Sandalwood", "Musk"] },
    season: ["Summer", "Spring"], occasion: ["Everyday", "Travel"], longevity: "Light", sillage: "Soft",
    variants: [{ id: "v-010-30", size: 30, unit: "ml", price: 899, stock: 22, sku: "GRF-30" }, { id: "v-010-50", size: 50, unit: "ml", price: 1499, stock: 18, sku: "GRF-50" }],
    images: [{ url: image("photo-1608571423902-eed4a5ad8108"), alt: "Green fresh fragrance" }], rating: 4.2, reviewCount: 28, popularity: 62, isNew: true, isBestseller: false, isFeatured: false, isDiscoverySet: false, authenticityGuaranteed: true, batchInformation: batch
  },
  {
    id: "p-011", name: "Iris & Linen", slug: "iris-and-linen", brand: "Atelier No. 9", category: "Musky",
    description: "Powdery iris and clean linen accords create a quietly elegant scent, softened by white musk and pale woods.", shortDescription: "Powdery iris and freshly laundered linen.",
    gender: "women", concentration: "EDP", scentFamily: ["Floral", "Musky"], notes: { top: ["Aldehydes", "Pear"], middle: ["Iris", "Violet"], base: ["White Musk", "Blonde Woods"] },
    season: ["Spring", "Autumn"], occasion: ["Office", "Everyday"], longevity: "Moderate", sillage: "Soft",
    variants: [{ id: "v-011-30", size: 30, unit: "ml", price: 1199, stock: 16, sku: "IRL-30" }, { id: "v-011-50", size: 50, unit: "ml", price: 1899, stock: 9, sku: "IRL-50" }],
    images: [{ url: image("photo-1615634260167-c8cdede054de"), alt: "Minimal floral perfume" }], rating: 4.6, reviewCount: 47, popularity: 73, isNew: false, isBestseller: false, isFeatured: false, isDiscoverySet: false, authenticityGuaranteed: true, batchInformation: batch
  },
  {
    id: "p-012", name: "Oud Nocturne", slug: "oud-nocturne", brand: "Orris & Oak", category: "Oriental",
    description: "A deep and atmospheric oud composition with smoky resins, saffron and a smooth leather accord. Made for those who enjoy a memorable, expressive trail.", shortDescription: "Smoky oud, resin and saffron after dark.",
    gender: "men", concentration: "Parfum", scentFamily: ["Oriental", "Woody"], notes: { top: ["Saffron", "Black Pepper"], middle: ["Oud", "Labdanum"], base: ["Leather", "Patchouli", "Amber"] },
    season: ["Autumn", "Winter"], occasion: ["Evening", "Special occasion"], longevity: "Very long-lasting", sillage: "Very strong",
    variants: [{ id: "v-012-30", size: 30, unit: "ml", price: 1599, stock: 7, sku: "OUN-30" }, { id: "v-012-50", size: 50, unit: "ml", price: 2599, stock: 4, sku: "OUN-50" }],
    images: [{ url: image("photo-1592945403244-b3fbafd7f539"), alt: "Dark oud perfume bottle" }], rating: 4.9, reviewCount: 67, popularity: 93, isNew: false, isBestseller: true, isFeatured: false, isDiscoverySet: false, authenticityGuaranteed: true, batchInformation: batch
  }
];
