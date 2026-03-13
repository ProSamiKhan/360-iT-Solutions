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
  FileText,
  QrCode,
  Zap,
  Activity,
  Cpu,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { QRCodeSVG } from 'qrcode.react';

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
      </Routes>
    </DashboardLayout>
  );
}

function Overview() {
  const [stats, setStats] = useState<any>(null);
  
  useEffect(() => {
    getStats().then(setStats);
  }, []);

  const revenueData = [
    { name: 'Mon', revenue: 4000, repairs: 12 },
    { name: 'Tue', revenue: 3000, repairs: 8 },
    { name: 'Wed', revenue: 5000, repairs: 15 },
    { name: 'Thu', revenue: 2780, repairs: 9 },
    { name: 'Fri', revenue: 6890, repairs: 20 },
    { name: 'Sat', revenue: 4390, repairs: 14 },
    { name: 'Sun', revenue: 3490, repairs: 10 },
  ];

  const techPerformance = [
    { name: 'Sami', value: 45 },
    { name: 'Rahul', value: 30 },
    { name: 'Imran', value: 25 },
  ];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b'];

  if (!stats) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-indigo-100 rounded-full"></div>
        <div className="h-4 w-32 bg-slate-100 rounded"></div>
      </div>
    </div>
  );

  const cards = [
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <TrendingUp />, color: 'bg-indigo-600', trend: '+12.5%', desc: 'vs last month' },
    { label: 'Active Repairs', value: stats.pendingRepairs, icon: <Activity />, color: 'bg-amber-500', trend: '+3', desc: 'new today' },
    { label: 'Total Clients', value: stats.totalClients, icon: <Users />, color: 'bg-blue-500', trend: '+8', desc: 'this week' },
    { label: 'Success Rate', value: '98%', icon: <Zap />, color: 'bg-emerald-500', trend: '+2%', desc: 'customer satisfaction' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Command Center</h1>
          <p className="text-slate-500 font-medium">Real-time operational intelligence for 360 iT Solutions.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none bg-white border border-slate-200 px-6 py-3 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
            Export Data
          </button>
          <button className="flex-1 md:flex-none bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200">
            <Plus className="w-4 h-4" /> New Job
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`${card.color} text-white p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
              <div className="text-right">
                <span className={`text-xs font-black px-2 py-1 rounded-lg ${card.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {card.trend}
                </span>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{card.desc}</p>
              </div>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{card.label}</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{card.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900">Revenue Velocity</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Weekly growth trajectory</p>
            </div>
            <div className="flex bg-slate-50 p-1 rounded-xl">
              <button className="px-4 py-1.5 text-xs font-bold bg-white rounded-lg shadow-sm">Revenue</button>
              <button className="px-4 py-1.5 text-xs font-bold text-slate-400">Repairs</button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 700, fill: '#94a3b8'}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 700, fill: '#94a3b8'}} />
                <Tooltip 
                  cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-3xl rounded-full -mr-16 -mt-16"></div>
          <h3 className="text-xl font-black mb-2">Tech Performance</h3>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8">Repair distribution</p>
          
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={techPerformance}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {techPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black">100%</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Efficiency</span>
            </div>
          </div>

          <div className="space-y-4 mt-8">
            {techPerformance.map((tech, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className="text-sm font-bold">{tech.name}</span>
                </div>
                <span className="text-xs font-black text-slate-400">{tech.value}%</span>
              </div>
            ))}
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
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Client Directory</h2>
          <p className="text-slate-500 text-sm font-medium">Manage your customer database and history.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="w-full md:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-200"
        >
          <Plus className="w-5 h-5" /> Register Client
        </button>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-slate-100"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-900">New Client</h3>
                <button onClick={() => setShowModal(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-all"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleAddClient} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Full Identity</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Rahul Sharma"
                    value={newClient.name}
                    onChange={e => setNewClient({...newClient, name: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 font-bold placeholder:text-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Node</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="+91 00000 00000"
                    value={newClient.phone}
                    onChange={e => setNewClient({...newClient, phone: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 font-bold placeholder:text-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email Protocol</label>
                  <input 
                    type="email" 
                    placeholder="rahul@example.com"
                    value={newClient.email}
                    onChange={e => setNewClient({...newClient, email: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 font-bold placeholder:text-slate-300"
                  />
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                  Confirm Registration
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30">
          <div className="relative max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Filter clients by name or phone..." 
              className="w-full pl-14 pr-6 py-4 bg-white border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 shadow-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-6">Identity</th>
                <th className="px-8 py-6">Contact</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Joined</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-110 transition-transform">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900">{client.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{client.email || 'NO EMAIL'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-black text-slate-600 text-sm">{client.phone}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Active</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-slate-400">{new Date(client.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-3 hover:bg-white rounded-xl transition-all text-slate-300 hover:text-indigo-600 shadow-sm border border-transparent hover:border-slate-100">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
    deviceId: 'demo-device',
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
      case 'Received': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Diagnosing': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Repairing': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'Waiting Parts': return 'bg-red-50 text-red-600 border-red-100';
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Delivered': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Repair Matrix</h2>
          <p className="text-slate-500 text-sm font-medium">Track and manage active service operations.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200"
        >
          <Plus className="w-5 h-5" /> Initiate Job
        </button>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-slate-100"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-900">New Repair Job</h3>
                <button onClick={() => setShowModal(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-all"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleAddRepair} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Target Client</label>
                  <select 
                    required
                    value={newRepair.clientId}
                    onChange={e => setNewRepair({...newRepair, clientId: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 font-bold appearance-none"
                  >
                    <option value="">Select from directory...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Service Protocol</label>
                  <select 
                    value={newRepair.serviceType}
                    onChange={e => setNewRepair({...newRepair, serviceType: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 font-bold appearance-none"
                  >
                    <option>Hardware Repair</option>
                    <option>Software Installation</option>
                    <option>Virus Removal</option>
                    <option>Data Recovery</option>
                    <option>Networking Setup</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Diagnostic Notes</label>
                  <textarea 
                    required
                    placeholder="Describe the technical failure..."
                    value={newRepair.problemDescription}
                    onChange={e => setNewRepair({...newRepair, problemDescription: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 font-bold h-32 placeholder:text-slate-300"
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200">
                  Execute Job Initiation
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-6">
        {repairs.map((repair) => (
          <motion.div 
            key={repair.id} 
            whileHover={{ scale: 1.01 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="flex flex-col lg:flex-row justify-between gap-8">
              <div className="flex gap-8">
                <div className="bg-slate-900 p-4 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-slate-200">
                  <QRCodeSVG value={repair.trackingId} size={64} fgColor="#FFFFFF" bgColor="transparent" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] bg-indigo-50 px-3 py-1 rounded-lg">{repair.trackingId}</span>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(repair.status)}`}>
                      {repair.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">{repair.serviceType}</h3>
                  <p className="text-slate-500 font-medium mt-2 max-w-xl">{repair.problemDescription}</p>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between border-t lg:border-t-0 lg:border-l border-slate-50 pt-6 lg:pt-0 lg:pl-8">
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Sync</p>
                  <p className="text-sm font-black text-slate-900">{new Date(repair.updatedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-3 mt-6 lg:mt-0">
                  <button className="p-4 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all border border-transparent hover:border-indigo-100">
                    <FileText className="w-5 h-5" />
                  </button>
                  <button className="px-6 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
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
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Ledger</h2>
          <p className="text-slate-500 text-sm font-medium">Financial records and billing history.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-6">Reference</th>
                <th className="px-8 py-6">Value</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Timestamp</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="font-black text-slate-900">{inv.invoiceNumber}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-lg font-black text-slate-900">₹{inv.totalAmount.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${inv.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {inv.paymentStatus}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-slate-400">{new Date(inv.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-3 bg-white border border-slate-100 rounded-xl text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                      <FileText className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
