import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import TopicManagement from '../components/Admin/TopicManagement';
import ParticipantManagement from '../components/Admin/ParticipantManagement';
import { Users, Layers, CheckCircle2, PieChart, ShieldCheck, RefreshCw } from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('participants'); // 'participants' | 'topics'
  
  const [stats, setStats] = useState({
    totalParticipants: 0,
    totalTopics: 0,
    assignedTopics: 0,
    remainingTopics: 0
  });

  const [participants, setParticipants] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, participantsData, topicsData] = await Promise.all([
        apiFetch('/admin/stats'),
        apiFetch('/admin/participants'),
        apiFetch('/admin/topics')
      ]);

      setStats(statsData);
      setParticipants(participantsData);
      setTopics(topicsData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Control Center</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl text-white tracking-tight">
            Event Admin Dashboard
          </h2>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-cyan-300 font-bold text-xs shadow transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="glass-panel-glow rounded-2xl p-5 border border-cyan-500/30 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs font-mono font-semibold text-slate-400 uppercase block mb-1">Total Participants</span>
            <span className="font-display font-extrabold text-3xl text-white">{stats.totalParticipants}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel-glow rounded-2xl p-5 border border-purple-500/30 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs font-mono font-semibold text-slate-400 uppercase block mb-1">Total Topics</span>
            <span className="font-display font-extrabold text-3xl text-white">{stats.totalTopics}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel-glow rounded-2xl p-5 border border-pink-500/30 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs font-mono font-semibold text-slate-400 uppercase block mb-1">Assigned Topics</span>
            <span className="font-display font-extrabold text-3xl text-pink-400">{stats.assignedTopics}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel-glow rounded-2xl p-5 border border-emerald-500/30 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs font-mono font-semibold text-slate-400 uppercase block mb-1">Remaining Topics</span>
            <span className="font-display font-extrabold text-3xl text-emerald-400">{stats.remainingTopics}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <PieChart className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('participants')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-bold text-sm transition-all ${
            activeTab === 'participants'
              ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white glass-panel'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Participants ({participants.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('topics')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-bold text-sm transition-all ${
            activeTab === 'topics'
              ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white glass-panel'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Topics Database ({topics.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === 'participants' ? (
          <ParticipantManagement participants={participants} onRefresh={fetchAdminData} />
        ) : (
          <TopicManagement topics={topics} onRefresh={fetchAdminData} />
        )}
      </div>

    </div>
  );
}
