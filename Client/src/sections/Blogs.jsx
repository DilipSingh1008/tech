import React from "react";

const blogPosts = [
  {
    title: "Top Web Development Trends 2026",
    desc: "From AI-driven interfaces to WASM, explore the technologies defining the next web era.",
    category: "Development",
    date: "Feb 15, 2026",
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600",
  },
  {
    title: "The Psychology of UI/UX Design",
    desc: "How cognitive load and micro-interactions dictate user retention in modern apps.",
    category: "Design",
    date: "Feb 10, 2026",
    img: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=600",
  },
  {
    title: "Scaling Startup Infrastructure",
    desc: "A guide to building resilient cloud architectures that grow with your user base.",
    category: "Cloud",
    date: "Feb 05, 2026",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600",
  },
];

export default function Blogs() {
  return (
    <section
      id="blogs"
      className="bg-[#020617] text-white py-24 px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-[#00e5fa]"></span>
              <p className="text-[#00e5fa] font-bold text-[10px] uppercase tracking-[0.4em]">
                Insights & News
              </p>
            </div>
            <h2 className="text-2xl md:text-4xl font-black leading-tight">
              Latest from our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5fa] to-blue-500">
                Tech Lab
              </span>
            </h2>
          </div>
          <button className="hidden md:block group px-8 py-3 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#00e5fa] hover:text-black hover:border-[#00e5fa] transition-all duration-300">
            View All Insights
          </button>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {blogPosts.map((post, i) => (
            <article
              key={i}
              className="group cursor-pointer transform transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden rounded-[2rem] mb-6 aspect-[16/10] bg-slate-900 border border-white/5">
                <img
                  src={post.img}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-in-out"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />

                <div className="absolute top-5 left-5">
                  <span className="bg-[#00e5fa] text-black text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Text Content */}
              <div className="px-2">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
                  {post.date}
                </p>
                <h3 className="text-xl font-bold group-hover:text-[#00e5fa] transition-colors duration-300 leading-snug mb-3">
                  {post.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-5 font-medium">
                  {post.desc}
                </p>

                {/* Interactive Link */}
                <div className="flex items-center text-[#00e5fa] font-bold text-[10px] uppercase tracking-[0.2em] group-hover:gap-3 transition-all">
                  Read Article
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile View All */}
        <button className="md:hidden mt-12 w-full py-4 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-white/5">
          View All Insights
        </button>
      </div>
    </section>
  );
}
