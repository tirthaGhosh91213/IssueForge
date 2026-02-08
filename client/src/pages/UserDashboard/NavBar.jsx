import { motion } from "framer-motion";
import { Menu, Plus, Shield, LogOut } from "lucide-react";

export default function AdminNavbar({ onMenuClick, navigate }) {
  const actions = [
    
    { icon: Shield, label: "My Task", path: "/user/my-task" },
   
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-xl shadow-xl border-b border-slate-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">
        <div className="flex items-center justify-between">
          {/* Logo - Mobile First */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 flex-shrink-0"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-xl sm:text-2xl font-bold text-white">U</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                ULMiND IssueForge
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium hidden lg:block">User Dashboard</p>
            </div>
            <span className="sm:hidden text-xl font-bold text-slate-900">IssueForge</span>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
            className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl hover:shadow-md transition-all"
          >
            <Menu size={24} />
          </motion.button>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {actions.map((action, idx) => (
              <ActionButton 
                key={action.label}
                delay={idx * 0.05}
                icon={action.icon}
                label={action.label}
                onClick={() => navigate(action.path)}
              />
            ))}
            
            <LogoutButton onClick={() => {
              localStorage.removeItem("auth");
              navigate("/login");
            }} />
          </div>
        </div>
      </div>
    </nav>
  );
}

function ActionButton({ icon: Icon, label, onClick, delay = 0 }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center gap-2 bg-blue-600 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-300 font-medium text-sm sm:text-base whitespace-nowrap"
    >
      <Icon size={18} />
      <span className="hidden sm:inline">{label}</span>
    </motion.button>
  );
}

function LogoutButton({ onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="ml-3 p-3 flex items-center gap-2 text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-medium"
      title="Logout"
    >
      <LogOut size={20} strokeWidth={2} />
      <span className="hidden lg:inline">Logout</span>
    </motion.button>
  );
}
