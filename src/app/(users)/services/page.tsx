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
import { FadeIn } from "@/components/FadeIn";
import axios from "axios";
import { useSession } from "next-auth/react";

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

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", 
  "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", 
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"
];

// Map service IDs to display names for the API
const serviceAreaMap: Record<string, string> = {
  "small-claims": "Small Claims Court",
  "landlord-tenant": "Landlord & Tenant Disputes",
  "traffic": "Traffic Violations",
  "other": "Other Legal Matter"
};

export default function Services() {
  const { toast } = useToast();
  const { data: session, status } = useSession();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if user is logged in
      if (status !== "authenticated") {
        toast({ 
          title: "Authentication Required", 
          description: "Please login to book a consultation.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Prepare data for API
      const appointmentData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        description: formData.description,
        area: serviceAreaMap[formData.service] || formData.service,
        preferredDate: formData.date,
        preferredTime: formData.time,
      };

      console.log("Submitting appointment:", appointmentData); // Debug log

      const response = await axios.post('/api/appiontment', appointmentData);

      if (response.status === 201) {
        toast({ 
          title: "Appointment Requested!", 
          description: response.data.message || "We have received your request and will contact you shortly." 
        });
        
        // Reset form
        setFormData({ 
          firstName: "", lastName: "", email: "", phone: "", 
          service: "", date: "", time: "", description: "" 
        });
        setAiAnalysis(null);
      }
    } catch (error: any) {
      console.error("Appointment submission error:", error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        switch (error.response.status) {
          case 400:
            toast({ 
              title: "Access Denied", 
              description: error.response.data.message || "You need to be logged in as a user to book appointments.",
              variant: "destructive"
            });
            break;
          case 401:
            toast({ 
              title: "Authentication Required", 
              description: "Please login to book a consultation.",
              variant: "destructive"
            });
            break;
          default:
            toast({ 
              title: "Submission Failed", 
              description: error.response.data.message || "Something went wrong. Please try again.",
              variant: "destructive"
            });
        }
      } else if (error.request) {
        // The request was made but no response was received
        toast({ 
          title: "Network Error", 
          description: "No response from server. Please check your connection.",
          variant: "destructive"
        });
      } else {
        // Something happened in setting up the request
        toast({ 
          title: "Error", 
          description: error.message || "Something went wrong",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
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
              <FadeIn key={s.id} direction={i % 2 === 1 ? "right" : "left"} className={cn(
                "grid grid-cols-1 lg:grid-cols-2 gap-16 items-center",
                i % 2 === 1 && "lg:flex-row-reverse"
              )}>
                <div id={s.id} className={cn(i % 2 === 1 ? "lg:order-2" : "lg:order-1")}>
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
                  <Button asChild size="lg" className="font-bold rounded-full">
                    <a href="#appointment">Book Consultation</a>
                  </Button>
                </div>
                <div className={cn(
                  "flex items-center justify-center p-12 bg-muted/10 rounded-3xl relative overflow-hidden group min-h-[400px]",
                  i % 2 === 1 ? "lg:order-1" : "lg:order-2"
                )}>
                  <s.icon className="w-48 h-48 text-primary/10 transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-[2.5rem] m-6" />
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Appointment Form */}
        <section id="appointment" className="py-24 bg-muted/5 border-t border-border/50">
          <div className="container mx-auto px-4 max-w-5xl">
            <FadeIn className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Book Your Consultation</h2>
              <div className="h-1 w-20 bg-primary mx-auto mb-6" />
              <p className="text-muted-foreground">Schedule a private session with our legal experts to discuss your matter.</p>
              {status !== "authenticated" && (
                <div className="mt-4 p-3 bg-secondary/10 border border-secondary/20 rounded-xl inline-flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-medium">Please login to book an appointment</span>
                </div>
              )}
            </FadeIn>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <FadeIn direction="right" className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="bg-card/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/10 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">First Name (Optional)</label>
                      <Input 
                        className="bg-background/50 h-12" 
                        value={formData.firstName} 
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} 
                        placeholder={session?.user?.name?.split(' ')[0] || "Auto-filled from login"}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Last Name (Optional)</label>
                      <Input 
                        className="bg-background/50 h-12" 
                        value={formData.lastName} 
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} 
                        placeholder={session?.user?.name?.split(' ').slice(1).join(' ') || "Auto-filled from login"}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Email (Optional)</label>
                      <Input 
                        type="email" 
                        className="bg-background/50 h-12" 
                        value={formData.email} 
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                        placeholder={session?.user?.email || "Auto-filled from login"}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Phone *</label>
                      <Input 
                        type="tel" 
                        required 
                        className="bg-background/50 h-12" 
                        value={formData.phone} 
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Description of Matter *</label>
                    <Textarea 
                      required 
                      rows={4} 
                      className="bg-background/50"
                      value={formData.description} 
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                      onBlur={(e) => handleAIAnalysis(e.target.value)}
                      placeholder="Please describe your legal situation..." 
                    />
                    {aiAnalysis && (
                      <div className="mt-4 p-4 rounded-2xl bg-primary/5 border border-primary/20 animate-in slide-in-from-top-2 duration-500">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="h-4 w-4 text-primary" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">AI Analysis Results</span>
                        </div>
                        <p className="text-xs text-muted-foreground italic leading-relaxed">{aiAnalysis.reasoning}</p>
                        {aiAnalysis.isUrgent && (
                          <div className="mt-3 flex items-center gap-1.5 text-secondary">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Urgent Matter Detected</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Service Area *</label>
                      <Select value={formData.service} onValueChange={(v) => setFormData({ ...formData, service: v })}>
                        <SelectTrigger className="bg-background/50 h-12"><SelectValue placeholder="Select area" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small-claims">Small Claims Court</SelectItem>
                          <SelectItem value="landlord-tenant">Landlord & Tenant</SelectItem>
                          <SelectItem value="traffic">Traffic Violations</SelectItem>
                          <SelectItem value="other">Other Legal Matter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Preferred Date *</label>
                      <Input 
                        type="date" 
                        required 
                        className="bg-background/50 h-12" 
                        value={formData.date} 
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Preferred Time *</label>
                      <Select value={formData.time} onValueChange={(v) => setFormData({ ...formData, time: v })}>
                        <SelectTrigger className="bg-background/50 h-12"><SelectValue placeholder="Select time" /></SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full h-14 font-bold text-lg rounded-2xl shadow-xl shadow-primary/20 mt-4" 
                    disabled={isSubmitting || status !== "authenticated"}
                  >
                    {isSubmitting ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                    ) : status !== "authenticated" ? (
                      "Please Login to Book"
                    ) : (
                      "Request Consultation"
                    )}
                  </Button>
                </form>
              </FadeIn>

              <FadeIn direction="left" className="space-y-8">
                 <div className="bg-card/30 backdrop-blur rounded-[2.5rem] p-10 border border-white/5 shadow-xl">
                    <Calendar className="h-12 w-12 text-primary mb-6" />
                    <h3 className="text-2xl font-headline font-bold mb-4">Availability</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Consultations are by appointment only. We are available Monday to Friday from <strong className="text-foreground">9:00 AM to 4:30 PM</strong>.
                    </p>
                 </div>
                 <div className="bg-primary/5 rounded-[2.5rem] p-10 border border-primary/20 shadow-xl">
                    <h3 className="text-lg font-headline font-bold mb-6 text-primary">What to expect?</h3>
                    <ul className="space-y-5">
                      {[
                        "Confidential evaluation",
                        "Strategic legal options",
                        "Clear fee structure",
                        "Actionable next steps"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-4 text-sm font-medium">
                          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                            <CheckCircle className="h-4 w-4 text-primary" />
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>
                 </div>
              </FadeIn>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
}