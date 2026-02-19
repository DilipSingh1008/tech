import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Settings,
  Train,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Monitor,
  UserPlus,
} from "lucide-react";

import HeroForm from "./HeroForm";
import ServicesForm from "./ServicesForm";
import TrainForm from "./TrainForm";
import CreateAdmin from "./createadmin";
import CareerManager from "./CareerManager";
// import Createadmin from "./CreateAdmin";
function Dashboard() {
  const [activeTab, setActiveTab] = useState("Hero");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Hero Section",
      icon: <Monitor size={20} />,
      component: <HeroForm />,
    },
    // { name: "About Us", icon: <User size={20} />, component: <AboutForm /> },
    {
      name: "Careers",
      icon: <Briefcase size={20} />,
      component: <CareerManager />,
    },
    {
      name: "Services",
      icon: <Settings size={20} />,
      component: <ServicesForm />,
    },
    { name: "Training", icon: <Train size={20} />, component: <TrainForm /> },
    {
      name: "Manage Admins",
      icon: <UserPlus size={20} />,
      component: <CreateAdmin />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* --- SIDEBAR --- */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col fixed h-full z-50`}
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Admin Panel
            </h2>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hover:bg-slate-800 p-1 rounded"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center p-3 rounded-xl transition-all ${
                activeTab === item.name
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {isSidebarOpen && (
                <span className="ml-3 font-medium transition-opacity">
                  {item.name}
                </span>
              )}
              {isSidebarOpen && activeTab === item.name && (
                <ChevronRight size={16} className="ml-auto" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}
      >
        {/* Navbar */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-indigo-600" size={24} />
            <h1 className="text-lg font-semibold text-slate-800">
              {activeTab} Management
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-700">Super Admin</p>
              <p className="text-xs text-slate-500">online</p>
            </div>
            <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
              AD
            </div>
          </div>
        </header>

        {/* Content Section */}
        <div className="p-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
            <div className="p-6">
              {menuItems.find((item) => item.name === activeTab)?.component}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
