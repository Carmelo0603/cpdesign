import { useTranslation } from "react-i18next";
import { useLocalizedProjects } from "../hooks/useProjects";
import { useDocumentTitle } from "../hooks/usePage";
import { Button, ButtonLink } from "../components/ui/Button";
import { Container, StatusBlock } from "../components/ui/Section";
import Hero from "../components/sections/Hero";
import Story from "../components/sections/Story";
import Journey from "../components/sections/Journey";
import WorkIndex from "../components/sections/WorkIndex";

/** Home as a journey: the cover with its lens, the deck of disciplines, the road so far, then the work. */
const HomePage = () => {
  const { t } = useTranslation();
  useDocumentTitle(t("meta.home"));
  const { localized, status, retry } = useLocalizedProjects();

  return (
    <>
      <Hero />
      <Story />
      <Journey />

      <section aria-labelledby="selected-title" className="py-24 md:py-32">
        <Container>
          <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
            <h2 id="selected-title" className="text-[clamp(2.5rem,1.4rem+4vw,5.5rem)] leading-[0.9] font-bold tracking-[-0.04em]">
              {t("projects.selected")}
              <span className="voice mt-1 block text-[0.5em] tracking-[-0.01em] text-lilac">{t("projects.selectedAccent")}</span>
            </h2>
            <ButtonLink to="/progetti" viewTransition variant="outline" icon="arrowRight">
              {t("projects.all")}
            </ButtonLink>
          </div>
          {status === "error" && (
            <StatusBlock action={<Button onClick={retry} variant="outline">{t("projects.retry")}</Button>}>{t("projects.error")}</StatusBlock>
          )}
          {status === "loading" && (
            <div className="flex flex-col gap-3" aria-hidden="true">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="skeleton h-20 rounded-md" />
              ))}
            </div>
          )}
          {status === "ready" && localized.length === 0 && <StatusBlock>{t("projects.empty")}</StatusBlock>}
          {status === "ready" && localized.length > 0 && <WorkIndex projects={localized.slice(0, 6)} />}
        </Container>
      </section>
    </>
  );
};

export default HomePage;
