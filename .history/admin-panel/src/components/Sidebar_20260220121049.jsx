import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Hexagon,
  X,
  Grid,
  LocationEdit,
} from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    { path: "/dashboard/users", name: "Users", icon: <Users size={18} /> },
    {
      path: "/dashboard/location",
      name: "Location",
      icon: <LocationEdit size={18} />,
    },
    {
      path: "/dashboard/settings",
      name: "Settings",
      icon: <Settings size={18} />,
    },
    {
      path: "/dashboard/categories",
      name: "Manage Categories",
      icon: <Grid size={18} />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar - Width reduced to w-56 */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] w-56 transform transition-transform duration-300 ease-in-out border-r flex flex-col
        md:sticky md:translate-x-0 
        ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
        style={{
          backgroundColor: "var(--sidebar-bg)",
          borderColor: "var(--border-color)",
          height: "100vh",
        }}
      >
        {/* Header - Height reduced to h-14 for compact look */}
        <div
          className="h-14 flex items-center justify-between px-5 border-b"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="p-1 rounded-lg"
              style={{
                backgroundColor: "var(--primary-glow)",
                color: "var(--primary)",
              }}
            >
              <Hexagon size={18} fill="currentColor" fillOpacity={0.2} />
            </div>
            <h2
              className="text-md font-bold uppercase tracking-tighter"
              style={{ color: "var(--text-main)" }}
            >
              Admin<span style={{ color: "var(--primary)" }}>Pan</span>
            </h2>
          </div>
          <button
            onClick={toggleSidebar}
            className="md:hidden p-1 text-slate-500 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation - Reduced vertical padding (py-4) and spacing (space-y-1) */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              onClick={() => window.innerWidth < 768 && toggleSidebar()}
              className={({ isActive }) => `
                flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 group
                ${isActive ? "bg-white/5 border border-white/5" : "hover:bg-white/5 text-slate-400"}
              `}
              style={({ isActive }) => ({
                color: isActive ? "var(--primary)" : "var(--text-muted)",
              })}
            >
              {({ isActive }) => (
                <>
                  <span className="group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="text-[13px] font-medium tracking-tight">
                    {item.name}
                  </span>
                  {isActive && (
                    <div
                      className="ml-auto w-1 h-1 rounded-full shadow-[0_0_8px_var(--primary)]"
                      style={{ backgroundColor: "var(--primary)" }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
