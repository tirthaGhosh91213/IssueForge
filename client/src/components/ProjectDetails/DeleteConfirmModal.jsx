import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

export default function DeleteConfirmModal({ 
  deleteConfirm, 
  onCancel, 
  onConfirm 
}) {
  return (
    deleteConfirm.open && (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onCancel}>
        {/* ✅ PERFECT BLUR: bg-black/30 + backdrop-blur-sm */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden border border-white/20" 
          onClick={e => e.stopPropagation()}
        >
          <div className="p-8 text-center border-b border-gray-200">
            <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              {deleteConfirm.type === 'project' 
                ? 'Are you sure you want to delete this project? This action cannot be undone.' 
                : 'Are you sure you want to delete this issue? This action cannot be undone.'
              }
            </p>
          </div>
          <div className="px-8 py-6 bg-gray-50/80 backdrop-blur-sm border-t border-gray-200">
            <div className="flex gap-3 justify-center">
              <button
                onClick={onCancel}
                className="flex-1 px-6 py-3 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-lg transition-all duration-200"
              >
                Delete {deleteConfirm.type === 'project' ? 'Project' : 'Issue'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  );
}
