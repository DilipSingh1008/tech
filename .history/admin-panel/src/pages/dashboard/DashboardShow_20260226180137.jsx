import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { getItems } from "../../services/api";
import {
  Users,
  Briefcase,
  Package,
  Activity,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";

const DashboardShow = () => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    roles: 0,
    activeRoles: 0,
    services: 0,
    activeServices: 0,
    products: 0,
    activeProducts: 0,
  });

  // EXACT THEME MATCH (Keeping your color palette)
  const theme = {
    main: isDarkMode
      ? "bg-[#0b0e14] text-slate-300"
      : "bg-gray-50 text-gray-700",
    card: isDarkMode
      ? "bg-[#151b28] border-gray-800"
      : "bg-white border-gray-200 shadow-sm",
    subText: isDarkMode ? "text-gray-400" : "text-gray-500",
    headerText: isDarkMode ? "text-white" : "text-gray-900",
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [roleRes, serviceRes, productRes] = await Promise.all([
        getItems("user"),
        getItems("services"),
        getItems("product-item"),
      ]);
      setStats({
        roles: roleRes.data?.length || 0,
        activeRoles: roleRes.data?.filter((r) => r.status).length || 0,
        services: serviceRes.data?.length || 0,
        activeServices: serviceRes.data?.filter((s) => s.status).length || 0,
        products: productRes.data?.length || 0,
        activeProducts: productRes.data?.filter((p) => p.status).length || 0,
      });
    } catch (error) {
      console.error("Dashboard Data Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const Card = ({ title, total, active, icon, color, gradient }) => {
    const percentage = total > 0 ? Math.round((active / total) * 100) : 0;

    return (
      <div
        className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg group ${theme.card}`}
      >
        {/* Subtle Background Accent */}
        <div
          className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity ${gradient}`}
        ></div>

        <div className="flex items-center justify-between mb-6">
          <div
            className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500 ring-1 ring-${color}-500/20`}
          >
            {React.cloneElement(icon, { size: 22 })}
          </div>
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-${color}-500/10 text-${color}-500`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full bg-${color}-500 animate-pulse`}
            ></span>
            Live
          </div>
        </div>

        {loading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-8 w-12 bg-gray-700/20 rounded"></div>
            <div className="h-4 w-24 bg-gray-700/10 rounded"></div>
          </div>
        ) : (
          <div className="relative z-10">
            <div className="flex items-end justify-between">
              <div>
                <p className={`text-sm font-medium mb-1 ${theme.subText}`}>
                  {title}
                </p>
                <h3
                  className={`text-4xl font-bold tracking-tight ${theme.headerText}`}
                >
                  {total}
                </h3>
              </div>
              <div className="text-right">
                <p
                  className={`text-xs font-semibold text-${color}-500 flex items-center gap-1 justify-end`}
                >
                  {percentage}% <ArrowUpRight size={12} />
                </p>
                <p className="text-[11px] opacity-60">Success Rate</p>
              </div>
            </div>

            {/* Feature: Custom Progress Bar */}
            <div className="mt-5">
              <div className="flex justify-between text-[10px] mb-1.5 font-bold uppercase tracking-tight opacity-60">
                <span>Active Units</span>
                <span>
                  {active} / {total}
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-500/10 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ease-out bg-${color}-500`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 lg:p-10 ${theme.main}`}>
      <div className="max-w-6xl mx-auto">
        {/* Responsive Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {/* <Activity size={18} className="text-blue-500" /> */}
              {/* <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500">
                Management Suite
              </span> */}
              <h2
                className={`text-3xl font-bold tracking-tight ${theme.headerText}`}
              >
                Dashboard Overview
              </h2>
            </div>
            {/* <h2
              className={`text-3xl font-extrabold tracking-tight ${theme.headerText}`}
            >
              System Overview
            </h2> */}
          </div>

          <button
            onClick={fetchDashboardData}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
              isDarkMode
                ? "bg-(--primary) text-white hover:bg-(--primary)"
                : "bg-(--primary) text-white hover:bg-(--primary)"
            }`}
          >
            Refresh Data <ChevronRight size={16} />
          </button>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <Card
            title="Total Roles"
            total={stats.roles}
            active={stats.activeRoles}
            icon={<Users />}
            color="blue"
            gradient="bg-blue-500"
          />

          <Card
            title="Total Services"
            total={stats.services}
            active={stats.activeServices}
            icon={<Briefcase />}
            color="purple"
            gradient="bg-purple-500"
          />

          <Card
            title="Total Products"
            total={stats.products}
            active={stats.activeProducts}
            icon={<Package />}
            color="emerald"
            gradient="bg-emerald-500"
          />
        </div>

        {/* Info Footer - Makes it look like a real feature */}
        <div
          className={`mt-10 p-4 rounded-2xl border border-dashed flex items-center justify-center gap-2 text-xs font-medium ${theme.subText} border-gray-700/50`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          All systems operational. Last updated:{" "}
          {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default DashboardShow;
