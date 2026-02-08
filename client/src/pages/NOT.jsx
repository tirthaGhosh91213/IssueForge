import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Profile</h2>
      <p className="mt-2">Role: {user.role}</p>
    </div>
  );
};

export default Profile;
