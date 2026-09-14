import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Sparkles, User, GraduationCap, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const { user, role, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 md:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo / Branding */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="font-display font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400">
              DOPPELGANGER
            </h1>
            <p className="text-[10px] text-slate-400 tracking-widest uppercase font-mono">Topic Allocation Portal</p>
          </div>
        </div>

        {/* User Info / Role Badge */}
        <div className="flex items-center gap-4">
          {role === 'participant' ? (
            <div className="hidden sm:flex items-center gap-3 bg-slate-900/80 border border-white/10 rounded-full px-4 py-1.5 shadow-inner">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>{user.name}</span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1.5 text-xs text-purple-300 font-medium">
                <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                <span>{user.college}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-purple-950/60 border border-purple-500/30 rounded-full px-3 py-1 text-xs text-purple-300 font-mono">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Admin Mode</span>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-slate-800/80 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-white/10 hover:border-red-500/30 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Logout</span>
          </button>
        </div>

      </div>
    </header>
  );
}
