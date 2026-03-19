import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { UserProfile, Repair, Invoice } from '../types';
import { getRepairs, getInvoices } from '../services/dataService';
import { 
  Wrench, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Package,
  Truck,
  Download
} from 'lucide-react';

interface ClientDashboardProps {
  user: UserProfile;
}

export default function ClientDashboard({ user }: ClientDashboardProps) {
  return (
    <DashboardLayout user={user}>
      <Routes>
        <Route path="/" element={<MyRepairs user={user} />} />
        <Route path="/invoices" element={<MyInvoices user={user} />} />
      </Routes>
    </DashboardLayout>
  );
}

function MyRepairs({ user }: { user: UserProfile }) {
  const [repairs, setRepairs] = useState<Repair[]>([]);

  useEffect(() => {
    return getRepairs((data) => {
      setRepairs(data); 
    }, user.uid);
  }, [user.uid]);

  const getStatusIcon = (status: Repair['status']) => {
    switch (status) {
      case 'Received': return <Package className="w-5 h-5" />;
      case 'Completed': return <CheckCircle2 className="w-5 h-5" />;
      case 'Delivered': return <Truck className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">My Repairs</h1>
        <p className="text-slate-500 text-xs md:text-sm font-medium">Track the status of your devices and service history.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {repairs.map((repair) => (
          <div key={repair.id} className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="bg-indigo-50 text-indigo-600 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform mx-auto sm:mx-0">
                  {getStatusIcon(repair.status)}
                </div>
                <div className="text-center sm:text-left">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] bg-indigo-50/50 px-3 py-1 rounded-lg">{repair.trackingId}</span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">{repair.serviceType}</h3>
                  <p className="text-slate-500 text-sm font-medium mt-1">{repair.problemDescription}</p>
                </div>
              </div>
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-50 pt-4 md:pt-0 md:pl-6">
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest
                  ${repair.status === 'Completed' || repair.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}
                `}>
                  {repair.status}
                </span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Updated: {new Date(repair.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}

        {repairs.length === 0 && (
          <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-400">
            <Wrench className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>You don't have any repair jobs yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MyInvoices({ user }: { user: UserProfile }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    return getInvoices(setInvoices, user.uid);
  }, [user.uid]);

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">My Invoices</h1>
        <p className="text-slate-500 text-xs md:text-sm font-medium">View and download your service bills.</p>
      </div>

      <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-6">Invoice #</th>
                <th className="px-8 py-6">Amount</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Date</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6 font-black text-slate-900">{inv.invoiceNumber}</td>
                  <td className="px-8 py-6 font-black text-slate-900">₹{inv.totalAmount.toLocaleString()}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${inv.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {inv.paymentStatus}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-400">{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline flex items-center gap-2 ml-auto">
                      <Download className="w-4 h-4" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-slate-50">
          {invoices.map((inv) => (
            <div key={inv.id} className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Invoice Number</p>
                  <p className="font-black text-slate-900">{inv.invoiceNumber}</p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${inv.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {inv.paymentStatus}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Amount</p>
                  <p className="font-black text-slate-900">₹{inv.totalAmount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                  <p className="text-xs font-bold text-slate-900">{new Date(inv.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                <Download className="w-4 h-4" /> Download Invoice PDF
              </button>
            </div>
          ))}
        </div>

        {invoices.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-bold text-sm">No invoices found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
