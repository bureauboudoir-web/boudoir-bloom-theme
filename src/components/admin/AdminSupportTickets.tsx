import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Check, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: string;
  admin_response: string | null;
  responded_at: string | null;
  created_at: string;
  profiles?: {
    email: string;
    full_name: string | null;
  };
}

const AdminSupportTickets = () => {
  const { user } = useAuth();
  const { isSuperAdmin, isAdmin } = useUserRole();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [response, setResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredTickets = tickets.filter(ticket => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      ticket.subject.toLowerCase().includes(query) ||
      ticket.message.toLowerCase().includes(query) ||
      ticket.profiles?.full_name?.toLowerCase().includes(query) ||
      ticket.profiles?.email.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    try {
      let creatorIds: string[] = [];

      // If manager (not admin/super_admin), filter by assigned creators
      if (!isSuperAdmin && !isAdmin && user) {
        const { data: assignedMeetings } = await supabase
          .from('creator_meetings')
          .select('user_id')
          .eq('assigned_manager_id', user.id);

        creatorIds = [...new Set(assignedMeetings?.map(m => m.user_id) || [])];

        if (creatorIds.length === 0) {
          setTickets([]);
          setLoading(false);
          return;
        }
      }

      let query = supabase
        .from("support_tickets")
        .select("*")
        .order("created_at", { ascending: false });

      // Apply filter for managers
      if (!isSuperAdmin && !isAdmin && creatorIds.length > 0) {
        query = query.in('user_id', creatorIds);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch profile information separately for each ticket
      const ticketsWithProfiles = await Promise.all(
        (data || []).map(async (ticket) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("email, full_name")
            .eq("id", ticket.user_id)
            .single();

          return {
            ...ticket,
            profiles: profile || { email: "Unknown", full_name: null },
          };
        })
      );

      setTickets(ticketsWithProfiles);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast({
        title: "Error",
        description: "Failed to load support tickets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async () => {
    if (!selectedTicket || !response.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({
          admin_response: response,
          responded_at: new Date().toISOString(),
          status: "in_progress",
        })
        .eq("id", selectedTicket.id);

      if (error) throw error;

      toast({
        title: "Response sent",
        description: "Your response has been sent to the creator.",
      });

      setSelectedTicket(null);
      setResponse("");
      fetchTickets();
    } catch (error) {
      console.error("Error responding to ticket:", error);
      toast({
        title: "Error",
        description: "Failed to send response",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkResolved = async (ticketId: string) => {
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({ status: "resolved" })
        .eq("id", ticketId);

      if (error) throw error;

      toast({
        title: "Ticket resolved",
        description: "The support ticket has been marked as resolved.",
      });

      fetchTickets();
    } catch (error) {
      console.error("Error resolving ticket:", error);
      toast({
        title: "Error",
        description: "Failed to resolve ticket",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
      case "in_progress":
        return "bg-blue-500/20 text-blue-500 border-blue-500/50";
      case "resolved":
        return "bg-green-500/20 text-green-500 border-green-500/50";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <Card className="p-6 bg-card border-primary/20">
        <p className="text-muted-foreground">Loading support tickets...</p>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6 bg-card border-primary/20">
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold mb-1">Support Tickets</h2>
              <p className="text-muted-foreground">
                Manage creator support requests
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {filteredTickets.filter((t) => t.status !== "resolved").length} Open
            </Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets by subject, message, or creator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredTickets.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            {searchQuery ? "No tickets match your search" : "No support tickets yet."}
          </p>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="border border-border rounded-lg p-4 space-y-3 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{ticket.subject}</h3>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">
                        {ticket.profiles?.full_name || ticket.profiles?.email}
                      </span>
                      {" • "}
                      {new Date(ticket.created_at).toLocaleString()}
                    </p>
                    <p className="text-sm">{ticket.message}</p>
                    {ticket.admin_response && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-sm font-semibold mb-1">Your Response:</p>
                        <p className="text-sm text-muted-foreground">{ticket.admin_response}</p>
                        {ticket.responded_at && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Sent on {new Date(ticket.responded_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setResponse(ticket.admin_response || "");
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {ticket.admin_response ? "Edit Response" : "Respond"}
                    </Button>
                    {ticket.status !== "resolved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkResolved(ticket.id)}
                        className="text-green-500 hover:text-green-600"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Respond to Support Ticket</DialogTitle>
            <DialogDescription>
              {selectedTicket?.subject} • From{" "}
              {selectedTicket?.profiles?.full_name || selectedTicket?.profiles?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Creator's Message:</Label>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                {selectedTicket?.message}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="response">Your Response</Label>
              <Textarea
                id="response"
                placeholder="Type your response here..."
                className="min-h-[120px]"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTicket(null)}>
              Cancel
            </Button>
            <Button onClick={handleRespond} disabled={isSubmitting || !response.trim()}>
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Sending..." : "Send Response"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminSupportTickets;
