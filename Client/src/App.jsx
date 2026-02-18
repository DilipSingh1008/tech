import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import QuoteModal from "./components/QuoteModal";

// import Hero from "./sections/Hero";
import About from "./sections/About";
import Services from "./sections/Services";
import Train from "./sections/Train";
import Blogs from "./sections/Blogs";
import Career from "./sections/Career";
import Contact from "./sections/Contact";
import Home from "./sections/Home";
import AdminLogin from "./Admin/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./Admin/Dashboard";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Check if current route is admin
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-[#050a1f] font-sans selection:bg-[#00e5fa] selection:text-black">
      {!isAdminPage && <Navbar onOpenModal={openModal} />}

      <main>
        <Routes>
          <Route path="/" element={<Home onOpenModal={openModal} />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/train" element={<Train />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/career" element={<Career />} />
          <Route path="/contact" element={<Contact />} />

          {/* ADMIN PAGES */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!isAdminPage && <Footer />}
      {!isAdminPage && <QuoteModal isOpen={isModalOpen} onClose={closeModal} />}
    </div>
  );
}
export default App;
