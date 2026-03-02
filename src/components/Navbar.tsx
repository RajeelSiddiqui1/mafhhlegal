
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NavLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 z-50 w-full transition-all duration-500",
      scrolled 
        ? "h-16 bg-background/80 backdrop-blur-xl border-b border-border/50 py-0" 
        : "h-24 bg-transparent py-2"
    )}>
      <div className="container mx-auto flex h-full items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-lg shadow-primary/10">
            <Scale className="h-6 w-6" />
          </div>
          <span className="font-headline text-2xl font-bold tracking-tight text-gradient-gold">
            Mafhh Legal
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex md:items-center md:gap-10">
          {NavLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-bold text-foreground/70 transition-all hover:text-primary relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
          <Button asChild size="sm" className="font-bold rounded-full px-8 h-10 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
            <Link href="/services#appointment">Book Consultation</Link>
          </Button>
        </div>

        {/* Mobile Nav Trigger */}
        <button
          className="flex items-center md:hidden h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-0 z-50 h-screen w-full bg-background/98 backdrop-blur-2xl flex flex-col p-8 md:hidden animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-16">
            <Link href="/" className="flex items-center gap-3">
               <Scale className="h-8 w-8 text-primary" />
               <span className="font-headline text-2xl font-bold text-gradient-gold">Mafhh Legal</span>
            </Link>
            <button onClick={() => setIsOpen(false)} className="h-12 w-12 rounded-full bg-card border border-border flex items-center justify-center">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col gap-8">
            {NavLinks.map((link, idx) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-4xl font-headline font-bold text-foreground/90 hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-8">
              <Button asChild className="w-full h-16 rounded-2xl text-xl font-bold" onClick={() => setIsOpen(false)}>
                <Link href="/services#appointment">Book Consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
