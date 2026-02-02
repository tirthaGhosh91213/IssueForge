import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Users,
  FolderKanban,
  Zap
} from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-100">

      {/* ================= BACKGROUND BLOBS ================= */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-300 opacity-30 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-purple-300 opacity-30 blur-[120px] rounded-full" />


      {/* ================= NAVBAR ================= */}
      <nav className="relative z-10 flex justify-between items-center px-10 py-6 backdrop-blur bg-white/50 border-b">

        <h1 className="text-xl font-bold tracking-wide text-indigo-600">
          🚀 ULMiND IssueForge
        </h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl shadow-md"
        >
          Login
        </motion.button>

      </nav>



      {/* ================= HERO ================= */}
      <section className="relative z-10 text-center px-6 py-36">

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-6xl md:text-7xl font-extrabold leading-tight text-gray-900"
        >
          Build.
          <span className="text-indigo-600"> Track.</span>
          <br />
          Deliver Faster.
        </motion.h1>


        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-500 text-lg mt-6 max-w-xl mx-auto"
        >
          A powerful issue & project management platform for modern teams.
        </motion.p>


        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={() => navigate("/login")}
          className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-4 rounded-2xl shadow-2xl text-lg font-semibold"
        >
          Get Started →
        </motion.button>
      </section>



      {/* ================= FEATURES ================= */}
      <section className="relative z-10 pb-24 px-8">

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">

          <FeatureCard
            icon={Zap}
            title="Lightning Fast"
            desc="Instant actions with smooth workflow"
          />

          <FeatureCard
            icon={Users}
            title="Team Collaboration"
            desc="Work together with roles & permissions"
          />

          <FeatureCard
            icon={FolderKanban}
            title="Smart Projects"
            desc="Organize tasks with clarity & control"
          />

        </div>

      </section>



      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 text-center text-gray-500 pb-8 text-sm">
        © 2026 • ULMiND • Built by Tirtha
      </footer>
    </div>
  );
}



/* =================================================
   FEATURE CARD (Premium Style)
================================================= */

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-12 text-center"
    >
      <Icon size={36} className="mx-auto mb-6 text-indigo-600" />

      <h3 className="font-bold text-xl mb-2">{title}</h3>

      <p className="text-gray-500 text-sm">{desc}</p>
    </motion.div>
  );
}
