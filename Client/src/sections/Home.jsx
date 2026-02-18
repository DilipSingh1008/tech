import React from "react";
import Hero from "./Hero";
import About from "./About";
import Services from "./Services";
import Train from "./Train";
import Blogs from "./Blogs";
import Career from "./Career";
import Contact from "./Contact";

function Home({ onOpenModal }) {
  return (
    <>
      <Hero onOpenModal={onOpenModal} />
      <About />
      <Services />
      <Train />
      <Blogs />
      <Career />
      <Contact />
    </>
  );
}
export default Home;
