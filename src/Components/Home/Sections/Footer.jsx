import React from "react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="text-center text-white py-4 primary-bg">
      <p>{t("footer.copyright")}</p>
    </footer>
  );
};

export default Footer;
