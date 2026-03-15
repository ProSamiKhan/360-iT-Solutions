import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Mail, Lock, ArrowRight, User } from 'lucide-react';
import { loginWithGoogle, loginWithEmail, signUpWithEmail, resetPassword } from '../services/authService';
import { useNavigate } from 'react-router-dom';

type AuthMode = 'login' | 'signup' | 'reset';

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const user = await loginWithGoogle();
      // Redirection handled by App.tsx
    } catch (err: any) {
      console.error("Google Login Error:", err);
      if (err.code === 'auth/popup-blocked') {
        setError("Popup blocked! Please allow popups or open the app in a new tab.");
      } else if (err.code === 'auth/unauthorized-domain') {
        setError("This domain is not authorized in Firebase. Please add it to 'Authorized Domains'.");
      } else {
        setError(err.message || "Failed to login with Google. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === 'login') {
        const user = await loginWithEmail(email, password);
        if (!user) {
          setError("User profile not found.");
        }
      } else if (mode === 'signup') {
        if (!displayName) {
          setError("Please enter your name.");
          setLoading(false);
          return;
        }
        await signUpWithEmail(email, password, displayName);
      } else if (mode === 'reset') {
        await resetPassword(email);
        setMessage("Password reset email sent! Please check your inbox.");
        setMode('login');
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
      >
        <div className="p-8 text-center border-b border-slate-50">
          <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <Cpu className="text-white w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {mode === 'login' ? 'Login to access your 360 iT Solutions dashboard' : 
             mode === 'signup' ? 'Join 360 iT Solutions to track your repairs' : 
             'Enter your email to receive a reset link'}
          </p>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm font-medium border border-emerald-100">
              {message}
            </div>
          )}

          <div className="space-y-4">
            {mode === 'login' && (
              <>
                <button 
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border-2 border-slate-100 rounded-2xl font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-200 transition-all disabled:opacity-50"
                >
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                  {loading ? 'Logging in...' : 'Continue with Google'}
                </button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Or continue with</span>
                  </div>
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'signup' && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all text-sm"
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="Email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all text-sm"
                />
              </div>
              {mode !== 'reset' && (
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="password" 
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all text-sm"
                  />
                </div>
              )}
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'} 
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </div>

          <div className="text-center space-y-2">
            {mode === 'login' ? (
              <>
                <p className="text-slate-500 text-sm">
                  Don't have an account? <button onClick={() => setMode('signup')} className="text-indigo-600 font-bold hover:underline">Sign Up</button>
                </p>
                <button onClick={() => setMode('reset')} className="text-slate-400 text-xs hover:text-indigo-600 transition-colors">Forgot password?</button>
              </>
            ) : (
              <p className="text-slate-500 text-sm">
                Already have an account? <button onClick={() => setMode('login')} className="text-indigo-600 font-bold hover:underline">Sign In</button>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
