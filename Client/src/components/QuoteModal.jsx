import React from "react";

const QuoteModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        onClick={() => onClose(false)}
        className="absolute inset-0 bg-slate-950/80  animate-in fade-in duration-300"
      />

      {/* Modal Box */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl z-[10000] max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-10 duration-300"
      >
        <div className="sticky top-0 bg-[#0f172a] px-6 py-4 border-b border-white/5 flex justify-between items-center z-10">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Start Your <span className="text-[#00e5fa]">Project</span>
          </h2>
          <button
            onClick={() => onClose(false)}
            className="p-2 text-slate-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 md:p-8">
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full p-3 bg-[#1e293b] text-white rounded-xl border border-white/5 outline-none focus:ring-2 focus:ring-[#00e5fa]"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full p-3 bg-[#1e293b] text-white rounded-xl border border-white/5 outline-none focus:ring-2 focus:ring-[#00e5fa]"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Category
              </label>
              <select className="w-full p-3 bg-[#1e293b] text-white rounded-xl border border-white/5 outline-none focus:ring-2 focus:ring-[#00e5fa]">
                <option>Website Development</option>
                <option>Mobile App (iOS/Android)</option>
                <option>UI/UX Design</option>
                <option>E-commerce Store</option>
                <option>Custom SaaS Portal</option>
                <option>Cloud Infrastructure</option>
              </select>
            </div>
            <button className="w-full bg-[#00e5fa] py-4 rounded-xl font-bold text-black hover:bg-white transition-all">
              Send Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuoteModal;
