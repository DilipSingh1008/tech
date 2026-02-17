import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import About from "./sections/About";
import Blogs from "./sections/Blogs";
import Career from "./sections/Career";
import Contact from "./sections/Contact";
import Hero from "./sections/Hero";
import Services from "./sections/Services";
import Train from "./sections/Train";

function App() {
  return (
    <div className="min-h-screen bg-[#050a1f] font-sans selection:bg-[#00e5fa] selection:text-black">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Train />
        <Blogs />
        <Career />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
