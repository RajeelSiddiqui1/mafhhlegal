"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Scale, Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import axios from "axios";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "User" // Default role
  });
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Sending data:", formData); // Debug log

      const response = await axios.post('/api/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      console.log("Response:", response); // Debug log

      if (response.status === 201) {
        toast({ 
          title: "Account Created!", 
          description: "Welcome to Mafhh Legal. Please sign in to continue." 
        });
        
        // Redirect to login page after successful registration
        router.push("/login");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle different error responses
      if (error.response) {
        console.log("Error response data:", error.response.data); // Debug log
        console.log("Error response status:", error.response.status); // Debug log
        
        switch (error.response.status) {
          case 400:
            toast({ 
              title: "Validation Error", 
              description: error.response.data.message || "Please check your input and try again",
              variant: "destructive"
            });
            break;
          case 409:
            toast({ 
              title: "Email Already Registered", 
              description: "Please use a different email or sign in",
              variant: "destructive"
            });
            break;
          default:
            toast({ 
              title: "Registration Failed", 
              description: error.response.data.message || "Something went wrong",
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
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-gradient p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="h-12 w-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
              <Scale className="h-6 w-6" />
            </div>
            <span className="font-headline text-3xl font-bold text-gradient-gold">Mafhh Legal</span>
          </Link>
          <h1 className="text-2xl font-headline font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground mt-2">Join us for professional legal representation</p>
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl">
          <form onSubmit={handleRegister} className="space-y-4">
            {/* First Name Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required 
                  placeholder="John" 
                  className="pl-10 h-12 bg-background/50 border-white/10 focus:border-primary"
                />
              </div>
            </div>

            {/* Last Name Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Last Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required 
                  placeholder="Doe" 
                  className="pl-10 h-12 bg-background/50 border-white/10 focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                  placeholder="name@example.com" 
                  className="pl-10 h-12 bg-background/50 border-white/10 focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required 
                  placeholder="••••••••" 
                  className="pl-10 h-12 bg-background/50 border-white/10 focus:border-primary"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-bold rounded-xl mt-4" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Create Account"}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline inline-flex items-center gap-1">
                Sign In <ArrowRight className="h-3 w-3" />
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}