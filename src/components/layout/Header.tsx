import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // Fallback di sicurezza: se la lingua non è ancora caricata, forza l'italiano per evitare crash
  const currentLang = i18n.language || "it";

  return (
    <header className="border-b-8 border-dark bg-light flex justify-between items-center p-6 lg:px-12 w-full z-50 relative">
      <Link
        to="/"
        className="font-heading font-black text-4xl lg:text-5xl tracking-tighter hover:text-neon hover:bg-dark transition-colors px-2"
        onClick={() => setIsMenuOpen(false)}
      >
        &lt; CPDESIGN &gt;
      </Link>

      {/* DESKTOP */}
      <div className="hidden lg:flex items-center gap-10">
        <nav className="flex gap-10 font-heading font-black text-xl lg:text-2xl uppercase">
          <Link to="/progetti" className="hover:text-neon hover:bg-dark px-2 transition-colors">
            {t("nav_projects")}
          </Link>
          <Link to="/chisono" className="hover:text-neon hover:bg-dark px-2 transition-colors">
            {t("nav_about")}
          </Link>
        </nav>

        {/* SWITCH LINGUA DESKTOP */}
        <div className="flex border-4 border-dark font-heading font-black text-lg uppercase bg-light">
          <button
            onClick={() => changeLanguage("it")}
            className={`px-3 py-1 transition-colors ${currentLang.startsWith("it") ? "bg-dark text-neon" : "hover:bg-neon text-dark"}`}
          >
            IT
          </button>
          <div className="w-1 bg-dark"></div>
          <button
            onClick={() => changeLanguage("en")}
            className={`px-3 py-1 transition-colors ${currentLang.startsWith("en") ? "bg-dark text-neon" : "hover:bg-neon text-dark"}`}
          >
            EN
          </button>
        </div>

        <a
          href="https://cyrexymityfwnnqectvm.supabase.co/storage/v1/object/public/portfolio-assets/Carmelo%20Provenzani%20CV.zip"
          download="Carmelo_Provenzani_CV.zip"
          className="bg-neon text-dark font-heading font-black text-2xl px-8 py-2 border-4 border-dark shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all block"
        >
          CV
        </a>
      </div>

      {/* MOBILE: L'hamburger resta visibile fino al breakpoint 'lg' */}
      <button
        className="lg:hidden flex flex-col justify-center items-center gap-1.5 p-2 border-4 border-dark hover:bg-neon transition-colors"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Menu"
      >
        <span className={`block w-8 h-1 bg-dark transition-transform duration-200 ${isMenuOpen ? "rotate-45 translate-y-2.5" : ""}`}></span>
        <span className={`block w-8 h-1 bg-dark transition-opacity duration-200 ${isMenuOpen ? "opacity-0" : ""}`}></span>
        <span className={`block w-8 h-1 bg-dark transition-transform duration-200 ${isMenuOpen ? "-rotate-45 -translate-y-2.5" : ""}`}></span>
      </button>

      {/* MOBILE: Menu a tendina visibile sotto 'lg' */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-light border-b-8 border-dark flex flex-col font-heading font-black text-2xl uppercase lg:hidden shadow-brutal z-40">
          <Link to="/progetti" className="p-6 border-b-4 border-dark hover:bg-neon hover:text-dark transition-colors" onClick={() => setIsMenuOpen(false)}>
            {t("nav_projects")}
          </Link>
          <Link to="/chisono" className="p-6 border-b-4 border-dark hover:bg-neon hover:text-dark transition-colors" onClick={() => setIsMenuOpen(false)}>
            {t("nav_about")}
          </Link>

          {/* SWITCH LINGUA MOBILE */}
          <div className="p-6 border-b-4 border-dark flex gap-4">
            <button
              onClick={() => {
                changeLanguage("it");
                setIsMenuOpen(false);
              }}
              className={`flex-1 border-4 border-dark py-2 font-heading font-black transition-colors ${currentLang.startsWith("it") ? "bg-dark text-neon" : "hover:bg-neon text-dark"}`}
            >
              IT
            </button>
            <button
              onClick={() => {
                changeLanguage("en");
                setIsMenuOpen(false);
              }}
              className={`flex-1 border-4 border-dark py-2 font-heading font-black transition-colors ${currentLang.startsWith("en") ? "bg-dark text-neon" : "hover:bg-neon text-dark"}`}
            >
              EN
            </button>
          </div>

          <div className="p-6 bg-dark">
            <button className="w-full bg-neon text-dark font-heading font-black text-2xl px-8 py-4 border-4 border-dark shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              SCARICA CV
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
