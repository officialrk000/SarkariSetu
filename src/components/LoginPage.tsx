import React from 'react';
import { motion } from 'motion/react';
import { Shield, Loader2, Phone, Lock, LogIn } from 'lucide-react';
import AdminPanel from './AdminPanel';
import { APPS_SCRIPT_URL } from '../lib/config';

export default function LoginPage() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [adminName, setAdminName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const [mobile, setMobile] = React.useState('');
  const [password, setPassword] = React.useState('');

  // Check session on load
  React.useEffect(() => {
    const savedAdmin = localStorage.getItem('admin_session');
    if (savedAdmin) {
      try {
        const data = JSON.parse(savedAdmin);
        setIsLoggedIn(true);
        setAdminName(data.name);
      } catch (e) {
        localStorage.removeItem('admin_session');
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const scriptUrl = APPS_SCRIPT_URL;
      if (!scriptUrl || scriptUrl.length < 10) {
        throw new Error('Apps Script URL is not configured. Please add it in Settings > Secrets menu.');
      }

      const response = await fetch(scriptUrl, {
        method: 'POST',
        body: JSON.stringify({
          action: 'login',
          data: { mobile, password }
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        localStorage.setItem('admin_session', JSON.stringify({ name: result.name, mobile }));
        setAdminName(result.name);
        setIsLoggedIn(true);
      } else {
        throw new Error(result.message || 'Invalid Mobile Number or Password');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return <AdminPanel onClose={handleLogout} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xs bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 border border-gray-100 p-8 text-center"
      >
        <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-100">
          <Shield className="w-6 h-6" />
        </div>
        
        <h1 className="text-lg font-black text-gray-900 mb-0.5">Admin Login</h1>
        <p className="text-[10px] text-gray-400 mb-6 font-black uppercase tracking-widest">Sign in to continue</p>

        {error && (
          <div className="mb-4 p-2.5 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold border border-red-100 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone className="w-3.5 h-3.5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            </div>
            <input
              type="tel"
              required
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl outline-none focus:bg-white focus:border-blue-600 transition-all font-bold text-xs text-gray-900 placeholder:text-gray-300"
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-3.5 h-3.5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            </div>
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl outline-none focus:bg-white focus:border-blue-600 transition-all font-bold text-xs text-gray-900 placeholder:text-gray-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black py-3 rounded-xl transition-all shadow-lg shadow-blue-100 active:scale-95 mt-1 text-xs"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            {loading ? 'Wait...' : 'Login'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-50">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Authorized Personnel Only</p>
        </div>
      </motion.div>
    </div>
  );
}

