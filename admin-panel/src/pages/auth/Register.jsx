import Sidebar from "../../components/Sidebar";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    navigate("/"); // redirect to login if not logged in
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg-color)] font-[var(--font-family)]">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[var(--primary-color)]">
            Dashboard
          </h1>
          <Button
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Logout
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded shadow">Users: 120</div>
          <div className="bg-white p-4 rounded shadow">Sales: $3,200</div>
          <div className="bg-white p-4 rounded shadow">Visits: 5,400</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
