import { useState, useEffect } from "react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1542744094-24638eff58bb?q=80&w=2071",
    title: "Engineering Digital Excellence",
    subtitle: "FULL STACK SYSTEMS",
    desc: "Architecting high-performance digital ecosystems with seamless scalability and enterprise-grade security.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2071",
    title: "Innovating Mobile Experiences",
    subtitle: "NEXT-GEN APPS",
    desc: "Crafting intuitive iOS & Android solutions that redefine user engagement and business efficiency.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2071",
    title: "Future-Ready Cloud Infrastructure",
    subtitle: "CLOUD ARCHITECTURE",
    desc: "Accelerate your digital transformation with agile, secure, and cost-optimized cloud deployments.",
  },
];

export default function Hero({ onOpenModal }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  // const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section
        id="home"
        className="relative h-screen flex items-center px-6 md:px-20 bg-[#020617] overflow-hidden"
      >
        {/* 1. Subtle Animated Grid Overlay (IT Vibe) */}
        <div
          className="absolute inset-0 z-10 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(#00e5fa 0.5px, transparent 0.5px)",
            backgroundSize: "30px 30px",
          }}
        ></div>

        <div className="absolute inset-0 z-0">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out ${
                index === currentSlide
                  ? "opacity-40 scale-100"
                  : "opacity-0 scale-110"
              }`}
            >
              <img
                src={slide.image}
                className="w-full h-full object-cover"
                alt=""
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/80 to-transparent z-10" />
        </div>

        <div className="relative z-20 max-w-5xl">
          <div
            key={`text-${currentSlide}`}
            className="animate-in fade-in slide-in-from-bottom-8 duration-1000"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[1px] w-8 bg-[#00e5fa]"></span>
              <p className="text-[#00e5fa] font-bold tracking-[0.3em] text-xs uppercase">
                {slides[currentSlide].subtitle}
              </p>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6 tracking-tight">
              {slides[currentSlide].title.split(" ").map((word, i) => (
                <span
                  key={i}
                  className={
                    i === 2
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-[#00e5fa] to-blue-500"
                      : ""
                  }
                >
                  {word}{" "}
                </span>
              ))}
            </h1>

            <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
              {slides[currentSlide].desc}
            </p>
          </div>

          {/* 4. Interactive Action Group */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <button
              onClick={onOpenModal}
              className="w-full sm:w-auto bg-[#00e5fa] hover:bg-white text-black px-10 py-4 rounded-xl font-black transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(0,229,250,0.3)]"
            >
              Start Your Project
            </button>

            <button className="flex items-center gap-2 text-white font-bold hover:text-[#00e5fa] transition-colors group">
              <span className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center group-hover:border-[#00e5fa]">
                ▶
              </span>
              Watch Showreel
            </button>
          </div>
        </div>

        {/* 5. Modern Slide Progress Indicators */}
        <div className="absolute right-10 bottom-10 md:bottom-auto md:top-1/2 md:-translate-y-1/2 flex md:flex-col gap-4 z-30">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`transition-all duration-500 rounded-full ${
                i === currentSlide
                  ? "h-12 w-1.5 bg-[#00e5fa]"
                  : "h-6 w-1.5 bg-slate-700 hover:bg-slate-500"
              }`}
            />
          ))}
        </div>
      </section>
      
    </>
  );
}
