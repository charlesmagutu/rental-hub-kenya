import React, { useState, useEffect } from 'react';
import { Wrench, Plus, Clock, CheckCircle2, AlertCircle, Calendar, MoreVertical, Filter, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '../lib/api';
import { MaintenanceRequest, Unit, Tenant } from '../types';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function MaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    unit_id: '',
    tenant_id: '',
    title: '',
    description: '',
    priority: 'MEDIUM' as MaintenanceRequest['priority']
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [r, u, t] = await Promise.all([
      api.getMaintenanceRequests(),
      api.getUnits(),
      api.getTenants()
    ]);
    setRequests(r);
    setUnits(u);
    setTenants(t);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.submitMaintenanceRequest(newRequest);
      toast.success('Maintenance request submitted successfully');
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to submit request');
    }
  };

  const handleStatusChange = async (id: string, status: MaintenanceRequest['status']) => {
    await api.updateMaintenanceStatus(id, status);
    toast.success(`Status updated to ${status}`);
    fetchData();
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'URGENT': return 'bg-red-100 text-red-700';
      case 'HIGH': return 'bg-amber-100 text-amber-700';
      case 'MEDIUM': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Maintenance Requests</h1>
          <p className="text-slate-500">Track and manage property repairs and tenant requests.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" /> New Request
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Pending" value={requests.filter(r => r.status === 'PENDING').length} icon={<Clock className="text-amber-500" />} />
        <StatCard title="In Progress" value={requests.filter(r => r.status === 'IN_PROGRESS' || r.status === 'SCHEDULED').length} icon={<Wrench className="text-blue-500" />} />
        <StatCard title="Completed" value={requests.filter(r => r.status === 'COMPLETED').length} icon={<CheckCircle2 className="text-green-500" />} />
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search requests..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none bg-white" />
          </div>
          <Button variant="outline" className="gap-2"><Filter className="w-4 h-4" /> Filters</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider border-b border-slate-100">
                <th className="px-6 py-4">Issue</th>
                <th className="px-6 py-4">Unit</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-slate-900">{request.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{request.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">Unit {units.find(u => u.id === request.unit_id)?.unit_number}</td>
                  <td className="px-6 py-4">
                    <Badge className={`${getPriorityColor(request.priority)} border-none`}>{request.priority}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Select value={request.status} onValueChange={(val: any) => handleStatusChange(request.id, val)}>
                      <SelectTrigger className="h-8 w-32 border-none bg-transparent hover:bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">{new Date(request.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4 text-slate-400" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Maintenance Request</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Unit</Label>
              <Select required onValueChange={(val) => setNewRequest({...newRequest, unit_id: val})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map(u => (
                    <SelectItem key={u.id} value={u.id}>Unit {u.unit_number}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Issue Title</Label>
              <Input required placeholder="e.g. Broken faucet, Electrical surge" value={newRequest.title} onChange={e => setNewRequest({...newRequest, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea required placeholder="Provide more details about the issue..." value={newRequest.description} onChange={e => setNewRequest({...newRequest, description: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={newRequest.priority} onValueChange={(val: any) => setNewRequest({...newRequest, priority: val})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600">Create Request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
  return (
    <Card className="p-6 flex items-center gap-4">
      <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
      <div>
        <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
      </div>
    </Card>
  );
}