import React from "react";

const trainings = [
  {
    title: "Web Development Bootcamp",
    desc: "Master HTML5, CSS3, JavaScript, React, and Node.js with real-time projects.",
    duration: "12 Weeks",
    icon: "💻",
    level: "Beginner to Pro",
  },
  {
    title: "Mobile App Development",
    desc: "Build native-feel iOS & Android apps using React Native and Flutter frameworks.",
    duration: "8 Weeks",
    icon: "📱",
    level: "Intermediate",
  },
  {
    title: "Cloud & DevOps Ops",
    desc: "Hands-on with AWS, Docker, Kubernetes, and automated CI/CD pipelines.",
    duration: "10 Weeks",
    icon: "🚀",
    level: "Advanced",
  },
];

export default function Train() {
  return (
    <section
      id="training"
      className="bg-[#030712] text-white py-25 px-4 lg:px-12 relative overflow-hidden"
    >
      {/* Background Grid Pattern (For Unique Look) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300e5fa' fill-opacity='1'%3E%3Cpath d='M36 34v2h-2v-2h2zm0 8v2h-2v-2h2zm10-8v2h-2v-2h2zm0 8v2h-2v-2h2zm-20-8v2h-2v-2h2zm0 8v2h-2v-2h2zm10-16v2h-2v-2h2zm10 0v2h-2v-2h2zm-20 0v2h-2v-2h2zm10-8v2h-2v-2h2zm10 0v2h-2v-2h2zm-20 0v2h-2v-2h2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header - Compact & Strong */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-[1px] bg-[#00e5fa]"></span>
              <span className="text-[#00e5fa] font-bold text-[10px] uppercase tracking-[0.4em]">
                Expert Led Training
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">
              Future-Proof Your <span className="text-[#00e5fa]">Career.</span>
            </h2>
          </div>
          <p className="text-slate-400 text-sm max-w-sm border-l border-white/10 pl-4 mb-1">
            Industry-recognized certifications and real-world projects to help
            you lead the tech world.
          </p>
        </div>

        {/* Training Grid - Tight Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {trainings.map((t, i) => (
            <div
              key={i}
              className="group relative bg-[#0b1120] border border-white/5 p-6 rounded-xl hover:bg-[#0f172a] transition-all duration-300 flex flex-col justify-between"
            >
              {/* Top Section */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">
                    {t.icon}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-tighter bg-white/5 px-2 py-0.5 rounded border border-white/10 text-slate-400">
                    {t.level}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-[#00e5fa] transition-colors tracking-tight">
                  {t.title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                  {t.desc}
                </p>
              </div>

              {/* Bottom Section - No Extra Gaps */}
              <div className="mt-8 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase text-slate-600 font-bold tracking-widest">
                    Duration
                  </span>
                  <span className="text-sm font-bold text-slate-200">
                    {t.duration}
                  </span>
                </div>
                <button className="text-[#00e5fa] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group/btn">
                  Apply Now
                  <span className="w-5 h-5 rounded-full border border-[#00e5fa]/30 flex items-center justify-center group-hover/btn:bg-[#00e5fa] group-hover/btn:text-black transition-all">
                    →
                  </span>
                </button>
              </div>

              {/* Hover Border Glow Effect */}
              <div className="absolute inset-0 border border-[#00e5fa]/0 group-hover:border-[#00e5fa]/40 rounded-xl transition-all pointer-events-none shadow-[inset_0_0_20px_rgba(0,229,250,0.02)]" />
            </div>
          ))}
        </div>

        {/* Minimal Footer CTA */}
        {/* <div className="mt-12 flex flex-col items-center border-t border-white/5 pt-10">
          <button className="group relative px-8 py-3 bg-[#00e5fa] text-black font-black text-xs uppercase tracking-[0.2em] rounded shadow-[0_10px_30px_rgba(0,229,250,0.2)] hover:scale-105 transition-all">
            Browse All Programs
            <div className="absolute -inset-1 bg-[#00e5fa] rounded blur opacity-0 group-hover:opacity-30 transition-all"></div>
          </button>
          <p className="mt-6 text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
            New Batch Starts: March 2026
          </p>
        </div> */}
      </div>
    </section>
  );
}
