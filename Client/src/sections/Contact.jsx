import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.message
    ) {
      alert("fill all input ");
      return;
    }
    alert(`Thank you, ${formData.firstName}! We'll get back to you soon.`);
    setFormData({ firstName: "", lastName: "", email: "", message: "" });
  };

  return (
    <section
      id="contact"
      className="relative bg-[#020617] text-white py-24 px-6 overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-[#00e5fa]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-10 -left-20 w-60 h-60 bg-blue-600/10 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Contact Info & Vibe */}
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                Let’s Build Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5fa] to-blue-500">
                  Digital Future.
                </span>
              </h2>
              <p className="text-slate-400 text-lg max-w-md">
                Have a groundbreaking idea? Or need to scale your enterprise?
                Our team in Jodhpur is ready to help.
              </p>
            </div>

            <div className="grid gap-8">
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#00e5fa] transition-colors">
                  <span className="text-xl">📞</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#00e5fa] uppercase tracking-widest">
                    Phone
                  </p>
                  <p className="text-xl font-semibold">+91 9785869100</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#00e5fa] transition-colors">
                  <span className="text-xl">📍</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#00e5fa] uppercase tracking-widest">
                    Location
                  </p>
                  <p className="text-xl font-semibold text-slate-200">
                    Jodhpur, Rajasthan, India
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#00e5fa] transition-colors">
                  <span className="text-xl">⏰</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#00e5fa] uppercase tracking-widest">
                    Business Hours
                  </p>
                  <p className="text-lg font-semibold text-slate-200">
                    Mon - Fri: 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Modern Form Card */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#00e5fa] focus:bg-white/10 transition-all"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#00e5fa] focus:bg-white/10 transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                  Work Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#00e5fa] focus:bg-white/10 transition-all"
                  placeholder="hello@company.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                  Project Details
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full h-32 bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#00e5fa] focus:bg-white/10 transition-all resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <button
                type="submit"
                className="group w-full bg-[#00e5fa] hover:bg-white text-black font-black py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 shadow-[0_10px_30px_rgba(0,229,250,0.2)]"
              >
                Send Message
                <span className="group-hover:translate-x-1 transition-transform"></span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
