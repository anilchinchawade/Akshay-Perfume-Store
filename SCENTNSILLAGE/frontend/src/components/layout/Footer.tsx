import { Link } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";
import { Container } from "@/components/common/Container";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink py-14 text-white">
      <Container>
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl tracking-wide">SCENTNSILLAGE</p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-white/60">
              A considered collection of fragrances for every mood, moment and memory.
            </p>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Explore</h2>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/70">
              <Link to="/shop" className="hover:text-white">Shop all</Link>
              <Link to="/about" className="hover:text-white">Our story</Link>
              <Link to="/find-your-scent" className="hover:text-white">Find your scent</Link>
            </div>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Stay in the know</h2>
            <p className="mt-4 text-sm text-white/60">New discoveries, notes and stories from the world of fragrance.</p>
            <div className="mt-4 flex items-center gap-4 text-white/80">
              <a href="mailto:hello@scentnsillage.com" aria-label="Email us"><Mail size={18} /></a>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/15 pt-5 text-xs text-white/45">
          © {new Date().getFullYear()} SCENTNSILLAGE. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
