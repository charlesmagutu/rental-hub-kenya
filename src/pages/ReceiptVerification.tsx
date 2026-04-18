import React, { useState } from 'react';
import { ShieldCheck, Search, Download, Printer, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '../lib/api';
import { Receipt } from '../types';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ReceiptVerification({ onBack }: { onBack: () => void }) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<Receipt | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setError(false);
    setResult(null);
    try {
      const found = await api.verifyReceipt(query);
      if (found) setResult(found);
      else setError(true);
    } catch (e) {
      toast.error('Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById('receipt-card');
    if (!element) return;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.save(`Receipt-${result?.receipt_number}.pdf`);
    toast.success('Receipt downloaded successfully');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
      <div className="max-w-2xl w-full text-center mb-12">
        <ShieldCheck className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold">Verification Portal</h1>
        <p className="text-slate-600 mt-2">Verify the authenticity of any RentFlow digital receipt.</p>
      </div>

      <Card className="max-w-xl w-full p-8 shadow-xl mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <label className="text-sm font-bold text-slate-700">RECEIPT OR REFERENCE NO.</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input value={query} onChange={e => setQuery(e.target.value)} className="w-full pl-12 pr-4 h-14 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. RCP-2023-001" required />
          </div>
          <Button type="submit" className="w-full h-14 bg-blue-600 hover:bg-blue-700 font-bold rounded-xl" disabled={isSearching}>{isSearching ? 'Verifying...' : 'Verify Authenticity'}</Button>
        </form>
        {error && <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl flex gap-3"><XCircle className="shrink-0" /> Record not found</div>}
      </Card>

      {result && (
        <div className="max-w-xl w-full">
          <Card id="receipt-card" className="overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="bg-green-600 p-6 text-center text-white">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-2" />
              <h2 className="text-xl font-bold uppercase tracking-widest">Verified Receipt</h2>
              <p className="text-green-100 text-xs">Code: {result.verification_code}</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex justify-between"><span className="text-slate-400 font-bold uppercase text-[10px]">Tenant</span><span className="font-bold">{result.tenant_name}</span></div>
              <div className="flex justify-between"><span className="text-slate-400 font-bold uppercase text-[10px]">Property</span><span className="font-bold">{result.property_name}</span></div>
              <div className="flex justify-between border-t border-slate-100 pt-6"><span className="text-lg font-bold">Total Paid</span><span className="text-2xl font-black">KES {result.amount_paid.toLocaleString()}</span></div>
              <div className="flex gap-4 pt-4">
                <Button variant="outline" className="flex-1 rounded-xl h-12" onClick={downloadPDF}><Download className="w-4 h-4 mr-2" /> PDF</Button>
                <Button variant="outline" className="flex-1 rounded-xl h-12" onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" /> Print</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
      <button onClick={onBack} className="mt-12 text-slate-500 flex items-center gap-2 font-bold"><ArrowLeft className="w-4 h-4" /> Back Home</button>
    </div>
  );
}