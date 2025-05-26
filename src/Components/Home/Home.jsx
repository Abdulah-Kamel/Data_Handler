import React from "react";
import NavBar from "../NavBar/NavBar";
import Hero from "./Sections/Hero";
import About from "./Sections/About";
import Services from "./Sections/Services";
import Contact from "./Sections/Contact";
import Footer from "./Sections/Footer";

const Home = () => {
  return (
    <>
      <title>Home</title>
      <meta name="description" content="Home page" />
      <NavBar />
      <Hero />
      <About />
      <Services />
      <Contact />
      <Footer />
    </>
  );
};

export default Home;
