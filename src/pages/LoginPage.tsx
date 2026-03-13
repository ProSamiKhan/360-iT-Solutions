import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Mail, Phone, Lock, ArrowRight, Smartphone, Key } from 'lucide-react';
import { 
  loginWithGoogle, 
  setupRecaptcha, 
  loginWithPhone, 
  sendEmailOTP 
} from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loginMethod, setLoginMethod] = useState<'google' | 'phone' | 'email'>('google');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize reCAPTCHA once on mount
    setupRecaptcha('recaptcha-container');
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginWithGoogle();
      if (user) {
        navigate(user.role === 'admin' ? '/admin' : '/client');
      }
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

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      setError("Please enter a phone number");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const appVerifier = (window as any).recaptchaVerifier;
      if (!appVerifier) {
        throw new Error("Recaptcha not initialized. Please refresh.");
      }
      const result = await loginWithPhone(phoneNumber, appVerifier);
      setConfirmationResult(result);
      setSuccess("OTP sent to your mobile!");
    } catch (err: any) {
      console.error("Phone Login Error:", err);
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await confirmationResult.confirm(otp);
      // After phone login, the auth state listener in App.tsx will handle navigation
      // But we might need to create the user profile if it doesn't exist
      // For now, assume auth subscription handles it
    } catch (err: any) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await sendEmailOTP(email);
      setSuccess("Magic link sent to your email! Please check your inbox.");
    } catch (err: any) {
      console.error("Email OTP Error:", err);
      if (err.code === 'auth/operation-not-allowed') {
        setError("Email link sign-in is not enabled in Firebase. Please contact the administrator to enable it in the Firebase Console (Authentication > Sign-in method > Email/Password > Email link).");
      } else {
        setError(err.message || "Failed to send magic link.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Stable reCAPTCHA container */}
      <div id="recaptcha-container"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
      >
        <div className="p-8 text-center border-b border-slate-50">
          <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <Cpu className="text-white w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-slate-500 text-sm mt-1">Login to access your 360 iT Solutions dashboard</p>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm font-medium border border-emerald-100">
              {success}
            </div>
          )}

          <div className="flex bg-slate-50 p-1 rounded-2xl mb-6">
            <button 
              onClick={() => setLoginMethod('google')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${loginMethod === 'google' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
            >
              Google
            </button>
            <button 
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${loginMethod === 'phone' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
            >
              Phone OTP
            </button>
            <button 
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${loginMethod === 'email' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
            >
              Email OTP
            </button>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {loginMethod === 'google' && (
                <motion.button 
                  key="google"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-slate-100 rounded-2xl font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-200 transition-all disabled:opacity-50"
                >
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                  {loading ? 'Logging in...' : 'Continue with Google'}
                </motion.button>
              )}

              {loginMethod === 'phone' && (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  {!confirmationResult ? (
                    <form onSubmit={handlePhoneLogin} className="space-y-4">
                      <div className="relative">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                          type="tel" 
                          placeholder="+91 00000 00000"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all text-sm font-bold"
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        {loading ? 'Sending...' : 'Send OTP'} <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="relative">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all text-sm font-bold tracking-[0.5em] text-center"
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        {loading ? 'Verifying...' : 'Verify & Login'} <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </motion.div>
              )}

              {loginMethod === 'email' && (
                <motion.form 
                  key="email"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleEmailOTP} 
                  className="space-y-4"
                >
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="email" 
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all text-sm font-bold"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    {loading ? 'Sending...' : 'Send Magic Link'} <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <div className="text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account? <a href="#" className="text-indigo-600 font-bold hover:underline">Contact Admin</a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
