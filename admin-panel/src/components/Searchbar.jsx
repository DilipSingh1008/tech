import { Search } from "lucide-react";
import React from "react";
import { useTheme } from "../context/ThemeContext";

const Searchbar = ({ value, onChange }) => {
  const { isDarkMode } = useTheme();

  const bgColor = isDarkMode ? "bg-[#151b28]" : "bg-white";
  const borderColor = isDarkMode ? "border-gray-700/50" : "border-gray-300";
  const textColor = isDarkMode
    ? "text-slate-300 placeholder:text-slate-500"
    : "text-gray-700 placeholder:text-gray-400";

  return (
    <div
      className={`hidden md:flex items-center px-3 py-1.5 rounded-lg border ${bgColor} ${borderColor} transition-all`}
    >
      <Search
        size={14}
        className={`mr-2 ${isDarkMode ? "text-gray-400" : "text-gray-400"}`}
      />
      <input
        type="text"
        placeholder="Search..."
        className={`bg-transparent border-none focus:outline-none text-xs w-40 ${textColor}`}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Searchbar;
