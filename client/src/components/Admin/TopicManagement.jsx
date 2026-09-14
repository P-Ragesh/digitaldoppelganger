import React, { useState } from 'react';
import { apiFetch } from '../../utils/api';
import { Plus, Edit2, Trash2, CheckCircle, Clock, AlertCircle, Save, X } from 'lucide-react';

export default function TopicManagement({ topics, onRefresh }) {
  const [filter, setFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);

  const [formData, setFormData] = useState({ topicName: '', requirements: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredTopics = topics.filter(t => {
    if (filter === 'AVAILABLE') return t.status === 'AVAILABLE';
    if (filter === 'ASSIGNED') return t.status === 'ASSIGNED';
    return true;
  });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.topicName.trim() || !formData.requirements.trim()) {
      setError('Both Topic Name and Requirements are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editingTopic) {
        await apiFetch(`/admin/topics/${editingTopic.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/admin/topics', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }

      setFormData({ topicName: '', requirements: '' });
      setIsAddModalOpen(false);
      setEditingTopic(null);
      onRefresh();
    } catch (err) {
      setError(err.message || 'Failed to save topic');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (topic) => {
    setEditingTopic(topic);
    setFormData({
      topicName: topic.topicName,
      requirements: topic.requirements
    });
    setError('');
    setIsAddModalOpen(true);
  };

  const handleDelete = async (topicId) => {
    if (!window.confirm('Are you sure you want to delete this topic? If assigned, the assignment will be deleted as well.')) {
      return;
    }

    try {
      await apiFetch(`/admin/topics/${topicId}`, { method: 'DELETE' });
      onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to delete topic');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-white/10 text-xs font-medium">
          {['ALL', 'AVAILABLE', 'ASSIGNED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === f ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Add Topic Button */}
        <button
          onClick={() => {
            setEditingTopic(null);
            setFormData({ topicName: '', requirements: '' });
            setError('');
            setIsAddModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Topic</span>
        </button>
      </div>

      {/* Topics Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-mono border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">Topic Name</th>
                <th className="py-3.5 px-4">Requirements</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Assigned To</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredTopics.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    No topics found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredTopics.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-cyan-400">#{t.id}</td>
                    <td className="py-3.5 px-4 font-bold text-white max-w-[180px] truncate">{t.topicName}</td>
                    <td className="py-3.5 px-4 max-w-[280px] truncate text-slate-400">{t.requirements}</td>
                    <td className="py-3.5 px-4">
                      {t.status === 'ASSIGNED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold text-[10px]">
                          <CheckCircle className="w-3 h-3 text-purple-400" />
                          ASSIGNED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold text-[10px]">
                          <Clock className="w-3 h-3 text-emerald-400" />
                          AVAILABLE
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {t.assignment ? (
                        <div>
                          <span className="font-semibold text-cyan-300 block">{t.assignment.participant.name}</span>
                          <span className="text-[10px] text-slate-400">{t.assignment.participant.college}</span>
                        </div>
                      ) : (
                        <span className="text-slate-600 font-mono">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(t)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors"
                          title="Edit Topic"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Delete Topic"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Topic Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel max-w-md w-full rounded-2xl p-6 border border-cyan-500/30 shadow-2xl relative">
            
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-lg text-white mb-4">
              {editingTopic ? 'Edit Topic' : 'Add New Event Topic'}
            </h3>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Topic Name</label>
                <input
                  type="text"
                  value={formData.topicName}
                  onChange={(e) => setFormData({ ...formData, topicName: e.target.value })}
                  placeholder="e.g. AI Innovation"
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Detailed Requirements</label>
                <textarea
                  rows="4"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="Describe the challenge details..."
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingTopic ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
