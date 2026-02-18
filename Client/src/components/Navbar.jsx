import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ onOpenModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll logic with cleanup
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Training", path: "/train" },
    { name: "Blogs", path: "/blogs" },
    { name: "Career", path: "/career" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-[1000] ">
      {/* --- TOP BAR (Desktop Only) --- */}
      <div className="bg-[#ADADAD] text-[#1E40AF] py-1.5 border-b border-gray-300 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center text-[10px] font-extrabold uppercase tracking-widest">
          <div className="flex gap-6">
            <a
              href="mailto:info@tech.com"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
              info@tech.com
            </a>
            <a
              href="tel:+919785869100"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              +91 9785869100
            </a>
          </div>
          <div className="flex gap-4 items-center">
            {/* Social Icons simplified for readability */}
            {["Instagram", "LinkedIn", "Twitter"].map((social) => (
              <a
                key={social}
                href="#"
                className="hover:text-blue-800 transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* --- MAIN NAVBAR --- */}
      <nav
        className={`w-full transition-all duration-500 px-6 md:px-12 ${
          scrolled
            ? "py-3 bg-[#050a1f]/95 backdrop-blur-md shadow-xl"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer z-[1100]">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00e5fa] to-blue-600 rounded-lg blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative bg-white rounded-md w-9 h-9 flex items-center justify-center transition-transform group-hover:scale-110">
                <span className="text-[#050a1f] font-black text-xl italic">
                  T
                </span>
              </div>
            </div>
            <span
              className={`font-bold text-2xl tracking-tighter transition-colors duration-300 ${scrolled ? "text-white" : "text-white md:text-white"}`}
            >
              Tech<span className="text-[#00e5fa]">.</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-[12px] font-bold uppercase tracking-widest transition-all duration-300 relative group ${
                    scrolled
                      ? "text-gray-300"
                      : "text-gray-700 md:text-white lg:text-gray-200"
                  } hover:text-[#00e5fa]!`}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#00e5fa] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            <button
              onClick={onOpenModal}
              className="bg-[#00e5fa] text-[#050a1f] px-6 py-2.5 rounded-full font-bold text-[12px] uppercase tracking-wider hover:bg-white hover:shadow-[0_0_20px_rgba(0,229,250,0.4)] transition-all duration-300 active:scale-95 shadow-lg"
            >
              Get Quote
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => {
              setIsOpen(!isOpen);
              // onOpenModal();
            }}
            className="lg:hidden relative z-[1100] p-2 text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between items-end">
              <span
                className={`h-0.5 bg-current transition-all duration-300 ${isOpen ? "w-6 rotate-45 translate-y-2.5 bg-[#00e5fa]" : "w-6"}`}
              ></span>
              <span
                className={`h-0.5 bg-current transition-all duration-300 ${isOpen ? "opacity-0" : "w-4"}`}
              ></span>
              <span
                className={`h-0.5 bg-current transition-all duration-300 ${isOpen ? "w-6 -rotate-45 -translate-y-2 bg-[#00e5fa]" : "w-5"}`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Overlay Menu */}
        <div
          className={`fixed inset-0 bg-[#050a1f] z-[1050] flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
            isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          }`}
        >
          <div className="flex flex-col items-center gap-8">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                style={{ transitionDelay: `${index * 50}ms` }}
                className={`text-3xl font-bold text-white hover:text-[#00e5fa] transition-all transform ${isOpen ? "translate-y-0" : "translate-y-10"}`}
              >
                {item.name}
              </Link>
            ))}
            <button
              className={`mt-4 bg-[#00e5fa] text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest transition-all transform ${isOpen ? "translate-y-0" : "translate-y-10"}`}
              style={{ transitionDelay: `400ms` }}
            >
              Get Quote
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
