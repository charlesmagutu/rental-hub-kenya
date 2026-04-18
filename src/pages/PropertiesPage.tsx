import React, { useState } from 'react';
import { Building2, Plus, Search, MapPin, Home, MoreVertical, Edit2, Trash2, LayoutGrid, List } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockProperties } from '../lib/mockData';

export default function PropertiesPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Property Management</h1>
          <p className="text-slate-500">Manage your portfolio and view performance metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-slate-200 rounded-lg p-1">
            <button 
              onClick={() => setView('grid')}
              className={`p-1.5 rounded ${view === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-1.5 rounded ${view === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus className="w-4 h-4" /> Add New Property
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden group border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="relative h-48 overflow-hidden">
              <img src={property.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <Badge className="bg-blue-600 border-none mb-2">{property.units_count} Units</Badge>
                <h3 className="font-bold text-lg">{property.name}</h3>
              </div>
              <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/40">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-2 text-sm text-slate-500">
                <MapPin className="w-4 h-4 shrink-0 text-blue-600" />
                {property.address}
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Occupancy</p>
                  <p className="font-bold text-slate-900">92%</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Monthly Revenue</p>
                  <p className="font-bold text-green-600">KES 840k</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2 text-xs">
                  <Edit2 className="w-3 h-3" /> Edit
                </Button>
                <Button className="flex-1 bg-slate-900 hover:bg-slate-800 gap-2 text-xs">
                  <Home className="w-3 h-3" /> View Units
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {/* Empty State Card */}
        <button className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-all">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-bold">Add Another Property</span>
        </button>
      </div>
    </div>
  );
}