"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Mail, Phone, Calendar, MessageSquare, User, Clock } from "lucide-react";
import axios from "axios";
import { format } from "date-fns";

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
}

interface ContactsModalProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ContactsModal({ children, open, onOpenChange }: ContactsModalProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get('/api/contact');
      setContacts(response.data.contacts || []);
    } catch (error: any) {
      console.error("Error fetching contacts:", error);
      setError(error.response?.data?.message || "Failed to load contacts");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch contacts when modal opens
  useEffect(() => {
    if (open) {
      fetchContacts();
    }
  }, [open]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Progress':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy • h:mm a');
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline font-bold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            My Contact Inquiries
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-2">Error loading contacts</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={fetchContacts}
              >
                Try Again
              </Button>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground">No contact inquiries found.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Your submitted inquiries will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div
                  key={contact._id}
                  className="bg-card/50 border border-border rounded-xl p-5 hover:border-primary/30 transition-all"
                >
                  <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-headline font-bold">
                            {contact.firstName} {contact.lastName}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            ID: {contact._id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={getStatusColor(contact.status)}>
                        {contact.status}
                      </Badge>
                    </div>

                    {/* Subject */}
                    <div className="bg-muted/30 rounded-lg p-3">
                      <p className="text-sm font-medium text-primary mb-1">Subject</p>
                      <p className="text-sm">{contact.subject}</p>
                    </div>

                    {/* Inquiry */}
                    <div className="bg-muted/30 rounded-lg p-3">
                      <p className="text-sm font-medium text-primary mb-1">Inquiry</p>
                      <p className="text-sm whitespace-pre-wrap">{contact.Inquiry}</p>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{contact.phone}</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatDate(contact.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}