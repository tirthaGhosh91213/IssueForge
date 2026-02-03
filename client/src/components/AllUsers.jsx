// AllUsers.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Mail, User, Shield, Calendar, Loader2 } from "lucide-react";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center">
          <Users className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-800">All Users</h2>
          <p className="text-slate-600">Manage and monitor your users</p>
        </div>
      </div>

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
                  <Shield className="w-4 h-4" />
                  Role
                </div>
              </th>
              <th className="p-4 text-left font-semibold text-slate-700 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Joined
                </div>
              </th>
              <th className="p-4 text-left font-semibold text-slate-700 border-b border-slate-200 w-32">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
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
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'moderator' ? 'bg-purple-100 text-purple-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg hover:scale-105 transition-all">
                        Edit
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg hover:scale-105 transition-all">
                        Delete
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
