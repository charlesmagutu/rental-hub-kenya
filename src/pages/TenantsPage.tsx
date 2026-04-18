import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Mail, Phone, MoreHorizontal, UserPlus, FileText, Calendar, AlertTriangle, ShieldCheck, Check, X as XIcon, DollarSign, Wallet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { api } from '../lib/api';
import { Tenant, SecurityDeposit, Notice } from '../types';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [deposits, setDeposits] = useState<SecurityDeposit[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [noticeReason, setNoticeReason] = useState('');
  const [moveOutDate, setMoveOutDate] = useState('');
  const [selectedDeposit, setSelectedDeposit] = useState<SecurityDeposit | null>(null);
  const [deductions, setDeductions] = useState(0);
  const [refundReason, setRefundReason] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [t, d, n] = await Promise.all([
        api.getTenants(),
        api.getDeposits(),
        api.getNotices()
      ]);
      setTenants(t);
      setDeposits(d);
      setNotices(n);
    } catch (e) {
      toast.error('Failed to load tenant data');
    }
  };

  const handleGiveNotice = async () => {
    if (!selectedTenant || !noticeReason || !moveOutDate) return;
    try {
      await api.submitNotice(selectedTenant.id, noticeReason, moveOutDate);
      toast.success('Notice period started for tenant');
      fetchData();
      setIsNoticeModalOpen(false);
      setSelectedTenant(null);
    } catch (e) {
      toast.error('Failed to submit notice');
    }
  };

  const handleNoticeStatus = async (id: string, status: Notice['status']) => {
    try {
      await api.updateNoticeStatus(id, status);
      toast.success(`Notice ${status.toLowerCase()}`);
      fetchData();
    } catch (e) {
      toast.error('Failed to update notice status');
    }
  };

  const handleRefund = async () => {
    if (!selectedDeposit) return;
    try {
      await api.updateDeposit(selectedDeposit.id, {
        is_refunded: true,
        refund_date: new Date().toISOString().split('T')[0],
        deductions,
        reason: refundReason
      });
      toast.success('Security deposit refund processed');
      setIsDepositModalOpen(false);
      fetchData();
    } catch (e) {
      toast.error('Failed to process refund');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tenant & Lease Management</h1>
          <p className="text-slate-500">Manage lease agreements, deposits, and move-out notices.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <UserPlus className="w-4 h-4" /> Onboard Tenant
        </Button>
      </div>

      <Tabs defaultValue="directory" className="space-y-6">
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="directory">Directory</TabsTrigger>
          <TabsTrigger value="notices">Move-out Notices</TabsTrigger>
          <TabsTrigger value="deposits">Security Deposits</TabsTrigger>
        </TabsList>

        <TabsContent value="directory">
          <Card className="p-4 flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by name, unit or phone..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2"><Filter className="w-4 h-4" /> Filters</Button>
              <Button variant="outline" className="gap-2">Export</Button>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                  <th className="px-6 py-4">Tenant Name</th>
                  <th className="px-6 py-4">Unit</th>
                  <th className="px-6 py-4">Lease Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                          {tenant.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{tenant.name}</p>
                          <p className="text-xs text-slate-500">{tenant.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">Unit {tenant.unit_id}</td>
                    <td className="px-6 py-4">
                      <Badge className={tenant.status === 'ACTIVE' ? "bg-green-50 text-green-700 border-none font-bold" : "bg-amber-50 text-amber-700 border-none font-bold"}>
                        {tenant.status}
                      </Badge>
                      <p className="text-[10px] text-slate-400 mt-1">Expires: {tenant.lease_end}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setSelectedTenant(tenant); setIsNoticeModalOpen(true); }}>
                          Notice
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Mail className="w-4 h-4 text-slate-400" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="notices">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notices.map(n => {
              const tenant = tenants.find(t => t.id === n.tenant_id);
              return (
                <Card key={n.id} className={`p-6 flex items-start gap-4 border-l-4 ${n.status === 'APPROVED' ? 'border-green-500' : 'border-amber-500'}`}>
                  <div className={`p-3 rounded-xl ${n.status === 'APPROVED' ? 'bg-green-50' : 'bg-amber-50'}`}>
                    {n.status === 'APPROVED' ? <Check className="w-6 h-6 text-green-600" /> : <AlertTriangle className="w-6 h-6 text-amber-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-lg">{tenant?.name}</h4>
                      <Badge className={n.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                        {n.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">Reason: {n.reason}</p>
                    <div className="flex items-center gap-6 mt-4 text-xs font-bold text-slate-400 uppercase">
                      <div className="flex items-center gap-2"><Calendar className="w-3 h-3" /> Notice: {n.notice_date}</div>
                      <div className="flex items-center gap-2"><Calendar className="w-3 h-3" /> Exit: {n.move_out_date}</div>
                    </div>
                    {n.status === 'PENDING' && (
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleNoticeStatus(n.id, 'APPROVED')}>Approve</Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleNoticeStatus(n.id, 'REJECTED')}>Reject</Button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="deposits">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold">Security Deposit Tracking</h3>
              <Button variant="outline" size="sm">Download Log</Button>
            </div>
            <div className="space-y-4">
              {tenants.map(t => {
                const dep = deposits.find(d => d.tenant_id === t.id);
                return (
                  <div key={t.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold border border-slate-200">{t.name[0]}</div>
                      <div>
                        <p className="font-bold">{t.name}</p>
                        <p className="text-xs text-slate-500">Unit {t.unit_id}</p>
                        {dep?.is_refunded && <Badge className="bg-green-100 text-green-700 text-[8px] h-4">Refunded</Badge>}
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-xs text-slate-400 font-bold uppercase">Balance</p>
                        <p className="font-bold">KES {dep?.amount?.toLocaleString() || '0'}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-blue-600"
                        onClick={() => { setSelectedDeposit(dep || null); setIsDepositModalOpen(true); }}
                        disabled={dep?.is_refunded}
                      >
                        {dep?.is_refunded ? 'Closed' : 'Refund'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isNoticeModalOpen} onOpenChange={setIsNoticeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Move-out Notice</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-lg flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> 30-day notice rule applies for {selectedTenant?.name}
            </div>
            <div className="space-y-2">
              <Label>Reason for Moving</Label>
              <Textarea placeholder="e.g. Relocation, end of contract..." value={noticeReason} onChange={(e) => setNoticeReason(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Expected Move-out Date</Label>
              <Input type="date" value={moveOutDate} onChange={(e) => setMoveOutDate(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNoticeModalOpen(false)}>Cancel</Button>
            <Button className="bg-blue-600" onClick={handleGiveNotice}>Confirm Notice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDepositModalOpen} onOpenChange={setIsDepositModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Deposit Refund</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Wallet className="text-blue-600" />
                <span className="font-bold">Original Deposit</span>
              </div>
              <span className="font-bold">KES {selectedDeposit?.amount.toLocaleString()}</span>
            </div>
            <div className="space-y-2">
              <Label>Deductions (KES)</Label>
              <Input type="number" value={deductions} onChange={e => setDeductions(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Reason for Deductions</Label>
              <Textarea placeholder="e.g. Painting, repairs, unpaid water bills..." value={refundReason} onChange={e => setRefundReason(e.target.value)} />
            </div>
            <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
               <span className="text-sm font-medium">Final Refund Amount</span>
               <span className="text-xl font-bold">KES {( (selectedDeposit?.amount || 0) - deductions).toLocaleString()}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDepositModalOpen(false)}>Cancel</Button>
            <Button className="bg-blue-600" onClick={handleRefund}>Process Refund</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}