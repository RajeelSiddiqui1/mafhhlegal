
import Link from "next/link";
import Image from "next/image";
import { Scale, Home as HomeIcon, Car, Quote, ArrowRight, ShieldCheck, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AIAssistant } from "@/components/AIAssistant";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const services = [
  {
    icon: Scale,
    title: "Small Claims Court",
    desc: "Professional representation for disputes up to $35,000, including contract issues and debt collection.",
  },
  {
    icon: HomeIcon,
    title: "Landlord & Tenant",
    desc: "Expert assistance with evictions, maintenance issues, and Landlord and Tenant Board hearings.",
  },
  {
    icon: Car,
    title: "Traffic Violations",
    desc: "Defense representation for speeding tickets, license suspensions, and other traffic-related offenses.",
  },
];

const testimonials = [
  {
    quote: "Mafhh Legal helped me resolve my landlord dispute quickly. Their guidance was invaluable.",
    name: "Sarah Johnson",
    location: "Toronto, ON",
  },
  {
    quote: "Professional and knowledgeable. Achieving a favorable outcome for my small claims issue.",
    name: "Michael Chen",
    location: "Markham, ON",
  },
  {
    quote: "Successfully defended me against a traffic violation. Highly recommend their services.",
    name: "David Wilson",
    location: "Scarborough, ON",
  },
];

export default function Home() {
  const heroImg = PlaceHolderImages.find(img => img.id === "hero-justice") || PlaceHolderImages[0] || { imageUrl: "https://picsum.photos/seed/fallback/1920/1080", description: "Legal background", imageHint: "law" };
  const aboutImg = PlaceHolderImages.find(img => img.id === "office-legal") || PlaceHolderImages[1] || { imageUrl: "https://picsum.photos/seed/fallback/800/600", description: "Office background", imageHint: "office" };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          <Image
            src={heroImg.imageUrl}
            alt={heroImg.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImg.imageHint}
          />
          <div className="absolute inset-0 bg-overlay-dark" />
          <div className="relative z-10 container mx-auto px-4 text-center py-20">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-headline font-bold text-foreground mb-6 animate-fade-in-up leading-tight">
              Professional Paralegal <br /> Services <span className="text-gradient-gold">You Can Trust</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-10 animate-fade-in-up delay-100">
              Providing reliable and affordable legal support across Ontario with integrity, professionalism, and dedication.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-200">
              <Button variant="default" size="lg" asChild className="font-bold">
                <Link href="/services#appointment">Book Free Consultation</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="font-bold border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Link href="/services">Our Services</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Features */}
        <section className="py-12 bg-muted/20 border-y border-border">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <div>
                <p className="font-headline font-bold text-sm">Licensed Professionals</p>
                <p className="text-xs text-muted-foreground">Regulated & Insured in Ontario</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <p className="font-headline font-bold text-sm">Fast Response</p>
                <p className="text-xs text-muted-foreground">We value your time & urgency</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-end">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="font-headline font-bold text-sm">Client Focused</p>
                <p className="text-xs text-muted-foreground">Dedicated 1-on-1 support</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Our Legal Services</h2>
              <div className="h-1 w-20 bg-primary mx-auto mb-6" />
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive paralegal representation designed to help you navigate Ontario's legal system with confidence.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((s) => (
                <div key={s.title} className="group relative bg-card/40 rounded-xl p-8 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <s.icon className="h-16 w-16" />
                  </div>
                  <s.icon className="w-12 h-12 text-primary mb-6 transition-transform group-hover:scale-110" />
                  <h3 className="text-xl font-headline font-bold mb-3">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">{s.desc}</p>
                  <Link href="/services" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary transition-colors group/link">
                    Explore Details <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Preview */}
        <section className="py-24 bg-muted/10 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-primary/20">
                <Image
                  src={aboutImg.imageUrl}
                  alt={aboutImg.description}
                  fill
                  className="object-cover"
                  data-ai-hint={aboutImg.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
              </div>
              <div>
                <span className="text-primary font-bold text-sm uppercase tracking-widest mb-2 block">Our Story</span>
                <h2 className="text-3xl md:text-5xl font-headline font-bold mb-6">Built on Integrity and Dedication</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Mafhh Legal operates under <strong>MAFHH Paralegal Services Professional Corporation</strong>, providing trusted, professional, and affordable paralegal services across Ontario.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  We represent clients in small claims, landlord and tenant disputes, traffic violations, and other legal matters with a relentless focus on achieving the best possible outcomes for our clients.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild variant="secondary" size="lg" className="font-bold">
                    <Link href="/about">Meet the Founder</Link>
                  </Button>
                  <Button asChild variant="ghost" size="lg" className="font-bold text-primary">
                    <Link href="/about">Learn More</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-navy-gradient">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Client Voices</h2>
              <p className="text-foreground/60 max-w-lg mx-auto">Hear how we've helped others navigate their legal challenges.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div key={t.name} className="bg-background/40 backdrop-blur rounded-2xl p-8 border border-white/10 relative">
                  <Quote className="w-10 h-10 text-primary/30 absolute top-4 right-4" />
                  <p className="text-foreground/80 text-lg leading-relaxed mb-8 italic relative z-10">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-headline font-bold text-foreground">{t.name}</p>
                      <p className="text-xs text-foreground/50">{t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10">
            <Scale className="h-96 w-96 rotate-12" />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-headline font-bold mb-6">Ready to Protect Your Rights?</h2>
            <p className="text-primary-foreground/80 mb-10 max-w-2xl mx-auto text-lg">
              Contact us today for a confidential consultation. Let our experienced legal team provide the support you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="font-bold text-lg px-12">
                <Link href="/contact">Contact Us Today</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-bold border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link href="/services#appointment">Schedule Appointment</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
}
