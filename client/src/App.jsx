import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));

if (auth && Date.now() > auth.expires) {
  localStorage.removeItem("auth");
}

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
