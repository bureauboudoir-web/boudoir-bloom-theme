import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, DollarSign, FileText, Calendar, Loader2, Filter, Search } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
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
  user_id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  description: string;
  notes: string | null;
  invoice_date: string;
  due_date: string;
  status: 'pending' | 'creator_paid' | 'payment_confirmed' | 'overdue';
  creator_payment_confirmed_at: string | null;
  admin_payment_confirmed_at: string | null;
  payment_method: string | null;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
};

type Creator = {
  id: string;
  full_name: string | null;
  email: string;
};

export const AdminInvoices = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { isSuperAdmin, isAdmin } = useUserRole();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPaymentReceivedDialog, setShowPaymentReceivedDialog] = useState(false);

  const filteredInvoices = invoices.filter(invoice => {
    if (!searchQuery) return statusFilter === "all" || invoice.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      invoice.invoice_number.toLowerCase().includes(query) ||
      invoice.profiles?.full_name?.toLowerCase().includes(query) ||
      invoice.profiles?.email.toLowerCase().includes(query) ||
      invoice.description.toLowerCase().includes(query)
    );
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Form state
  const [formData, setFormData] = useState({
    user_id: "",
    amount: "",
    description: "",
    notes: "",
    invoice_date: format(new Date(), 'yyyy-MM-dd'),
    due_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    payment_method: "",
  });

  useEffect(() => {
    if (user) {
      fetchCreators();
      fetchInvoices();
    }
  }, [user]);

  const fetchCreators = async () => {
    try {
      let assignedCreatorIds: string[] = [];

      // If manager (not admin/super_admin), filter by assigned creators
      if (!isSuperAdmin && !isAdmin && user) {
        const { data: assignedMeetings } = await supabase
          .from('creator_meetings')
          .select('user_id')
          .eq('assigned_manager_id', user.id);

        assignedCreatorIds = [...new Set(assignedMeetings?.map(m => m.user_id) || [])];

        if (assignedCreatorIds.length === 0) {
          setCreators([]);
          return;
        }
      }

      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'creator');

      if (rolesError) throw rolesError;

      let creatorIds = userRoles?.map(r => r.user_id) || [];

      // Filter to only assigned creators for managers
      if (!isSuperAdmin && !isAdmin && assignedCreatorIds.length > 0) {
        creatorIds = creatorIds.filter(id => assignedCreatorIds.includes(id));
      }
      
      if (creatorIds.length === 0) {
        setCreators([]);
        return;
      }

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', creatorIds);

      if (profilesError) throw profilesError;

      setCreators(profiles || []);
    } catch (error) {
      console.error('Error fetching creators:', error);
      toast({
        title: "Error",
        description: "Failed to load creators",
        variant: "destructive",
      });
    }
  };

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      
      // First update overdue invoices
      await supabase.rpc('update_overdue_invoices');

      let creatorIds: string[] = [];

      // If manager (not admin/super_admin), filter by assigned creators
      if (!isSuperAdmin && !isAdmin && user) {
        const { data: assignedMeetings } = await supabase
          .from('creator_meetings')
          .select('user_id')
          .eq('assigned_manager_id', user.id);

        creatorIds = [...new Set(assignedMeetings?.map(m => m.user_id) || [])];

        if (creatorIds.length === 0) {
          setInvoices([]);
          setLoading(false);
          return;
        }
      }

      let query = supabase
        .from('invoices')
        .select(`
          *,
          profiles:user_id(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      // Apply filter for managers
      if (!isSuperAdmin && !isAdmin && creatorIds.length > 0) {
        query = query.in('user_id', creatorIds);
      }

      const { data, error } = await query;

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

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: invoiceNumber } = await supabase.rpc('generate_invoice_number');

      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('invoices')
        .insert({
          user_id: formData.user_id,
          created_by_user_id: user?.id,
          invoice_number: invoiceNumber,
          amount: parseFloat(formData.amount),
          description: formData.description,
          notes: formData.notes || null,
          invoice_date: formData.invoice_date,
          due_date: formData.due_date,
          payment_method: formData.payment_method || null,
          status: 'pending',
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Invoice created successfully",
      });

      setFormData({
        user_id: "",
        amount: "",
        description: "",
        notes: "",
        invoice_date: format(new Date(), 'yyyy-MM-dd'),
        due_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        payment_method: "",
      });

      fetchInvoices();
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedInvoice) return;

    try {
      const { error } = await supabase
        .from('invoices')
        .update({
          admin_payment_confirmed_at: new Date().toISOString(),
        })
        .eq('id', selectedInvoice.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment received and invoice marked as completed",
      });

      setShowPaymentReceivedDialog(false);
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
      creator_paid: { label: 'Awaiting Confirmation', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
      payment_confirmed: { label: 'Confirmed', className: 'bg-green-500/10 text-green-500 border-green-500/20' },
      overdue: { label: 'Overdue', className: 'bg-red-500/10 text-red-500 border-red-500/20' },
    };
    return <Badge variant="outline" className={config[status].className}>{config[status].label}</Badge>;
  };

  const stats = {
    totalOutstanding: invoices
      .filter(i => !i.admin_payment_confirmed_at)
      .reduce((sum, i) => sum + Number(i.amount), 0),
    pendingCount: invoices.filter(i => !i.creator_payment_confirmed_at && !i.admin_payment_confirmed_at).length,
    awaitingConfirmation: invoices.filter(i => i.creator_payment_confirmed_at && !i.admin_payment_confirmed_at).length,
    completedCount: invoices.filter(i => i.admin_payment_confirmed_at).length,
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">Total Outstanding</span>
          </div>
          <p className="text-2xl font-bold">${stats.totalOutstanding.toFixed(2)}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <FileText className="w-4 h-4" />
            <span className="text-sm">Pending Invoices</span>
          </div>
          <p className="text-2xl font-bold">{stats.pendingCount}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Awaiting Confirmation</span>
          </div>
          <p className="text-2xl font-bold">{stats.awaitingConfirmation}</p>
        </Card>
      </div>

      {/* Create Invoice Form */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Create New Invoice</h3>
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="creator">Creator *</Label>
              <Select value={formData.user_id} onValueChange={(value) => setFormData({ ...formData, user_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select creator" />
                </SelectTrigger>
                <SelectContent>
                  {creators.map((creator) => (
                    <SelectItem key={creator.id} value={creator.id}>
                      {creator.full_name || creator.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoice_date">Invoice Date *</Label>
              <Input
                id="invoice_date"
                type="date"
                required
                value={formData.invoice_date}
                onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date *</Label>
              <Input
                id="due_date"
                type="date"
                required
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Content creation services for January 2025"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_method">Payment Method</Label>
              <Input
                id="payment_method"
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                placeholder="e.g., Bank Transfer, PayPal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Internal Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Private notes (not visible to creator)"
              />
            </div>
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
            Create Invoice
          </Button>
        </form>
      </Card>

      {/* Invoice List */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h3 className="font-semibold text-lg">All Invoices</h3>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="creator_paid">Creator Paid</SelectItem>
                  <SelectItem value="payment_confirmed">Confirmed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredInvoices.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {searchQuery || statusFilter !== "all" ? "No invoices match your search" : "No invoices found"}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{invoice.profiles?.full_name || 'Unknown'}</div>
                        <div className="text-sm text-muted-foreground">{invoice.profiles?.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>${Number(invoice.amount).toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {format(new Date(invoice.due_date), 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell>
                      {invoice.creator_payment_confirmed_at && !invoice.admin_payment_confirmed_at && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setShowPaymentReceivedDialog(true);
                          }}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Confirm Received
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Confirm Payment Received Dialog */}
      <AlertDialog open={showPaymentReceivedDialog} onOpenChange={setShowPaymentReceivedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Payment Received</AlertDialogTitle>
            <AlertDialogDescription>
              Confirm you've received payment of ${selectedInvoice ? Number(selectedInvoice.amount).toFixed(2) : '0.00'} from{' '}
              {selectedInvoice?.profiles?.full_name || 'this creator'}?
              This will mark the invoice as completed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmPayment}>Confirm Received</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
