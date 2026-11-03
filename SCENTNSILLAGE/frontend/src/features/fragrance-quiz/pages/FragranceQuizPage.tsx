import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import { ProductCard } from "@/features/products/components/ProductCard";
import { products } from "@/features/products/data/products";
import type { Product } from "@/features/products/types/product.types";

const questions = [
  { key: "family", title: "Which fragrance family speaks to you?", options: ["Floral", "Woody", "Fresh", "Citrus", "Oriental", "Musky"] },
  { key: "occasion", title: "When will you wear your fragrance?", options: ["Everyday", "Office", "Evening", "Special occasion", "Date night", "Travel"] },
  { key: "season", title: "Which season are you shopping for?", options: ["Spring", "Summer", "Autumn", "Winter"] },
  { key: "budget", title: "What is your preferred budget?", options: ["Under ₹1,000", "₹1,000 – ₹2,000", "₹2,000 – ₹3,000", "Above ₹3,000"] }
] as const;

type Answers = { family: string; occasion: string; season: string; budget: string };

function recommend(answers: Answers): Product[] {
  const ranges: Record<string, [number, number]> = { "Under ₹1,000": [0, 1000], "₹1,000 – ₹2,000": [1000, 2000], "₹2,000 – ₹3,000": [2000, 3000], "Above ₹3,000": [3000, Number.POSITIVE_INFINITY] };
  const [minimum, maximum] = ranges[answers.budget] ?? [0, Number.POSITIVE_INFINITY];
  return products.map(product => {
    const startingPrice = Math.min(...product.variants.map(variant => variant.price));
    let score = 0;
    if (product.scentFamily.some(family => family.toLowerCase() === answers.family.toLowerCase())) score += 4;
    if (product.occasion.some(occasion => occasion.toLowerCase() === answers.occasion.toLowerCase())) score += 3;
    if (product.season.some(season => season.toLowerCase() === answers.season.toLowerCase())) score += 2;
    if (startingPrice >= minimum && startingPrice <= maximum) score += 2;
    return { product, score };
  }).sort((a, b) => b.score - a.score || b.product.rating - a.product.rating).slice(0, 3).map(entry => entry.product);
}

export function FragranceQuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ family: "", occasion: "", season: "", budget: "" });
  const [complete, setComplete] = useState(false);
  const question = questions[step];
  const recommendations = useMemo(() => complete ? recommend(answers) : [], [complete, answers]);
  const choose = (value: string) => setAnswers(current => ({ ...current, [question.key]: value }));
  const next = () => step === questions.length - 1 ? setComplete(true) : setStep(current => current + 1);

  return <Container><section className="mx-auto max-w-4xl py-16 sm:py-24">
    <div className="text-center"><Sparkles className="mx-auto text-gold" size={25}/><p className="eyebrow mt-4">A personal fragrance journey</p><h1 className="section-heading mt-3">Find your scent</h1><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted">A few thoughtful questions can help you discover fragrances that feel like you.</p></div>
    {!complete ? <div className="mx-auto mt-12 max-w-2xl border border-ink/10 bg-white/30 p-6 sm:p-10"><div className="mb-8 flex items-center justify-between text-xs text-muted"><span>QUESTION {step + 1} OF {questions.length}</span><span>{Math.round(((step + 1) / questions.length) * 100)}%</span></div><div className="h-1 bg-beige"><div className="h-1 bg-gold transition-all" style={{ width: `${((step + 1) / questions.length) * 100}%` }}/></div><h2 className="mt-8 font-display text-2xl sm:text-3xl">{question.title}</h2><div className="mt-7 grid grid-cols-2 gap-3">{question.options.map(option => { const selected = answers[question.key] === option; return <button key={option} onClick={() => choose(option)} aria-pressed={selected} className={`min-h-14 border px-4 py-3 text-left text-sm transition-colors ${selected ? "border-gold bg-[#eee8df]" : "border-ink/15 hover:border-gold"}`}>{option}</button>; })}</div><div className="mt-9 flex items-center justify-between"><button disabled={step === 0} onClick={() => setStep(current => current - 1)} className="inline-flex items-center gap-2 text-xs uppercase tracking-wider disabled:opacity-30"><ArrowLeft size={15}/> Back</button><Button disabled={!answers[question.key]} onClick={next}>{step === questions.length - 1 ? "Reveal my scents" : "Continue"} <ArrowRight size={15}/></Button></div></div>
      : <div className="mt-12"><div className="text-center"><p className="eyebrow">Your fragrance edit</p><h2 className="mt-3 font-display text-3xl">A few scents to explore.</h2><p className="mt-3 text-sm text-muted">Based on your answers: {answers.family}, {answers.occasion.toLowerCase()}, {answers.season.toLowerCase()}.</p></div><div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-3">{recommendations.map(product => <ProductCard key={product.id} product={product}/>)}</div><div className="mt-10 flex justify-center gap-4"><Button variant="secondary" onClick={() => { setStep(0); setComplete(false); }}>Retake quiz</Button><Link to="/shop"><Button>Explore all fragrances</Button></Link></div></div>}
  </section></Container>;
}
