import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const AdminDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          <h2 className="text-2xl font-bold">
            Welcome Admin 👋
          </h2>
          <p className="mt-2 text-gray-600">
            Select an option from the sidebar
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
