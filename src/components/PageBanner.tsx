
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

interface PageBannerProps {
  title: string;
  subtitle?: string;
}

export function PageBanner({ title, subtitle }: PageBannerProps) {
  const heroImg = PlaceHolderImages.find(img => img.id === "hero-justice") || PlaceHolderImages[0] || { imageUrl: "https://picsum.photos/seed/mafhh1/1920/1080", description: "Legal background", imageHint: "justice" };

  return (
    <section className="relative h-[30vh] min-h-[250px] flex items-center justify-center overflow-hidden">
      <Image
        src={heroImg.imageUrl}
        alt={heroImg.description}
        fill
        className="object-cover"
        priority
        data-ai-hint={heroImg.imageHint}
      />
      <div className="absolute inset-0 bg-overlay-dark" />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4 animate-fade-in-up">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-primary/80 font-medium animate-fade-in-up delay-75">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
