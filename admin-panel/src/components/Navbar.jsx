import { Bell, Search, Menu, User, Command, LogOut } from "lucide-react";
import ThemeToggleButton from "./Button";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
// import { useLocation } from "react-router-dom";
const getPageTitle = () => {
  const path = location.pathname;

  if (path === "/dashboard") return "Dashboard";
  if (path === "/dashboard/users") return "Users";
  if (path === "/dashboard/settings") return "Settings";
  if (path === "/dashboard/categories") return "Manage Categories";
  if (path === "/dashboard/location") return "Location";
  if (path === "/dashboard/profile") return "Account Settings";

  return "Dashboard"; // default
};

const Navbar = ({ onMenuClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  // const location = useLocation();

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      className="h-16 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between border-b transition-all duration-300"
      style={{
        backgroundColor: "var(--main-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl transition-colors hover:bg-slate-800/50"
          style={{ color: "var(--text-muted)" }}
        >
          <Menu size={22} />
        </button>

        <div className="hidden sm:flex flex-col">
          <span
            className="text-sm font-bold tracking-tight "
            style={{ color: "var(--text-muted)" }}
          >
            {/* Dashboard */}
            {getPageTitle()}
          </span>
          {/* <span
            className=" text-[8px] uppercase tracking-[0.2em] "
            style={{ color: "var(--text-main)" }}
          >
            System
          </span> */}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Modern Search Input */}
        <div
          className="hidden md:flex items-center px-3 py-1.5 rounded-lg border transition-all"
          style={{
            backgroundColor: "#161b22",
            borderColor: "var(--border-color)",
          }}
        >
          <Search size={14} style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none focus:outline-none ml-2 text-xs w-40 placeholder:text-slate-600"
            style={{ color: "var(--text-main)" }}
          />
        </div>

        <button className="relative p-2 rounded-xl transition-all hover:bg-slate-800/50 group">
          <Bell size={20} style={{ color: "var(--text-muted)" }} />
          <span
            className="absolute top-2 right-2.5 w-2 h-2 rounded-full border-2"
            style={{
              backgroundColor: "var(--primary)",
              borderColor: "var(--main-bg)",
            }}
          ></span>
        </button>

        <div
          className="h-6 w-[1px]"
          style={{ backgroundColor: "var(--border-color)" }}
        ></div>
        <div>
          {" "}
          <ThemeToggleButton />
        </div>
        {/* Profile */}
        <div className="flex items-center gap-3 group cursor-pointer pl-1">
          <div className="text-right hidden lg:block">
            <p
              className="text-xs font-bold leading-none mb-1"
              style={{ color: "var(--text-main)" }}
            >
              Akash Sharma
            </p>
            <p
              className="text-[10px] font-bold uppercase"
              style={{ color: "var(--primary)" }}
            >
              Admin
            </p>
          </div>
          <div className="relative" ref={dropdownRef}>
            {/* Clickable User Icon */}
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-9 h-9 rounded-full flex items-center justify-center border cursor-pointer transition-transform hover:scale-105"
              style={{
                backgroundColor: "#161b22",
                borderColor: "var(--border-color)",
              }}
            >
              <User size={18} style={{ color: "var(--primary)" }} />
            </div>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div
                className="absolute top-full right-0 mt-2 w-40 rounded-lg shadow-lg border z-50 overflow-hidden"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                }}
              >
                {/* Profile */}
                <button
                  onClick={() => {
                    navigate("/dashboard/profile");
                    setIsDropdownOpen(false);
                  }}
                  className="
        flex items-center gap-2
        w-full px-4 py-2 text-sm
        transition-all duration-150
        hover:bg-black/5 
        dark:hover:bg-white/5
        active:scale-[0.98]
        active:bg-black/10
        dark:active:bg-white/10
      "
                  style={{ color: "var(--text-main)" }}
                >
                  <User size={14} />
                  <span>Profile</span>
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="
        flex items-center gap-2
        w-full px-4 py-2 text-sm
        transition-all duration-150
        hover:bg-black/5 
        dark:hover:bg-white/5
        active:scale-[0.98]
        active:bg-black/10
        dark:active:bg-white/10
      "
                  style={{ color: "var(--danger)" }}
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
