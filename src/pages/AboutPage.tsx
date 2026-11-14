import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SITE } from "../config/site";
import { useDocumentTitle, useLang } from "../hooks/usePage";
import { ButtonAnchor } from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import { Container } from "../components/ui/Section";
import { Calisthenics, DesignAndCode } from "../components/illustrations/Illustrations";
import Skills from "../components/sections/Skills";

const AboutPage = () => {
  const { t } = useTranslation();
  const lang = useLang();
  useDocumentTitle(t("meta.about"));

  const approach = [t("about.approach1"), t("about.approach2"), t("about.approach3"), t("about.approach4")];
  const stops = [
    { date: t("about.t1Date"), title: t("about.t1Title"), desc: t("about.t1Desc") },
    { date: t("about.t2Date"), title: t("about.t2Title"), desc: t("about.t2Desc") },
    { date: t("about.t3Date"), title: t("about.t3Title"), desc: t("about.t3Desc") },
  ];

  return (
    <>
      <section aria-labelledby="about-title" className="on-blue overflow-hidden bg-violet text-sand">
        <Container className="grid grid-cols-1 gap-12 pt-12 pb-16 md:pt-16 md:pb-24 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="lg:col-span-7">
            <p className="fade-in text-[0.9375rem] font-semibold">{t("about.role")}</p>
            <h1 id="about-title" className="condensed mt-5 text-masthead">
              <span className="mast-in block">{t("about.title")}</span>
            </h1>
            <p className="voice fade-in mt-8 max-w-[34ch] text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] leading-[1.1]" style={{ ["--delay" as string]: "200ms" }}>
              {t("about.intro")}
            </p>
            <div className="fade-in mt-10" style={{ ["--delay" as string]: "320ms" }}>
              <ButtonAnchor href={SITE.cv[lang]} download variant="light" size="lg" icon="download">
                {t("hero.ctaCv")}
              </ButtonAnchor>
            </div>
          </div>
          <div className="bg-coral px-[7%] py-[5%] lg:col-span-5">
            <DesignAndCode eager className="block h-auto w-full" />
          </div>
        </Container>
      </section>

      <section aria-labelledby="approach-title" className="py-20 md:py-28">
        <Container>
          <h2 id="approach-title" className="text-headline font-bold">
            {t("about.approach")}
          </h2>
          <ul className="mt-12 grid grid-cols-1 gap-x-8 md:grid-cols-2">
            {approach.map((a) => (
              <li key={a} className="flex gap-5 border-t border-ink py-7 text-xl leading-snug md:text-2xl md:leading-snug">
                <span aria-hidden="true" className="mt-2.5 size-3 shrink-0 rounded-full bg-coral" />
                {a}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="path-title" className="border-t border-rule py-20 md:py-28">
        <Container>
          <h2 id="path-title" className="text-headline font-bold">
            {t("about.timeline")}
          </h2>
          <ol className="mt-12 border-b border-ink">
            {stops.map((s) => (
              <li key={s.title} className="grid grid-cols-1 gap-3 border-t border-ink py-8 md:grid-cols-12 md:gap-8">
                <p className="voice text-[1.5rem] leading-tight tabular-nums md:col-span-3">{s.date}</p>
                <h3 className="text-title font-bold md:col-span-5">{s.title}</h3>
                <p className="text-lg leading-relaxed text-ink-2 md:col-span-4">{s.desc}</p>
              </li>
            ))}
          </ol>
          <Link to="/progetti" viewTransition className="group mt-10 inline-flex items-center gap-4 text-title font-bold">
            <span className="group-hover:underline group-hover:decoration-2">{t("about.nextStopText")}</span>
            <span aria-hidden="true" className="inline-flex size-12 items-center justify-center rounded-full bg-ink text-paper transition-colors duration-200 group-hover:bg-coral">
              <Icon name="arrowRight" size={20} className="transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5" />
            </span>
          </Link>
        </Container>
      </section>

      <section aria-labelledby="offscreen-title" className="pb-20 md:pb-28">
        <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="bg-lilac px-[8%] py-[6%] lg:col-span-6">
            <Calisthenics className="block h-auto w-full" />
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <h2 id="offscreen-title" className="text-headline font-bold">
              {t("about.offscreen")}
            </h2>
            <p className="voice mt-6 text-[1.75rem] leading-snug md:text-[2rem]">{t("about.offscreenText")}</p>
          </div>
        </Container>
      </section>

      <Skills />
    </>
  );
};

export default AboutPage;
