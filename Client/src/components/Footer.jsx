import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#050a1f] text-gray-400 py-8 text-center">
      <p>
        © {new Date().getFullYear()} Tech Technologies. All rights reserved.
      </p>
    </footer>
  );
}
