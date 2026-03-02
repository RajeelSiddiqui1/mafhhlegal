
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Scale, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
            <Link href="/services#appointment">Consultation</Link>
          </Button>
        </div>

        {/* Mobile Nav Trigger */}
        <button
          className="flex items-center md:hidden h-10 w-10 rounded-xl bg-card/50 backdrop-blur border border-border flex items-center justify-center transition-colors hover:bg-card"
          onClick={() => setIsOpen(true)}
          aria-label="Open Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] h-screen w-full bg-background/98 backdrop-blur-2xl flex flex-col p-8 md:hidden"
          >
            <div className="flex justify-between items-center mb-16">
              <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                 <Scale className="h-8 w-8 text-primary" />
                 <span className="font-headline text-2xl font-bold text-gradient-gold">Mafhh Legal</span>
              </Link>
              <button 
                onClick={() => setIsOpen(false)} 
                className="h-12 w-12 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="Close Menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              {NavLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="flex items-center justify-between text-4xl font-headline font-bold text-foreground/90 hover:text-primary transition-colors group"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                    <ChevronRight className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0" />
                  </Link>
                </motion.div>
              ))}
              <motion.div 
                className="mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button asChild className="w-full h-16 rounded-2xl text-xl font-bold shadow-xl shadow-primary/20" onClick={() => setIsOpen(false)}>
                  <Link href="/services#appointment">Book Consultation</Link>
                </Button>
                <p className="text-center text-muted-foreground mt-8 text-sm font-medium italic">
                  "Serving Ontario with Integrity"
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
