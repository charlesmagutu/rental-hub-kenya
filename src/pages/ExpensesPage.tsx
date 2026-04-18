import React, { useState, useEffect } from 'react';
import { DollarSign, Search, Filter, Plus, Download, TrendingDown, Trash2, Edit2, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '../lib/api';
import { Expense, Property } from '../types';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Expense>>({
    category: 'MAINTENANCE',
    status: 'PAID',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [e, p] = await Promise.all([api.getExpenses(), api.getProperties()]);
    setExpenses(e);
    setProperties(p);
  };

  const handleSubmit = async () => {
    if (!formData.property_id || !formData.amount) {
      toast.error('Please fill required fields');
      return;
    }
    try {
      await api.addExpense(formData as Expense);
      toast.success('Expense recorded');
      fetchData();
      setIsModalOpen(false);
    } catch (e) {
      toast.error('Failed to save expense');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financial Tracking</h1>
          <p className="text-slate-500">Manage property expenses and maintenance costs.</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700 gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" /> Record Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex items-center gap-4 border-l-4 border-red-500">
          <div className="p-3 bg-red-50 rounded-xl"><TrendingDown className="text-red-600 w-6 h-6" /></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Expenses (Oct)</p>
            <h3 className="text-2xl font-bold">KES {expenses.reduce((acc, e) => acc + e.amount, 0).toLocaleString()}</h3>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between gap-4">
           <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="Search expenses..." />
           </div>
           <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export</Button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Property</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map(e => (
              <tr key={e.id} className="text-sm hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-500">{e.date}</td>
                <td className="px-6 py-4"><Badge variant="secondary" className="font-bold">{e.category}</Badge></td>
                <td className="px-6 py-4 font-medium">{properties.find(p => p.id === e.property_id)?.name || 'N/A'}</td>
                <td className="px-6 py-4 text-slate-600">{e.description}</td>
                <td className="px-6 py-4 text-right font-bold text-red-600">KES {e.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Record New Expense</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Property</Label>
              <Select onValueChange={v => setFormData({...formData, property_id: v})}>
                <SelectTrigger><SelectValue placeholder="Select Property" /></SelectTrigger>
                <SelectContent>{properties.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Category</Label>
              <Select onValueChange={(v: any) => setFormData({...formData, category: v})} defaultValue="MAINTENANCE">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="UTILITY">Utility</SelectItem>
                  <SelectItem value="TAX">Tax</SelectItem>
                  <SelectItem value="SALARY">Salary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2"><Label>Amount (KES)</Label><Input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} /></div>
               <div className="space-y-2"><Label>Date</Label><Input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
            </div>
            <div className="space-y-2"><Label>Description</Label><Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button className="bg-red-600" onClick={handleSubmit}>Save Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}