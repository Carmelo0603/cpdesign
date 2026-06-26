import { useTranslation } from "react-i18next";

const MyPath = () => {
  const { t } = useTranslation();

  return (
    <section id="chisono" className="border-b-8 border-dark bg-neon flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 p-6 md:p-12 border-b-8 md:border-b-0 md:border-r-8 border-dark flex flex-col justify-between">
        <h2 className="font-heading font-black text-5xl md:text-7xl uppercase tracking-tighter text-dark leading-none">
          {t("mypath_title_1")}
          <br />
          {t("mypath_title_2")}
        </h2>
        <div className="mt-8 md:mt-0">
          <span className="font-heading font-black text-3xl md:text-5xl text-dark border-4 border-dark px-4 py-2 bg-light inline-block">[03]</span>
        </div>
      </div>

      <div className="w-full md:w-2/3 p-6 md:p-12 bg-light">
        <h3 className="font-heading font-black text-3xl md:text-5xl uppercase text-dark mb-8 leading-[0.9]">{t("mypath_subtitle")}</h3>
        <p className="font-heading font-black text-xl md:text-2xl text-dark uppercase leading-tight text-justify">{t("mypath_desc")}</p>
      </div>
    </section>
  );
};

export default MyPath;
