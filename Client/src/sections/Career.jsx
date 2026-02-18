import React from "react";

const jobs = [
  {
    title: "Frontend Developer",
    location: "Jodhpur (In-Office)",
    type: "Full-Time",
    stack: "React, Tailwind, Next.js",
  },
  {
    title: "Backend Developer",
    location: "Jodhpur (In-Office)",
    type: "Full-Time",
    stack: "Node.js, MongoDB, AWS",
  },
  {
    title: "UI/UX Designer",
    location: "Remote / Hybrid",
    type: "Part-Time",
    stack: "Figma, Adobe XD, Framer",
  },
];

export default function Career() {
  return (
    <section id="career" className="bg-[#020617] text-white py-25 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header - Minimalist */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
              <span className="w-10 h-[2px] bg-[#00e5fa]"></span>
              <p className="text-[#00e5fa] font-bold text-xs uppercase tracking-[0.3em]">
                We're Hiring
              </p>
            </div>
            <h2 className="text-4xl md:text-6xl font-black italic">
              Join the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5fa] to-blue-500 underline decoration-white/10">
                Squad.
              </span>
            </h2>
          </div>
          <p className="text-slate-400 text-center md:text-right max-w-sm text-sm leading-relaxed">
            Don't see a role for you? Send your resume anyway – we're always
            looking for exceptional talent.
          </p>
        </div>

        {/* Job List Layout - More professional than cards */}
        <div className="space-y-4">
          {jobs.map((job, i) => (
            <div
              key={i}
              className="group relative bg-white/5 border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/[0.08] transition-all duration-500 cursor-pointer overflow-hidden"
            >
              {/* Left Side: Info */}
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl md:text-2xl font-bold group-hover:text-[#00e5fa] transition-colors">
                    {job.title}
                  </h3>
                  <span className="hidden md:block px-3 py-0.5 bg-white/5 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-white/10">
                    {job.type}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    📍 {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    ⚙️ {job.stack}
                  </span>
                </div>
              </div>

              {/* Right Side: Action */}
              <div className="mt-6 md:mt-0 relative z-10">
                <button className="w-full md:w-auto px-8 py-3 bg-[#00e5fa] text-black font-black text-xs uppercase tracking-widest rounded-xl group-hover:bg-white transition-all shadow-[0_0_20px_rgba(0,229,250,0.1)]">
                  Apply Now
                </button>
              </div>

              {/* Decorative Background Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00e5fa]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
