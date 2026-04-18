import React, { useState, useEffect } from 'react';
import { Zap, Droplet, Trash2, Shield, Calendar, ArrowUpRight, BarChart3, Plus, Calculator, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '../lib/api';
import { Unit, UtilityBill } from '../types';
import { toast } from 'sonner';

export default function UtilitiesPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [isReadingModalOpen, setIsReadingModalOpen] = useState(false);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [reading, setReading] = useState({ unit_id: '', type: 'ELECTRICITY' as UtilityBill['type'], prev: 0, curr: 0 });
  const [splitData, setSplitData] = useState({ type: 'GARBAGE' as UtilityBill['type'], amount: 0 });

  useEffect(() => {
    api.getUnits().then(setUnits);
  }, []);

  const handleReadingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const consumption = reading.curr - reading.prev;
    if (consumption < 0) {
      toast.error('Current reading cannot be less than previous');
      return;
    }
    toast.success(`Bill generated for Unit ${units.find(u => u.id === reading.unit_id)?.unit_number}: KES ${(consumption * (reading.type === 'ELECTRICITY' ? 24 : 120)).toLocaleString()}`);
    setIsReadingModalOpen(false);
  };

  const handleSplitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const perUnit = splitData.amount / units.length;
    toast.success(`Shared cost split successfully: KES ${perUnit.toLocaleString()} per unit`);
    setIsSplitModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Utility Billing</h1>
          <p className="text-slate-500">Automate consumption tracking and tenant billing.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setIsSplitModalOpen(true)}>
            <Users className="w-4 h-4" /> Split Cost
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2" onClick={() => setIsReadingModalOpen(true)}>
            <Plus className="w-4 h-4" /> Record Reading
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <UtilityCard type="Electricity" value="4.2k KWh" icon={<Zap className="text-amber-500" />} trend="+12%" />
        <UtilityCard type="Water" value="120 m\\u00b3" icon={<Droplet className="text-blue-500" />} trend="-5%" />
        <UtilityCard type="Garbage" value="KES 12k" icon={<Trash2 className="text-slate-500" />} />
        <UtilityCard type="Security" value="KES 45k" icon={<Shield className="text-green-500" />} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-6">
          <h3 className="font-bold text-lg mb-6">Recent Readings & Bills</h3>
          <div className="space-y-4">
             {[
               { unit: 'A101', type: 'Electricity', amount: '2,400', date: 'Oct 24, 2023', status: 'PAID' },
               { unit: 'A102', type: 'Water', amount: '850', date: 'Oct 24, 2023', status: 'PAID' },
               { unit: 'B205', type: 'Electricity', amount: '3,100', date: 'Oct 23, 2023', status: 'UNPAID' },
               { unit: 'C301', type: 'Electricity', amount: '1,900', date: 'Oct 22, 2023', status: 'PAID' },
             ].map((bill, i) => (
               <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                     {bill.type === 'Electricity' ? <Zap className="w-5 h-5 text-amber-500" /> : <Droplet className="w-5 h-5 text-blue-500" />}
                   </div>
                   <div>
                     <p className="font-bold">Unit {bill.unit} - {bill.type}</p>
                     <p className="text-xs text-slate-500">Generated on {bill.date}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-6">
                   <span className="font-bold">KES {bill.amount}</span>
                   <Badge className={bill.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                     {bill.status}
                   </Badge>
                 </div>
               </div>
             ))}
          </div>
        </Card>

        <Card className="p-6 bg-blue-600 text-white relative overflow-hidden">
           <div className="relative z-10">
             <BarChart3 className="w-10 h-10 mb-6 opacity-80" />
             <h4 className="text-xl font-bold mb-2">Automation Active</h4>
             <p className="text-blue-100 text-sm mb-8">RentFlow is automatically calculating sub-meter readings based on your defined tariffs.</p>
             <div className="space-y-4">
               <div className="flex justify-between items-center text-sm">
                 <span>Electricity Rate</span>
                 <span className="font-bold">KES 24/KWh</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span>Water Rate</span>
                 <span className="font-bold">KES 120/m\\u00b3</span>
               </div>
             </div>
             <Button className="w-full mt-10 bg-white text-blue-600 hover:bg-blue-50 font-bold">Configure Tariffs</Button>
           </div>
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        </Card>
      </div>

      <Dialog open={isReadingModalOpen} onOpenChange={setIsReadingModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Meter Reading</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReadingSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Unit</Label>
              <Select required onValueChange={(v) => setReading({...reading, unit_id: v})}>
                <SelectTrigger><SelectValue placeholder="Select unit" /></SelectTrigger>
                <SelectContent>{units.map(u => <SelectItem key={u.id} value={u.id}>Unit {u.unit_number}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Utility Type</Label>
              <Select value={reading.type} onValueChange={(v: any) => setReading({...reading, type: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ELECTRICITY">Electricity</SelectItem>
                  <SelectItem value="WATER">Water</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Previous Reading</Label><Input type="number" value={reading.prev} onChange={e => setReading({...reading, prev: Number(e.target.value)})} /></div>
              <div className="space-y-2"><Label>Current Reading</Label><Input type="number" value={reading.curr} onChange={e => setReading({...reading, curr: Number(e.target.value)})} /></div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Consumption</span>
                <span className="font-bold text-lg">{Math.max(0, reading.curr - reading.prev)} {reading.type === 'ELECTRICITY' ? 'KWh' : 'm\\u00b3'}</span>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsReadingModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600">Generate Bill</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isSplitModalOpen} onOpenChange={setIsSplitModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Split Shared Costs</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSplitSubmit} className="space-y-4 py-4">
            <div className="p-3 bg-amber-50 text-amber-700 text-sm rounded-lg flex items-center gap-2">
              <Calculator className="w-4 h-4" /> Costs will be split equally among all {units.length} active units.
            </div>
            <div className="space-y-2">
              <Label>Utility Type</Label>
              <Select value={splitData.type} onValueChange={(v: any) => setSplitData({...splitData, type: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="GARBAGE">Garbage Collection</SelectItem>
                  <SelectItem value="SECURITY">Security Services</SelectItem>
                  <SelectItem value="GAS">Shared Gas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Total Bill Amount (KES)</Label>
              <Input type="number" required value={splitData.amount} onChange={e => setSplitData({...splitData, amount: Number(e.target.value)})} />
            </div>
            <div className="p-4 bg-slate-900 text-white rounded-xl flex justify-between items-center">
               <span className="text-sm font-medium">Cost Per Unit</span>
               <span className="text-xl font-bold">KES {(splitData.amount / (units.length || 1)).toLocaleString()}</span>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsSplitModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600">Confirm Split</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UtilityCard({ type, value, icon, trend }: { type: string, value: string, icon: React.ReactNode, trend?: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
          <span className="text-sm text-slate-500 font-medium">{type} Usage</span>
        </div>
        {trend && (
          <Badge className={trend.startsWith('+') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}>
            {trend}
          </Badge>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </Card>
  );
}