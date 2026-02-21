import React from "react";
import { Sun, Moon } from "lucide-react"; // Agar lucide-react hai, nahi toh emojis use karein
import { useTheme } from "../context/ThemeContext";

const ThemeToggleButton = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      // "w-12 h-6" isko compact aur mini banata hai
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full 
        cursor-pointer
        transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400
        ${isDarkMode ? "bg-slate-700" : "bg-gray-200"}
      `}
    >
      <span className="sr-only">Toggle Theme</span>

      {/* Moving Circle */}
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition duration-300
          flex items-center justify-center text-[10px]
          ${isDarkMode ? "translate-x-6" : "translate-x-1"}
        `}
      >
        {isDarkMode ? (
          <Moon size={10} className="text-blue-600 fill-blue-600" />
        ) : (
          <Sun size={10} className="text-yellow-500 fill-yellow-500" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggleButton;
