
import Link from "next/link";
import Image from "next/image";
import { Scale, Home as HomeIcon, Car, Quote, ArrowRight, ShieldCheck, Clock, Users, CheckCircle2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AIAssistant } from "@/components/AIAssistant";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { FadeIn } from "@/components/FadeIn";

const services = [
  {
    icon: Scale,
    title: "Small Claims Court",
    desc: "Professional representation for disputes up to $35,000, including contract issues and debt collection.",
    color: "bg-blue-500/10",
  },
  {
    icon: HomeIcon,
    title: "Landlord & Tenant",
    desc: "Expert assistance with evictions, maintenance issues, and Landlord and Tenant Board hearings.",
    color: "bg-green-500/10",
  },
  {
    icon: Car,
    title: "Traffic Violations",
    desc: "Defense representation for speeding tickets, license suspensions, and other traffic-related offenses.",
    color: "bg-red-500/10",
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
  const heroImg = PlaceHolderImages.find(img => img.id === "hero-justice") || PlaceHolderImages[0] || { imageUrl: "https://picsum.photos/seed/mafhh1/1920/1080", description: "Lady Justice", imageHint: "lady justice" };
  const aboutImg = PlaceHolderImages.find(img => img.id === "office-legal") || PlaceHolderImages[1] || { imageUrl: "https://picsum.photos/seed/mafhh2/800/600", description: "Law office", imageHint: "law office" };

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/30">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[90vh] md:h-screen w-full flex items-center justify-center overflow-hidden">
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
          
          <div className="relative z-10 container mx-auto px-4 text-center mt-20 md:mt-0">
            <FadeIn duration={1}>
              <div className="inline-block mb-4 md:mb-6 px-4 md:px-6 py-1.5 md:py-2 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20">
                <span className="text-[10px] md:text-xs lg:text-sm font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] text-primary">
                  MAFHH Paralegal Services
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-headline font-bold text-foreground mb-6 md:mb-8 leading-[1.1] md:leading-[1]">
                Justice with <br className="hidden sm:block" />
                <span className="text-gradient-gold">Unwavering Integrity</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.3} duration={1}>
              <p className="text-base md:text-xl lg:text-2xl text-foreground/80 max-w-2xl lg:max-w-3xl mx-auto mb-8 md:mb-12 font-body leading-relaxed px-4">
                Trusted representation across Ontario. Bridging the gap between complex legal challenges and affordable, professional results.
              </p>
            </FadeIn>
            <FadeIn delay={0.6} duration={1} className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center px-4">
              <Button size="lg" asChild className="w-full sm:w-auto font-bold text-base md:text-lg lg:text-xl h-14 md:h-16 px-8 md:px-12 rounded-full shadow-2xl shadow-primary/30 hover:scale-105 transition-transform">
                <Link href="/services#appointment">Free Case Assessment</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="w-full sm:w-auto font-bold text-base md:text-lg lg:text-xl h-14 md:h-16 px-8 md:px-12 rounded-full border-white/20 backdrop-blur-md bg-white/5 hover:bg-white/10 text-white">
                <Link href="/services">Our Expertise</Link>
              </Button>
            </FadeIn>
            
            <FadeIn delay={1} className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:block">
              <div className="flex flex-col items-center gap-2 text-muted-foreground animate-bounce opacity-50">
                <span className="text-[10px] uppercase tracking-widest font-bold">Scroll to Explore</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Dynamic Stats Section */}
        <section className="py-12 md:py-16 relative z-20 -mt-16 md:-mt-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 bg-card/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
              <FadeIn delay={0.1} className="flex items-center gap-4 md:gap-6 group">
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-inner">
                  <ShieldCheck className="h-6 w-6 md:h-8 md:w-8" />
                </div>
                <div>
                  <p className="font-headline font-bold text-lg md:text-xl mb-1">Licensed & Insured</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Law Society of Ontario compliance</p>
                </div>
              </FadeIn>
              <FadeIn delay={0.2} className="flex items-center gap-4 md:gap-6 group">
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-inner">
                  <Clock className="h-6 w-6 md:h-8 md:w-8" />
                </div>
                <div>
                  <p className="font-headline font-bold text-lg md:text-xl mb-1">Fast Response</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Expert contact within 24 hours</p>
                </div>
              </FadeIn>
              <FadeIn delay={0.3} className="flex items-center gap-4 md:gap-6 group">
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-inner">
                  <Users className="h-6 w-6 md:h-8 md:w-8" />
                </div>
                <div>
                  <p className="font-headline font-bold text-lg md:text-xl mb-1">Dedicated Support</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Case strategies built for your needs</p>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 md:py-32 bg-background relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.03),transparent_40%)]" />
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-16 md:mb-24">
              <FadeIn>
                <div className="inline-block px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-4 md:mb-6">
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary">Our Areas of Practice</span>
                </div>
                <h2 className="text-3xl md:text-5xl lg:text-7xl font-headline font-bold mb-4 md:mb-6">Expert Legal Solutions</h2>
                <div className="h-1.5 w-16 md:w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto rounded-full mb-6 md:mb-8" />
                <p className="text-muted-foreground text-base md:text-xl max-w-2xl mx-auto font-body">
                  Specialized representation designed to protect your rights and deliver tangible results.
                </p>
              </FadeIn>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              {services.map((s, idx) => (
                <FadeIn key={s.title} delay={idx * 0.1}>
                  <div className="group relative h-full bg-card/30 border border-border/50 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 hover:border-primary/50 transition-all duration-500 overflow-hidden">
                    <div className={`absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 ${s.color} rounded-bl-[4rem] md:rounded-bl-[5rem] -mr-8 -mt-8 md:-mr-10 md:-mt-10 group-hover:w-full group-hover:h-full group-hover:mr-0 group-hover:mt-0 transition-all duration-700 opacity-50`} />
                    <div className="relative z-10">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-10 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-xl">
                        <s.icon className="w-6 h-6 md:w-8 md:w-8" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-headline font-bold mb-3 md:mb-4">{s.title}</h3>
                      <p className="text-muted-foreground text-sm md:text-lg leading-relaxed mb-8 md:mb-10">{s.desc}</p>
                      <Link href="/services" className="inline-flex items-center gap-2 font-bold text-sm md:text-base text-primary hover:text-secondary transition-all group/link">
                        Explore Service <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover/link:translate-x-2 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 md:py-32 bg-muted/5 relative">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
              <FadeIn direction="right" className="relative group">
                <div className="absolute -inset-4 bg-primary/20 rounded-[2.5rem] md:rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative aspect-[4/5] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5">
                  <Image
                    src={aboutImg.imageUrl}
                    alt={aboutImg.description}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    data-ai-hint={aboutImg.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 p-6 md:p-10 bg-card/40 backdrop-blur-xl border border-white/10 rounded-[1.5rem] md:rounded-[2rem] max-w-[85%] shadow-2xl">
                    <p className="text-primary font-bold text-2xl md:text-4xl font-headline mb-1 md:mb-2">Licensed</p>
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold opacity-70">Professional Legal Experts</p>
                  </div>
                </div>
              </FadeIn>
              <FadeIn direction="left">
                <span className="text-primary font-bold text-xs md:text-sm uppercase tracking-[0.3em] md:tracking-[0.4em] mb-4 md:mb-6 block">Our Commitment</span>
                <h2 className="text-3xl md:text-5xl lg:text-7xl font-headline font-bold mb-6 md:mb-8">Committed to <br className="hidden md:block" /> Your Best Outcome</h2>
                <div className="space-y-6 md:space-y-8 mb-8 md:mb-12">
                  <p className="text-muted-foreground text-base md:text-xl leading-relaxed">
                    Mafhh Legal operates with a clear philosophy: provide <strong className="text-foreground font-bold">professional transparency</strong> and results-oriented advocacy that you can trust.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 pt-2 md:pt-4">
                    {[
                      "Customized Legal Strategy",
                      "Transparent Fee Structure",
                      "Direct Paralegal Access",
                      "Results-Driven Focus"
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3 md:gap-4">
                        <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                        </div>
                        <span className="font-medium text-sm md:text-base text-foreground/80">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 md:gap-6">
                  <Button asChild size="lg" className="w-full sm:w-auto h-14 md:h-16 px-8 md:px-12 rounded-full font-bold text-base md:text-lg shadow-xl hover:translate-y-[-2px] transition-transform">
                    <Link href="/about">Learn Our Story</Link>
                  </Button>
                  <Button asChild variant="ghost" size="lg" className="w-full sm:w-auto h-14 md:h-16 px-8 md:px-12 rounded-full font-bold text-base md:text-lg group">
                    <Link href="/contact" className="flex items-center justify-center gap-2">
                      Get in Touch <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 md:py-32 bg-navy-gradient text-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-primary rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-secondary rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16 md:mb-24">
              <FadeIn>
                <h2 className="text-3xl md:text-5xl lg:text-7xl font-headline font-bold mb-4 md:mb-6">Client Experiences</h2>
                <p className="text-foreground/60 text-base md:text-xl font-body">Success stories from individuals we've represented across Ontario.</p>
              </FadeIn>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {testimonials.map((t, idx) => (
                <FadeIn key={t.name} delay={idx * 0.15}>
                  <div className="h-full bg-white/5 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 border border-white/10 relative group hover:bg-white/10 transition-all duration-500">
                    <Quote className="w-10 h-10 md:w-16 md:h-16 text-primary/10 absolute top-8 right-8 md:top-10 md:right-10 transition-transform group-hover:scale-125 duration-700" />
                    <p className="text-foreground/90 text-lg md:text-2xl leading-[1.6] md:leading-[1.8] mb-8 md:mb-12 italic font-body">
                      "{t.quote}"
                    </p>
                    <div className="flex items-center gap-4 md:gap-6 mt-auto">
                      <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-[1.25rem] bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-primary-foreground text-xl md:text-2xl shadow-2xl">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-headline font-bold text-lg md:text-2xl text-foreground">{t.name}</p>
                        <p className="text-[10px] md:text-xs text-foreground/50 uppercase tracking-[0.2em] font-bold">{t.location}</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="container mx-auto px-4 max-w-3xl">
            <FadeIn className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 lg:p-16 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 md:p-12 opacity-[0.05] text-primary pointer-events-none">
                <Scale className="h-40 w-40 md:h-56 md:w-56 rotate-12" />
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-headline font-bold text-foreground mb-6 md:mb-8 leading-tight">
                  Let's Discuss <br className="hidden sm:block" /> Your Case
                </h2>
                <p className="text-muted-foreground mb-8 md:mb-12 max-w-lg mx-auto text-base md:text-lg lg:text-xl font-body leading-relaxed">
                  The first step to resolution is a expert conversation. Get a professional assessment of your legal situation today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
                  <Button asChild size="lg" className="w-full sm:w-auto h-14 md:h-16 px-10 md:px-12 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="/contact">Book Consultation</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="w-full sm:w-auto h-14 md:h-16 px-10 md:px-12 rounded-full font-bold text-lg border-primary/20 text-primary hover:bg-white/5 hover:scale-105 transition-all duration-300">
                    <Link href="tel:+16477075723">Call Now</Link>
                  </Button>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
}
