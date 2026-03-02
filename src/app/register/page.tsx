
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Scale, Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem("mafhh_user", JSON.stringify({ name: "John Doe", email: "john@example.com" }));
      toast({ title: "Account Created!", description: "Welcome to Mafhh Legal." });
      router.push("/dashboard");
      router.refresh();
      setIsLoading(false);
    }, 1500);
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
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  required 
                  placeholder="John Doe" 
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
