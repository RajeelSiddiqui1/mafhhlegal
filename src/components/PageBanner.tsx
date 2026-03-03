
"use client";

import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { motion } from "framer-motion";

interface PageBannerProps {
  title: string;
  subtitle?: string;
}

export function PageBanner({ title, subtitle }: PageBannerProps) {
  const heroImg = PlaceHolderImages.find(img => img.id === "hero-justice") || PlaceHolderImages[0] || { imageUrl: "https://picsum.photos/seed/mafhh1/1920/1080", description: "Lady Justice", imageHint: "lady justice" };

  return (
    <section className="relative h-[40vh] md:h-[50vh] min-h-[350px] md:min-h-[450px] flex items-center justify-center overflow-hidden w-full -mt-90 md:-mt-24">
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImg.imageUrl}
          alt={heroImg.description}
          fill
          className="object-cover animate-slow-zoom"
          priority
          data-ai-hint={heroImg.imageHint}
        />
        <div className="absolute inset-0 bg-hero-overlay" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center mt-12 md:mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 mb-4 md:mb-6">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-primary">
              Professional Paralegal Services
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-bold mb-4 md:mb-6 text-foreground leading-tight px-4">
            {title}
          </h1>
          {subtitle && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-sm md:text-xl lg:text-2xl text-foreground/80 font-medium max-w-2xl mx-auto leading-relaxed px-4"
            >
              {subtitle}
            </motion.p>
          )}
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="h-1 w-16 md:w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-6 md:mt-8"
          />
        </motion.div>
      </div>
    </section>
  );
}
