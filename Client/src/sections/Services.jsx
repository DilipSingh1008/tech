const services = [
  {
    title: "Full Stack Systems",
    desc: "Scalable web ecosystems using MERN & Next.js for global performance.",
    icon: "🌐",
    tag: "Scalable",
  },
  {
    title: "Next-Gen Mobile",
    desc: "High-performance iOS & Android apps with intuitive UI/UX design.",
    icon: "📱",
    tag: "Intuitive",
  },
  {
    title: "Enterprise ERP/CRM",
    desc: "Tailor-made automation tools to streamline your business workflows.",
    icon: "🛠️",
    tag: "Efficiency",
  },
  {
    title: "Cloud Infrastructure",
    desc: "AWS/Azure deployments with 99.9% uptime and top-tier security.",
    icon: "☁️",
    tag: "Secure",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="bg-[#fcfdfe] py-16 px-6 border-y border-slate-100"
    >
      <div className="max-w-7xl mx-auto">
        {/* Compact Header */}
        <div className="text-center mb-12 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="w-8 h-[1.5px] bg-[#00e5fa]"></span>
            <span className="text-[#00e5fa] font-bold text-[10px] uppercase tracking-[0.2em]">
              What We Do
            </span>
            <span className="w-8 h-[1.5px] bg-[#00e5fa]"></span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5fa] to-blue-600">
              Expertise
            </span>
          </h2>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">
            Transforming complex business challenges into seamless digital
            assets.
          </p>
        </div>

        {/* Tight Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <div
              key={i}
              className="group relative p-6 rounded-2xl bg-white border border-slate-200/60 hover:border-[#00e5fa]/40 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5 flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle Corner Accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#00e5fa]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div>
                {/* Icon & Tag Row */}
                <div className="flex justify-between items-start mb-5">
                  <div className="text-3xl transform group-hover:scale-110 transition-transform duration-300 grayscale-[0.5] group-hover:grayscale-0">
                    {s.icon}
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-tighter px-2 py-0.5 bg-slate-50 text-slate-400 rounded-md group-hover:bg-[#00e5fa]/10 group-hover:text-[#00e5fa] transition-colors border border-slate-100">
                    {s.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-[#00e5fa] transition-colors">
                  {s.title}
                </h3>
                <p className="text-slate-500 text-[13px] leading-relaxed">
                  {s.desc}
                </p>
              </div>

              {/* Minimalist Footer */}
              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-2 group/btn cursor-pointer">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">
                  Details
                </span>
                <span className="text-[#00e5fa] transform group-hover/btn:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
