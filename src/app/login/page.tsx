"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Scale, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      if (result?.error) {
        toast({ 
          title: "Login Failed", 
          description: "Invalid email or password. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({ 
          title: "Welcome Back!", 
          description: "Successfully logged into your account." 
        });
        
        // Get user role from session to determine redirect
        const session = await fetch('/api/auth/session').then(res => res.json());
        
        // Redirect based on user role
        if (session?.user?.role === "Admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
        
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({ 
        title: "Login Failed", 
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
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
          <h1 className="text-2xl font-headline font-bold text-foreground">Sign In</h1>
          <p className="text-muted-foreground mt-2">Access your case dashboard and appointments</p>
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
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
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Password</label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline font-bold">Forgot?</Link>
              </div>
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

            <Button type="submit" className="w-full h-12 text-base font-bold rounded-xl" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary font-bold hover:underline inline-flex items-center gap-1">
                Register <ArrowRight className="h-3 w-3" />
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}