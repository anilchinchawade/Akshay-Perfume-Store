import {Product} from "../models/Product.js";
const base=[
 ["Amber Oud","Maison Aurelle","Oriental","unisex","EDP",["Woody","Oriental"],["Bergamot","Saffron"],["Rose","Jasmine"],["Oud","Amber","Musk"],999],
 ["Velvet Rose","Atelier No. 9","Floral","women","EDP",["Floral","Musky"],["Pink Pepper","Pear"],["Damask Rose","Peony"],["White Musk","Cashmere"],1199],
 ["Citrus Atelier","Maison Aurelle","Citrus","unisex","EDT",["Citrus","Fresh"],["Lemon","Mandarin"],["Neroli","Basil"],["Cedarwood","Musk"],899],
 ["Sandalwood Dusk","Orris & Oak","Woody","unisex","Parfum",["Woody","Oriental"],["Cardamom","Pepper"],["Iris","Incense"],["Sandalwood","Tonka"],1499],
 ["Azure Coast","Blue Hour","Fresh","men","EDT",["Fresh","Aquatic"],["Sea Salt","Grapefruit"],["Lavender","Sage"],["Driftwood","Amber"],999],
 ["Midnight Vetiver","Orris & Oak","Woody","men","EDP",["Woody","Aromatic"],["Bergamot","Black Pepper"],["Vetiver","Geranium"],["Patchouli","Leather"],1399],
 ["Jasmine Veil","Atelier No. 9","Floral","women","EDP",["Floral","White Floral"],["Mandarin","Green Notes"],["Jasmine","Tuberose"],["Sandalwood","Musk"],1299],
 ["Spiced Tonka","Maison Aurelle","Oriental","unisex","EDP",["Oriental","Gourmand"],["Cinnamon","Orange"],["Lavender","Almond"],["Tonka","Vanilla"],1599],
 ["The Discovery Edit","SCENTNSILLAGE","Discovery","unisex","EDP",["Fresh","Floral","Woody"],["Citrus","Pear"],["Rose","Jasmine"],["Musk","Cedar"],799],
 ["Green Fig","Botanical House","Green","unisex","EDT",["Green","Fresh"],["Fig Leaf","Bergamot"],["Tea","Coconut"],["Vetiver","Musk"],1099],
 ["Iris & Linen","Atelier No. 9","Clean","women","EDP",["Powdery","Floral"],["Aldehydes","Pear"],["Iris","Violet"],["White Musk","Cashmere"],1399],
 ["Oud Nocturne","Orris & Oak","Oud","unisex","Parfum",["Oud","Woody"],["Saffron","Incense"],["Rose","Oud"],["Agarwood","Amber"],2199],
 ["Rosewood Bloom","Botanical House","Floral","women","EDP",["Floral","Woody"],["Raspberry","Pink Pepper"],["Rose","Magnolia"],["Rosewood","Musk"],1249],
 ["Coastal Neroli","Blue Hour","Fresh","unisex","EDT",["Citrus","Aquatic"],["Neroli","Lime"],["Orange Blossom","Sea Notes"],["Cedar","Musk"],1049],
 ["Leather & Smoke","Orris & Oak","Leather","men","Parfum",["Leather","Smoky"],["Juniper","Pepper"],["Suede","Tobacco"],["Leather","Birch"],1899],
 ["Vanilla Ember","Maison Aurelle","Gourmand","women","EDP",["Gourmand","Oriental"],["Mandarin","Pink Pepper"],["Vanilla Orchid","Cocoa"],["Vanilla","Benzoin"],1499],
 ["Rain on Earth","Botanical House","Green","unisex","EDT",["Green","Woody"],["Mint","Bergamot"],["Vetiver","Green Tea"],["Moss","Cedar"],1149],
 ["Saffron Silk","Atelier No. 9","Oriental","unisex","EDP",["Oriental","Spicy"],["Saffron","Cardamom"],["Rose","Jasmine"],["Amber","Sandalwood"],1799],
 ["White Musk Aura","Blue Hour","Clean","unisex","EDT",["Musky","Fresh"],["Lemon","Aldehydes"],["Cotton Flower","Iris"],["White Musk","Cashmere"],949],
 ["Cedar Reverie","Orris & Oak","Woody","men","EDP",["Woody","Aromatic"],["Grapefruit","Juniper"],["Cypress","Clary Sage"],["Cedarwood","Vetiver"],1349]
] as const;
const slugify=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
export async function seedProducts(){
 for(let i=0;i<base.length;i++){
  const [name,brand,category,gender,concentration,families,top,middle,baseNotes,price]=base[i];
  const id=`p-${String(i+1).padStart(3,"0")}`,slug=slugify(name);
  const product={
   id,name,slug,brand,category,description:`${name} is a thoughtfully composed fragrance from ${brand}, balancing expressive opening notes with a distinctive heart and a lasting signature.`,shortDescription:`A considered ${families[0].toLowerCase()} fragrance with a memorable finish.`,
   gender,concentration,scentFamily:[...families],notes:{top:[...top],middle:[...middle],base:[...baseNotes]},season:["Spring","Autumn"],occasion:["Everyday","Evening"],longevity:"Long-lasting",sillage:"Moderate",
   variants:[{id:`${id}-30`,size:30,unit:"ml",price,stock:20,sku:`SNS-${i+1}-30`},{id:`${id}-50`,size:50,unit:"ml",price:Math.round(price*1.55),stock:12,sku:`SNS-${i+1}-50`},{id:`${id}-100`,size:100,unit:"ml",price:Math.round(price*2.35),stock:6,sku:`SNS-${i+1}-100`}],
   images:[{url:"https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85",alt:`${name} perfume bottle`}],
   rating:0,reviewCount:0,popularity:90-i*3,isNew:i>13,isBestseller:i<4,isFeatured:i<8,isDiscoverySet:name==="The Discovery Edit",authenticityGuaranteed:true,batchInformation:"Batch and authenticity details are printed on the bottle packaging.",isActive:true
  };
  await Product.updateOne({slug},{$setOnInsert:product},{upsert:true});
 }
 console.info(`Seed check complete: ${base.length} catalogue products.`);
}
