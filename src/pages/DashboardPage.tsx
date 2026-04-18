import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Download,
  AlertCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { api } from '../lib/api';
import { Property, Tenant } from '../types';

const chartData = [
  { month: 'Jan', revenue: 450000, expenses: 120000 },
  { month: 'Feb', revenue: 480000, expenses: 130000 },
  { month: 'Mar', revenue: 470000, expenses: 115000 },
  { month: 'Apr', revenue: 520000, expenses: 140000 },
  { month: 'May', revenue: 510000, expenses: 125000 },
  { month: 'Jun', revenue: 550000, expenses: 150000 },
];

export default function DashboardPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [p, t] = await Promise.all([api.getProperties(), api.getTenants()]);
      setProperties(p);
      setTenants(t);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export Report
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus className="w-4 h-4" /> Add Property
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Properties" 
          value={properties.length.toString()} 
          trend="+2 this month" 
          trendUp={true} 
          icon={<Building2 className="text-blue-600" />}
        />
        <StatsCard 
          title="Total Tenants" 
          value={tenants.length.toString()} 
          trend="+5 new" 
          trendUp={true} 
          icon={<Users className="text-indigo-600" />}
        />
        <StatsCard 
          title="Revenue (KES)" 
          value="1.2M" 
          trend="+12% vs last month" 
          trendUp={true} 
          icon={<CreditCard className="text-green-600" />}
        />
        <StatsCard 
          title="Occupancy Rate" 
          value="94%" 
          trend="-2% vs last month" 
          trendUp={false} 
          icon={<TrendingUp className="text-amber-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900 text-lg">Revenue vs Expenses</h3>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-sm outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 text-lg">Recent Activity</h3>
            <Button variant="ghost" size="sm" className="text-blue-600 text-xs font-bold">VIEW ALL</Button>
          </div>
          <div className="space-y-6">
            <ActivityItem icon={<CreditCard className="text-green-600" />} bg="bg-green-50" title="Payment Received" subtitle="John Doe paid KES 45,000" time="2 mins ago" />
            <ActivityItem icon={<Plus className="text-blue-600" />} bg="bg-blue-50" title="New Booking" subtitle="Unit A102 reserved by Jane S." time="1 hour ago" />
            <ActivityItem icon={<AlertCircle className="text-red-600" />} bg="bg-red-50" title="Maintenance Request" subtitle="Leak reported in B304" time="3 hours ago" />
            <ActivityItem icon={<Users className="text-indigo-600" />} bg="bg-indigo-50" title="New Tenant" subtitle="Added Mark Omari to V01" time="5 hours ago" />
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-bold text-slate-900 text-lg">Properties</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search properties..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
              />
            </div>
            <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Property Name</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {properties.map((prop) => (
                <tr key={prop.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{prop.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{prop.address}</td>
                  <td className="px-6 py-4 text-right"><button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400"><MoreVertical className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function StatsCard({ title, value, trend, trendUp, icon }: { title: string, value: string, trend: string, trendUp: boolean, icon: React.ReactNode }) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-slate-50 rounded-xl">
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: 'w-6 h-6' }) : icon}
        </div>
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h4 className="text-3xl font-extrabold text-slate-900">{value}</h4>
        <div className="mt-4 flex items-center gap-1">
          {trendUp ? <ArrowUpRight className="w-4 h-4 text-green-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}
          <span className={`text-xs font-bold ${trendUp ? 'text-green-600' : 'text-red-600'}`}>{trend}</span>
        </div>
      </div>
    </Card>
  );
}

function ActivityItem({ icon, bg, title, subtitle, time }: { icon: React.ReactNode, bg: string, title: string, subtitle: string, time: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bg}`}>
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5' }) : icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900 leading-none mb-1">{title}</p>
        <p className="text-xs text-slate-500 truncate">{subtitle}</p>
      </div>
      <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{time}</span>
    </div>
  );
}