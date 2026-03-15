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
  Truck
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Repairs</h1>
        <p className="text-slate-500 text-sm">Track the status of your devices and service history.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {repairs.map((repair) => (
          <div key={repair.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex gap-6">
                <div className="bg-indigo-50 text-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0">
                  {getStatusIcon(repair.status)}
                </div>
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{repair.trackingId}</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">{repair.serviceType}</h3>
                  <p className="text-slate-500 text-sm mt-1">{repair.problemDescription}</p>
                </div>
              </div>
              <div className="flex flex-col items-end justify-center">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2
                  ${repair.status === 'Completed' || repair.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}
                `}>
                  {repair.status}
                </span>
                <p className="text-xs text-slate-400 font-medium">Last updated: {new Date(repair.updatedAt).toLocaleDateString()}</p>
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Invoices</h1>
        <p className="text-slate-500 text-sm">View and download your service bills.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Invoice #</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">{inv.invoiceNumber}</td>
                <td className="px-6 py-4 font-bold text-slate-900">₹{inv.totalAmount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${inv.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {inv.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{new Date(inv.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-indigo-600 font-bold text-sm hover:underline">Download PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
