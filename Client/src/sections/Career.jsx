import React, { useEffect, useState } from "react";

// const jobs = [
//   {
//     title: "Frontend Developer",
//     location: "Jodhpur (In-Office)",
//     type: "Full-Time",
//     stack: "React, Tailwind, Next.js",
//   },
//   {
//     title: "Backend Developer",
//     location: "Jodhpur (In-Office)",
//     type: "Full-Time",
//     stack: "Node.js, MongoDB, AWS",
//   },
//   {
//     title: "UI/UX Designer",
//     location: "Remote / Hybrid",
//     type: "Part-Time",
//     stack: "Figma, Adobe XD, Framer",
//   },
// ];
function ApplicationModal({ job, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    resume: null,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setFormData({ ...formData, resume: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("jobTitle", job.title);
    if (formData.resume) data.append("resume", formData.resume);

    try {
      const response = await fetch("http://localhost:5000/api/apply", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        alert("Application submitted successfully!");
        onClose();
      } else {
        alert("Failed to submit application.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting application.");
    }

    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-[#020617] text-white p-8 rounded-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Apply for {job.title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-[#111827] border border-gray-600"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-[#111827] border border-gray-600"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Resume</label>
            <input
              type="file"
              name="resume"
              onChange={handleChange}
              accept=".pdf,.doc,.docx"
              required
              className="w-full p-2 rounded bg-[#111827] border border-gray-600"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-2 bg-[#00e5fa] text-black font-bold rounded hover:bg-white transition"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Career() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/career")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching jobs:", err);
        setLoading(false);
      });
  }, []);
  if (loading)
    return <p className="text-white text-center py-10">Loading...</p>;
  return (
    <section id="career" className="bg-[#020617] text-white py-25 px-6">
      <div className="max-w-6xl mx-auto">
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

        <div className="space-y-4">
          {jobs.map((job, i) => (
            <div
              key={i}
              className="group relative bg-white/5 border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/[0.08] transition-all duration-500 cursor-pointer overflow-hidden"
            >
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

              <div className="mt-6 md:mt-0 relative z-10">
                <button
                  onClick={() => setSelectedJob(job)}
                  className="w-full md:w-auto px-8 py-3 bg-[#00e5fa] text-black font-black text-xs uppercase tracking-widest rounded-xl group-hover:bg-white transition-all shadow-[0_0_20px_rgba(0,229,250,0.1)]"
                >
                  Apply Now
                </button>
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-[#00e5fa]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
      {selectedJob && (
        <ApplicationModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </section>
  );
}
