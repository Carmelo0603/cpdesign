import { useTranslation } from "react-i18next";
import heroIcon from "../../assets/Container_margin.svg";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col items-center justify-center border-b-8 border-dark py-16 md:py-24 px-4 bg-light text-center">
      <h1 className="font-heading font-black text-6xl md:text-8xl lg:text-[10rem] leading-[0.85] tracking-tighter text-dark m-0">{t("hero_designer")}</h1>

      <div className="bg-neon text-dark font-heading font-black text-4xl md:text-6xl px-6 py-1 border-8 border-dark shadow-brutal my-6 -rotate-6">
        &lt;&amp;&gt;
      </div>

      <h1 className="font-heading font-black text-6xl md:text-8xl lg:text-[10rem] leading-[0.85] tracking-tighter text-dark m-0">{t("hero_developer")}</h1>

      <img src={heroIcon} alt="UX/UI & Development Logic" className="w-70 md:w-150 my-6 object-contain" />
      <div className="mt-10 max-w-3xl">
        <h3 className="font-heading font-black text-2xl md:text-3xl text-dark uppercase tracking-tight">{t("hero_subtitle")}</h3>
      </div>
    </section>
  );
};

export default Hero;
