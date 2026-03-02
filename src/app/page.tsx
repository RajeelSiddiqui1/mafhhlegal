
import Link from "next/link";
import Image from "next/image";
import { Scale, Home as HomeIcon, Car, Quote, ArrowRight, ShieldCheck, Clock, Users, CheckCircle2 } from "lucide-react";
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
  const heroImg = PlaceHolderImages.find(img => img.id === "hero-justice") || PlaceHolderImages[0];
  const aboutImg = PlaceHolderImages.find(img => img.id === "office-legal") || PlaceHolderImages[1];

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/30">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          <Image
            src={heroImg.imageUrl}
            alt={heroImg.description}
            fill
            className="object-cover scale-105 animate-slow-zoom"
            priority
            data-ai-hint={heroImg.imageHint}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
          <div className="relative z-10 container mx-auto px-4 text-center">
            <FadeIn duration={0.8}>
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-headline font-bold text-foreground mb-8 leading-[1.1]">
                Justice with <span className="text-gradient-gold">Integrity</span> <br />
                Support with <span className="text-gradient-gold italic">Care</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.2} duration={0.8}>
              <p className="text-lg md:text-2xl text-foreground/80 max-w-3xl mx-auto mb-12 font-body leading-relaxed">
                Licensed paralegal services across Ontario. We bridge the gap between complex legal issues and affordable, professional solutions.
              </p>
            </FadeIn>
            <FadeIn delay={0.4} duration={0.8} className="flex flex-col sm:flex-row gap-5 justify-center">
              <Button size="lg" asChild className="font-bold text-lg h-14 px-10 shadow-xl shadow-primary/20">
                <Link href="/services#appointment">Book Free Consultation</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="font-bold text-lg h-14 px-10 border-primary/50 backdrop-blur-sm hover:bg-primary/10">
                <Link href="/services">Explore Our Services</Link>
              </Button>
            </FadeIn>
          </div>
        </section>

        {/* Dynamic Stats Section */}
        <section className="py-16 relative z-20 -mt-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-card/80 backdrop-blur-xl border border-border/50 rounded-[2rem] p-10 shadow-2xl">
              <FadeIn delay={0.1} className="flex items-center gap-6 group">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <div>
                  <p className="font-headline font-bold text-xl mb-1">Licensed & Insured</p>
                  <p className="text-sm text-muted-foreground">Full Law Society compliance in Ontario</p>
                </div>
              </FadeIn>
              <FadeIn delay={0.2} className="flex items-center gap-6 group">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                  <Clock className="h-8 w-8" />
                </div>
                <div>
                  <p className="font-headline font-bold text-xl mb-1">Fast Response</p>
                  <p className="text-sm text-muted-foreground">Initial assessment within 24 hours</p>
                </div>
              </FadeIn>
              <FadeIn delay={0.3} className="flex items-center gap-6 group">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                  <Users className="h-8 w-8" />
                </div>
                <div>
                  <p className="font-headline font-bold text-xl mb-1">Personal Advocacy</p>
                  <p className="text-sm text-muted-foreground">Tailored strategies for your specific case</p>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-32 bg-background relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.03),transparent_40%)]" />
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-24">
              <FadeIn>
                <h2 className="text-4xl md:text-6xl font-headline font-bold mb-6">Expert Legal Areas</h2>
                <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mb-8" />
                <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-body">
                  Specialized representation designed to protect your rights and deliver results.
                </p>
              </FadeIn>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {services.map((s, idx) => (
                <FadeIn key={s.title} delay={idx * 0.1}>
                  <div className="group relative h-full bg-card/30 border border-border/50 rounded-3xl p-10 hover:border-primary/50 transition-all duration-500 overflow-hidden">
                    <div className={`absolute top-0 right-0 w-32 h-32 ${s.color} rounded-bl-[5rem] -mr-10 -mt-10 group-hover:w-full group-hover:h-full group-hover:mr-0 group-hover:mt-0 transition-all duration-700 opacity-50`} />
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                        <s.icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-headline font-bold mb-4">{s.title}</h3>
                      <p className="text-muted-foreground text-lg leading-relaxed mb-8">{s.desc}</p>
                      <Link href="/services" className="inline-flex items-center gap-2 font-bold text-primary hover:text-secondary transition-all group/link">
                        Learn More <ArrowRight className="w-5 h-5 group-hover/link:translate-x-2 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* About Section - Enhanced Visuals */}
        <section className="py-32 bg-muted/5 relative">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <FadeIn direction="right" className="relative group">
                <div className="absolute -inset-4 bg-primary/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border border-primary/20">
                  <Image
                    src={aboutImg.imageUrl}
                    alt={aboutImg.description}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    data-ai-hint={aboutImg.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-10 left-10 p-8 bg-card/60 backdrop-blur-md border border-white/10 rounded-2xl max-w-[80%]">
                    <p className="text-primary font-bold text-3xl font-headline mb-2">10+</p>
                    <p className="text-xs uppercase tracking-[0.2em] font-bold opacity-70">Years of Legal Excellence</p>
                  </div>
                </div>
              </FadeIn>
              <FadeIn direction="left">
                <span className="text-primary font-bold text-sm uppercase tracking-[0.3em] mb-4 block">Trusted Representation</span>
                <h2 className="text-4xl md:text-6xl font-headline font-bold mb-8">Committed to <br /> Your Best Outcome</h2>
                <div className="space-y-6 mb-12">
                  <p className="text-muted-foreground text-xl leading-relaxed">
                    Mafhh Legal operates with a simple philosophy: provide <strong className="text-foreground">professional transparency</strong> and results-oriented advocacy.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                    {[
                      "Customized Legal Strategy",
                      "Transparent Fee Structure",
                      "Direct Paralegal Access",
                      "Results-Driven Focus"
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                        <span className="font-medium text-foreground/80">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-6">
                  <Button asChild size="lg" className="h-14 px-10 rounded-full font-bold">
                    <Link href="/about">Learn Our Story</Link>
                  </Button>
                  <Button asChild variant="ghost" size="lg" className="h-14 px-10 rounded-full font-bold group">
                    <Link href="/contact" className="flex items-center gap-2">
                      Get in Touch <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Testimonials - Premium Layout */}
        <section className="py-32 bg-navy-gradient text-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-24">
              <FadeIn>
                <h2 className="text-4xl md:text-6xl font-headline font-bold mb-6">Client Experiences</h2>
                <p className="text-foreground/60 text-xl font-body">Success stories from individuals we've represented across Ontario.</p>
              </FadeIn>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {testimonials.map((t, idx) => (
                <FadeIn key={t.name} delay={idx * 0.15}>
                  <div className="h-full bg-background/10 backdrop-blur-xl rounded-[2.5rem] p-12 border border-white/5 relative group hover:bg-background/20 transition-all duration-500">
                    <Quote className="w-16 h-16 text-primary/10 absolute top-8 right-8 transition-transform group-hover:scale-125 duration-700" />
                    <p className="text-foreground/90 text-xl leading-[1.8] mb-12 italic font-body">
                      "{t.quote}"
                    </p>
                    <div className="flex items-center gap-5 mt-auto">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-primary-foreground text-xl shadow-lg">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-headline font-bold text-xl text-foreground">{t.name}</p>
                        <p className="text-sm text-foreground/50 uppercase tracking-widest">{t.location}</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - High Impact */}
        <section className="py-32 relative overflow-hidden">
          <div className="container mx-auto px-4 max-w-6xl">
            <FadeIn className="bg-primary rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-primary/30">
              <div className="absolute top-0 right-0 p-20 opacity-10">
                <Scale className="h-64 w-64 rotate-12" />
              </div>
              <div className="relative z-10">
                <h2 className="text-4xl md:text-7xl font-headline font-bold text-primary-foreground mb-8 leading-tight">
                  Let's Discuss <br /> Your Case Today
                </h2>
                <p className="text-primary-foreground/90 mb-12 max-w-2xl mx-auto text-xl font-body leading-relaxed">
                  The first step to resolution is a conversation. Get a professional assessment of your legal situation without any obligation.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button asChild size="lg" variant="secondary" className="h-16 px-12 rounded-full font-bold text-xl shadow-xl hover:scale-105 transition-transform">
                    <Link href="/contact">Book Consultation</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-16 px-12 rounded-full font-bold text-xl border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-all">
                    <Link href="tel:+16477075723">Call +1 647 707 5723</Link>
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
