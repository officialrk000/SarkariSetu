import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Settings, LogOut, LayoutDashboard, 
  Database, Bell, Menu, Shield, Users
} from 'lucide-react';
import AdminForm from './AdminForm';

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = React.useState('new_post');
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 transition-transform duration-300 lg:translate-x-0 lg:static
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 leading-tight">Admin Console</h2>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Sarkari Setu</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            <NavItem 
              active={activeTab === 'new_post'} 
              onClick={() => setActiveTab('new_post')} 
              icon={Plus} 
              label="New Sheet Entry" 
            />
            <NavItem 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
              icon={LayoutDashboard} 
              label="Dashboard" 
            />
            <NavItem 
              active={activeTab === 'posts'} 
              onClick={() => setActiveTab('posts')} 
              icon={Database} 
              label="Manage Data" 
            />
            <NavItem 
              active={activeTab === 'notifications'} 
              onClick={() => setActiveTab('notifications')} 
              icon={Bell} 
              label="Push Notifications" 
            />
            <NavItem 
              active={activeTab === 'users'} 
              onClick={() => setActiveTab('users')} 
              icon={Users} 
              label="Admin List" 
            />
          </nav>

          <div className="pt-6 border-t border-gray-100">
            <button 
              onClick={onClose}
              className="w-full flex items-center gap-3 p-4 rounded-2xl text-gray-500 hover:bg-red-50 hover:text-red-600 font-bold transition-all"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-black text-gray-900">
              {activeTab === 'new_post' ? 'Create New Entry' : activeTab.replace('_', ' ').toUpperCase()}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-black text-gray-900">Administrator</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Master Access</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
              <Shield className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </header>

        <div className="p-6 md:p-10 max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {activeTab === 'new_post' ? (
                <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 p-8 border border-gray-100">
                  <div className="mb-8">
                    <h2 className="text-2xl font-black text-gray-900">Entry Form</h2>
                    <p className="text-gray-500 font-medium">Add a new record to the "data" sheet in your linked Google Spreadsheet.</p>
                  </div>
                  <AdminForm />
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-20 text-center border border-gray-100">
                  <Settings className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <h2 className="text-xl font-black text-gray-400">Module Coming Soon</h2>
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

function NavItem({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all
        ${active 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'}
      `}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );
}
