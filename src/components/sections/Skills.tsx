import { useTranslation } from "react-i18next";
import { Container } from "../ui/Section";

/** Skills as a typographic index on a yellow field. */
const Skills = () => {
  const { t } = useTranslation();
  const groups = [
    { name: t("skills.front"), items: ["React", "TypeScript", "Redux", "JavaScript ES6+", "Tailwind CSS", "SASS"] },
    { name: t("skills.design"), items: ["Figma", "Illustrator", "Wireframing", t("skills.prototyping"), t("skills.research")] },
    { name: t("skills.back"), items: ["Java", "Spring Boot", "MySQL"] },
  ];

  return (
    <section aria-labelledby="skills-title" className="border-t border-rule py-20 md:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-6 pb-12 md:grid-cols-12 md:gap-8 md:pb-16">
          <h2 id="skills-title" className="text-headline font-bold md:col-span-7">
            {t("skills.title")}
          </h2>
          <p className="voice max-w-[30ch] text-lilac text-[1.5rem] leading-snug md:col-span-5 md:self-end md:text-[1.75rem]">{t("skills.lead")}</p>
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          {groups.map((g) => (
            <div key={g.name}>
              <h3 className="border-b-2 border-coral pb-3 text-sm font-bold tracking-[0.04em] text-coral uppercase">{g.name}</h3>
              <ul>
                {g.items.map((item) => (
                  <li key={item} className="border-b border-rule py-3 text-[1.625rem] leading-tight font-semibold tracking-[-0.02em] md:text-[1.875rem]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Skills;
