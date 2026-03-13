import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { UserProfile, Client, Repair, Invoice, Technician } from '../types';
import { 
  getStats, 
  getClients, 
  getRepairs, 
  getInvoices, 
  getTechnicians, 
  addClient, 
  addRepair, 
  updateRepairStatus, 
  deleteClient, 
  seedDemoData,
  getRepairsByClientId
} from '../services/dataService';
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
  ShieldCheck,
  History,
  AlertCircle,
  BarChart3,
  Bell
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
        <Route path="/payments" element={<PaymentsView />} />
        <Route path="/notifications" element={<NotificationsView />} />
        <Route path="/reports" element={<ReportsView />} />
      </Routes>
    </DashboardLayout>
  );
}

function Overview() {
  const [stats, setStats] = useState<any>(null);
  const [seeding, setSeeding] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    getStats().then(setStats);
  }, []);

  const handleSeedData = async () => {
    if (confirm('This will add 10 demo clients and several repairs. Continue?')) {
      setSeeding(true);
      try {
        await seedDemoData();
        const newStats = await getStats();
        setStats(newStats);
        alert('Demo data seeded successfully!');
      } catch (err) {
        console.error(err);
        alert('Failed to seed data.');
      } finally {
        setSeeding(false);
      }
    }
  };

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
          <button 
            onClick={handleSeedData}
            disabled={seeding}
            className="flex-1 md:flex-none bg-indigo-50 text-indigo-600 border border-indigo-100 px-6 py-3 rounded-2xl text-sm font-bold hover:bg-indigo-100 transition-all shadow-sm disabled:opacity-50"
          >
            {seeding ? 'Seeding...' : 'Seed 25 Clients'}
          </button>
          <button className="flex-1 md:flex-none bg-white border border-slate-200 px-6 py-3 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
            Export Data
          </button>
          <button 
            onClick={() => navigate('/repairs')}
            className="flex-1 md:flex-none bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200"
          >
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
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [historyClient, setHistoryClient] = useState<{client: Client, repairs: Repair[]} | null>(null);

  useEffect(() => {
    return getClients((data) => {
      setClients(data);
      setLoading(false);
    });
  }, []);

  const handleViewHistory = async (client: Client) => {
    const repairs = await getRepairsByClientId(client.id);
    setHistoryClient({ client, repairs });
    setActiveMenu(null);
  };

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

  const handleDeleteClient = async (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteClient(id);
        setActiveMenu(null);
      } catch (err) {
        console.error(err);
      }
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
                  <td className="px-8 py-6 text-right relative">
                    <button 
                      onClick={() => setActiveMenu(activeMenu === client.id ? null : client.id)}
                      className="p-3 hover:bg-white rounded-xl transition-all text-slate-300 hover:text-indigo-600 shadow-sm border border-transparent hover:border-slate-100"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    <AnimatePresence>
                      {activeMenu === client.id && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-8 top-16 z-10 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2"
                        >
                          <button 
                            onClick={() => handleViewHistory(client)}
                            className="w-full text-left px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-2"
                          >
                            <History className="w-4 h-4" /> View History
                          </button>
                          <button 
                            onClick={() => handleDeleteClient(client.id)}
                            className="w-full text-left px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            Delete Client
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {historyClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-2xl w-full shadow-2xl border border-slate-100 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{historyClient.client.name}</h3>
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Service History • {historyClient.repairs.length} Visits</p>
                </div>
                <button onClick={() => setHistoryClient(null)} className="p-3 hover:bg-slate-50 rounded-2xl transition-all"><X className="w-6 h-6" /></button>
              </div>
              
              <div className="space-y-4">
                {historyClient.repairs.length === 0 ? (
                  <p className="text-center py-12 text-slate-400 font-bold">No repair history found.</p>
                ) : (
                  historyClient.repairs.map((repair) => (
                    <div key={repair.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-[10px] font-black text-indigo-600 bg-white px-2 py-1 rounded border border-indigo-100 uppercase tracking-widest">{repair.trackingId}</span>
                          <h4 className="text-lg font-black text-slate-900 mt-2">{repair.serviceType}</h4>
                        </div>
                        <span className="px-3 py-1 bg-white rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200">
                          {repair.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 font-medium">{repair.problemDescription}</p>
                      <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date: {new Date(repair.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RepairsList() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState<Repair | null>(null);
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

  const handleUpdateStatus = async (repairId: string, status: Repair['status']) => {
    try {
      await updateRepairStatus(repairId, status);
      setShowStatusModal(null);
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
                  
                  {repair.status === 'Completed' && (
                    <div className="mt-4 flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 animate-pulse">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-widest">Please collect as soon as possible</span>
                    </div>
                  )}
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
                  <button 
                    onClick={() => setShowStatusModal(repair)}
                    className="px-6 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showStatusModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-slate-100"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-900">Update Status</h3>
                <button onClick={() => setShowStatusModal(null)} className="p-3 hover:bg-slate-50 rounded-2xl transition-all"><X className="w-6 h-6" /></button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {['Received', 'Diagnosing', 'Repairing', 'Waiting Parts', 'Completed', 'Delivered'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleUpdateStatus(showStatusModal.id, status as Repair['status'])}
                    className={`w-full py-4 rounded-2xl font-black text-sm transition-all ${
                      showStatusModal.status === status 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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

function ReportsView() {
  const [stats, setStats] = useState<any>(null);
  
  useEffect(() => {
    getStats().then(setStats);
  }, []);

  if (!stats) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Intelligence Reports</h2>
          <p className="text-slate-500 text-sm font-medium">Deep dive into your business metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <BarChart3 className="w-8 h-8 text-indigo-600 mb-4" />
          <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Revenue</h4>
          <p className="text-3xl font-black text-slate-900 mt-1">₹{stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-4" />
          <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Repairs Completed</h4>
          <p className="text-3xl font-black text-slate-900 mt-1">{stats.completedRepairs}</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <Users className="w-8 h-8 text-blue-500 mb-4" />
          <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Client Growth</h4>
          <p className="text-3xl font-black text-slate-900 mt-1">{stats.totalClients}</p>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl">
        <h3 className="text-xl font-black mb-6">Notification Center</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-bold">System Update</p>
              <p className="text-xs text-slate-500">All services are running at optimal speed.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold">Revenue Milestone</p>
              <p className="text-xs text-slate-500">You've reached 90% of your monthly goal.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentsView() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  
  useEffect(() => {
    return getInvoices(setInvoices);
  }, []);

  const totalRevenue = invoices.reduce((acc, inv) => acc + (inv.paymentStatus === 'Paid' ? inv.totalAmount : 0), 0);
  const pendingRevenue = invoices.reduce((acc, inv) => acc + (inv.paymentStatus === 'Pending' ? inv.totalAmount : 0), 0);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Payments Hub</h2>
          <p className="text-slate-500 text-sm font-medium">Monitor revenue and transaction health.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Collected</p>
          <h3 className="text-4xl font-black text-slate-900">₹{totalRevenue.toLocaleString()}</h3>
          <div className="mt-6 h-2 bg-slate-50 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pending Receivables</p>
          <h3 className="text-4xl font-black text-slate-900">₹{pendingRevenue.toLocaleString()}</h3>
          <div className="mt-6 h-2 bg-slate-50 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: '25%' }}></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50">
          <h3 className="text-lg font-black text-slate-900">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-6">Transaction ID</th>
                <th className="px-8 py-6">Client</th>
                <th className="px-8 py-6">Amount</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {invoices.filter(i => i.paymentStatus === 'Paid').map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6 font-black text-slate-900">TXN-{inv.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-8 py-6 font-black text-slate-900">Client ID: {inv.clientId.slice(0, 5)}</td>
                  <td className="px-8 py-6 font-black text-slate-900">₹{inv.totalAmount.toLocaleString()}</td>
                  <td className="px-8 py-6">
                    <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                      Success
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-slate-500">{new Date(inv.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function NotificationsView() {
  const notifications = [
    { id: 1, title: 'New Repair Job', message: 'Client "Rahul Sharma" initiated a new hardware repair.', time: '2 hours ago', type: 'info' },
    { id: 2, title: 'Payment Received', message: 'Invoice #INV-001 has been paid successfully.', time: '5 hours ago', type: 'success' },
    { id: 3, title: 'Low Inventory', message: 'Thermal paste stock is running low.', time: '1 day ago', type: 'warning' },
    { id: 4, title: 'System Update', message: 'Dashboard v2.1 is now live with new features.', time: '2 days ago', type: 'info' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Notification Center</h2>
        <p className="text-slate-500 text-sm font-medium">Stay updated with real-time system alerts.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {notifications.map((n) => (
          <div key={n.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex gap-6 items-start hover:shadow-md transition-all">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              n.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 
              n.type === 'warning' ? 'bg-amber-50 text-amber-600' : 
              'bg-indigo-50 text-indigo-600'
            }`}>
              {n.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : 
               n.type === 'warning' ? <AlertCircle className="w-6 h-6" /> : 
               <Bell className="w-6 h-6" />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-black text-slate-900">{n.title}</h4>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{n.time}</span>
              </div>
              <p className="text-slate-500 text-sm mt-1 font-medium">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
