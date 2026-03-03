"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  Scale, 
  User, 
  ChevronRight,
  Plus,
  AlertCircle,
  Loader2,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import Link from "next/link";
import axios from "axios";
import { ContactsModal } from "@/components/ContactsModal";

interface Appointment {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  description: string;
  area: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contactsModalOpen, setContactsModalOpen] = useState(false);

  // Check authentication
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/login");
      return;
    }
  }, [session, status, router]);

  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!session?.user) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await axios.get('/api/appiontment');
        
        if (response.data && response.data.appiontments) {
          setAppointments(response.data.appiontments);
        }
      } catch (error: any) {
        console.error("Error fetching appointments:", error);
        setError(error.response?.data?.message || "Failed to load appointments");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchAppointments();
    }
  }, [session]);

  useEffect(() => {
    setMounted(true);
    // Set user from session
    if (session?.user) {
      setUser({
        // @ts-ignore - name exists in session
        name: session.user.name || "User",
        // @ts-ignore - email exists in session
        email: session.user.email || ""
      });
    }
  }, [session]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!mounted) return null;

  // Show loading while checking session
  if (status === "loading" || !mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

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
              <div className="flex gap-3">
                <ContactsModal open={contactsModalOpen} onOpenChange={setContactsModalOpen}>
                  <Button variant="outline" className="rounded-full h-12 px-6 font-bold">
                    <MessageSquare className="mr-2 h-4 w-4" /> View Contacts
                  </Button>
                </ContactsModal>
                <Button asChild className="rounded-full h-12 px-8 font-bold shadow-lg shadow-primary/20">
                  <Link href="/services#appointment">
                    <Plus className="mr-2 h-4 w-4" /> New Consultation
                  </Link>
                </Button>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-50 mb-1">User ID</p>
                    <p className="font-medium text-xs text-muted-foreground">{session?.user?.id || 'N/A'}</p>
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
                    <AlertCircle className="h-5 w-5 text-primary" /> Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Appointments</span>
                    <span className="font-bold text-lg">{appointments.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Pending</span>
                    <span className="font-bold text-yellow-500">
                      {appointments.filter(a => a.status.toLowerCase() === 'pending').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Confirmed</span>
                    <span className="font-bold text-green-500">
                      {appointments.filter(a => a.status.toLowerCase() === 'confirmed').length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-headline font-bold">My Appointments</h2>
                {/* @ts-ignore - role is added in session */}
                {session?.user?.role === "Admin" && (
                  <Link href="/admin" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">
                    Switch to Admin View
                  </Link>
                )}
              </div>

              {isLoading ? (
                <div className="flex justify-center py-24">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-center py-24 bg-card/10 rounded-[2rem] border-2 border-dashed border-red-500/20">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4 opacity-50" />
                  <p className="text-red-500 mb-2">Error loading appointments</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-24 bg-card/10 rounded-[2rem] border-2 border-dashed border-white/5">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground italic mb-4">No upcoming appointments found.</p>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link href="/services#appointment">Book Your First Consultation</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {appointments.map((apt, idx) => (
                    <FadeIn key={apt._id} delay={idx * 0.1}>
                      <Card className="bg-card/30 border-white/5 hover:border-primary/30 transition-all rounded-[2rem] overflow-hidden group">
                        <CardContent className="p-8">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                              <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                                <Scale className="h-7 w-7 text-primary" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
                                  {apt._id.slice(-8).toUpperCase()}
                                </p>
                                <h3 className="text-xl font-headline font-bold">{apt.area}</h3>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {apt.description}
                                </p>
                                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" /> {formatDate(apt.preferredDate)}
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5" /> {formatTime(apt.preferredTime)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="text-xs text-muted-foreground">
                                    Contact: {apt.phone}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                              <Badge variant="outline" className={getStatusColor(apt.status)}>
                                {apt.status}
                              </Badge>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="rounded-full h-10 w-10 border-white/10 group-hover:bg-primary group-hover:text-primary-foreground"
                                onClick={() => router.push(`/appointments/${apt._id}`)}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </FadeIn>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}