
import Link from "next/link";
import Image from "next/image";
import { Shield, Users, Target, Heart, Star, Award, DollarSign, Lightbulb, HandHeart, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageBanner } from "@/components/PageBanner";
import { AIAssistant } from "@/components/AIAssistant";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const coreValues = [
  { icon: Shield, title: "Integrity", desc: "Highest ethical standards in all legal representations." },
  { icon: Award, title: "Professionalism", desc: "Top-tier competence and conduct in practice." },
  { icon: Users, title: "Accessibility", desc: "Quality services for everyone, regardless of situation." },
  { icon: Heart, title: "Client Care", desc: "Client interests are at the heart of our operations." },
  { icon: Star, title: "Excellence", desc: "Quality in legal services and client experience." },
];

const whyChoose = [
  { icon: Award, title: "Licensed Professionals", desc: "Fully licensed paralegals with deep Ontario legal expertise." },
  { icon: DollarSign, title: "Transparent Fees", desc: "Upfront pricing with no hidden costs for accessibility." },
  { icon: Lightbulb, title: "Personalized Strategies", desc: "Custom approaches for your unique legal situation." },
  { icon: HandHeart, title: "Ethical Representation", desc: "Treating every client with respect and empathy." },
];

export default function About() {
  const officeImg = PlaceHolderImages.find(img => img.id === "office-legal") || PlaceHolderImages[1] || { imageUrl: "https://picsum.photos/seed/mafhh2/800/600", description: "Law office", imageHint: "office" };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <PageBanner 
        title="About Mafhh Legal" 
        subtitle="Professional Paralegal Services Dedicated to Excellence" 
      />

      <main className="flex-1">
        {/* Who We Are */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">Who We Are</h2>
                <div className="h-1 w-20 bg-primary mb-8" />
                <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                  Mafhh Legal operates under <strong className="text-foreground">MAFHH Paralegal Services Professional Corporation</strong>. We are a team of dedicated legal professionals providing trusted and affordable paralegal services across Ontario.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Our firm was founded on the principle that quality legal representation shouldn't be a luxury. We specialize in Small Claims, Landlord/Tenant disputes, and Traffic violations, ensuring your voice is heard in the legal system.
                </p>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-card p-4 rounded-lg border border-border/50">
                      <p className="text-primary font-headline font-bold text-2xl">100%</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest">Client Focus</p>
                   </div>
                   <div className="bg-card p-4 rounded-lg border border-border/50">
                      <p className="text-primary font-headline font-bold text-2xl">Licensed</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest">In Ontario</p>
                   </div>
                </div>
              </div>
              <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={officeImg.imageUrl}
                  alt={officeImg.description}
                  fill
                  className="object-cover"
                  data-ai-hint={officeImg.imageHint}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-24 bg-muted/5 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-card rounded-2xl p-12 shadow-sm border border-border group hover:border-primary/50 transition-colors">
                <Target className="w-12 h-12 text-primary mb-6 transition-transform group-hover:scale-110" />
                <h3 className="text-2xl font-headline font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To provide professional, reliable, and accessible legal representation through integrity and a steadfast commitment to our clients' best interests.
                </p>
              </div>
              <div className="bg-card rounded-2xl p-12 shadow-sm border border-border group hover:border-primary/50 transition-colors">
                <Star className="w-12 h-12 text-primary mb-6 transition-transform group-hover:scale-110" />
                <h3 className="text-2xl font-headline font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be the first choice for paralegal services in Ontario, known for our ethical standards, effective results, and community impact.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-headline font-bold mb-16">Our Core Values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {coreValues.map((v) => (
                <div key={v.title} className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <v.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="text-lg font-headline font-bold mb-2">{v.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 bg-navy-gradient text-foreground">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-headline font-bold mb-4">Why Choose Mafhh Legal</h2>
              <p className="text-foreground/60">The professional difference in every case we handle.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {whyChoose.map((w) => (
                <div key={w.title} className="flex gap-6 bg-background/20 backdrop-blur rounded-2xl p-8 border border-white/5 group hover:bg-background/30 transition-all">
                  <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center shrink-0 mt-1 transition-transform group-hover:scale-110">
                    <w.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-headline font-bold mb-2">{w.title}</h4>
                    <p className="text-sm text-foreground/60 leading-relaxed">{w.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Founder */}
        <section className="py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
               <div className="inline-block p-1 rounded-full bg-gradient-to-tr from-primary to-secondary mb-6">
                 <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center text-4xl font-headline font-bold text-primary">
                    S
                 </div>
               </div>
               <h2 className="text-3xl font-headline font-bold mb-2">Meet the Founder</h2>
               <h3 className="text-xl text-primary font-medium mb-6 italic">Syeda, Licensed Paralegal</h3>
            </div>
            <div className="prose prose-invert max-w-none text-muted-foreground text-center">
              <p className="leading-relaxed mb-6 text-lg">
                With years of dedicated experience in the legal field, Syeda founded Mafhh Legal with a clear mission: to democratize access to justice. Her practice is built on the belief that everyone deserves professional representation that is both effective and affordable.
              </p>
              <p className="leading-relaxed mb-10">
                Syeda's expertise spans Small Claims Court, Landlord and Tenant disputes, and Traffic violations. She takes a personalized approach to every case, crafting legal strategies that address the unique needs of her clients while maintaining the highest standards of integrity.
              </p>
              <blockquote className="border-l-4 border-primary pl-8 text-left py-4 bg-muted/30 rounded-r-xl">
                <p className="italic text-foreground text-xl font-headline">
                  "At Mafhh Legal, we don't just handle cases; we represent people. Our goal is to ensure that access to justice is a reality for every member of our community."
                </p>
              </blockquote>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-headline font-bold mb-6">Ready to Discuss Your Case?</h2>
            <p className="mb-10 max-w-2xl mx-auto text-secondary-foreground/80">
              Take the first step towards resolving your legal matter. Contact Syeda and the team today.
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground font-bold px-12 h-14 hover:bg-navy-dark transition-colors">
              <Link href="/contact">Book Your Consultation</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
}
