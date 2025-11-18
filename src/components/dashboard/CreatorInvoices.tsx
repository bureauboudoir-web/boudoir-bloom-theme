import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Calendar, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Invoice = {
  id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  description: string;
  invoice_date: string;
  due_date: string;
  status: 'pending' | 'creator_paid' | 'payment_confirmed' | 'overdue';
  creator_payment_confirmed_at: string | null;
  payment_method: string | null;
  created_at: string;
};

export const CreatorInvoices = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (user) {
      fetchInvoices();
    }
  }, [user]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      
      // Update overdue invoices
      await supabase.rpc('update_overdue_invoices');

      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setInvoices((data as any) || []);
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

  const handleConfirmPayment = async () => {
    if (!selectedInvoice) return;

    try {
      const { error } = await supabase
        .from('invoices')
        .update({
          status: 'creator_paid',
          creator_payment_confirmed_at: new Date().toISOString(),
        })
        .eq('id', selectedInvoice.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment confirmation sent to admin",
      });

      setShowConfirmDialog(false);
      setSelectedInvoice(null);
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

  const getStatusBadge = (status: Invoice['status']) => {
    const config = {
      pending: { label: 'Pending', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
      creator_paid: { label: 'Awaiting Admin Confirmation', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
      payment_confirmed: { label: 'Paid', className: 'bg-green-500/10 text-green-500 border-green-500/20' },
      overdue: { label: 'Overdue', className: 'bg-red-500/10 text-red-500 border-red-500/20' },
    };
    return <Badge variant="outline" className={config[status].className}>{config[status].label}</Badge>;
  };

  const isOverdue = (dueDate: string, status: Invoice['status']) => {
    return new Date(dueDate) < new Date() && (status === 'pending' || status === 'overdue');
  };

  const stats = {
    totalPending: invoices
      .filter(i => i.status === 'pending' || i.status === 'creator_paid' || i.status === 'overdue')
      .reduce((sum, i) => sum + Number(i.amount), 0),
    totalPaid: invoices
      .filter(i => i.status === 'payment_confirmed')
      .reduce((sum, i) => sum + Number(i.amount), 0),
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Total Pending</span>
          </div>
          <p className="text-2xl font-bold">${stats.totalPending.toFixed(2)}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Total Paid</span>
          </div>
          <p className="text-2xl font-bold">${stats.totalPaid.toFixed(2)}</p>
        </Card>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        {invoices.length === 0 ? (
          <Card className="p-8">
            <div className="text-center text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No invoices yet</p>
            </div>
          </Card>
        ) : (
          invoices.map((invoice) => (
            <Card
              key={invoice.id}
              className={`p-4 ${isOverdue(invoice.due_date, invoice.status) ? 'border-red-500/50' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-lg">{invoice.invoice_number}</span>
                    {getStatusBadge(invoice.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">${Number(invoice.amount).toFixed(2)}</span>
                      <span className="text-muted-foreground">{invoice.currency}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Due:</span>
                      <span className={isOverdue(invoice.due_date, invoice.status) ? 'text-red-500 font-medium' : ''}>
                        {format(new Date(invoice.due_date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm">
                    <p className="text-muted-foreground mb-1">Description:</p>
                    <p>{invoice.description}</p>
                  </div>

                  {invoice.payment_method && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Payment Method: </span>
                      <span className="font-medium">{invoice.payment_method}</span>
                    </div>
                  )}
                </div>

                {invoice.status === 'pending' && (
                  <Button
                    onClick={() => {
                      setSelectedInvoice(invoice);
                      setShowConfirmDialog(true);
                    }}
                    className="ml-4"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Payment
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Confirm Payment Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Payment Made</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you've completed the payment of ${selectedInvoice ? Number(selectedInvoice.amount).toFixed(2) : '0.00'} for invoice{' '}
              {selectedInvoice?.invoice_number}? This will notify the admin for verification.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmPayment}>Confirm Payment</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
