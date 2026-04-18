import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  BedDouble, 
  Square, 
  Search, 
  Filter, 
  Info, 
  CheckCircle2,
  Calendar,
  X,
  CreditCard,
  Building2,
  Phone,
  Mail,
  Maximize2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { Unit, Property } from '../types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface MarketplacePageProps {
  onBack: () => void;
}

export default function MarketplacePage({ onBack }: MarketplacePageProps) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [applicant, setApplicant] = useState({ name: '', email: '', phone: '', date: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [u, p] = await Promise.all([api.getUnits(), api.getProperties()]);
    setUnits(u);
    setProperties(p);
  };

  const availableUnits = units.filter(u => u.status === 'AVAILABLE');

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnit) return;
    setIsBooking(true);
    try {
      await api.createBooking(selectedUnit.id, applicant);
      toast.success('Your booking request has been submitted!');
      setSelectedUnit(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Booking failed');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Find Your Next Home</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-full gap-2"><Filter className="w-4 h-4" /> Filters</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Available Listings</h2>
          <p className="text-slate-500">{availableUnits.length} premium units ready for move-in.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {availableUnits.map((unit) => {
            const property = properties.find(p => p.id === unit.property_id);
            return (
              <motion.div 
                key={unit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="cursor-pointer"
                onClick={() => setSelectedUnit(unit)}
              >
                <Card className="overflow-hidden border-slate-100 shadow-lg group">
                  <div className="relative h-64">
                    <img src={property?.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute bottom-4 right-4">
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg">KES {unit.rent_amount.toLocaleString()}/mo</div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{property?.name} - {unit.unit_number}</h3>
                    <p className="text-slate-500 text-sm flex items-center gap-1 mb-4"><MapPin className="w-3.5 h-3.5" /> {property?.address}</p>
                    <div className="flex items-center gap-4 py-4 border-t border-slate-100 mb-4">
                      <Badge variant="secondary">{unit.type}</Badge>
                      <div className="flex items-center gap-1 text-xs text-slate-500 font-bold uppercase"><CheckCircle2 className="w-3 h-3 text-green-500" /> Verified</div>
                    </div>
                    <Button className="w-full bg-slate-900 hover:bg-blue-600 rounded-xl">View Details</Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </main>

      <AnimatePresence>
        {selectedUnit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedUnit(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div layoutId={selectedUnit.id} className="relative bg-white w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col">
               <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/2 relative">
                    <img src={properties.find(p => p.id === selectedUnit.property_id)?.image} className="w-full h-80 md:h-full object-cover" alt="" />
                    <Badge className="absolute top-6 left-6 bg-white/90 text-slate-900 border-none px-4 py-2 text-sm">Unit {selectedUnit.unit_number}</Badge>
                  </div>
                  <div className="p-8 md:w-1/2">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-3xl font-bold">{selectedUnit.type}</h2>
                        <p className="text-slate-500">Available for KES {selectedUnit.rent_amount.toLocaleString()} / Month</p>
                      </div>
                      <button onClick={() => setSelectedUnit(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-6 h-6" /></button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <p className="text-xs text-slate-400 font-bold uppercase mb-1">Features</p>
                         <div className="flex flex-wrap gap-2">
                           {selectedUnit.features.map(f => <Badge key={f} variant="outline" className="text-[10px]">{f}</Badge>)}
                         </div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <p className="text-xs text-slate-400 font-bold uppercase mb-1">Lease</p>
                         <p className="text-sm font-bold">12 Months Min</p>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold flex items-center gap-2"><Maximize2 className="w-4 h-4 text-blue-600" /> Visual Layout</h4>
                        <span className="text-xs text-slate-400">Architectural Blueprint</span>
                      </div>
                      <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                        <img src={selectedUnit.layout_image} alt="Unit Layout" className="w-full h-full object-contain" />
                      </div>
                    </div>

                    <form onSubmit={handleBook} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input required value={applicant.name} onChange={e => setApplicant({...applicant, name: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Email</Label><Input type="email" required value={applicant.email} onChange={e => setApplicant({...applicant, email: e.target.value})} /></div>
                        <div className="space-y-2"><Label>Phone</Label><Input type="tel" required value={applicant.phone} onChange={e => setApplicant({...applicant, phone: e.target.value})} /></div>
                      </div>
                      <div className="space-y-2">
                        <Label>Desired Move-in Date</Label>
                        <Input type="date" required value={applicant.date} onChange={e => setApplicant({...applicant, date: e.target.value})} />
                      </div>
                      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 my-6">
                         <div className="flex justify-between items-center mb-1">
                           <span className="text-blue-700 font-bold">Reservation Fee</span>
                           <span className="font-bold">KES 10,000</span>
                         </div>
                         <p className="text-[10px] text-blue-600 font-medium">Deductible from first month's rent. Non-refundable if application is canceled.</p>
                      </div>
                      <Button type="submit" className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold shadow-lg shadow-blue-600/30" disabled={isBooking}>
                        {isBooking ? 'Submitting...' : 'Reserve Unit Now'}
                      </Button>
                    </form>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}