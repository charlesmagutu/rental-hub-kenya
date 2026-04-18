import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Building2, Users, Wallet, Receipt, Bell, Settings, ShoppingBag, LogOut, Menu, X, CreditCard, Zap, TrendingUp, FileText, DollarSign, Wrench } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import MarketplacePage from './pages/MarketplacePage';
import ReceiptVerification from './pages/ReceiptVerification';
import PropertiesPage from './pages/PropertiesPage';
import TenantsPage from './pages/TenantsPage';
import PaymentsPage from './pages/PaymentsPage';
import UtilitiesPage from './pages/UtilitiesPage';
import ExpensesPage from './pages/ExpensesPage';
import MaintenancePage from './pages/MaintenancePage';
import AuthPage from './pages/AuthPage';
import { api } from './lib/api';
import { User, Notification } from './types';
import { Badge } from './components/ui/badge';

type View = 'landing' | 'dashboard' | 'properties' | 'tenants' | 'payments' | 'utilities' | 'expenses' | 'maintenance' | 'marketplace' | 'verify-receipt' | 'auth';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const currentUser = api.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      fetchNotifications();
    }
  }, []);

  const fetchNotifications = async () => {
    const data = await api.getNotifications();
    setNotifications(data);
  };

  const handleLogin = (u: User) => {
    setUser(u);
    setView('dashboard');
    toast.success(`Welcome back, ${u.name}!`);
    fetchNotifications();
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setView('landing');
    toast.success('Signed out successfully');
  };

  const handleMarkRead = async (id: string) => {
    await api.markNotificationRead(id);
    fetchNotifications();
  };

  const renderView = () => {
    switch (view) {
      case 'landing':
        return <LandingPage onGetStarted={() => setView(user ? 'dashboard' : 'auth')} onMarketplace={() => setView('marketplace')} />;
      case 'auth':
        return <AuthPage onLogin={handleLogin} onBack={() => setView('landing')} />;
      case 'dashboard':
        return <DashboardPage />;
      case 'properties':
        return <PropertiesPage />;
      case 'tenants':
        return <TenantsPage />;
      case 'payments':
        return <PaymentsPage />;
      case 'utilities':
        return <UtilitiesPage />;
      case 'expenses':
        return <ExpensesPage />;
      case 'maintenance':
        return <MaintenancePage />;
      case 'marketplace':
        return <MarketplacePage onBack={() => setView('landing')} />;
      case 'verify-receipt':
        return <ReceiptVerification onBack={() => setView('landing')} />;
      default:
        return <LandingPage onGetStarted={() => setView('auth')} onMarketplace={() => setView('marketplace')} />;
    }
  };

  const isDashboardView = ['dashboard', 'properties', 'tenants', 'payments', 'utilities', 'expenses', 'maintenance'].includes(view);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Toaster position="top-right" richColors />
      
      {isDashboardView && user ? (
        <div className="flex h-screen overflow-hidden">
          <aside className={`bg-slate-900 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col shrink-0`}>
            <div className="p-6 flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Building2 className="w-6 h-6" />
              </div>
              {isSidebarOpen && <span className="font-bold text-xl tracking-tight">RentFlow</span>}
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
              <SidebarItem icon={<LayoutDashboard />} label="Overview" active={view === 'dashboard'} onClick={() => setView('dashboard')} collapsed={!isSidebarOpen} />
              <SidebarItem icon={<Building2 />} label="Properties" active={view === 'properties'} onClick={() => setView('properties')} collapsed={!isSidebarOpen} />
              <SidebarItem icon={<Users />} label="Tenants" active={view === 'tenants'} onClick={() => setView('tenants')} collapsed={!isSidebarOpen} />
              <SidebarItem icon={<Wrench />} label="Maintenance" active={view === 'maintenance'} onClick={() => setView('maintenance')} collapsed={!isSidebarOpen} />
              <SidebarItem icon={<CreditCard />} label="Payments" active={view === 'payments'} onClick={() => setView('payments')} collapsed={!isSidebarOpen} />
              <SidebarItem icon={<Zap />} label="Utilities" active={view === 'utilities'} onClick={() => setView('utilities')} collapsed={!isSidebarOpen} />
              <SidebarItem icon={<DollarSign />} label="Expenses" active={view === 'expenses'} onClick={() => setView('expenses')} collapsed={!isSidebarOpen} />
              <div className="my-4 border-t border-slate-800 opacity-50"></div>
              <SidebarItem icon={<Receipt />} label="Verify Receipt" onClick={() => setView('verify-receipt')} collapsed={!isSidebarOpen} />
              <SidebarItem icon={<ShoppingBag />} label="Marketplace" onClick={() => setView('marketplace')} collapsed={!isSidebarOpen} />
            </nav>

            <div className="p-4 border-t border-slate-800">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                {isSidebarOpen && <span>Sign Out</span>}
              </button>
            </div>
          </aside>

          <main className="flex-1 overflow-y-auto bg-slate-50 relative">
            <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Bell className="w-5 h-5 text-slate-600" />
                    {notifications.filter(n => !n.is_read).length > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    )}
                  </button>
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <h4 className="font-bold">Notifications</h4>
                        <button onClick={() => setIsNotificationsOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-slate-400">No new notifications</div>
                        ) : (
                          notifications.map(n => (
                            <div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.is_read ? 'bg-blue-50/50' : ''}`} onClick={() => handleMarkRead(n.id)}>
                              <div className="flex justify-between items-start">
                                <p className="font-bold text-sm text-slate-900">{n.title}</p>
                                {n.channel !== 'SYSTEM' && <Badge variant="outline" className="text-[8px] uppercase h-4">{n.channel}</Badge>}
                              </div>
                              <p className="text-xs text-slate-500 mt-1">{n.message}</p>
                              <p className="text-[10px] text-slate-400 mt-2">{new Date(n.created_at).toLocaleTimeString()}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                  <div className="text-right">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.role}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
                    {user.avatar || user.name.substring(0, 2)}
                  </div>
                </div>
              </div>
            </header>
            <div className="p-8 max-w-7xl mx-auto">
              {renderView()}
            </div>
          </main>
        </div>
      ) : (
        <div className="w-full">
          {renderView()}
        </div>
      )}
    </div>
  );
}

function SidebarItem({ icon, label, active = false, collapsed = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, collapsed?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
        active 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5 shrink-0' }) : icon}
      {!collapsed && <span className="font-medium">{label}</span>}
    </button>
  );
}