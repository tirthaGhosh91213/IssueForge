import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  ShieldCheck,
  Bug,
  FolderKanban
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    admins: 0,
    issues: 0,
    projects: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/users");
      const data = await res.json();

      const users = data.users || [];

      const adminCount = users.filter(u => u.role === "admin").length;
      const userCount = users.filter(u => u.role === "user").length;

      setStats({
        users: userCount,
        admins: adminCount,
        issues: 12,
        projects: 5
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">

      {/* ================= NAVBAR ================= */}
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold tracking-wide">
          🚀 ULMiND IssueForge
        </h1>

        <span className="text-sm opacity-80">
          Welcome back 👋
        </span>
      </nav>


      {/* ================= HERO ================= */}
      <div className="text-center py-14">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-gray-800">
          Smart Issue & Project Management
        </h1>
        <p className="text-gray-500 text-lg">
          Track • Assign • Fix • Manage
        </p>
      </div>


      {/* ================= LOGIN CARDS ================= */}
      <div className="flex flex-col md:flex-row gap-10 justify-center items-center">

        <LoginCard
          title="Admin Login"
          desc="Manage projects, users & reports"
          color="from-green-500 to-emerald-600"
          onClick={() => navigate("/admin/login")}
        />

        <LoginCard
          title="User Login"
          desc="Work on assigned issues"
          color="from-blue-500 to-indigo-600"
          onClick={() => navigate("/user-login")}
        />

      </div>


      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 px-8 md:px-20">

        {loading ? (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        ) : (
          <>
            <StatCard title="Users" value={stats.users} icon={<Users />} />
            <StatCard title="Admins" value={stats.admins} icon={<ShieldCheck />} />
            <StatCard title="Issues" value={stats.issues} icon={<Bug />} />
            <StatCard title="Projects" value={stats.projects} icon={<FolderKanban />} />
          </>
        )}
      </div>


      {/* ================= FOOTER ================= */}
      <footer className="text-center text-gray-500 mt-20 pb-6 text-sm">
        © 2026 ULMiND • Built with ❤️ by Tirtha
      </footer>
    </div>
  );
}


/* =================================================
   LOGIN CARD
================================================= */
function LoginCard({ title, desc, onClick, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-10 w-80 text-center"
    >
      <h2 className="text-2xl font-bold mb-3">{title}</h2>
      <p className="text-gray-500 text-sm mb-6">{desc}</p>

      <button
        onClick={onClick}
        className={`bg-gradient-to-r ${color} text-white px-6 py-3 rounded-xl w-full font-semibold shadow-md hover:shadow-xl transition`}
      >
        Login →
      </button>
    </motion.div>
  );
}

/* =================================================
   STAT CARD
================================================= */
function StatCard({ title, value, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.07 }}
      className="bg-white rounded-3xl shadow-lg p-8 text-center flex flex-col items-center gap-3 transition"
    >
      <div className="text-indigo-600">{icon}</div>

      <h2 className="text-4xl font-extrabold text-gray-800">
        {value}
      </h2>

      <p className="text-gray-500">{title}</p>
    </motion.div>
  );
}

/* =================================================
   LOADING SKELETON
================================================= */
function Skeleton() {
  return (
    <div className="bg-gray-200 animate-pulse h-32 rounded-3xl" />
  );
}
