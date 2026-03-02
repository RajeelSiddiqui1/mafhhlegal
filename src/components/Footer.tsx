
'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Scale, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full bg-muted/30 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Scale className="h-6 w-6 text-primary" />
              <span className="font-headline text-xl font-bold text-gradient-gold">
                Mafhh Legal
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              MAFHH Paralegal Services Professional Corporation. Providing trusted, 
              professional, and affordable paralegal services across Ontario.
            </p>
          </div>
          
          <div>
            <h4 className="font-headline font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/services" className="hover:text-primary transition-colors">Legal Services</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/services#appointment" className="hover:text-primary transition-colors">Book Consultation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Small Claims Court</li>
              <li>Landlord & Tenant Disputes</li>
              <li>Traffic Violations</li>
              <li>Other Legal Matters</li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-semibold text-foreground mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>3001 Markham Rd, Scarborough, ON M1X 1L6</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href="tel:+16477075723" className="hover:text-primary transition-colors">+1 647 707 5723</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a href="mailto:syeda@mafhhlegal.com" className="hover:text-primary transition-colors">syeda@mafhhlegal.com</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border text-center text-xs text-muted-foreground">
          <p>&copy; {year || 2024} MAFHH Paralegal Services Professional Corporation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
