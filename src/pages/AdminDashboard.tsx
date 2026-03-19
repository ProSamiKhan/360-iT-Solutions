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
  updateClient,
  addRepair, 
  updateRepairStatus, 
  deleteClient, 
  seedDemoData 
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
  Eye,
  Edit2,
  Trash2,
  Download
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
    </div>
  );
}

function ClientProfileModal({ client, onClose }: { client: Client, onClose: () => void }) {
  const [history, setHistory] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return getRepairs((data) => {
      setHistory(data);
      setLoading(false);
    }, client.id);
  }, [client.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 max-w-2xl w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h3 className="text-xl md:text-2xl font-black text-slate-900">Client Profile</h3>
          <button onClick={onClose} className="p-2 md:p-3 hover:bg-slate-50 rounded-2xl transition-all"><X className="w-5 h-5 md:w-6 md:h-6" /></button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-10">
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] md:rounded-[2.5rem] bg-indigo-600 text-white flex items-center justify-center text-4xl md:text-5xl font-black shadow-xl shadow-indigo-200 mb-4">
              {client.name?.charAt(0) || '?'}
            </div>
            <h4 className="text-lg md:text-xl font-black text-slate-900 text-center">{client.name}</h4>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest text-center mt-1 truncate max-w-full">{client.email}</p>
          </div>
          
          <div className="md:col-span-2 grid grid-cols-1 gap-3 md:gap-4">
            <div className="bg-slate-50 p-4 md:p-5 rounded-2xl">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
              <p className="font-bold text-slate-700 text-sm md:text-base">{client.phone || 'Not provided'}</p>
            </div>
            <div className="bg-slate-50 p-4 md:p-5 rounded-2xl">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Address</p>
              <p className="font-bold text-slate-700 text-sm md:text-base">{client.address || 'Not provided'}</p>
            </div>
            <div className="bg-slate-50 p-4 md:p-5 rounded-2xl">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Registration Date</p>
              <p className="font-bold text-slate-700 text-sm md:text-base">{new Date(client.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h5 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            Service History
          </h5>
          
          {loading ? (
            <div className="py-10 text-center text-slate-400 font-bold text-sm">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="py-10 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
              <p className="text-slate-400 font-bold text-sm">No repair history found for this client.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((repair) => (
                <div key={repair.id} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{repair.trackingId}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">•</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(repair.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="font-black text-slate-900">{repair.serviceType}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                    repair.status === 'Delivered' ? 'bg-slate-200 text-slate-600' :
                    repair.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {repair.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button 
          onClick={onClose}
          className="w-full mt-10 bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
        >
          Close Profile
        </button>
      </motion.div>
    </div>
  );
}

function ClientsList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [viewClient, setViewClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState({ name: '', phone: '', email: '', address: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    return getClients((data) => {
      setClients(data);
      setLoading(false);
    });
  }, []);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editClient) return;
    try {
      await updateClient(editClient.id, {
        name: editClient.name,
        phone: editClient.phone,
        email: editClient.email,
        address: editClient.address
      });
      setEditClient(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteClient(id);
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
        {editClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 max-w-md w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-black text-slate-900">Edit Client</h3>
                <button onClick={() => setEditClient(null)} className="p-2 md:p-3 hover:bg-slate-50 rounded-2xl transition-all"><X className="w-5 h-5 md:w-6 md:h-6" /></button>
              </div>
              <form onSubmit={handleUpdateClient} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Full Identity</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Rahul Sharma"
                    value={editClient.name}
                    onChange={e => setEditClient({...editClient, name: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 font-bold placeholder:text-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Node</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="+91 00000 00000"
                    value={editClient.phone}
                    onChange={e => setEditClient({...editClient, phone: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 font-bold placeholder:text-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email Protocol</label>
                  <input 
                    type="email" 
                    placeholder="rahul@example.com"
                    value={editClient.email || ''}
                    onChange={e => setEditClient({...editClient, email: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 font-bold placeholder:text-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Address</label>
                  <input 
                    type="text" 
                    placeholder="Client Address"
                    value={editClient.address || ''}
                    onChange={e => setEditClient({...editClient, address: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 font-bold placeholder:text-slate-300"
                  />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200">
                  Save Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {viewClient && (
          <ClientProfileModal 
            client={viewClient} 
            onClose={() => setViewClient(null)} 
          />
        )}
      </AnimatePresence>

      <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 md:p-8 border-b border-slate-50 bg-slate-50/30">
          <div className="relative max-w-md">
            <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 md:w-5 md:h-5" />
            <input 
              type="text" 
              placeholder="Search clients..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 md:pl-14 pr-4 md:pr-6 py-3 md:py-4 bg-white border-none rounded-xl md:rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 shadow-sm"
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
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
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-110 transition-transform">
                        {client.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-black text-slate-900">{client.name || 'Unnamed Client'}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{client.email || 'NO EMAIL'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-black text-slate-600 text-sm">{client.phone || 'No Phone'}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Active</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-slate-400">{new Date(client.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setViewClient(client)}
                        className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100"
                        title="View Profile"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setEditClient(client)}
                        className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100"
                        title="Edit Client"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClient(client.id)}
                        className="p-3 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                        title="Delete Client"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-slate-50">
          {filteredClients.map((client) => (
            <div key={client.id} className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">
                    {client.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-sm">{client.name || 'Unnamed Client'}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[150px]">{client.email || 'NO EMAIL'}</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-widest">Active</span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500">{client.phone || 'No Phone'}</span>
                <span className="text-slate-400">{new Date(client.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setViewClient(client)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest"
                >
                  <Eye className="w-4 h-4" /> View
                </button>
                <button 
                  onClick={() => setEditClient(client)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button 
                  onClick={() => handleDeleteClient(client.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
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
              className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 max-w-md w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-black text-slate-900">New Repair Job</h3>
                <button onClick={() => setShowModal(false)} className="p-2 md:p-3 hover:bg-slate-50 rounded-2xl transition-all"><X className="w-5 h-5 md:w-6 md:h-6" /></button>
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
            className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="flex flex-col lg:flex-row justify-between gap-6 md:gap-8">
              <div className="flex flex-col sm:flex-row gap-6 md:gap-8">
                <div className="bg-slate-900 p-4 rounded-2xl md:rounded-3xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-slate-200 w-fit mx-auto sm:mx-0">
                  <QRCodeSVG value={repair.trackingId} size={64} fgColor="#FFFFFF" bgColor="transparent" />
                </div>
                <div className="text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 md:gap-3 mb-2">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] bg-indigo-50 px-3 py-1 rounded-lg">{repair.trackingId}</span>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(repair.status)}`}>
                      {repair.status}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900">{repair.serviceType}</h3>
                  <p className="text-slate-500 text-sm md:text-base font-medium mt-2 max-w-xl">{repair.problemDescription}</p>
                </div>
              </div>
              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 lg:border-l border-slate-50 pt-6 lg:pt-0 lg:pl-8">
                <div className="text-left lg:text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Sync</p>
                  <p className="text-sm font-black text-slate-900">{new Date(repair.updatedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2 md:gap-3">
                  <button 
                    onClick={() => alert('Viewing details for repair ' + repair.trackingId)}
                    className="p-3 md:p-4 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl md:rounded-2xl transition-all border border-transparent hover:border-indigo-100"
                  >
                    <FileText className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setShowStatusModal(repair)}
                    className="px-4 md:px-6 py-3 md:py-4 bg-slate-900 text-white rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                  >
                    Update
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
              className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 max-w-md w-full shadow-2xl border border-slate-100"
            >
              <div className="flex justify-between items-center mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-black text-slate-900">Update Status</h3>
                <button onClick={() => setShowStatusModal(null)} className="p-2 md:p-3 hover:bg-slate-50 rounded-2xl transition-all"><X className="w-5 h-5 md:w-6 md:h-6" /></button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {['Received', 'Completed', 'Delivered'].map((status) => (
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

