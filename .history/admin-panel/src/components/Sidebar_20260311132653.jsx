import { NavLink } from "react-router-dom";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  Users,
  Settings,
  Hexagon,
  X,
  Grid,
  LocationEdit,
  ImageIcon,
  Shield,
  Layers,
  ListTree,
  Newspaper,
  HelpCircle,
  Briefcase,
  Layout,
  Tags,
  PenTool,
  MessageCircle,
} from "lucide-react";
import { useGetItemsQuery } from "../redux/api/apiSlice";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { data: modulesData } = useGetItemsQuery("role/module");
  const permissions = useSelector((state) => state.permission.permissions || []);
  const role = localStorage.getItem("role");
  const allow =
    role === "admin"
      ? true
      : role === "sub-admin"
        ? true
        : false;

  const menuItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      moduleKey: "dashboard",
    },
    // conditionally push
    ...(allow
      ? [
          {
            path: "/dashboard/managerole",
            name: "ManageRole",
            icon: <Shield size={18} />,
            moduleKey: "managerole",
          },
          {
            path: "/dashboard/manage-modules",
            name: "Manage Modules",
            icon: <ListTree size={18} />,
            moduleKey: "manage-modules",
          },
        ]
      : []),

    { path: "/dashboard/user", name: "Users", icon: <Users size={18} />, moduleKey: "users" },
    {
      path: "/dashboard/location",
      name: "Location",
      icon: <LocationEdit size={18} />,
      moduleKey: "location",
    },

    {
      path: "/dashboard/categories",
      name: "Manage Categories",
      icon: <Grid size={18} />,
      moduleKey: "categories",
    },
    {
      path: "/dashboard/banner",
      name: "Banner",
      icon: <ImageIcon size={18} />,
      moduleKey: "banner",
    },
    {
      path: "/dashboard/products",
      name: "Products",
      icon: <Hexagon size={18} />,
      moduleKey: "products",
    },
    {
      path: "/dashboard/service",
      name: "Manage Services",
      icon: <Briefcase size={18} />,
      moduleKey: "services",
    },
    {
      path: "/dashboard/cms",
      name: "Manage CMS",
      icon: <Layout size={18} />,
      moduleKey: "cms",
    },
    {
      path: "/dashboard/faq-category",
      name: "FAQ Category",
      icon: <Layers size={18} />,
      moduleKey: "faq-category",
    },
    {
      path: "/dashboard/manage-faq",
      name: "Manage FAQ",
      icon: <HelpCircle size={18} />,
      moduleKey: "faq",
    },
    {
      path: "/dashboard/manage-news",
      name: "Manage News",
      icon: <Newspaper size={18} />,
      moduleKey: "news",
    },
    {
      path: "/dashboard/Manage-Blog-Categor",
      name: "Blog Category ",
      icon: <Tags size={18} />,
      moduleKey: "blog-category",
    },
    {
      path: "/dashboard/Manage-Blog",
      name: "Manage Blog ",
      icon: <PenTool size={18} />,
      moduleKey: "blog",
    },

    {
      path: "/dashboard/Client",
      name: "Client ",
      icon: <PenTool size={18} />,
    },
    {
      path: "/dashboard/enquiry",
      name: "Enquiry",
      icon: <MessageCircle size={18} />,
      moduleKey: "enquiry",
    },
    {
      path: "/dashboard/vendor",
      name: "Vendor",
      icon: <MessageCircle size={18} />,
    },
    {
      path: "/dashboard/career",
      name: "Career",
      icon: <Briefcase size={18} />,
      moduleKey: "career",
    },
    {
      path: "/dashboard/Media-Post",
      name: "MediaPost",
      icon: <Briefcase size={18} />,
      moduleKey: "media-post",
    },
    {
      path: "/dashboard/Manage-media",
      name: "Media Category",
      icon: <ImageIcon size={18} />,
    },
    {
      path: "/dashboard/Manage-media-items",
      name: "Media Items",
      icon: <ImageIcon size={18} />,
    },
    {
      path: "/dashboard/settings",
      name: "Settings",
      icon: <Settings size={18} />,
      moduleKey: "settings",
    },
  ];

  const existingModuleNames = useMemo(
    () =>
      new Set([
        "dashboard",
        "managerole",
        "users",
        "location",
        "categories",
        "banner",
        "products",
        "services",
        "cms",
        "faq-category",
        "faq",
        "news",
        "blog-category",
        "blog",
        "client",
        "enquiry",
        "vendor",
        "career",
        "media-post",
        "settings",
      ]),
    [],
  );

  const dynamicModuleItems = useMemo(() => {
    const modules = modulesData || [];
    return modules
      .filter((mod) => mod?.name && !existingModuleNames.has(mod.name))
      .map((mod) => ({
        path: `/dashboard/module/${mod.name}`,
        name: mod.label || mod.name,
        icon: <ListTree size={18} />,
        moduleKey: mod.name,
      }));
  }, [modulesData, existingModuleNames]);

  const permissionMap = useMemo(() => {
    const map = new Map();
    permissions.forEach((p) => {
      const key = p?.module?.name;
      if (key) map.set(key, p);
    });
    return map;
  }, [permissions]);

  const allMenuItems = useMemo(() => {
    const items = [...menuItems, ...dynamicModuleItems];
    if (role === "admin") return items;

    return items.filter((item) => {
      if (!item.moduleKey) return true;
      const perm = permissionMap.get(item.moduleKey);
      return !!(perm?.all || perm?.view);
    });
  }, [menuItems, dynamicModuleItems, permissionMap, role]);
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleSidebar}
      />

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

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {allMenuItems.map((item) => (
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
