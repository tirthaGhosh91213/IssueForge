// AllUsers.jsx - Updated with Details Button
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Mail, User, Loader2, Search, Trash2, Plus, Eye, X } from "lucide-react";

export default function AllUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/admin/users");
        const data = await response.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      setDeleting(true);
      const response = await fetch(`http://localhost:5000/api/admin/user/${userId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setUsers(users.filter(user => user._id !== userId));
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setDeleting(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-12"
      >
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Loading Users...</h2>
          <p className="text-slate-600">Fetching all user data</p>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-800">All Users</h2>
            <p className="text-slate-600">Manage and monitor your users</p>
          </div>
        </div>

        {/* Search Field */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white/70 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-lg placeholder-slate-400"
            />
          </div>
        </motion.div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse bg-white rounded-2xl shadow-inner border border-slate-200">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                <th className="p-4 text-left font-semibold text-slate-700 border-b border-slate-200 sticky left-0 bg-gradient-to-r from-slate-50 to-slate-100 z-10">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Name
                  </div>
                </th>
                <th className="p-4 text-left font-semibold text-slate-700 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </div>
                </th>
                <th className="p-4 text-left font-semibold text-slate-700 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    View Details
                  </div>
                </th>
                <th className="p-4 text-left font-semibold text-slate-700 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Assign Task
                  </div>
                </th>
                <th className="p-4 text-left font-semibold text-slate-700 border-b border-slate-200 w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    {searchTerm ? "No users found matching your search" : "No users found"}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 group"
                  >
                    <td className="p-4 font-medium text-slate-800 sticky left-0 bg-white group-hover:bg-slate-50 z-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 text-white font-bold text-lg rounded-xl flex items-center justify-center flex-shrink-0">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 max-w-md truncate">{user.email}</td>
                    <td className="p-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/admin/user-details/${user._id}`)}
                        className="px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 font-medium text-sm flex items-center gap-1.5"
                      >
                        <Eye size={16} />
                        <span className="hidden sm:inline">Details</span>
                      </motion.button>
                    </td>
                    <td className="p-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/admin/assign-task/${user._id}`)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-violet-700 transition-all duration-300 font-medium text-sm flex items-center gap-2"
                      >
                        <Plus size={16} />
                        Assign Task
                      </motion.button>
                    </td>
                    <td className="p-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDeleteConfirm(user._id)}
                        className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl hover:shadow-md transition-all duration-200 flex items-center gap-1"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                        <span className="hidden sm:inline text-sm">Delete</span>
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setDeleteConfirm(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 max-w-md w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Delete User</h3>
                <p className="text-slate-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-slate-700 mb-8 leading-relaxed">
              Are you sure you want to delete this user? This will permanently remove all their data and cannot be recovered.
            </p>
            
            <div className="flex gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-6 rounded-xl transition-all duration-200"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDeleteUser(deleteConfirm)}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete User"
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
