import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Background change logic on scroll
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Services", id: "services" },
    { name: "Training", id: "training" },
    { name: "Blogs", id: "blogs" },
    { name: "Career", id: "career" },
    { name: "Contact", id: "contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-[100]">
      {/* --- TOP BAR (Fixed & Always Visible) --- */}
      {/* <div className="bg-[#020617] text-white/70 py-2 border-b border-white/5 hidden md:block">
        <div className="max-w-7xl mx-auto px-12 flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em]">
          <div className="flex gap-8">
            <a
              href="mailto:info@tech.com"
              className="flex items-center gap-2 hover:text-[#00e5fa] transition-colors"
            >
              <span className="text-[#00e5fa] text-xs">📧</span> info@tech.com
            </a>
            <a
              href="tel:+919799526124"
              className="flex items-center gap-2 hover:text-[#00e5fa] transition-colors"
            >
              <span className="text-[#00e5fa] text-xs">📞</span> +91 97995 26124
            </a>
          </div>

          <div className="flex gap-6 items-center">
            <a href="#" className="hover:text-[#00e5fa] transition-colors">
              Instagram
            </a>
            <a href="#" className="hover:text-[#00e5fa] transition-colors">
              LinkedIn
            </a>
            <a href="#" className="hover:text-[#00e5fa] transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </div> */}
      <div className="bg-[#ADADAD] text-[#1E40AF] py-2 border-b border-gray-300 hidden md:block">
        <div className="max-w-7xl mx-auto px-12 flex justify-between items-center text-[10px] font-extrabold uppercase tracking-[0.15em]">
          {/* Left Side: Contact Info */}
          <div className="flex gap-8">
            <a
              href="mailto:info@tech.com"
              className="flex items-center gap-2 hover:text-[#00e5fa] transition-colors"
            >
              <span className="text-blue-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </span>
              info@tech.com
            </a>
            <a
              href="tel:+919799526124"
              className="flex items-center gap-2 hover:text-[#00e5fa] transition-colors"
            >
              <span className="text-blue-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              +91 9785869100
            </a>
          </div>

          {/* Right Side: Social Icons with Text */}
          <div className="flex gap-6 items-center">
            <a
              href="#"
              className="flex items-center gap-1.5 hover:text-blue-800 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              Instagram
            </a>
            <a
              href="#"
              className="flex items-center gap-1.5 hover:text-blue-800 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              LinkedIn
            </a>
            <a
              href="#"
              className="flex items-center gap-1.5 hover:text-blue-800 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
              Twitter
            </a>
          </div>
        </div>
      </div>

      {/* --- MAIN NAVBAR --- */}
      <nav
        className={`w-full transition-all duration-300 px-6 md:px-12 ${
          scrolled
            ? "py-3 bg-[#050a1f]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-2 group cursor-pointer shrink-0">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00e5fa] to-blue-600 rounded-full blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative bg-white rounded-lg w-9 h-9 flex items-center justify-center transition-transform group-hover:rotate-12">
                <span className="text-[#050a1f] font-black text-lg italic">
                  T
                </span>
              </div>
            </div>
            <span className="font-bold text-xl tracking-tighter text-white">
              Tech<span className="text-[#00e5fa]">.</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <div className="flex gap-4 xl:gap-6">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={`#${item.id}`}
                  className="text-gray-300 text-[11px] xl:text-[12px] font-bold uppercase tracking-widest hover:text-[#00e5fa] transition-all duration-300 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#00e5fa] transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>

            <button className="bg-[#00e5fa] text-black px-5 py-2 rounded-full font-bold text-[11px] uppercase tracking-tighter hover:bg-white hover:shadow-[0_0_20px_rgba(0,229,250,0.4)] transition-all duration-300 active:scale-95 shadow-lg">
              Get Quote
            </button>
          </div>

          {/* Mobile Toggle Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-50 text-white focus:outline-none"
            >
              <div className="space-y-1.5">
                <span
                  className={`block h-0.5 w-6 bg-white transition-all ${isOpen ? "rotate-45 translate-y-2" : ""}`}
                ></span>
                <span
                  className={`block h-0.5 w-6 bg-white ${isOpen ? "opacity-0" : ""}`}
                ></span>
                <span
                  className={`block h-0.5 w-6 bg-white transition-all ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        <div
          className={`fixed inset-0 bg-[#050a1f] transition-all duration-500 lg:hidden ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
        >
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={`#${item.id}`}
                onClick={() => setIsOpen(false)}
                className="text-2xl font-black text-white hover:text-[#00e5fa]"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
