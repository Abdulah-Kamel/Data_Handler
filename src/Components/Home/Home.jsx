import React from "react";
import NavBar from "../NavBar/NavBar";
import Hero from "./Sections/Hero";
import About from "./Sections/About";
import Services from "./Sections/Services";
import Contact from "./Sections/Contact";
import Footer from "./Sections/Footer";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  return (
    <>
      <title>{t("home.page_title")}</title>
      <meta name="description" content={t("home.page_description")} />
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
