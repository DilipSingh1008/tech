import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Outlet } from "react-router-dom";
// import { useGetItemsQuery } from "../../redux/api/apiSlice";

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

<<<<<<< HEAD
  const roleId = localStorage.getItem("roleId");

 const{data} = useGetItemsQuery("auth/my-permissions", {
    skip: !roleId,
  });
=======
  //yh hide kiya kyu ki use nhi ho rha tha kahi pr bhi

  //   const roleId = localStorage.getItem("roleId");
  //   const role = localStorage.getItem("role");
>>>>>>> b86534a8e191f14695608db1a365b23966ed1f3b

  //  const{data} = useGetItemsQuery(`role/${roleId}/permissions`, {
  //     skip: !roleId || role === "admin",
  //   });

  return (
    <div className="flex min-h-screen bg-[var(--main-bg)]">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 md:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
