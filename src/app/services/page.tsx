
"use client";

import { useState } from "react";
import { Scale, Home as HomeIcon, Car, CheckCircle, Calendar, MessageSquare, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageBanner } from "@/components/PageBanner";
import { AIAssistant } from "@/components/AIAssistant";
import { useToast } from "@/hooks/use-toast";
import { categorizeInquiry, type InquiryCategorizerOutput } from "@/ai/flows/inquiry-categorizer-flow";
import { cn } from "@/lib/utils";

const servicesList = [
  {
    id: "small-claims",
    icon: Scale,
    title: "Small Claims Court Representation",
    desc: "We provide professional representation for matters in Small Claims Court, where the claim does not exceed $35,000. Our experienced paralegals can help you navigate the process from filing to judgment.",
    items: [
      "Contract disputes and breach of contract claims",
      "Debt collection and money owed",
      "Property damage claims",
      "Negligence claims",
      "Landlord and tenant disputes involving money",
    ],
  },
  {
    id: "landlord-tenant",
    icon: HomeIcon,
    title: "Landlord & Tenant Disputes",
    desc: "We represent both landlords and tenants in disputes before the Landlord and Tenant Board. Our expertise covers a wide range of residential tenancy issues.",
    items: [
      "Eviction proceedings and defense",
      "Rent increase disputes",
      "Maintenance and repair issues",
      "Lease agreement disputes",
      "Tenant rights and responsibilities",
    ],
  },
  {
    id: "traffic",
    icon: Car,
    title: "Traffic Violations Defense",
    desc: "We provide defense representation for various traffic-related offenses, helping you protect your driving record and avoid unnecessary penalties.",
    items: [
      "Speeding tickets and racing charges",
      "Careless driving charges",
      "Driving without insurance",
      "License suspension appeals",
      "Commercial vehicle offenses",
    ],
  },
];

export default function Services() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<InquiryCategorizerOutput | null>(null);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    service: "", date: "", time: "", description: "",
  });

  const handleAIAnalysis = async (msg: string) => {
    if (!msg.trim()) return;
    try {
      const analysis = await categorizeInquiry({ message: msg });
      setAiAnalysis(analysis);
      if (analysis.suggestedCategories.length > 0) {
        // Map AI categories to our select values
        const categoryMap: Record<string, string> = {
          "Small Claims Court": "small-claims",
          "Landlord & Tenant Disputes": "landlord-tenant",
          "Traffic Violations": "traffic",
          "Other Legal Matter": "other"
        };
        const mapped = categoryMap[analysis.suggestedCategories[0]];
        if (mapped) setFormData(prev => ({ ...prev, service: mapped }));
      }
    } catch (error) {
      console.error("AI Analysis failed", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      toast({ 
        title: "Appointment Requested!", 
        description: "We have received your request and will contact you shortly to confirm your consultation." 
      });
      setFormData({ firstName: "", lastName: "", email: "", phone: "", service: "", date: "", time: "", description: "" });
      setAiAnalysis(null);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <PageBanner 
        title="Our Services" 
        subtitle="Comprehensive Paralegal Solutions Tailored for You" 
      />

      <main className="flex-1">
        {/* Services Detail List */}
        <section className="py-24">
          <div className="container mx-auto px-4 space-y-32">
            {servicesList.map((s, i) => (
              <div key={s.id} id={s.id} className={cn(
                "grid grid-cols-1 lg:grid-cols-2 gap-16 items-center",
                i % 2 === 1 && "lg:flex-row-reverse"
              )}>
                <div className={cn(i % 2 === 1 ? "lg:order-2" : "lg:order-1")}>
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 font-bold text-sm uppercase tracking-wider">
                    <s.icon className="h-4 w-4" />
                    Expert Representation
                  </div>
                  <h2 className="text-3xl md:text-5xl font-headline font-bold mb-6">{s.title}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-8 text-lg">{s.desc}</p>
                  <ul className="grid grid-cols-1 gap-4 mb-10">
                    {s.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild size="lg" className="font-bold">
                    <a href="#appointment">Book Consultation</a>
                  </Button>
                </div>
                <div className={cn(
                  "flex items-center justify-center p-12 bg-muted/10 rounded-3xl relative overflow-hidden group",
                  i % 2 === 1 ? "lg:order-1" : "lg:order-2"
                )}>
                  <s.icon className="w-48 h-48 text-primary/10 transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-3xl m-4" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Appointment Form */}
        <section id="appointment" className="py-24 bg-muted/5 border-t border-border/50">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Book Your Consultation</h2>
              <div className="h-1 w-20 bg-primary mx-auto mb-6" />
              <p className="text-muted-foreground">Schedule a private session with our legal experts to discuss your matter.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 md:p-10 shadow-xl border border-border space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">First Name *</label>
                      <Input required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">Last Name *</label>
                      <Input required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">Email *</label>
                      <Input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">Phone *</label>
                      <Input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Description of Matter *</label>
                    <Textarea 
                      required 
                      rows={4} 
                      value={formData.description} 
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                      onBlur={(e) => handleAIAnalysis(e.target.value)}
                      placeholder="Please describe your legal situation. Our AI will help categorize it for you..." 
                    />
                    {aiAnalysis && (
                      <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20 animate-in fade-in duration-300">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="h-4 w-4 text-primary" />
                          <span className="text-xs font-bold uppercase tracking-wider text-primary">AI Analysis Results</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{aiAnalysis.reasoning}</p>
                        {aiAnalysis.isUrgent && (
                          <div className="mt-2 flex items-center gap-1 text-secondary">
                            <AlertTriangle className="h-3 w-3" />
                            <span className="text-[10px] font-bold uppercase">Urgent Matter Detected</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">Service Area *</label>
                      <Select value={formData.service} onValueChange={(v) => setFormData({ ...formData, service: v })}>
                        <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small-claims">Small Claims Court</SelectItem>
                          <SelectItem value="landlord-tenant">Landlord & Tenant</SelectItem>
                          <SelectItem value="traffic">Traffic Violations</SelectItem>
                          <SelectItem value="other">Other Legal Matter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">Preferred Date *</label>
                      <Input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">Preferred Time *</label>
                      <Select value={formData.time} onValueChange={(v) => setFormData({ ...formData, time: v })}>
                        <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                        <SelectContent>
                          {["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"].map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full h-14 font-bold text-lg" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : "Request Consultation"}
                  </Button>
                </form>
              </div>

              <div className="space-y-8">
                 <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                    <Calendar className="h-10 w-10 text-primary mb-4" />
                    <h3 className="text-xl font-headline font-bold mb-4">Availability</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Consultations are by appointment only. We strive to respond to all booking requests within 24 business hours.
                    </p>
                 </div>
                 <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20">
                    <h3 className="text-lg font-headline font-bold mb-4 text-primary">What to expect?</h3>
                    <ul className="space-y-4">
                      {[
                        "Confidential evaluation",
                        "Strategic legal options",
                        "Clear fee structure",
                        "Actionable next steps"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm font-medium">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                 </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
}
