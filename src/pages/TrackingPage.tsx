import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Cpu, Clock, CheckCircle2, AlertCircle, Package, Truck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getRepairByTrackingId } from '../services/dataService';
import { Repair } from '../types';

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState('');
  const [repair, setRepair] = useState<Repair | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setError(null);
    setRepair(null);

    try {
      const result = await getRepairByTrackingId(trackingId.trim());
      if (result) {
        setRepair(result);
      } else {
        setError("No repair found with this Tracking ID.");
      }
    } catch (err) {
      setError("An error occurred while searching. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const statusSteps = [
    { status: 'Received', icon: <Package className="w-5 h-5" />, label: 'Device Received' },
    { status: 'Completed', icon: <CheckCircle2 className="w-5 h-5" />, label: 'Repair Completed' },
    { status: 'Delivered', icon: <Truck className="w-5 h-5" />, label: 'Delivered' },
  ];

  function SettingsIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
  }

  const currentStepIndex = repair ? statusSteps.findIndex(s => s.status === repair.status) : -1;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="bg-white border-b border-slate-100 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Cpu className="text-indigo-600 w-6 h-6" />
            <span className="text-lg font-bold">360 iT Solutions</span>
          </Link>
          <Link to="/" className="text-sm font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Track Your Repair</h1>
          <p className="text-slate-600">Enter your Repair Tracking ID to see the current status of your device.</p>
        </div>

        <form onSubmit={handleTrack} className="mb-12">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
            <input 
              type="text" 
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
              placeholder="e.g. RT-10045"
              className="w-full pl-16 pr-32 py-5 bg-white border-2 border-slate-100 rounded-3xl text-xl font-bold tracking-widest focus:border-indigo-600 focus:ring-0 transition-all shadow-sm"
            />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-3 top-3 bottom-3 px-8 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </div>
        </form>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-center gap-4 text-red-600"
          >
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </motion.div>
        )}

        {repair && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="flex flex-col md:flex-row justify-between gap-6 mb-12">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tracking ID</span>
                  <h2 className="text-2xl font-bold text-indigo-600">{repair.trackingId}</h2>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Status</span>
                  <div className="flex items-center gap-2 justify-end mt-1">
                    <div className="w-3 h-3 rounded-full bg-indigo-600 animate-pulse"></div>
                    <span className="text-xl font-bold">{repair.status}</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-100 md:left-0 md:right-0 md:top-6 md:bottom-auto md:h-0.5"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-6 gap-8 relative">
                  {statusSteps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                      <div key={index} className="flex md:flex-col items-center gap-4 md:text-center">
                        <div className={`
                          w-12 h-12 rounded-2xl flex items-center justify-center z-10 transition-all duration-500
                          ${isCompleted ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-400'}
                          ${isCurrent ? 'ring-4 ring-indigo-50' : ''}
                        `}>
                          {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : step.icon}
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                            {step.label}
                          </p>
                          {isCurrent && (
                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mt-1">
                              In Progress
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-3xl">
              <h3 className="text-lg font-bold mb-6">Device Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Service Type</p>
                  <p className="font-medium">{repair.serviceType}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Problem</p>
                  <p className="font-medium">{repair.problemDescription}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Last Updated</p>
                  <p className="font-medium">{new Date(repair.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
