import React from "react";
import NavBar from "../NavBar/NavBar";
import Hero from "./Sections/Hero";
import About from "./Sections/About";
import Services from "./Sections/Services";
import Contact from "./Sections/Contact";
import Footer from "./Sections/Footer";
// import { Helmet } from 'react-helmet-async';

const Home = () => {
  return (
    <>
      {/* <Helmet> */}
        <title>Home</title>
        <meta name="description" content="Home page" />
      {/* </Helmet> */}
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
