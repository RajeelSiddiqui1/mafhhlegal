
"use client";

import Link from "next/link";
import { useState } from "react";
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

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Scale className="h-8 w-8 text-primary" />
          <span className="font-headline text-2xl font-bold tracking-tight text-gradient-gold">
            Mafhh Legal
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex md:items-center md:gap-8">
          {NavLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
          <Button asChild variant="default" size="sm" className="font-semibold">
            <Link href="/services#appointment">Book Now</Link>
          </Button>
        </div>

        {/* Mobile Nav Trigger */}
        <button
          className="flex items-center md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="container md:hidden bg-background/95 pb-6 px-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-4">
            {NavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-medium text-foreground/70 hover:text-primary py-2 border-b border-border/20"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Button asChild className="mt-2 w-full">
              <Link href="/services#appointment" onClick={() => setIsOpen(false)}>Book Consultation</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
