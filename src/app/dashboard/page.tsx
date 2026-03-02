
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Scale, 
  User, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("mafhh_user");
    if (!storedUser) {
      router.push("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  if (!user) return null;

  const mockAppointments = [
    {
      id: "APT-001",
      service: "Small Claims Court",
      date: "2024-05-20",
      time: "10:30 AM",
      status: "Confirmed",
      color: "bg-green-500/10 text-green-500",
    },
    {
      id: "APT-002",
      service: "Landlord & Tenant",
      date: "2024-05-25",
      time: "2:00 PM",
      status: "Pending",
      color: "bg-yellow-500/10 text-yellow-500",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4">
          <FadeIn direction="down" className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-headline font-bold mb-2">Welcome, {user.name}</h1>
                <p className="text-muted-foreground">Manage your legal matters and upcoming consultations.</p>
              </div>
              <Button asChild className="rounded-full h-12 px-8 font-bold shadow-lg shadow-primary/20">
                <Link href="/services#appointment">
                  <Plus className="mr-2 h-4 w-4" /> New Consultation
                </Link>
              </Button>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-card/50 backdrop-blur border-white/10 rounded-[2rem]">
                <CardHeader>
                  <CardTitle className="text-lg font-headline font-bold flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" /> Profile Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-50 mb-1">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-50 mb-1">Account Status</p>
                    <Badge variant="outline" className="text-primary border-primary/30">Verified Client</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20 rounded-[2rem]">
                <CardHeader>
                  <CardTitle className="text-lg font-headline font-bold flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" /> Recent Updates
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-3">
                  <p>• Your Small Claims document review is in progress.</p>
                  <p>• New message from Syeda regarding your case.</p>
                </CardContent>
              </Card>
            </div>

            {/* Appointments */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-headline font-bold">My Appointments</h2>
                <Button variant="ghost" size="sm" className="font-bold text-primary">View History</Button>
              </div>

              <div className="grid gap-6">
                {mockAppointments.map((apt, idx) => (
                  <FadeIn key={apt.id} delay={idx * 0.1}>
                    <Card className="bg-card/30 border-white/5 hover:border-primary/30 transition-all rounded-[2rem] overflow-hidden group">
                      <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-start gap-4">
                            <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                              <Scale className="h-7 w-7 text-primary" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{apt.id}</p>
                              <h3 className="text-xl font-headline font-bold">{apt.service}</h3>
                              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {apt.date}</span>
                                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {apt.time}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                            <Badge className={apt.color}>{apt.status}</Badge>
                            <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-white/10 group-hover:bg-primary group-hover:text-primary-foreground">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </FadeIn>
                ))}

                {mockAppointments.length === 0 && (
                  <div className="text-center py-24 bg-card/10 rounded-[2rem] border-2 border-dashed border-white/5">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <p className="text-muted-foreground italic">No upcoming appointments found.</p>
                    <Button asChild variant="link" className="text-primary mt-2">
                      <Link href="/services#appointment">Schedule one now</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
