import React, { useState } from 'react';
import { apiFetch } from '../../utils/api';
import { Search, Download, RotateCcw, CheckCircle, Clock } from 'lucide-react';

export default function ParticipantManagement({ participants, onRefresh }) {
  const [search, setSearch] = useState('');

  const filteredParticipants = participants.filter(p => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.college.toLowerCase().includes(q);
  });

  const handleResetAssignment = async (participantId, participantName) => {
    if (!window.confirm(`Are you sure you want to reset topic assignment for ${participantName}? The topic will become available again for other participants.`)) {
      return;
    }

    try {
      await apiFetch(`/admin/reset-assignment/${participantId}`, { method: 'POST' });
      onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to reset assignment');
    }
  };

  const handleExportCSV = () => {
    const token = localStorage.getItem('doppelganger_token');
    fetch('/api/admin/export', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'doppelganger_assignments.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(err => alert('Failed to export CSV: ' + err.message));
  };

  return (
    <div className="space-y-6">
      
      {/* Top Search & Export Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search participant or college..."
            className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* CSV Export Button */}
        <button
          onClick={handleExportCSV}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-cyan-300 font-bold text-xs shadow transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>

      </div>

      {/* Participants Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-mono border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4">Participant</th>
                <th className="py-3.5 px-4">College Name</th>
                <th className="py-3.5 px-4">Assigned Topic</th>
                <th className="py-3.5 px-4">Assignment Time</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredParticipants.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    No registered participants found.
                  </td>
                </tr>
              ) : (
                filteredParticipants.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{p.name}</td>
                    <td className="py-3.5 px-4 text-slate-400">{p.college}</td>
                    <td className="py-3.5 px-4">
                      {p.assignment ? (
                        <span className="font-bold text-cyan-300">{p.assignment.topic.topicName}</span>
                      ) : (
                        <span className="text-slate-600 font-mono">Not Spun Yet</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {p.assignment ? new Date(p.assignment.assignedAt).toLocaleString() : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.assignment ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold text-[10px]">
                          <CheckCircle className="w-3 h-3 text-purple-400" />
                          COMPLETED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/5 font-semibold text-[10px]">
                          <Clock className="w-3 h-3 text-slate-500" />
                          PENDING
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {p.assignment && (
                          <button
                            onClick={() => handleResetAssignment(p.id, p.name)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-amber-400 transition-colors inline-flex items-center gap-1 text-[11px] px-2.5"
                            title="Reset Assignment"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset</span>
                          </button>
                        )}

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
  );
}
