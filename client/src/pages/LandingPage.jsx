import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, User, GraduationCap, ShieldCheck, ArrowRight, AlertCircle, Lock } from 'lucide-react';

export default function LandingPage() {
  const { loginParticipant, loginAdmin } = useAuth();

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleParticipantSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedCollege = college.trim();

    if (!trimmedName || !trimmedCollege) {
      setError('Please enter both your Participant Name and College Name.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await loginParticipant(trimmedName, trimmedCollege);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    if (!adminUsername.trim() || !adminPassword.trim()) {
      setError('Please provide both admin username and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await loginAdmin(adminUsername.trim(), adminPassword.trim());
    } catch (err) {
      setError(err.message || 'Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-12">
      
      {/* Dynamic Background Glow Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-md w-full relative z-10">
        
        {/* Title Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-cyan-400/30 text-cyan-300 text-xs font-mono mb-4 shadow-lg">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span>LIVE EVENT ALLOCATION PORTAL</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-normal sm:tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-200 to-pink-400 drop-shadow-[0_0_25px_rgba(0,240,255,0.4)]">
            DOPPELGANGER
          </h1>
          
          <p className="mt-3 text-lg font-medium text-slate-300 tracking-widest font-display uppercase">
            Spin. Discover. Create.
          </p>
        </div>

        {/* Card Form */}
        <div className="glass-panel-glow rounded-3xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
          
          {/* Mode Switcher Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <h2 className="font-display font-bold text-lg text-white">
              {isAdminMode ? 'Admin Authentication' : 'Participant Entry'}
            </h2>

            <button
              type="button"
              onClick={() => {
                setIsAdminMode(!isAdminMode);
                setError('');
              }}
              className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              {isAdminMode ? (
                <>
                  <User className="w-3.5 h-3.5" />
                  <span>Participant Login</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </>
              )}
            </button>
          </div>

          {/* Validation Error Banner */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Content */}
          {!isAdminMode ? (
            <form onSubmit={handleParticipantSubmit} className="space-y-5">
              
              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-300 mb-2">
                  Participant Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full bg-slate-950/80 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-300 mb-2">
                  College Name
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="Enter your college / institution"
                    required
                    className="w-full bg-slate-950/80 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-display font-extrabold text-base bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Entering Event...' : 'ENTER EVENT'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          ) : (
            <form onSubmit={handleAdminSubmit} className="space-y-5">
              
              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-300 mb-2">
                  Admin Username
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="admin"
                    required
                    className="w-full bg-slate-950/80 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-300 mb-2">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-950/80 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-display font-extrabold text-base bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Authenticating...' : 'ADMIN LOGIN'}</span>
                <ShieldCheck className="w-4 h-4" />
              </button>

            </form>
          )}

        </div>

        {/* Footer Note */}
        <p className="text-center text-slate-500 text-xs mt-6 font-mono">
          Persistent Database Topic Assignment Engine &bull; DOPPELGANGER 2026
        </p>

      </div>

    </div>
  );
}
