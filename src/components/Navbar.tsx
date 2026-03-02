
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Scale, ChevronRight, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const NavLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    // Static auth check
    const user = localStorage.getItem("mafhh_user");
    setIsLoggedIn(!!user);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("mafhh_user");
    setIsLoggedIn(false);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className={cn(
      "fixed top-0 z-50 w-full transition-all duration-500",
      scrolled 
        ? "h-16 md:h-18 bg-background/80 backdrop-blur-xl border-b border-border/50 py-0" 
        : "h-20 md:h-24 bg-transparent py-2"
    )}>
      <div className="container mx-auto flex h-full items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 md:gap-3 group">
          <div className="h-8 w-8 md:h-10 md:w-10 bg-primary/20 rounded-lg md:rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-lg shadow-primary/10">
            <Scale className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <span className="font-headline text-lg md:text-2xl font-bold tracking-tight text-gradient-gold">
            Mafhh Legal
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex md:items-center md:gap-6 lg:gap-8">
          {NavLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-xs lg:text-sm font-bold text-foreground/70 transition-all hover:text-primary relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
          
          <div className="h-4 w-px bg-border/50 mx-2" />

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-xs lg:text-sm font-bold text-primary flex items-center gap-2 hover:opacity-80 transition-opacity">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Button onClick={handleLogout} variant="ghost" size="sm" className="font-bold text-xs hover:text-red-400">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-xs lg:text-sm font-bold text-foreground/70 hover:text-primary transition-colors">
                Login
              </Link>
              <Button asChild size="sm" className="font-bold rounded-full px-6 h-9 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
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
            className="fixed inset-0 z-[60] h-screen w-full bg-background/98 backdrop-blur-2xl flex flex-col p-6 md:hidden"
          >
            <div className="flex justify-between items-center mb-12">
              <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                 <Scale className="h-7 w-7 text-primary" />
                 <span className="font-headline text-xl font-bold text-gradient-gold">Mafhh Legal</span>
              </Link>
              <button 
                onClick={() => setIsOpen(false)} 
                className="h-10 w-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="Close Menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col gap-5">
              {NavLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="flex items-center justify-between text-2xl font-headline font-bold text-foreground/90 hover:text-primary transition-colors group"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                    <ChevronRight className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0" />
                  </Link>
                </motion.div>
              ))}
              
              <div className="h-px bg-border my-4" />

              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" className="text-xl font-bold text-primary" onClick={() => setIsOpen(false)}>Dashboard</Link>
                  <button onClick={handleLogout} className="text-left text-xl font-bold text-foreground/70">Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-xl font-bold text-foreground/70" onClick={() => setIsOpen(false)}>Login</Link>
                  <Button asChild className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20" onClick={() => setIsOpen(false)}>
                    <Link href="/register">Register Now</Link>
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
