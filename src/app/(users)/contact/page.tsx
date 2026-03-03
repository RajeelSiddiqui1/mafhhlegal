"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Calendar, CheckCircle, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageBanner } from "@/components/PageBanner";
import { AIAssistant } from "@/components/AIAssistant";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const contactMethods = [
  {
    icon: Phone,
    title: "Call Us",
    desc: "Speak with our team during business hours",
    action: "+1 647 707 5723",
    href: "tel:+16477075723",
  },
  {
    icon: Mail,
    title: "Email Us",
    desc: "Detailed inquiries and case submissions",
    action: "syeda@mafhhlegal.com",
    href: "mailto:syeda@mafhhlegal.com",
  },
  {
    icon: Calendar,
    title: "Visit Us",
    desc: "By appointment at our office location",
    action: "Book Appointment",
    href: "/services#appointment",
  },
];

export default function Contact() {
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", 
    lastName: "", 
    email: "", 
    phone: "", 
    subject: "", 
    Inquiry: "", // Note: Changed from 'message' to 'Inquiry' to match schema
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (status !== "authenticated" || session?.user?.role !== "User") {
      toast({ 
        title: "Authentication Required", 
        description: "Please login as a user to send a message.",
        variant: "destructive"
      });
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/contact', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        Inquiry: formData.Inquiry,
      });

      if (response.status === 201) {
        toast({ 
          title: "Message Sent!", 
          description: response.data.message || "Thank you for contacting Mafhh Legal. We will respond as soon as possible." 
        });
        
        // Reset form
        setFormData({ 
          firstName: "", 
          lastName: "", 
          email: "", 
          phone: "", 
          subject: "", 
          Inquiry: "" 
        });
      }
    } catch (error: any) {
      console.error("Contact submission error:", error);
      
      if (error.response?.status === 400) {
        toast({ 
          title: "Validation Error", 
          description: error.response.data.message || "Please fill in all required fields.",
          variant: "destructive"
        });
      } else if (error.response?.status === 401 || error.response?.status === 400) {
        toast({ 
          title: "Access Denied", 
          description: "Please login as a user to send a message.",
          variant: "destructive"
        });
        router.push("/login");
      } else {
        toast({ 
          title: "Error", 
          description: "Failed to send message. Please try again later.",
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
        title="Contact Us" 
        subtitle="We Are Here to Listen and Provide Professional Support" 
      />

      <main className="flex-1">
        {/* Contact Grid */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {/* Form */}
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-headline font-bold mb-8">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 md:p-12 rounded-3xl border border-border shadow-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">First Name *</label>
                      <Input 
                       
                        value={formData.firstName} 
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} 
                        className="bg-background/50" 
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">Last Name *</label>
                      <Input 
                   
                        value={formData.lastName} 
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} 
                        className="bg-background/50"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">Email Address *</label>
                      <Input 
                        type="email" 
                      
                        value={formData.email} 
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                        className="bg-background/50"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">Phone Number *</label>
                      <Input 
                        type="tel" 
                        required 
                        value={formData.phone} 
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                        className="bg-background/50"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Subject *</label>
                    <Input 
                      required 
                      value={formData.subject} 
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })} 
                      className="bg-background/50"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Inquiry Details *</label>
                    <Textarea 
                      required 
                      rows={6} 
                      value={formData.Inquiry} 
                      onChange={(e) => setFormData({ ...formData, Inquiry: e.target.value })} 
                      placeholder="How can we help you today?" 
                      className="bg-background/50"
                      disabled={isSubmitting}
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full h-14 font-bold text-lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="mr-2 h-4 w-4" /> Send Message</>
                    )}
                  </Button>
                </form>
              </div>

              {/* Info Sidebar */}
              <div className="space-y-8">
                <div className="bg-primary/5 rounded-3xl p-8 border border-primary/20 shadow-sm h-fit">
                  <h3 className="text-2xl font-headline font-bold mb-8 text-primary">Office Details</h3>
                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground mb-1 uppercase tracking-wider">Our Address</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">3001 Markham Rd, Scarborough, ON M1X 1L6, Canada</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground mb-1 uppercase tracking-wider">Phone</p>
                        <a href="tel:+16477075723" className="text-sm text-muted-foreground hover:text-primary transition-colors">+1 647 707 5723</a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground mb-1 uppercase tracking-wider">Email</p>
                        <a href="mailto:syeda@mafhhlegal.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">syeda@mafhhlegal.com</a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground mb-1 uppercase tracking-wider">Hours</p>
                        <p className="text-sm text-muted-foreground">Mon - Fri: 9:00 AM - 5:00 PM</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">Consultation by Appointment</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-primary/20">
                    <h4 className="font-headline font-bold text-foreground mb-4">Why Choose Us?</h4>
                    <ul className="space-y-3">
                      {["Free Initial Assessment", "Strict Confidentiality", "Experienced Paralegals", "Transparent Fee Model"].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                          <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Other Ways */}
        <section className="py-24 bg-muted/10 border-t border-border/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-headline font-bold mb-4">Other Ways to Reach Us</h2>
              <p className="text-muted-foreground">Multiple channels to ensure we're always accessible.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {contactMethods.map((m) => (
                <div key={m.title} className="bg-card rounded-2xl p-10 text-center shadow-lg border border-border group hover:border-primary transition-all duration-300">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110">
                    <m.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-headline font-bold mb-3">{m.title}</h3>
                  <p className="text-sm text-muted-foreground mb-6 h-12 leading-relaxed">{m.desc}</p>
                  <a href={m.href} className="text-sm font-bold text-primary hover:text-secondary transition-colors underline underline-offset-4 decoration-primary/30">
                    {m.action}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
}