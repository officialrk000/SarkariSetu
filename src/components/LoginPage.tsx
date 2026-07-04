import React from 'react';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { motion } from 'motion/react';
import { LogIn, Shield, Loader2 } from 'lucide-react';
import AdminPanel from './AdminPanel';

export default function LoginPage() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      // Verify authorization via Apps Script
      const scriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL;
      if (!scriptUrl) {
        throw new Error('Apps Script URL not configured. Please add VITE_APPS_SCRIPT_URL to your environment.');
      }

      const response = await fetch(scriptUrl, {
        method: 'POST',
        body: JSON.stringify({
          action: 'checkAuth',
          data: { email }
        })
      });
      
      const authResult = await response.json();
      
      if (!authResult.authorized) {
        await auth.signOut();
        throw new Error('Access denied. This account is not in the authorized list.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
      await auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (user) {
    return <AdminPanel onClose={() => auth.signOut()} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center"
      >
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8" />
        </div>
        
        <h1 className="text-2xl font-black text-gray-900 mb-2">Admin Access</h1>
        <p className="text-gray-500 mb-8 font-medium">Please sign in with your authorized Google account to access the admin panel.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 hover:border-blue-100 hover:bg-blue-50 text-gray-700 font-bold py-4 rounded-2xl transition-all group"
        >
          <LogIn className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
          Sign in with Google
        </button>

        <div className="mt-8 pt-8 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Authorized Personnel Only</p>
        </div>
      </motion.div>
    </div>
  );
}
