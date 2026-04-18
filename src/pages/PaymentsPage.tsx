import React, { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Search, Filter, Download, Plus, CheckCircle2, AlertCircle, Clock, Receipt as ReceiptIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { Payment } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    const data = await api.getPayments();
    setPayments(data);
  };

  const handleMpesaPush = async () => {
    if (!phone || !amount) {
      toast.error('Please enter phone number and amount');
      return;
    }
    setIsProcessing(true);
    try {
      await api.triggerMpesaPush(phone, parseFloat(amount), 't-1');
      toast.success('Payment completed successfully!');
      fetchPayments();
      setIsMpesaModalOpen(false);
    } catch (error) {
      toast.error('Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rent & Payments</h1>
          <p className="text-slate-500">Monitor collections, verify receipts, and trigger M-Pesa requests.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="gap-2" onClick={() => setIsMpesaModalOpen(true)}>
             <Smartphone className="w-4 h-4" /> Trigger M-Pesa
           </Button>
           <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
             <Plus className="w-4 h-4" /> Manual Entry
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Collected this Month" value={`KES ${payments.filter(p => p.status === 'COMPLETED').reduce((acc, p) => acc + p.amount, 0).toLocaleString()}`} icon={<CheckCircle2 className="text-green-600" />} />
        <SummaryCard title="Pending Payments" value={`KES ${payments.filter(p => p.status === 'PENDING').reduce((acc, p) => acc + p.amount, 0).toLocaleString()}`} icon={<Clock className="text-amber-600" />} />
        <SummaryCard title="Overdue Balance" value="KES 45,000" icon={<AlertCircle className="text-red-600" />} />
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by reference or tenant..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p.id} className="text-sm hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-500">{p.date}</td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">{p.reference}</td>
                  <td className="px-6 py-4 font-medium text-xs"><Badge variant="secondary">{p.type}</Badge></td>
                  <td className="px-6 py-4 font-bold">KES {p.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                     <Badge variant="outline" className="gap-1 px-2">
                       {p.method === 'MPESA' ? <Smartphone className="w-3 h-3" /> : <CreditCard className="w-3 h-3" />}
                       {p.method}
                     </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={p.status === 'COMPLETED' ? "bg-green-100 text-green-700 border-none" : "bg-amber-100 text-amber-700 border-none"}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" className="text-blue-600 font-bold hover:underline gap-1">
                      <ReceiptIcon className="w-3 h-3" /> VIEW
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={isMpesaModalOpen} onOpenChange={setIsMpesaModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Initiate M-Pesa STK Push</DialogTitle>
            <DialogDescription>Enter the tenant's phone number and the amount to request.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input placeholder="e.g. 254712345678" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Amount (KES)</Label>
              <Input type="number" placeholder="e.g. 45000" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMpesaModalOpen(false)}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleMpesaPush} disabled={isProcessing}>
              {isProcessing ? 'Sending...' : 'Send Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SummaryCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      </div>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
    </Card>
  );
}