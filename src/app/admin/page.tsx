
"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock, 
  MoreVertical, 
  Search, 
  ShieldCheck,
  TrendingUp,
  Mail,
  Phone,
  LayoutDashboard
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { FadeIn } from "@/components/FadeIn";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const mockUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", cases: 2, joinDate: "2024-01-15" },
    { id: 2, name: "Sarah Smith", email: "sarah.s@test.com", cases: 1, joinDate: "2024-02-10" },
    { id: 3, name: "Michael Wong", email: "m.wong@legal.com", cases: 3, joinDate: "2024-03-05" },
    { id: 4, name: "Elena Rodriguez", email: "elena.r@web.com", cases: 1, joinDate: "2024-04-22" },
  ];

  useEffect(() => {
    const saved = localStorage.getItem("mafhh_appointments");
    if (saved) {
      setAppointments(JSON.parse(saved));
    } else {
      const defaults = [
        { id: "APT-1001", client: "John Doe", service: "Small Claims Court", date: "2024-05-20", time: "10:30 AM", status: "Confirmed" },
        { id: "APT-1002", client: "Sarah Smith", service: "Landlord & Tenant", date: "2024-05-25", time: "2:00 PM", status: "Pending" },
        { id: "APT-1003", client: "John Doe", service: "Traffic Violations", date: "2024-06-02", time: "9:00 AM", status: "Pending" },
      ];
      setAppointments(defaults);
      localStorage.setItem("mafhh_appointments", JSON.stringify(defaults));
    }
  }, []);

  const updateStatus = (id: string, newStatus: string) => {
    const updated = appointments.map(apt => 
      apt.id === id ? { ...apt, status: newStatus } : apt
    );
    setAppointments(updated);
    localStorage.setItem("mafhh_appointments", JSON.stringify(updated));
    toast({
      title: "Status Updated",
      description: `Appointment ${id} is now ${newStatus}.`,
    });
  };

  const filteredAppointments = appointments.filter(apt => 
    apt.client.toLowerCase().includes(search.toLowerCase()) ||
    apt.service.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4">
          <FadeIn direction="down" className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-headline font-bold mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground text-sm">Managing Mafhh Legal operations and client matters.</p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" asChild className="rounded-full border-white/10">
                   <a href="/dashboard">View as User</a>
                </Button>
                <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: "Total Users", value: mockUsers.length, icon: Users, color: "text-blue-500" },
              { label: "Active Appointments", value: appointments.length, icon: Calendar, color: "text-green-500" },
              { label: "Pending Reviews", value: appointments.filter(a => a.status === 'Pending').length, icon: Clock, color: "text-yellow-500" },
              { label: "Success Rate", value: "94%", icon: TrendingUp, color: "text-primary" },
            ].map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.1}>
                <Card className="bg-card/40 border-white/5 backdrop-blur-sm rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                    <p className="text-3xl font-headline font-bold">{stat.value}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>

          <Tabs defaultValue="appointments" className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <TabsList className="bg-card/50 border border-white/10 p-1 rounded-xl">
                <TabsTrigger value="appointments" className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">Appointments</TabsTrigger>
                <TabsTrigger value="users" className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">Client List</TabsTrigger>
              </TabsList>

              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search records..." 
                  className="pl-10 bg-card/30 border-white/10 rounded-full h-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <TabsContent value="appointments" className="m-0">
              <div className="grid gap-4">
                {filteredAppointments.map((apt, idx) => (
                  <FadeIn key={apt.id} delay={idx * 0.05}>
                    <Card className="bg-card/20 border-white/5 hover:border-primary/20 transition-all rounded-2xl group">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-muted/50 rounded-xl flex items-center justify-center font-bold text-primary border border-white/5">
                              {apt.client.charAt(0)}
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{apt.id}</p>
                              <h3 className="text-lg font-headline font-bold">{apt.client}</h3>
                              <p className="text-sm text-muted-foreground">{apt.service}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-center">
                            <div className="hidden md:block">
                              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Schedule</p>
                              <div className="flex flex-col text-sm">
                                <span className="flex items-center gap-2"><Calendar className="h-3 w-3" /> {apt.date}</span>
                                <span className="flex items-center gap-2"><Clock className="h-3 w-3" /> {apt.time}</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Status</p>
                              <Badge variant="outline" className={cn(
                                "border-none",
                                apt.status === 'Confirmed' ? 'bg-green-500/10 text-green-500' : 
                                apt.status === 'Cancelled' ? 'bg-red-500/10 text-red-500' : 
                                'bg-yellow-500/10 text-yellow-500'
                              )}>
                                {apt.status}
                              </Badge>
                            </div>
                            <div className="flex justify-end">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-white/10">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-card border-white/10 rounded-xl">
                                  <DropdownMenuItem onClick={() => updateStatus(apt.id, 'Confirmed')} className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" /> Confirm
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => updateStatus(apt.id, 'Cancelled')} className="flex items-center gap-2 text-red-500">
                                    <ShieldCheck className="h-4 w-4" /> Cancel
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" /> Contact Client
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </FadeIn>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="users" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockUsers.map((user, i) => (
                  <FadeIn key={user.id} delay={i * 0.1}>
                    <Card className="bg-card/20 border-white/5 rounded-2xl overflow-hidden group hover:border-primary/20 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="h-14 w-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-xl">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-headline font-bold text-lg">{user.name}</h3>
                            <p className="text-xs text-muted-foreground">Joined {user.joinDate}</p>
                          </div>
                        </div>
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4 text-primary" /> {user.email}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <LayoutDashboard className="h-4 w-4 text-primary" /> {user.cases} active cases
                          </div>
                        </div>
                        <Button variant="outline" className="w-full rounded-xl border-white/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                          View Full Profile
                        </Button>
                      </CardContent>
                    </Card>
                  </FadeIn>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
