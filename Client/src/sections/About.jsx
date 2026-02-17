import React from "react";

export default function About() {
  return (
    <section
      id="about"
      className="relative bg-[#050a1f] text-white py-20 md:py-32 px-6 overflow-hidden"
    >
      {/* Background Glow Effect */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00e5fa]/5 rounded-full blur-[120px] -z-0" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[100px] -z-0" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left Side: Impactful Text */}
        <div className="space-y-8">
          <div>
            <span className="text-[#00e5fa] font-bold tracking-[0.2em] text-sm uppercase mb-4 block">
              Our Legacy
            </span>
            <h2 className="text-4xl md:text-6xl font-black leading-[1.1]">
              Architecting the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5fa] to-blue-400">
                Next Digital Frontier.
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            <p className="text-slate-400 text-lg leading-relaxed border-l-2 border-[#00e5fa] pl-6">
              We don't just build software; we engineer growth. At{" "}
              <span className="text-white font-bold">Tech</span>, we specialize
              in high-performance ecosystems designed for the modern enterprise.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed pl-6">
              From seamless Cloud migrations to intuitive Mobile experiences,
              our mission is to turn complex challenges into scalable digital
              assets.
            </p>
          </div>

          {/* Quick Stats - Adds massive trust */}
          <div className="flex gap-10 pt-4">
            <div>
              <h4 className="text-3xl font-bold text-white">50+</h4>
              <p className="text-slate-500 text-sm uppercase tracking-wider">
                Projects
              </p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-white">99%</h4>
              <p className="text-slate-500 text-sm uppercase tracking-wider">
                Uptime
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Glassmorphism Cards */}
        <div className="grid gap-6">
          <div className="group p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-[#00e5fa]/40 transition-all duration-500 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#00e5fa] scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />
            <h3 className="text-2xl font-bold mb-3 flex items-center gap-3">
              <span className="text-[#00e5fa]">01.</span> Our Mission
            </h3>
            <p className="text-slate-400 leading-relaxed">
              To deliver high-velocity digital solutions that empower global
              brands to outpace the competition through technology.
            </p>
          </div>

          <div className="group p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-blue-400/40 transition-all duration-500 backdrop-blur-sm relative overflow-hidden lg:ml-12">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />
            <h3 className="text-2xl font-bold mb-3 flex items-center gap-3">
              <span className="text-blue-400">02.</span> Our Vision
            </h3>
            <p className="text-slate-400 leading-relaxed">
              To be the world’s most trusted partner for digital transformation,
              setting new benchmarks in innovation and agility.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
