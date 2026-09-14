import React from 'react';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import Navbar from './components/Navbar';
import { Loader2, Sparkles } from 'lucide-react';

export default function App() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cyber-dark text-cyan-400">
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-purple-600 to-pink-500 p-0.5 shadow-2xl mb-4">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-cyan-300 animate-spin" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-mono tracking-widest text-slate-300 uppercase">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Initialising DOPPELGANGER...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-cyber-dark flex flex-col">
      <Navbar />
      <main className="flex-1">
        {role === 'admin' ? <AdminPage /> : <DashboardPage />}
      </main>
    </div>
  );
}

