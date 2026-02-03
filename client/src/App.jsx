import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import CreateProject from "./components/CreateProject";
import CreateUser from "./components/CreateUser";
import UsersList from "./components/UsersList";
import MakeAdmin from "./components/MakeAdmin";

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
          <Route path="/admin/create-project" element={<CreateProject />} />
          <Route path="/admin/users" element={<UsersList />} />
          <Route path="/admin/make-admin/:id" element={<MakeAdmin />} />
          <Route path="/admin/create-user" element={<CreateUser />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
