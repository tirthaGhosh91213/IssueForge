import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AdminNavbar from "../components/AdminNavbar";
import { 
  Users, 
  Folder, 
  Bug,
  User,
  Image,
  AlertCircle,
  Loader2
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState("users");
  
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersRes, projectsRes, issuesRes] = await Promise.all([
          fetch("http://localhost:5000/api/admin/users"),
          fetch("http://localhost:5000/api/admin/projects"),
          fetch("http://localhost:5000/api/issues?page=1&limit=5")
        ]);
        
        const usersData = await usersRes.json();
        const projectsData = await projectsRes.json();
        const issuesData = await issuesRes.json();
        
        setUsers(usersData.users || []);
        setProjects(projectsData.projects || []);
        setIssues(issuesData.issues || []);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { label: "Total Users", value: users.length, color: "blue", Icon: Users },
    { label: "Total Projects", value: projects.length, color: "violet", Icon: Folder },
    { label: "Open Issues", value: issues.filter(i => i.status === "open").length, color: "indigo", Icon: AlertCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <AdminNavbar navigate={navigate} />
      
      <div className="max-w-7xl mx-auto p-8">
        {/* Stats Header */}
        {/* <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {stats.map((stat, idx) => (
            <StatCard key={stat.label} delay={idx * 0.1} {...stat} />
          ))}
        </motion.div> */}

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Sidebar Tabs */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-64 flex-shrink-0 hidden lg:block"
          >
            <TabSidebar active={active} setActive={setActive} />
          </motion.div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {loading ? (
                <LoadingState key="loading" />
              ) : (
                <>
                  {active === "users" && (
                    <ContentSection key="users" title="All Users">
                      {users.map(user => (
                        <UserCard key={user._id} user={user} />
                      ))}
                    </ContentSection>
                  )}
                  {active === "projects" && (
                    <ContentSection key="projects" title="All Projects">
                      {projects.map(project => (
                        <ProjectCard key={project._id} project={project} />
                      ))}
                    </ContentSection>
                  )}
                  {active === "issues" && (
                    <ContentSection key="issues" title="All Issues">
                      {issues.map(issue => (
                        <IssueCard key={issue._id} issue={issue} />
                      ))}
                    </ContentSection>
                  )}
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats Card
// function StatCard({ label, value, color, Icon, delay = 0 }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay }}
//       whileHover={{ y: -4 }}
//       className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/50 hover:border-transparent hover:shadow-2xl transition-all duration-300 group"
//     >
//       <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-${color}-500 to-${color}-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
//         <Icon className="w-6 h-6 text-white" />
//       </div>
//       <p className="text-3xl font-bold text-slate-800 mb-1">{value}</p>
//       <p className="text-sm font-medium text-slate-600">{label}</p>
//     </motion.div>
//   );
// }

// Sidebar Tabs
function TabSidebar({ active, setActive }) {
  const tabs = [
    { key: "users", label: "Users", Icon: Users },
    { key: "projects", label: "Projects", Icon: Folder },
    { key: "issues", label: "Issues", Icon: Bug }
  ];

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 sticky top-8 h-fit">
      <h3 className="font-semibold text-slate-800 mb-6 text-lg">Quick Access</h3>
      <nav className="space-y-2">
        {tabs.map(tab => (
          <TabButton 
            key={tab.key}
            active={active === tab.key}
            onClick={() => setActive(tab.key)}
            Icon={tab.Icon}
            label={tab.label}
          />
        ))}
      </nav>
    </div>
  );
}

function TabButton({ active, onClick, label, Icon }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-200 text-left group ${
        active 
          ? "bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-lg" 
          : "text-slate-700 hover:bg-slate-100 hover:text-blue-600"
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-500 group-hover:text-blue-500'}`} />
      <span className="font-medium">{label}</span>
    </motion.button>
  );
}

// Content Section
function ContentSection({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8"
    >
      <h2 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
        <span className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center">
          <Users className="w-6 h-6 text-white" />
        </span>
        {title}
      </h2>
      <p className="text-slate-600 mb-8">Manage and monitor your {title.toLowerCase()}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </motion.div>
  );
}

// Cards
function UserCard({ user }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="group bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl hover:border-transparent transition-all duration-300 overflow-hidden"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
          {user.name?.charAt(0)?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{user.name}</h3>
          <p className="text-sm text-slate-500 truncate">{user.email}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
          user.role === 'user' ? 'bg-violet-100 text-violet-800' : 'bg-slate-100 text-slate-800'
        }`}>
          {user.role}
        </span>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
      </div>
    </motion.div>
  );
}

function ProjectCard({ project }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="group bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl hover:border-transparent transition-all duration-300 overflow-hidden"
    >
      <div className="w-full h-32 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl mb-4 group-hover:scale-105 transition-transform overflow-hidden relative">
        <Image className="w-full h-full object-cover group-hover:brightness-110 transition-all absolute inset-0 opacity-20" />
        {project.image && (
          <img
            src={`http://localhost:5000/uploads/${project.image}`}
            alt={project.name}
            className="w-full h-full object-cover group-hover:brightness-110 transition-all"
          />
        )}
      </div>
      <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2 group-hover:text-blue-600">{project.name}</h3>
      <p className="text-sm text-slate-500 mb-4">{project.description || "No description"}</p>
    </motion.div>
  );
}

function IssueCard({ issue }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="group bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl hover:border-transparent transition-all duration-300"
    >
      <h3 className="font-semibold text-slate-800 mb-3 line-clamp-2 group-hover:text-blue-600">{issue.title}</h3>
      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          issue.status === 'open' ? 'bg-red-100 text-red-800' :
          issue.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {issue.status}
        </span>
        <div className={`w-3 h-3 rounded-full ${
          issue.priority === 'high' ? 'bg-red-500' :
          issue.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
        }`} />
      </div>
    </motion.div>
  );
}

function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50"
    >
      <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
      <h2 className="text-2xl font-semibold text-slate-800 mb-2">Loading Dashboard...</h2>
      <p className="text-slate-600">Fetching your data</p>
    </motion.div>
  );
}
