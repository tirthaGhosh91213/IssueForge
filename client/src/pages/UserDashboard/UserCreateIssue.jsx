import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeftIcon, // Replaced Arrow with Chevron for a more formal look
  CloudArrowUpIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function CreateIssue() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get('projectId');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    media: null
  });
  
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleFileChange = (e) => {
    setFormData({ ...formData, media: e.target.files[0] });
  };

  const handleFinalSubmit = async () => {
    setShowConfirm(false);
    setLoading(true);
    setStatus({ type: '', msg: '' });

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('priority', formData.priority);
    if (formData.media) data.append('media', formData.media);

    try {
      const res = await axios.post(`http://localhost:5000/api/issues/create/${projectId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setStatus({ type: 'success', msg: 'Incident documented successfully.' });
        setTimeout(() => navigate(-1), 2000);
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Failed to initialize issue creation.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto">
        
        {/* --- FORMAL BACK ICON & NAVIGATION --- */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-slate-400 hover:text-blue-600 transition-all group"
          >
            <ChevronLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em]">Return</span>
          </button>
          <div className="h-px flex-1 mx-8 bg-slate-200/60"></div>
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">IssueForge Management</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-xl shadow-[0_15px_40px_-12px_rgba(0,0,0,0.03)] overflow-hidden"
        >
          {/* Light Gray Header Section */}
          <div className="bg-slate-100/80 border-b border-slate-200 px-10 py-8 flex justify-between items-end">
            <div>
              <h1 className="text-slate-900 text-2xl font-bold tracking-tight">Create New Incident</h1>
              <p className="text-blue-600 text-[10px] mt-1 font-black uppercase tracking-[0.15em]">
                Project Reference: {projectId || "N/A"}
              </p>
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-slate-400 text-[10px] font-bold uppercase tracking-tight">Status</div>
              <div className="text-slate-900 text-xs font-black tracking-tighter">NEW_LOG_ENTRY</div>
            </div>
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); setShowConfirm(true); }} 
            className="p-10 space-y-8"
          >
            {status.msg && (
              <div className={`p-4 rounded-lg flex items-center gap-3 text-xs font-bold ${
                status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
              }`}>
                {status.type === 'success' ? <CheckCircleIcon className="w-5 h-5" /> : <ExclamationCircleIcon className="w-5 h-5" />}
                {status.msg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Issue Title</label>
                  <input 
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-600 focus:bg-white outline-none transition-all font-semibold text-slate-800"
                    placeholder="Enter short summary..."
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Description</label>
                  <textarea 
                    required
                    rows="5"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-600 focus:bg-white outline-none transition-all font-medium text-slate-700 resize-none"
                    placeholder="Details about the finding..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Priority Matrix</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['low', 'medium', 'high'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setFormData({...formData, priority: p})}
                        className={`py-3 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                          formData.priority === p 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                          : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Evidence File</label>
                  <div className="relative group h-[155px]">
                    <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className={`h-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${
                      formData.media ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 bg-slate-50 group-hover:bg-slate-100/50'
                    }`}>
                      <CloudArrowUpIcon className={`w-8 h-8 mb-2 ${formData.media ? 'text-blue-600' : 'text-slate-300'}`} />
                      <p className="text-[11px] font-black text-slate-800 uppercase">
                        {formData.media ? formData.media.name : 'Select System File'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">Security ID: AUTH_{Math.floor(Math.random() * 1000)}</p>
              <button 
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-12 py-4 rounded-lg font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-700 hover:shadow-xl shadow-blue-100 transition-all disabled:opacity-50 active:scale-95"
              >
                {loading ? 'Submitting...' : 'Document Incident'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
            >
              <div className="p-8 text-center">
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheckIcon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Confirm Deployment</h3>
                <p className="text-sm text-slate-500 font-medium">Verify all technical details before documenting this incident.</p>
              </div>
              <div className="bg-slate-50 p-4 flex gap-2">
                <button onClick={() => setShowConfirm(false)} className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                <button onClick={handleFinalSubmit} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">Submit Log</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}