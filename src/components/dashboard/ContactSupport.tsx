import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ListSkeleton } from "@/components/ui/loading-skeletons";

interface ContactSupportProps {
  userId: string;
  userName: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: string;
  admin_response: string | null;
  responded_at: string | null;
  created_at: string;
}

const supportFormSchema = z.object({
  subject: z.string().min(1, "Please select a subject"),
  message: z.string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

type SupportFormValues = z.infer<typeof supportFormSchema>;

const SUBJECT_OPTIONS = [
  "Problem Report",
  "Shoot Cancellation",
  "Schedule Change",
  "Payment Question",
  "Other",
];

// TODO: Replace with actual Bureau Boudoir WhatsApp number
const WHATSAPP_NUMBER = "1234567890"; // Replace with actual number

const ContactSupport = ({ userId, userName }: ContactSupportProps) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(true);

  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  useEffect(() => {
    fetchTickets();
  }, [userId]);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoadingTickets(false);
    }
  };

  const onSubmit = async (values: SupportFormValues) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("support_tickets").insert({
        user_id: userId,
        subject: values.subject,
        message: values.message,
      });

      if (error) throw error;

      toast({
        title: "Support ticket created",
        description: "Your message has been sent to your representative.",
      });

      form.reset();
      fetchTickets();
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    const subject = form.getValues("subject") || "Support Request";
    const message = form.getValues("message") || "Hi, I need help";
    const text = encodeURIComponent(
      `Hi, I'm ${userName}\n\nSubject: ${subject}\n\nMessage: ${message}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-yellow-500";
      case "in_progress":
        return "text-blue-500";
      case "resolved":
        return "text-green-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card border-primary/20">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold mb-2">Contact Your Representative</h2>
            <p className="text-muted-foreground">
              Reach out for any issues, questions, or concerns
            </p>
          </div>
        </div>

        <Button
          onClick={handleWhatsAppClick}
          className="w-full mb-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          size="lg"
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Message on WhatsApp
        </Button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or submit a detailed request</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SUBJECT_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your issue or question..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading} className="w-full">
              <Send className="mr-2 h-4 w-4" />
              {loading ? "Sending..." : "Submit Request"}
            </Button>
          </form>
        </Form>
      </Card>

      <Card className="p-6 bg-card border-primary/20">
        <h3 className="font-serif text-xl font-bold mb-4">Your Support Tickets</h3>
        {loadingTickets ? (
          <div className="animate-in fade-in duration-300">
            <ListSkeleton count={3} />
          </div>
        ) : tickets.length === 0 ? (
          <p className="text-muted-foreground">No support tickets yet.</p>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="border border-border rounded-lg p-4 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{ticket.subject}</h4>
                      <span className={`text-sm capitalize ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{ticket.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(ticket.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                {ticket.admin_response && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-sm font-semibold mb-1">Response:</p>
                    <p className="text-sm text-muted-foreground">{ticket.admin_response}</p>
                    {ticket.responded_at && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Responded on {new Date(ticket.responded_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ContactSupport;
