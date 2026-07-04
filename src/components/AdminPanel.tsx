import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Settings, LogOut, LayoutDashboard, 
  Database, Bell, Menu, Shield, Users, Loader2,
  RefreshCcw, FileText, CheckCircle2
} from 'lucide-react';
import AdminForm from './AdminForm';

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [stats, setStats] = React.useState<{ total: number; recent: any[] }>({ total: 0, recent: [] });
  const [loading, setLoading] = React.useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const scriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL;
      const response = await fetch(scriptUrl, {
        method: 'POST',
        body: JSON.stringify({ action: 'getStats' })
      });
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transition-transform duration-300 lg:translate-x-0 lg:static
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-gray-900 leading-tight">Admin</h2>
              <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">Sarkari Setu</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            <NavItem 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
              icon={LayoutDashboard} 
              label="Dashboard" 
            />
            <NavItem 
              active={activeTab === 'new_post'} 
              onClick={() => setActiveTab('new_post')} 
              icon={Plus} 
              label="New Entry" 
            />
            <NavItem 
              active={activeTab === 'posts'} 
              onClick={() => setActiveTab('posts')} 
              icon={Database} 
              label="Records" 
            />
            <NavItem 
              active={activeTab === 'notifications'} 
              onClick={() => setActiveTab('notifications')} 
              icon={Bell} 
              label="Alerts" 
            />
          </nav>

          <div className="pt-4 border-t border-gray-100">
            <button 
              onClick={onClose}
              className="w-full flex items-center gap-2 p-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 font-bold transition-all text-xs"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-sm font-black text-gray-900">
              {activeTab === 'dashboard' ? 'Overview' : activeTab.replace('_', ' ').toUpperCase()}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={fetchStats} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6 max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard 
                      title="Total Entries" 
                      value={stats.total.toString()} 
                      icon={FileText} 
                      color="blue" 
                    />
                    <StatCard 
                      title="Forms Submitted" 
                      value={stats.total.toString()} 
                      icon={CheckCircle2} 
                      color="emerald" 
                    />
                    <StatCard 
                      title="Active Posts" 
                      value={stats.total.toString()} 
                      icon={Database} 
                      color="purple" 
                    />
                  </div>

                  {/* Recent Activity Table */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                      <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Recent Submissions</h3>
                      <button className="text-[10px] font-bold text-blue-600 hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50/50">
                          <tr>
                            <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">Post Name</th>
                            <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">Category</th>
                            <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">Admin</th>
                            <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {loading ? (
                            <tr>
                              <td colSpan={4} className="p-10 text-center">
                                <Loader2 className="w-5 h-5 animate-spin mx-auto text-blue-500" />
                              </td>
                            </tr>
                          ) : stats.recent.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="p-10 text-center text-xs font-bold text-gray-400">No data found in sheet.</td>
                            </tr>
                          ) : (
                            stats.recent.map((entry, i) => (
                              <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3">
                                  <p className="text-xs font-bold text-gray-900 line-clamp-1">{entry.postName}</p>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[9px] font-black uppercase">{entry.formType}</span>
                                </td>
                                <td className="px-4 py-3">
                                  <p className="text-[10px] font-bold text-gray-500">{entry.submittedBy || 'N/A'}</p>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] font-bold text-gray-600">Live</span>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'new_post' && (
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <div className="mb-6">
                    <h2 className="text-sm font-black text-gray-900">Entry Form</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Exporting to "data" sheet</p>
                  </div>
                  <AdminForm />
                </div>
              )}

              {(activeTab === 'posts' || activeTab === 'notifications' || activeTab === 'users') && (
                <div className="bg-white rounded-2xl p-20 text-center border border-gray-100">
                  <Settings className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Module Under Development</h2>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: 'blue' | 'emerald' | 'purple' }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100'
  };

  return (
    <div className={`p-4 rounded-2xl border ${colors[color]} shadow-sm`}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/50 rounded-lg">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{title}</p>
          <h4 className="text-xl font-black">{value}</h4>
        </div>
      </div>
    </div>
  );
}

function NavItem({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-2 p-3 rounded-xl font-bold transition-all text-xs
        ${active 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'}
      `}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
