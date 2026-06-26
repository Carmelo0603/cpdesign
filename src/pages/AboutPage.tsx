import { useTranslation } from "react-i18next";

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-light flex flex-col w-full">
      <div className="border-b-8 border-dark p-6 md:px-12 md:py-16 bg-neon flex flex-col md:flex-row md:items-end justify-between gap-6">
        <h1 className="font-heading font-black text-6xl md:text-8xl lg:text-[9rem] uppercase tracking-tighter text-dark leading-[0.8] m-0">
          {t("about_manifesto_1")}
          <br />
          {t("about_manifesto_2")}
        </h1>
        <span className="font-heading font-black text-3xl md:text-5xl text-dark border-4 border-dark px-4 py-2 bg-light shadow-brutal inline-block">
          {t("about_tag")}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row w-full flex-grow">
        <div className="w-full lg:w-1/2 border-b-8 lg:border-b-0 lg:border-r-8 border-dark flex flex-col">
          <div className="p-6 md:p-12 border-b-8 border-dark bg-dark text-light">
            <h2 className="font-heading font-black text-4xl md:text-5xl uppercase mb-6">{t("about_role")}</h2>
            <p className="font-body text-xl md:text-2xl font-bold uppercase leading-tight text-justify">{t("about_desc")}</p>
          </div>

          <div className="p-6 md:p-12 bg-light flex-grow">
            <h3 className="font-heading font-black text-3xl uppercase text-dark mb-8 border-b-4 border-dark pb-2">{t("about_approach")}</h3>
            <ul className="flex flex-col gap-6 font-heading font-black text-xl md:text-2xl uppercase text-dark">
              <li className="flex items-start gap-4">
                <span className="text-neon bg-dark px-2">&rarr;</span>
                {t("about_approach_1")}
              </li>
              <li className="flex items-start gap-4">
                <span className="text-neon bg-dark px-2">&rarr;</span>
                {t("about_approach_2")}
              </li>
              <li className="flex items-start gap-4">
                <span className="text-neon bg-dark px-2">&rarr;</span>
                {t("about_approach_3")}
              </li>
              <li className="flex items-start gap-4">
                <span className="text-neon bg-dark px-2">&rarr;</span>
                {t("about_approach_4")}
              </li>
            </ul>

            <div className="mt-12 p-6 border-4 border-dark bg-neon text-dark">
              <p className="font-heading font-black text-lg uppercase leading-tight">{t("about_calisthenics")}</p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col bg-light">
          <div className="p-6 md:p-12 border-b-8 border-dark">
            <h3 className="font-heading font-black text-3xl uppercase text-dark mb-8 border-b-4 border-dark pb-2">{t("about_stack")}</h3>
            <div className="flex flex-col gap-6">
              <div>
                <div className="font-heading font-black text-xl uppercase mb-2">{t("about_frontend")}</div>
                <div className="flex flex-wrap gap-2">
                  {["React", "TypeScript", "Redux", "JavaScript (ES6+)", "Tailwind", "SASS"].map((tech) => (
                    <span key={tech} className="border-4 border-dark px-3 py-1 font-heading font-black uppercase text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-heading font-black text-xl uppercase mb-2">{t("about_uxui")}</div>
                <div className="flex flex-wrap gap-2">
                  {["Figma", "Illustrator", "Wireframing", "Prototipazione"].map((tech) => (
                    <span key={tech} className="border-4 border-dark px-3 py-1 font-heading font-black uppercase text-sm bg-dark text-neon">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-heading font-black text-xl uppercase mb-2 opacity-50">{t("about_backend")}</div>
                <div className="flex flex-wrap gap-2 opacity-50 hover:opacity-100 transition-opacity">
                  {["Java", "Spring Boot", "MySQL"].map((tech) => (
                    <span key={tech} className="border-4 border-dark px-3 py-1 font-heading font-black uppercase text-sm border-dashed">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-12 flex-grow bg-dark text-light">
            <h3 className="font-heading font-black text-3xl uppercase text-neon mb-8 border-b-4 border-neon pb-2">{t("about_timeline")}</h3>
            <div className="flex flex-col gap-10">
              <div className="relative pl-6 border-l-4 border-light">
                <div className="absolute w-4 h-4 bg-neon -left-[10px] top-1 border-2 border-dark"></div>
                <div className="font-heading font-black text-xl text-neon">{t("about_date_1")}</div>
                <div className="font-heading font-black text-2xl uppercase mt-1">{t("about_title_1")}</div>
                <p className="font-body text-sm font-bold mt-2 uppercase">{t("about_desc_1")}</p>
              </div>

              <div className="relative pl-6 border-l-4 border-light">
                <div className="absolute w-4 h-4 bg-light -left-[10px] top-1 border-2 border-dark"></div>
                <div className="font-heading font-black text-xl text-light/70">{t("about_date_2")}</div>
                <div className="font-heading font-black text-2xl uppercase mt-1">{t("about_title_2")}</div>
                <p className="font-body text-sm font-bold mt-2 uppercase">{t("about_desc_2")}</p>
              </div>

              <div className="relative pl-6 border-l-4 border-light">
                <div className="absolute w-4 h-4 bg-light -left-[10px] top-1 border-2 border-dark"></div>
                <div className="font-heading font-black text-xl text-light/70">{t("about_date_3")}</div>
                <div className="font-heading font-black text-2xl uppercase mt-1">{t("about_title_3")}</div>
                <p className="font-body text-sm font-bold mt-2 uppercase">{t("about_desc_3")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
