import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { completeEmailLinkSignIn } from '../services/authService';
import { motion } from 'framer-motion';
import { Cpu, Loader2 } from 'lucide-react';

export default function LoginCallback() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleSignIn = async () => {
      try {
        const user = await completeEmailLinkSignIn();
        if (user) {
          // Auth state listener in App.tsx will handle the redirect
          // but we can also do it here if needed
        } else {
          setError("Invalid or expired sign-in link.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to sign in.");
      }
    };

    handleSignIn();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-indigo-600 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200">
          <Cpu className="text-white w-8 h-8" />
        </div>
        
        {error ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-red-100"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-2">Sign-in Failed</h2>
            <p className="text-red-600 text-sm mb-6">{error}</p>
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-bold hover:bg-slate-800 transition-all"
            >
              Back to Login
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Verifying your link...</h2>
            <p className="text-slate-500">Please wait while we sign you in.</p>
          </div>
        )}
      </div>
    </div>
  );
}
