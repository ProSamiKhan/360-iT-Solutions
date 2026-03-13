import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { UserProfile, Client, Repair, Invoice, Technician } from '../types';
import { getStats, getClients, getRepairs, getInvoices, getTechnicians, addClient, addRepair } from '../services/dataService';
import { 
  Users, 
  Wrench, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Plus, 
  Search, 
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  X,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

interface AdminDashboardProps {
  user: UserProfile;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  return (
    <DashboardLayout user={user}>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/clients" element={<ClientsList />} />
        <Route path="/repairs" element={<RepairsList />} />
        <Route path="/invoices" element={<InvoicesList />} />
        {/* Add more routes as needed */}
      </Routes>
    </DashboardLayout>
  );
}

function Overview() {
  const [stats, setStats] = useState<any>(null);
  
  useEffect(() => {
    getStats().then(setStats);
  }, []);

  const data = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 2000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 1890 },
    { name: 'Sat', revenue: 2390 },
    { name: 'Sun', revenue: 3490 },
  ];

  if (!stats) return null;

  const cards = [
    { label: 'Total Clients', value: stats.totalClients, icon: <Users />, color: 'bg-blue-500', trend: '+12%' },
    { label: 'Total Repairs', value: stats.totalRepairs, icon: <Wrench />, color: 'bg-indigo-500', trend: '+5%' },
    { label: 'Pending Repairs', value: stats.pendingRepairs, icon: <Clock />, color: 'bg-amber-500', trend: '-2%' },
    { label: 'Completed', value: stats.completedRepairs, icon: <CheckCircle2 />, color: 'bg-emerald-500', trend: '+18%' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all">
            Download Report
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100">
            <Plus className="w-4 h-4" /> New Repair
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`${card.color} text-white p-3 rounded-2xl shadow-lg`}>
                {card.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${card.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {card.trend}
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{card.label}</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold">Revenue Analytics</h3>
            <select className="bg-slate-50 border-none rounded-xl text-xs font-bold px-4 py-2">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Total Revenue</h3>
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-indigo-50 text-indigo-600 mb-4">
              <TrendingUp className="w-10 h-10" />
            </div>
            <h4 className="text-4xl font-extrabold text-slate-900">₹{stats.totalRevenue.toLocaleString()}</h4>
            <p className="text-slate-500 text-sm mt-2">Total earnings to date</p>
          </div>
          <div className="space-y-4 mt-8">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
              <span className="text-sm font-medium text-slate-600">Daily Average</span>
              <span className="text-sm font-bold">₹{(stats.totalRevenue / 30).toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
              <span className="text-sm font-medium text-slate-600">Monthly Growth</span>
              <span className="text-sm font-bold text-emerald-600">+12.5%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClientsList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', phone: '', email: '', address: '' });

  useEffect(() => {
    return getClients((data) => {
      setClients(data);
      setLoading(false);
    });
  }, []);

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addClient(newClient);
      setShowModal(false);
      setNewClient({ name: '', phone: '', email: '', address: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Clients Management</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
        >
          <Plus className="w-5 h-5" /> Add New Client
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Add New Client</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-50 rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={newClient.name}
                  onChange={e => setNewClient({...newClient, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Number</label>
                <input 
                  required
                  type="tel" 
                  value={newClient.phone}
                  onChange={e => setNewClient({...newClient, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={newClient.email}
                  onChange={e => setNewClient({...newClient, email: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Address</label>
                <textarea 
                  value={newClient.address}
                  onChange={e => setNewClient({...newClient, address: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-600 h-24"
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all">
                Save Client
              </button>
            </form>
          </motion.div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name, phone or email..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Client Name</th>
              <th className="px-6 py-4">Phone Number</th>
              <th className="px-6 py-4">Email Address</th>
              <th className="px-6 py-4">Joined Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      {client.name.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-900">{client.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 font-medium">{client.phone}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{client.email || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{new Date(client.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-indigo-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {clients.length === 0 && !loading && (
          <div className="p-12 text-center text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No clients found. Add your first client to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function RepairsList() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [newRepair, setNewRepair] = useState({
    clientId: '',
    deviceId: 'demo-device', // Simplified for demo
    problemDescription: '',
    serviceType: 'Hardware Repair',
    status: 'Received' as Repair['status'],
    remarks: ''
  });

  useEffect(() => {
    getClients(setClients);
    return getRepairs((data) => {
      setRepairs(data);
      setLoading(false);
    });
  }, []);

  const handleAddRepair = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addRepair(newRepair);
      setShowModal(false);
      setNewRepair({
        clientId: '',
        deviceId: 'demo-device',
        problemDescription: '',
        serviceType: 'Hardware Repair',
        status: 'Received',
        remarks: ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status: Repair['status']) => {
    switch (status) {
      case 'Received': return 'bg-blue-50 text-blue-600';
      case 'Diagnosing': return 'bg-amber-50 text-amber-600';
      case 'Repairing': return 'bg-indigo-50 text-indigo-600';
      case 'Waiting Parts': return 'bg-red-50 text-red-600';
      case 'Completed': return 'bg-emerald-50 text-emerald-600';
      case 'Delivered': return 'bg-slate-100 text-slate-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Repair Jobs</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
        >
          <Plus className="w-5 h-5" /> New Repair Job
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">New Repair Job</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-50 rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddRepair} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Select Client</label>
                <select 
                  required
                  value={newRepair.clientId}
                  onChange={e => setNewRepair({...newRepair, clientId: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="">Choose a client...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Service Type</label>
                <select 
                  value={newRepair.serviceType}
                  onChange={e => setNewRepair({...newRepair, serviceType: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-600"
                >
                  <option>Hardware Repair</option>
                  <option>Software Installation</option>
                  <option>Virus Removal</option>
                  <option>Data Recovery</option>
                  <option>Networking Setup</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Problem Description</label>
                <textarea 
                  required
                  value={newRepair.problemDescription}
                  onChange={e => setNewRepair({...newRepair, problemDescription: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-600 h-24"
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all">
                Create Repair Job
              </button>
            </form>
          </motion.div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Tracking ID</th>
              <th className="px-6 py-4">Service Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Updated</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {repairs.map((repair) => (
              <tr key={repair.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-bold text-indigo-600">{repair.trackingId}</span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{repair.serviceType}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(repair.status)}`}>
                    {repair.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{new Date(repair.updatedAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-indigo-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InvoicesList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    return getInvoices(setInvoices);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Invoices</h2>
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
                  <button className="p-2 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-indigo-600">
                    <FileText className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
