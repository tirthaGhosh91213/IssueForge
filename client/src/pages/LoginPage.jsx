import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);


  /* ================= SAVE TOKEN (2 DAYS) ================= */
  const saveToken = (token) => {
    const twoDays = 2 * 24 * 60 * 60 * 1000;

    const tokenData = {
      token,
      expires: Date.now() + twoDays
    };

    localStorage.setItem("auth", JSON.stringify(tokenData));
  };


  /* ================= HANDLE LOGIN ================= */

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      /* -------- TRY ADMIN -------- */
      let res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      let data = await res.json();

      if (data.success) {
        saveToken(data.token);
        navigate("/admin");
        return;
      }

      /* -------- TRY USER -------- */
      res = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      data = await res.json();

      if (data.success) {
        navigate("/user");
        return;
      }

      setError("Invalid email or password");

    } catch {
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };


  /* ================= UI ================= */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-100 relative overflow-hidden">

      {/* background blur */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-300 opacity-30 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-purple-300 opacity-30 blur-[120px] rounded-full" />


      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-12 w-[380px] relative z-10"
      >

        <h2 className="text-3xl font-bold text-center mb-2">
          Welcome Back 👋
        </h2>

        <p className="text-gray-500 text-center text-sm mb-8">
          Sign in to continue
        </p>


        {/* ================= EMAIL ================= */}
        <div className="mb-5 relative">
          <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />

          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>


        {/* ================= PASSWORD ================= */}
        <div className="mb-6 relative">

          <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />

          <input
            type={showPass ? "text" : "password"}
            required
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full pl-10 pr-10 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {/* 👁 Eye Toggle */}
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-3 text-gray-400 hover:text-indigo-600"
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>

        </div>


        {/* ================= ERROR ================= */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">
            {error}
          </p>
        )}


        {/* ================= BUTTON ================= */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          {loading ? "Signing in..." : "Login"}
        </motion.button>

      </motion.form>
    </div>
  );
}
