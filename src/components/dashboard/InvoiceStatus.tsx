import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { CardSkeleton } from "@/components/ui/loading-skeletons";

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  description: string;
  invoice_date: string;
  due_date: string;
  status: string;
  creator_payment_confirmed_at: string | null;
  admin_payment_confirmed_at: string | null;
}

export const InvoiceStatus = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast({
        title: "Error",
        description: "Failed to load invoices",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [user]);

  const confirmPayment = async (invoiceId: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ creator_payment_confirmed_at: new Date().toISOString() })
        .eq('id', invoiceId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment confirmed successfully",
      });
      fetchInvoices();
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast({
        title: "Error",
        description: "Failed to confirm payment",
        variant: "destructive",
      });
    }
  };

  const outstandingInvoices = invoices.filter(
    inv => !inv.creator_payment_confirmed_at && !inv.admin_payment_confirmed_at
  );

  const confirmedInvoices = invoices.filter(
    inv => inv.creator_payment_confirmed_at && !inv.admin_payment_confirmed_at
  );

  const completedInvoices = invoices.filter(
    inv => inv.admin_payment_confirmed_at
  );

  const InvoiceCard = ({ invoice, showConfirmButton }: { invoice: Invoice; showConfirmButton?: boolean }) => (
    <Card className="p-4 mb-3 border-primary/20">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold">{invoice.invoice_number}</p>
          <p className="text-sm text-muted-foreground">{invoice.description}</p>
        </div>
        <Badge variant={invoice.status === 'overdue' ? 'destructive' : 'secondary'}>
          {invoice.status}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm mt-3">
        <div>
          <p className="text-muted-foreground">Amount</p>
          <p className="font-semibold">${invoice.amount} {invoice.currency}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Due Date</p>
          <p>{format(new Date(invoice.due_date), 'MMM dd, yyyy')}</p>
        </div>
      </div>

      {invoice.creator_payment_confirmed_at && (
        <p className="text-xs text-muted-foreground mt-2">
          Payment confirmed: {format(new Date(invoice.creator_payment_confirmed_at), 'MMM dd, yyyy HH:mm')}
        </p>
      )}

      {invoice.admin_payment_confirmed_at && (
        <p className="text-xs text-green-600 mt-2">
          Completed: {format(new Date(invoice.admin_payment_confirmed_at), 'MMM dd, yyyy HH:mm')}
        </p>
      )}

      {showConfirmButton && (
        <Button 
          onClick={() => confirmPayment(invoice.id)}
          className="w-full mt-3"
          variant="outline"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Confirm Payment Sent
        </Button>
      )}
    </Card>
  );

  if (loading) {
    return (
      <div className="animate-in fade-in duration-300">
        <CardSkeleton count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-serif font-bold">Invoice Status</h2>
      
      <Tabs defaultValue="outstanding" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="outstanding" className="relative">
            <Clock className="w-4 h-4 mr-2" />
            Outstanding
            {outstandingInvoices.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {outstandingInvoices.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            <DollarSign className="w-4 h-4 mr-2" />
            Confirmed
            {confirmedInvoices.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {confirmedInvoices.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">
            <CheckCircle className="w-4 h-4 mr-2" />
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="outstanding" className="mt-4">
          {outstandingInvoices.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No outstanding invoices</p>
            </Card>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                These invoices require payment. Click "Confirm Payment Sent" after you've made the payment.
              </p>
              {outstandingInvoices.map(invoice => (
                <InvoiceCard key={invoice.id} invoice={invoice} showConfirmButton />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="confirmed" className="mt-4">
          {confirmedInvoices.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No confirmed invoices pending admin verification</p>
            </Card>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                Payment confirmed. Waiting for admin to verify receipt.
              </p>
              {confirmedInvoices.map(invoice => (
                <InvoiceCard key={invoice.id} invoice={invoice} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          {completedInvoices.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No completed invoices</p>
            </Card>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                Payment received and verified by admin.
              </p>
              {completedInvoices.map(invoice => (
                <InvoiceCard key={invoice.id} invoice={invoice} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
