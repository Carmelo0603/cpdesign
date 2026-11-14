import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocalizedProjects } from "../hooks/useProjects";
import { useDocumentTitle } from "../hooks/usePage";
import { Button } from "../components/ui/Button";
import ProjectPanel, { ProjectPanelSkeleton } from "../components/ui/ProjectPanel";
import { Container, StatusBlock } from "../components/ui/Section";
import { toneAt } from "../lib/tone";

const ProjectsPage = () => {
  const { t } = useTranslation();
  useDocumentTitle(t("meta.projects"));
  const { localized, status, retry } = useLocalizedProjects();
  const [params, setParams] = useSearchParams();
  const active = params.get("categoria");

  const categories = useMemo(() => Array.from(new Set(localized.map((p) => p.category))).sort((a, b) => a.localeCompare(b)), [localized]);
  const visible = active ? localized.filter((p) => p.category === active) : localized;

  const select = (category: string | null) => {
    const next = new URLSearchParams(params);
    if (category) next.set("categoria", category);
    else next.delete("categoria");
    const apply = () => setParams(next, { replace: true, preventScrollReset: true });
    if (document.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) document.startViewTransition(apply);
    else apply();
  };

  const chip = (selected: boolean) =>
    `inline-flex h-10 items-center rounded-full border-2 px-4 text-sm font-semibold transition-colors duration-150 ${
      selected ? "border-ink bg-ink text-paper" : "border-ink/20 text-ink-2 hover:border-ink hover:text-ink"
    }`;

  const [first, ...others] = visible;
  const showFeature = !active && first;
  const grid = showFeature ? others : visible;

  return (
    <>
      <Container className="pt-12 pb-12 md:pt-16 md:pb-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end md:gap-8">
          <h1 id="archive-title" className="condensed text-masthead md:col-span-8">
            <span className="mast-in block">{t("projects.title")}</span>
          </h1>
          <div className="md:col-span-4 md:pb-3">
            {status === "ready" && <p className="voice text-[2rem] leading-none tabular-nums">{t("projects.count", { count: localized.length })}</p>}
            <p className="mt-4 max-w-[44ch] text-lg leading-relaxed text-ink-2">{t("projects.archiveLead")}</p>
          </div>
        </div>

        {categories.length > 1 && (
          <div role="group" aria-label={t("projects.filterLabel")} className="mt-12 flex flex-wrap gap-2 border-t border-ink pt-6">
            <button type="button" aria-pressed={!active} onClick={() => select(null)} className={chip(!active)}>
              {t("projects.filterAll")}
            </button>
            {categories.map((c) => (
              <button key={c} type="button" aria-pressed={active === c} onClick={() => select(c)} className={chip(active === c)}>
                {c}
              </button>
            ))}
          </div>
        )}
      </Container>

      <Container className="pb-20 md:pb-28">
        {status === "error" && (
          <StatusBlock action={<Button onClick={retry} variant="outline">{t("projects.retry")}</Button>}>{t("projects.error")}</StatusBlock>
        )}
        {status === "ready" && visible.length === 0 && <StatusBlock>{active ? t("projects.emptyFilter") : t("projects.empty")}</StatusBlock>}

        {status === "loading" && (
          <>
            <ProjectPanelSkeleton variant="feature" />
            <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-12">
              <div className="md:col-span-7"><ProjectPanelSkeleton /></div>
              <div className="md:col-span-5 md:mt-28"><ProjectPanelSkeleton /></div>
            </div>
          </>
        )}

        {status === "ready" && showFeature && <ProjectPanel project={first} tone={toneAt(0)} variant="feature" priority headingLevel="h2" />}
        {status === "ready" && grid.length > 0 && (
          <div className={`grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-12 ${showFeature ? "mt-20 md:mt-28" : ""}`}>
            {grid.map((p, i) => (
              <div
                key={p.id}
                className={i % 2 === 1 ? "md:col-span-5 md:mt-28" : i === grid.length - 1 ? "md:col-span-7 md:col-start-6" : "md:col-span-7"}
              >
                <ProjectPanel project={p} tone={toneAt(localized.indexOf(p))} tall={i % 2 === 1} headingLevel="h2" priority={!showFeature && i < 2} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </>
  );
};

export default ProjectsPage;
