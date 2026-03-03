"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  LayoutDashboard,
  X,
  User as UserIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  FileText,
  AlertCircle,
  Loader2,
  Eye,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Star,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Home,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Award,
  Target,
  Users2,
  UserPlus,
  UserCheck,
  UserX,
  Briefcase,
  FolderOpen,
  FileCheck,
  FileX,
  Timer,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  Menu,
  Inbox,
  Send,
  Reply
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FadeIn } from "@/components/FadeIn";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

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
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  Inquiry: string;
  status: "Pending" | "Progress" | "Rejected" | "Completed";
  createdAt: string;
  userId?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Modal states
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Check authentication and admin role
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/login");
      return;
    }
    
    // @ts-ignore - role is added in session callback
    if (session.user?.role !== "Admin") {
      router.push("/dashboard");
      return;
    }
  }, [session, status, router]);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch appointments
        const appointmentsRes = await axios.get('/api/admin/appiontment');
        if (appointmentsRes.data && appointmentsRes.data.appiontments) {
          setAppointments(appointmentsRes.data.appiontments);
        }
        
        // Fetch contacts
        const contactsRes = await axios.get('/api/admin/contact');
        if (contactsRes.data && contactsRes.data.contacts) {
          setContacts(contactsRes.data.contacts);
        }
        
        // Fetch users
        const usersRes = await axios.get('/api/admin/users');
        if (usersRes.data && usersRes.data.users) {
          setUsers(usersRes.data.users);
        }
        
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.response?.data?.message || "Failed to load data");
        toast({
          title: "Error",
          description: "Failed to load admin data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchData();
    }
  }, [session, toast]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update contact status
  const updateContactStatus = async (id: string, newStatus: string) => {
    try {
      setUpdatingStatus(id);
      
      const response = await axios.patch(`/api/admin/contact/${id}`, {
        status: newStatus
      });
      
      if (response.status === 200) {
        // Update local state
        setContacts(prev => 
          prev.map(contact => 
            contact._id === id ? { ...contact, status: newStatus as any } : contact
          )
        );
        
        toast({
          title: "Status Updated",
          description: `Contact inquiry is now ${newStatus}.`,
        });

        // If modal is open, update selected contact
        if (selectedContact?._id === id) {
          setSelectedContact({ ...selectedContact, status: newStatus as any });
        }
      }
    } catch (error: any) {
      console.error("Error updating contact status:", error);
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Failed to update status",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Update appointment status
  const updateAppointmentStatus = async (id: string, newStatus: string) => {
    try {
      setUpdatingStatus(id);
      
      const response = await axios.patch(`/api/admin/appiontment/${id}`, {
        status: newStatus
      });
      
      if (response.status === 200) {
        setAppointments(prev => 
          prev.map(apt => 
            apt._id === id ? { ...apt, status: newStatus } : apt
          )
        );
        
        toast({
          title: "Status Updated",
          description: `Appointment is now ${newStatus}.`,
        });

        if (selectedAppointment?._id === id) {
          setSelectedAppointment({ ...selectedAppointment, status: newStatus });
        }
      }
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Failed to update status",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'progress':
        return <Timer className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'rejected':
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20';
      case 'progress':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
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

  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return formatDate(dateString);
    } catch {
      return dateString;
    }
  };

  // Filter and sort appointments
  const filteredAppointments = appointments
    .filter(apt => {
      const fullName = `${apt.firstName} ${apt.lastName}`.toLowerCase();
      const creatorName = apt.userId ? `${apt.userId.firstName} ${apt.userId.lastName}`.toLowerCase() : '';
      const serviceName = apt.area.toLowerCase();
      const email = apt.email.toLowerCase();
      const searchTerm = search.toLowerCase();
      
      const matchesSearch = fullName.includes(searchTerm) || 
                           creatorName.includes(searchTerm) || 
                           serviceName.includes(searchTerm) || 
                           email.includes(searchTerm);
      
      const matchesStatus = statusFilter === "all" || apt.status.toLowerCase() === statusFilter.toLowerCase();
      
      let matchesDate = true;
      if (dateRange !== "all") {
        const aptDate = new Date(apt.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - aptDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (dateRange === "today" && diffDays > 0) matchesDate = false;
        if (dateRange === "week" && diffDays > 7) matchesDate = false;
        if (dateRange === "month" && diffDays > 30) matchesDate = false;
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "status") {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

  // Filter contacts
  const filteredContacts = contacts
    .filter(contact => {
      const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
      const email = contact.email.toLowerCase();
      const subject = contact.subject.toLowerCase();
      const searchTerm = search.toLowerCase();
      
      const matchesSearch = fullName.includes(searchTerm) || 
                           email.includes(searchTerm) || 
                           subject.includes(searchTerm);
      
      const matchesStatus = statusFilter === "all" || contact.status.toLowerCase() === statusFilter.toLowerCase();
      
      let matchesDate = true;
      if (dateRange !== "all") {
        const contactDate = new Date(contact.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - contactDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (dateRange === "today" && diffDays > 0) matchesDate = false;
        if (dateRange === "week" && diffDays > 7) matchesDate = false;
        if (dateRange === "month" && diffDays > 30) matchesDate = false;
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return 0;
    });

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = user.email.toLowerCase();
    const searchTerm = search.toLowerCase();
    
    return fullName.includes(searchTerm) || email.includes(searchTerm);
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);
  const currentContacts = filteredContacts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = activeTab === "appointments" 
    ? Math.ceil(filteredAppointments.length / itemsPerPage)
    : Math.ceil(filteredContacts.length / itemsPerPage);

  // Stats calculations
  const totalUsers = users.length;
  const totalAppointments = appointments.length;
  const totalContacts = contacts.length;
  const pendingAppointments = appointments.filter(a => a.status === 'Pending').length;
  const progressAppointments = appointments.filter(a => a.status === 'Progress').length;
  const completedAppointments = appointments.filter(a => a.status === 'Completed').length;
  const rejectedAppointments = appointments.filter(a => a.status === 'Rejected').length;
  
  const pendingContacts = contacts.filter(c => c.status === 'Pending').length;
  const progressContacts = contacts.filter(c => c.status === 'Progress').length;
  const completedContacts = contacts.filter(c => c.status === 'Completed').length;
  const rejectedContacts = contacts.filter(c => c.status === 'Rejected').length;
  
  const appointmentsByStatus = [
    { name: 'Pending', value: pendingAppointments, color: '#EAB308' },
    { name: 'Progress', value: progressAppointments, color: '#3B82F6' },
    { name: 'Completed', value: completedAppointments, color: '#22C55E' },
    { name: 'Rejected', value: rejectedAppointments, color: '#EF4444' },
  ];

  const contactsByStatus = [
    { name: 'Pending', value: pendingContacts, color: '#EAB308' },
    { name: 'Progress', value: progressContacts, color: '#3B82F6' },
    { name: 'Completed', value: completedContacts, color: '#22C55E' },
    { name: 'Rejected', value: rejectedContacts, color: '#EF4444' },
  ];

  const appointmentsByArea = appointments.reduce((acc: any, apt) => {
    acc[apt.area] = (acc[apt.area] || 0) + 1;
    return acc;
  }, {});

  const areaChartData = Object.keys(appointmentsByArea).map(area => ({
    name: area.length > 20 ? area.substring(0, 20) + '...' : area,
    value: appointmentsByArea[area]
  }));

  if (!mounted) return null;

  // Show loading while checking session
  if (status === "loading" || !mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground animate-pulse">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />

      <main className="flex-1 pt-24 pb-24">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <FadeIn direction="down" className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-headline font-bold bg-gradient-to-r from-primary via-yellow-400 to-secondary bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
                    <span>Welcome back, {session?.user?.name || 'Admin'}</span>
                    <span className="text-primary">•</span>
                    <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="rounded-full border-white/10 hover:bg-primary/10 hover:text-white transition-all duration-300"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </FadeIn>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <FadeIn delay={0.1}>
              <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 backdrop-blur-sm rounded-2xl hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/40 transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="outline" className="bg-primary/10 border-primary/20">Total</Badge>
                  </div>
                  <p className="text-3xl font-headline font-bold mb-1">{totalUsers}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Registered Clients</p>
                  <div className="mt-4 h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-primary rounded-full transition-all duration-500" />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20 backdrop-blur-sm rounded-2xl hover:shadow-2xl hover:shadow-green-500/10 hover:border-green-500/40 transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Calendar className="h-6 w-6 text-green-500" />
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 border-green-500/20">Active</Badge>
                  </div>
                  <p className="text-3xl font-headline font-bold mb-1">{totalAppointments}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Appointments</p>
                  <div className="mt-4 flex gap-1">
                    <div className="h-1.5 flex-1 bg-green-500/20 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-green-500 rounded-full transition-all duration-500" />
                    </div>
                    <div className="h-1.5 flex-1 bg-green-500/20 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-green-500/50 rounded-full transition-all duration-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.3}>
              <Card className="bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/20 backdrop-blur-sm rounded-2xl hover:shadow-2xl hover:shadow-yellow-500/10 hover:border-yellow-500/40 transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 bg-yellow-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <MessageSquare className="h-6 w-6 text-yellow-500" />
                    </div>
                    <Badge variant="outline" className="bg-yellow-500/10 border-yellow-500/20">Inquiries</Badge>
                  </div>
                  <p className="text-3xl font-headline font-bold mb-1">{totalContacts}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Contact Forms</p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="h-2 flex-1 bg-yellow-500/20 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-yellow-500 rounded-full animate-pulse" />
                    </div>
                    <span className="text-xs font-bold text-yellow-500">{pendingContacts} pending</span>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.4}>
              <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20 backdrop-blur-sm rounded-2xl hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/40 transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <TrendingUp className="h-6 w-6 text-blue-500" />
                    </div>
                    <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20">Rate</Badge>
                  </div>
                  <p className="text-3xl font-headline font-bold mb-1">
                    {Math.round(((completedAppointments + completedContacts) / (totalAppointments + totalContacts)) * 100) || 0}%
                  </p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Completion Rate</p>
                  <div className="mt-4 flex justify-between items-center text-xs">
                    <span className="text-green-500 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> {completedAppointments + completedContacts}</span>
                    <span className="text-red-500 flex items-center gap-1"><XCircle className="h-3 w-3" /> {rejectedAppointments + rejectedContacts}</span>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <FadeIn delay={0.5} className="lg:col-span-2">
              <Card className="bg-card/40 border-white/5 backdrop-blur-sm rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-white/5 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-headline font-bold flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Appointments by Area
                    </CardTitle>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-32 h-8 text-xs bg-background/50 border-white/10">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={areaChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          stroke="#ffffff50" 
                          tick={{ fill: '#ffffff70', fontSize: 11 }} 
                          axisLine={{ stroke: '#ffffff20' }}
                          tickLine={false}
                        />
                        <YAxis 
                          stroke="#ffffff50" 
                          tick={{ fill: '#ffffff70', fontSize: 11 }} 
                          axisLine={{ stroke: '#ffffff20' }}
                          tickLine={false}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: '1px solid #374151',
                            borderRadius: '12px',
                            color: '#f9fafb',
                            padding: '12px 16px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                          }}
                          itemStyle={{ color: '#f9fafb', fontWeight: 600 }}
                          cursor={{ fill: '#ffffff10' }}
                        />
                        <Bar 
                          dataKey="value" 
                          fill="#8B5CF6" 
                          radius={[6, 6, 0, 0]}
                          animationBegin={0}
                          animationDuration={800}
                          maxBarSize={50}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.6}>
              <Card className="bg-card/40 border-white/5 backdrop-blur-sm rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-white/5 pb-4">
                  <CardTitle className="text-lg font-headline font-bold flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-72 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={appointmentsByStatus}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          animationBegin={0}
                          animationDuration={800}
                          style={{ cursor: 'pointer' }}
                        >
                          {appointmentsByStatus.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color}
                              stroke="transparent"
                              style={{ 
                                filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.3))',
                                transform: 'scale(1)',
                                transformOrigin: 'center',
                                transition: 'all 0.3s ease'
                              }}
                              className="transition-all duration-300 hover:opacity-80 hover:scale-105"
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: '1px solid #374151',
                            borderRadius: '12px',
                            color: '#f9fafb',
                            padding: '12px 16px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                          }}
                          itemStyle={{ color: '#f9fafb', fontWeight: 600 }}
                          labelStyle={{ color: '#d1d5db', marginBottom: '4px' }}
                          formatter={(value: number, name: string) => [
                            `${value} ${name}`,
                            name
                          ]}
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                    {/* Center text */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                      <p className="text-3xl font-bold text-foreground">{totalAppointments}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {appointmentsByStatus.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center gap-2 text-xs p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
                      >
                        <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground">{item.name}:</span>
                        <span className="font-bold text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="appointments" className="space-y-8" onValueChange={setActiveTab}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <TabsList className="bg-card/50 border border-white/10 p-1 rounded-xl shadow-lg">
                <TabsTrigger value="overview" className="rounded-lg px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold transition-all duration-300 hover:bg-primary/20">
                  <Activity className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="appointments" className="rounded-lg px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold transition-all duration-300 hover:bg-primary/20">
                  <Calendar className="h-4 w-4 mr-2" />
                  Appointments ({filteredAppointments.length})
                </TabsTrigger>
                <TabsTrigger value="contacts" className="rounded-lg px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold transition-all duration-300 hover:bg-primary/20">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contacts ({filteredContacts.length})
                </TabsTrigger>
                <TabsTrigger value="users" className="rounded-lg px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold transition-all duration-300 hover:bg-primary/20">
                  <Users className="h-4 w-4 mr-2" />
                  Clients ({filteredUsers.length})
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-3">
                {/* Filters */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32 h-10 text-sm bg-background/50 border-white/10 rounded-full">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="progress">Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-32 h-10 text-sm bg-background/50 border-white/10 rounded-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>

                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name, email, subject..." 
                    className="pl-10 bg-background/50 border-white/10 rounded-full h-10 text-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FadeIn>
                  <Card className="bg-card/40 border-white/5 backdrop-blur-sm rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-lg font-headline font-bold flex items-center gap-2">
                        <Users2 className="h-5 w-5 text-primary" />
                        Recent Clients
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {users.slice(0, 5).map((user, idx) => (
                          <div key={user._id} className="flex items-center justify-between p-3 bg-muted/10 rounded-xl hover:bg-primary/5 transition-all cursor-pointer" onClick={() => {
                            setSelectedUser(user);
                            setIsUserModalOpen(true);
                          }}>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold">
                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium">{user.firstName} {user.lastName}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {formatRelativeTime(user.createdAt)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>

                <FadeIn delay={0.1}>
                  <Card className="bg-card/40 border-white/5 backdrop-blur-sm rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-lg font-headline font-bold flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Recent Contacts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {contacts.slice(0, 5).map((contact, idx) => (
                          <div key={contact._id} className="flex items-start gap-3 p-3 bg-muted/10 rounded-xl hover:bg-primary/5 transition-all cursor-pointer" onClick={() => {
                            setSelectedContact(contact);
                            setIsContactModalOpen(true);
                          }}>
                            <div className="mt-1">{getStatusIcon(contact.status)}</div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {contact.firstName} {contact.lastName} - {contact.subject}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {contact.email}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatRelativeTime(contact.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              </div>
            </TabsContent>

            {/* Appointments Tab */}
            <TabsContent value="appointments" className="m-0">
              {isLoading ? (
                <div className="flex justify-center py-24">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-center py-24 bg-card/10 rounded-[2rem] border-2 border-dashed border-red-500/20">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-500 mb-2">Error loading appointments</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4 rounded-full"
                    onClick={() => window.location.reload()}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              ) : filteredAppointments.length === 0 ? (
                <div className="text-center py-24 bg-card/10 rounded-[2rem] border-2 border-dashed border-white/5">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground italic mb-4">No appointments found.</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-4">
                    {currentAppointments.map((apt, idx) => (
                      <FadeIn key={apt._id} delay={idx * 0.05}>
                        <Card 
                          className="bg-gradient-to-r from-card/30 to-card/10 border-white/5 hover:border-primary/30 hover:shadow-xl transition-all rounded-2xl overflow-hidden group cursor-pointer"
                          onClick={() => {
                            setSelectedAppointment(apt);
                            setIsAppointmentModalOpen(true);
                          }}
                        >
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                              <div className="flex items-start gap-4">
                                <div className="h-14 w-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg">
                                  {apt.firstName?.charAt(0)}{apt.lastName?.charAt(0)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <p className="text-xs font-bold text-primary uppercase tracking-widest">
                                      {apt._id.slice(-8).toUpperCase()}
                                    </p>
                                    <Badge variant="outline" className={getStatusColor(apt.status)}>
                                      {getStatusIcon(apt.status)}
                                      <span className="ml-1">{apt.status}</span>
                                    </Badge>
                                  </div>
                                  <h3 className="text-lg font-headline font-bold">
                                    {apt.firstName} {apt.lastName}
                                  </h3>
                                  <p className="text-sm text-muted-foreground mb-2">{apt.area}</p>
                                  
                                  {/* Creator Info */}
                                  <div className="flex items-center gap-2 text-xs bg-muted/10 p-2 rounded-lg inline-flex">
                                    <UserIcon className="h-3 w-3 text-primary" />
                                    <span className="text-muted-foreground">Created by:</span>
                                    <span className="font-medium">
                                      {apt.userId?.firstName} {apt.userId?.lastName}
                                    </span>
                                    <span className="text-muted-foreground">•</span>
                                    <span className="text-muted-foreground">{formatRelativeTime(apt.createdAt)}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-6">
                                <div className="hidden lg:block text-right">
                                  <p className="text-xs text-muted-foreground mb-1">Preferred Date</p>
                                  <p className="text-sm font-medium">{formatDate(apt.preferredDate)}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(apt.preferredTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                  </p>
                                </div>
                                
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-white/10">
                                      {updatingStatus === apt._id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <MoreVertical className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="bg-card border-white/10 rounded-xl w-52 shadow-2xl shadow-black/20">
                                    <DropdownMenuLabel className="text-muted-foreground">Update Status</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateAppointmentStatus(apt._id, 'Progress');
                                      }}
                                      className="flex items-center gap-3 cursor-pointer rounded-lg mx-1 my-0.5 p-2 hover:bg-blue-500/20 focus:bg-blue-500/20 transition-colors"
                                    >
                                      <Timer className="h-4 w-4 text-blue-500" />
                                      <span className="text-blue-400 font-medium">In Progress</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateAppointmentStatus(apt._id, 'Completed');
                                      }}
                                      className="flex items-center gap-3 cursor-pointer rounded-lg mx-1 my-0.5 p-2 hover:bg-green-500/20 focus:bg-green-500/20 transition-colors"
                                    >
                                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                                      <span className="text-green-400 font-medium">Completed</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateAppointmentStatus(apt._id, 'Rejected');
                                      }}
                                      className="flex items-center gap-3 cursor-pointer rounded-lg mx-1 my-0.5 p-2 hover:bg-red-500/20 focus:bg-red-500/20 transition-colors"
                                    >
                                      <XCircle className="h-4 w-4 text-red-500" />
                                      <span className="text-red-400 font-medium">Rejected</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.location.href = `mailto:${apt.email}`;
                                      }}
                                      className="flex items-center gap-3 cursor-pointer rounded-lg mx-1 my-0.5 p-2 hover:bg-primary/20 focus:bg-primary/20 transition-colors"
                                    >
                                      <Mail className="h-4 w-4 text-primary" />
                                      <span className="font-medium">Email Client</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </FadeIn>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && activeTab === "appointments" && (
                    <div className="flex items-center justify-between mt-8">
                      <p className="text-sm text-muted-foreground">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredAppointments.length)} of {filteredAppointments.length} appointments
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full h-10 w-10 border-white/10"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full h-10 w-10 border-white/10"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            {/* Contacts Tab */}
            <TabsContent value="contacts" className="m-0">
              {isLoading ? (
                <div className="flex justify-center py-24">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="text-center py-24 bg-card/10 rounded-[2rem] border-2 border-dashed border-white/5">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground italic mb-4">No contact inquiries found.</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-4">
                    {currentContacts.map((contact, idx) => (
                      <FadeIn key={contact._id} delay={idx * 0.05}>
                        <Card 
                          className="bg-gradient-to-r from-card/30 to-card/10 border-white/5 hover:border-primary/30 hover:shadow-xl transition-all rounded-2xl overflow-hidden group cursor-pointer"
                          onClick={() => {
                            setSelectedContact(contact);
                            setIsContactModalOpen(true);
                          }}
                        >
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                              <div className="flex items-start gap-4 flex-1">
                                <div className="h-14 w-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg">
                                  {contact.firstName?.charAt(0)}{contact.lastName?.charAt(0)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <p className="text-xs font-bold text-primary uppercase tracking-widest">
                                      {contact._id.slice(-8).toUpperCase()}
                                    </p>
                                    <Badge variant="outline" className={getStatusColor(contact.status)}>
                                      {getStatusIcon(contact.status)}
                                      <span className="ml-1">{contact.status}</span>
                                    </Badge>
                                  </div>
                                  
                                  <h3 className="text-lg font-headline font-bold">
                                    {contact.firstName} {contact.lastName}
                                  </h3>
                                  
                                  <p className="text-sm font-medium text-primary mt-1">
                                    {contact.subject}
                                  </p>
                                  
                                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                    {contact.Inquiry}
                                  </p>
                                  
                                  <div className="flex flex-wrap items-center gap-4 mt-3">
                                    <div className="flex items-center gap-2 text-xs bg-muted/10 px-3 py-1.5 rounded-full">
                                      <Mail className="h-3 w-3 text-primary" />
                                      <span>{contact.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs bg-muted/10 px-3 py-1.5 rounded-full">
                                      <Phone className="h-3 w-3 text-primary" />
                                      <span>{contact.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs bg-muted/10 px-3 py-1.5 rounded-full">
                                      <Clock className="h-3 w-3 text-primary" />
                                      <span>{formatRelativeTime(contact.createdAt)}</span>
                                    </div>
                                  </div>
                                  
                                  {contact.userId && (
                                    <div className="flex items-center gap-2 text-xs bg-muted/10 p-2 rounded-lg inline-flex mt-3">
                                      <UserIcon className="h-3 w-3 text-primary" />
                                      <span className="text-muted-foreground">Submitted by:</span>
                                      <span className="font-medium">
                                        {contact.userId.firstName} {contact.userId.lastName}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-3 lg:self-center">
                                {/* <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-full border-white/10 hover:bg-primary/10"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.location.href = `mailto:${contact.email}?subject=Re: ${contact.subject}`;
                                  }}
                                >
                                  <Reply className="h-3 w-3 mr-2" />
                                  Reply
                                </Button>
                                 */}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-white/10">
                                      {updatingStatus === contact._id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <MoreVertical className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="bg-card border-white/10 rounded-xl w-48">
                                    <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateContactStatus(contact._id, 'Progress');
                                      }}
                                      className="flex items-center gap-2 cursor-pointer"
                                    >
                                      <Timer className="h-4 w-4 text-blue-500" />
                                      In Progress
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateContactStatus(contact._id, 'Completed');
                                      }}
                                      className="flex items-center gap-2 cursor-pointer"
                                    >
                                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                                      Completed
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateContactStatus(contact._id, 'Rejected');
                                      }}
                                      className="flex items-center gap-2 cursor-pointer text-red-500"
                                    >
                                      <XCircle className="h-4 w-4" />
                                      Rejected
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.location.href = `mailto:${contact.email}`;
                                      }}
                                      className="flex items-center gap-2 cursor-pointer"
                                    >
                                      <Mail className="h-4 w-4" />
                                      Send Email
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </FadeIn>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && activeTab === "contacts" && (
                    <div className="flex items-center justify-between mt-8">
                      <p className="text-sm text-muted-foreground">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredContacts.length)} of {filteredContacts.length} contacts
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full h-10 w-10 border-white/10"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full h-10 w-10 border-white/10"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="m-0">
              {isLoading ? (
                <div className="flex justify-center py-24">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-24 bg-card/10 rounded-[2rem] border-2 border-dashed border-white/5">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground italic">No users found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUsers.map((user, i) => {
                    const userAppointments = appointments.filter(apt => apt.userId?._id === user._id);
                    const userContacts = contacts.filter(contact => contact.userId?._id === user._id);
                    
                    return (
                      <FadeIn key={user._id} delay={i * 0.1}>
                        <Card 
                          className="bg-gradient-to-br from-card/40 to-card/10 border-white/5 rounded-2xl overflow-hidden group hover:border-primary/30 hover:shadow-xl transition-all cursor-pointer"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsUserModalOpen(true);
                          }}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-6">
                              <div className="h-16 w-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                              </div>
                              <div>
                                <h3 className="font-headline font-bold text-lg">{user.firstName} {user.lastName}</h3>
                                <Badge variant="outline" className="mt-2 bg-primary/10 border-primary/20">
                                  {user.role}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="space-y-3 mb-6">
                              <div className="flex items-center gap-3 text-sm p-3 bg-muted/10 rounded-xl">
                                <Mail className="h-4 w-4 text-primary" />
                                <span className="text-muted-foreground truncate">{user.email}</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm p-3 bg-muted/10 rounded-xl">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span className="text-muted-foreground">Joined {formatRelativeTime(user.createdAt)}</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm p-3 bg-muted/10 rounded-xl">
                                <Briefcase className="h-4 w-4 text-primary" />
                                <span className="text-muted-foreground">{userAppointments.length} appointments</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm p-3 bg-muted/10 rounded-xl">
                                <MessageSquare className="h-4 w-4 text-primary" />
                                <span className="text-muted-foreground">{userContacts.length} inquiries</span>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                className="flex-1 rounded-xl border-white/10 hover:bg-primary hover:text-white transition-all"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.location.href = `mailto:${user.email}`;
                                }}
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Email
                              </Button>
                              <Button 
                                variant="outline" 
                                className="flex-1 rounded-xl border-white/10 hover:bg-primary hover:text-white transition-all"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedUser(user);
                                  setIsUserModalOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </FadeIn>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Appointment Details Modal */}
      <Dialog open={isAppointmentModalOpen} onOpenChange={setIsAppointmentModalOpen}>
        <DialogContent className="bg-gradient-to-br from-background via-background to-primary/5 border-white/10 max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold flex items-center gap-2">
              <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              Appointment Details
            </DialogTitle>
            <DialogDescription>
              Full information about the appointment and client
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-6 py-4">
              {/* Header with Status */}
              <div className="flex justify-between items-center p-4 bg-muted/10 rounded-xl">
                <div className="flex items-center gap-3">
                  {getStatusIcon(selectedAppointment.status)}
                  <div>
                    <p className="text-xs text-muted-foreground">Current Status</p>
                    <Badge variant="outline" className={getStatusColor(selectedAppointment.status)}>
                      {selectedAppointment.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  ID: {selectedAppointment._id}
                </p>
              </div>

              {/* Client Information */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Client Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/10 rounded-xl p-4">
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground mb-1">Full Name</p>
                    <p className="font-medium text-lg">{selectedAppointment.firstName} {selectedAppointment.lastName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground mb-1">Email</p>
                    <p className="font-medium flex items-center gap-2">
                      <Mail className="h-3 w-3 text-primary" /> {selectedAppointment.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground mb-1">Phone</p>
                    <p className="font-medium flex items-center gap-2">
                      <Phone className="h-3 w-3 text-primary" /> {selectedAppointment.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Creator Information */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Created By
                </h3>
                <div className="bg-muted/10 rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold">
                      {selectedAppointment.userId?.firstName?.charAt(0)}{selectedAppointment.userId?.lastName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{selectedAppointment.userId?.firstName} {selectedAppointment.userId?.lastName}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Mail className="h-3 w-3" /> {selectedAppointment.userId?.email}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Created on: {formatDateTime(selectedAppointment.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Appointment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/10 rounded-xl p-4">
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground mb-1">Service Area</p>
                    <p className="font-medium">{selectedAppointment.area}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground mb-1">Preferred Date</p>
                    <p className="font-medium flex items-center gap-2">
                      <CalendarIcon className="h-3 w-3 text-primary" /> {formatDate(selectedAppointment.preferredDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground mb-1">Preferred Time</p>
                    <p className="font-medium flex items-center gap-2">
                      <ClockIcon className="h-3 w-3 text-primary" /> {
                        new Date(selectedAppointment.preferredTime).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit', 
                          hour12: true 
                        })
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Case Description
                </h3>
                <div className="bg-muted/10 rounded-xl p-4">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{selectedAppointment.description}</p>
                </div>
              </div>

              {/* Status Update */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Update Status
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-full border-blue-500/20 hover:bg-blue-500/10"
                    onClick={() => {
                      updateAppointmentStatus(selectedAppointment._id, 'Progress');
                    }}
                  >
                    <Timer className="h-4 w-4 mr-2 text-blue-500" />
                    In Progress
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-full border-green-500/20 hover:bg-green-500/10"
                    onClick={() => {
                      updateAppointmentStatus(selectedAppointment._id, 'Completed');
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    Completed
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-full border-red-500/20 hover:bg-red-500/10"
                    onClick={() => {
                      updateAppointmentStatus(selectedAppointment._id, 'Rejected');
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                    Rejected
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <DialogFooter className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    window.location.href = `mailto:${selectedAppointment.email}`;
                  }}
                  className="rounded-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Client
                </Button>
                <Button
                  onClick={() => setIsAppointmentModalOpen(false)}
                  className="rounded-full bg-primary hover:bg-primary/90"
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Details Modal */}
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="bg-gradient-to-br from-background via-background to-primary/5 border-white/10 max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold flex items-center gap-2">
              <div className="h-10 w-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-yellow-500" />
              </div>
              Contact Inquiry Details
            </DialogTitle>
            <DialogDescription>
              Full information about the contact inquiry
            </DialogDescription>
          </DialogHeader>
          
          {selectedContact && (
            <div className="space-y-6 py-4">
              {/* Header with Status */}
              <div className="flex justify-between items-center p-4 bg-muted/10 rounded-xl">
                <div className="flex items-center gap-3">
                  {getStatusIcon(selectedContact.status)}
                  <div>
                    <p className="text-xs text-muted-foreground">Current Status</p>
                    <Badge variant="outline" className={getStatusColor(selectedContact.status)}>
                      {selectedContact.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  ID: {selectedContact._id}
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/10 rounded-xl p-4">
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground mb-1">Full Name</p>
                    <p className="font-medium text-lg">{selectedContact.firstName} {selectedContact.lastName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground mb-1">Email</p>
                    <p className="font-medium flex items-center gap-2">
                      <Mail className="h-3 w-3 text-primary" /> {selectedContact.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground mb-1">Phone</p>
                    <p className="font-medium flex items-center gap-2">
                      <Phone className="h-3 w-3 text-primary" /> {selectedContact.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground mb-1">Submitted On</p>
                    <p className="font-medium flex items-center gap-2">
                      <Clock className="h-3 w-3 text-primary" /> {formatDateTime(selectedContact.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Subject
                </h3>
                <div className="bg-muted/10 rounded-xl p-4">
                  <p className="font-medium">{selectedContact.subject}</p>
                </div>
              </div>

              {/* Inquiry */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Inquiry Details
                </h3>
                <div className="bg-muted/10 rounded-xl p-4">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{selectedContact.Inquiry}</p>
                </div>
              </div>

              {/* User Information (if logged in) */}
              {selectedContact.userId && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Submitted By (Registered User)
                  </h3>
                  <div className="bg-muted/10 rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold">
                        {selectedContact.userId.firstName?.charAt(0)}{selectedContact.userId.lastName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{selectedContact.userId.firstName} {selectedContact.userId.lastName}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <Mail className="h-3 w-3" /> {selectedContact.userId.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Update */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Update Status
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-full border-blue-500/20 hover:bg-blue-500/10"
                    onClick={() => {
                      updateContactStatus(selectedContact._id, 'Progress');
                    }}
                  >
                    <Timer className="h-4 w-4 mr-2 text-blue-500" />
                    In Progress
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-full border-green-500/20 hover:bg-green-500/10"
                    onClick={() => {
                      updateContactStatus(selectedContact._id, 'Completed');
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    Completed
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-full border-red-500/20 hover:bg-red-500/10"
                    onClick={() => {
                      updateContactStatus(selectedContact._id, 'Rejected');
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                    Rejected
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <DialogFooter className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    window.location.href = `mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`;
                  }}
                  className="rounded-full"
                >
                  <Reply className="h-4 w-4 mr-2" />
                  Reply via Email
                </Button>
                <Button
                  onClick={() => setIsContactModalOpen(false)}
                  className="rounded-full bg-primary hover:bg-primary/90"
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* User Details Modal */}
      <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <DialogContent className="bg-gradient-to-br from-background via-background to-primary/5 border-white/10 max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold flex items-center gap-2">
              <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-primary" />
              </div>
              User Profile
            </DialogTitle>
            <DialogDescription>
              Detailed information about the client
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6 py-4">
              {/* User Header */}
              <div className="flex items-center gap-6 p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
                <div className="h-20 w-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-xl">
                  {selectedUser.firstName?.charAt(0)}{selectedUser.lastName?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-headline font-bold">{selectedUser.firstName} {selectedUser.lastName}</h3>
                  <Badge variant="outline" className="mt-2 bg-primary/10 border-primary/20">
                    {selectedUser.role}
                  </Badge>
                </div>
              </div>

              {/* User Details */}
              <div className="grid grid-cols-1 gap-4 bg-muted/10 rounded-xl p-4">
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground mb-1 flex items-center gap-1">
                    <Mail className="h-3 w-3" /> Email Address
                  </p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Account Created
                  </p>
                  <p className="font-medium">{formatDateTime(selectedUser.createdAt)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground mb-1 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> User ID
                  </p>
                  <p className="font-mono text-xs">{selectedUser._id}</p>
                </div>
              </div>

              {/* Client Appointments */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Appointments ({appointments.filter(apt => apt.userId?._id === selectedUser._id).length})
                </h3>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                  {appointments
                    .filter(apt => apt.userId?._id === selectedUser._id)
                    .map(apt => (
                      <div key={apt._id} 
                        className="bg-muted/5 rounded-xl p-3 flex justify-between items-center hover:bg-primary/5 transition-all cursor-pointer"
                        onClick={() => {
                          setSelectedAppointment(apt);
                          setIsAppointmentModalOpen(true);
                          setIsUserModalOpen(false);
                        }}
                      >
                        <div>
                          <p className="text-sm font-medium">{apt.area}</p>
                          <p className="text-xs text-muted-foreground mt-1">{formatDate(apt.preferredDate)} at {
                            new Date(apt.preferredTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                          }</p>
                        </div>
                        <Badge variant="outline" className={getStatusColor(apt.status)}>
                          {apt.status}
                        </Badge>
                      </div>
                    ))}
                  {appointments.filter(apt => apt.userId?._id === selectedUser._id).length === 0 && (
                    <p className="text-sm text-muted-foreground italic p-4 text-center">No appointments found</p>
                  )}
                </div>
              </div>

              {/* Client Contacts */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Contact Inquiries ({contacts.filter(contact => contact.userId?._id === selectedUser._id).length})
                </h3>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                  {contacts
                    .filter(contact => contact.userId?._id === selectedUser._id)
                    .map(contact => (
                      <div key={contact._id} 
                        className="bg-muted/5 rounded-xl p-3 flex justify-between items-center hover:bg-primary/5 transition-all cursor-pointer"
                        onClick={() => {
                          setSelectedContact(contact);
                          setIsContactModalOpen(true);
                          setIsUserModalOpen(false);
                        }}
                      >
                        <div>
                          <p className="text-sm font-medium">{contact.subject}</p>
                          <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(contact.createdAt)}</p>
                        </div>
                        <Badge variant="outline" className={getStatusColor(contact.status)}>
                          {contact.status}
                        </Badge>
                      </div>
                    ))}
                  {contacts.filter(contact => contact.userId?._id === selectedUser._id).length === 0 && (
                    <p className="text-sm text-muted-foreground italic p-4 text-center">No contact inquiries found</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <DialogFooter className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    window.location.href = `mailto:${selectedUser.email}`;
                  }}
                  className="rounded-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Client
                </Button>
                <Button
                  onClick={() => setIsUserModalOpen(false)}
                  className="rounded-full bg-primary hover:bg-primary/90"
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}