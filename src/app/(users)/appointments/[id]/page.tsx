// app/appointments/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { 
  Calendar,
  Clock,
  Scale,
  User,
  Mail,
  Phone,
  FileText,
  ArrowLeft,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
  Clock3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import Link from "next/link";
import axios from "axios";

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
  userId: string;
}

export default function AppointmentDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Check authentication
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/login");
      return;
    }
  }, [session, status, router]);

  // Fetch appointment details
  useEffect(() => {
    const fetchAppointment = async () => {
      if (!session?.user || !id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch all appointments and find the specific one
        // (since we don't have a single endpoint yet)
        const response = await axios.get('/api/appiontment');
        
        if (response.data && response.data.appiontments) {
          const found = response.data.appiontments.find(
            (apt: Appointment) => apt._id === id
          );
          
          if (found) {
            setAppointment(found);
          } else {
            setError("Appointment not found");
          }
        } else {
          setError("Failed to load appointment details");
        }
      } catch (error: any) {
        console.error("Error fetching appointment:", error);
        setError(error.response?.data?.message || "Failed to load appointment details");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchAppointment();
    }
  }, [session, id]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock3 className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      return new Date(timeString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return dateString;
    }
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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <FadeIn direction="down" className="mb-8">
            <Button
              variant="ghost"
              className="gap-2 hover:bg-transparent hover:text-primary"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </FadeIn>

          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <FadeIn>
              <Card className="bg-card/30 border-red-500/20 rounded-[2rem]">
                <CardContent className="p-12 text-center">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-headline font-bold mb-2">Error</h2>
                  <p className="text-muted-foreground mb-6">{error}</p>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link href="/dashboard">Return to Dashboard</Link>
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>
          ) : appointment ? (
            <>
              {/* Header */}
              <FadeIn direction="down" className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl md:text-4xl font-headline font-bold">
                        Appointment Details
                      </h1>
                      <Badge variant="outline" className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      ID: <span className="font-mono text-xs">{appointment._id}</span>
                    </p>
                  </div>
                  <Button 
                    asChild
                    size="lg"
                    className="rounded-full font-bold shadow-lg shadow-primary/20"
                  >
                    <Link href="/services#appointment">
                      Book Another Consultation
                    </Link>
                  </Button>
                </div>
              </FadeIn>

              {/* Main Content */}
              <div className="grid gap-8">
                {/* Status Card */}
                <FadeIn>
                  <Card className="bg-card/30 border-white/5 rounded-[2rem] overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(appointment.status)}
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Current Status</p>
                          <p className="text-2xl font-headline font-bold capitalize">{appointment.status}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>

                {/* Appointment Details */}
                <FadeIn delay={0.1}>
                  <Card className="bg-card/30 border-white/5 rounded-[2rem]">
                    <CardHeader>
                      <CardTitle className="text-xl font-headline font-bold flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Appointment Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold opacity-50 mb-2">Service Area</p>
                          <p className="font-medium text-lg">{appointment.area}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold opacity-50 mb-2">Created On</p>
                          <p className="font-medium">{formatDateTime(appointment.createdAt)}</p>
                        </div>
                      </div>

                      <Separator className="bg-white/5" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold opacity-50 mb-2 flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> Preferred Date
                            </p>
                            <p className="font-medium">{formatDate(appointment.preferredDate)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold opacity-50 mb-2 flex items-center gap-1">
                              <Clock className="h-3 w-3" /> Preferred Time
                            </p>
                            <p className="font-medium">{formatTime(appointment.preferredTime)}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>

                {/* Client Information */}
                <FadeIn delay={0.2}>
                  <Card className="bg-card/30 border-white/5 rounded-[2rem]">
                    <CardHeader>
                      <CardTitle className="text-xl font-headline font-bold flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Client Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold opacity-50 mb-2">Full Name</p>
                            <p className="font-medium">{appointment.firstName} {appointment.lastName}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold opacity-50 mb-2 flex items-center gap-1">
                              <Mail className="h-3 w-3" /> Email Address
                            </p>
                            <p className="font-medium">{appointment.email}</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold opacity-50 mb-2 flex items-center gap-1">
                              <Phone className="h-3 w-3" /> Phone Number
                            </p>
                            <p className="font-medium">{appointment.phone}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>

                {/* Case Description */}
                <FadeIn delay={0.3}>
                  <Card className="bg-card/30 border-white/5 rounded-[2rem]">
                    <CardHeader>
                      <CardTitle className="text-xl font-headline font-bold flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Case Description
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted/10 rounded-xl p-6">
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {appointment.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>

                {/* Actions */}
                <FadeIn delay={0.4}>
                  <div className="flex flex-col sm:flex-row gap-4 justify-end">
                    <Button 
                      variant="outline" 
                      className="rounded-full border-white/10 hover:bg-primary/10 hover:text-white"
                      onClick={() => router.back()}
                    >
                      Go Back
                    </Button>
                    <Button 
                      className="rounded-full font-bold shadow-lg shadow-primary/20"
                      asChild
                    >
                  
                    </Button>
                  </div>
                </FadeIn>
              </div>
            </>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}