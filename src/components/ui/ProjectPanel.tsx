import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { LocalizedProject } from "../../types/portfolio";
import Icon from "./Icon";
import Img from "./Img";
import Tag from "./Tag";
import { vtName } from "../../lib/projects";
import { TONE_BG, type Tone } from "../../lib/tone";

interface Props {
  project: LocalizedProject;
  /** feature: the image plate and a large caption side by side, like a magazine spread. */
  variant?: "feature" | "card";
  /** Above-the-fold panels load eagerly. */
  priority?: boolean;
  headingLevel?: "h2" | "h3";
  /** Short context shown above the title in the feature spread, e.g. "Latest project". */
  note?: string;
  /** Taller image frame for the narrow column of an asymmetric pair. */
  tall?: boolean;
  tone: Tone;
}

const Plate = ({ project, priority, sizes, frame, tone }: { project: LocalizedProject; priority: boolean; sizes: string; frame: string; tone: Tone }) => (
  <div className={`relative ${TONE_BG[tone]} p-[7%]`}>
    <div className={`relative overflow-hidden bg-paper-2 ${frame}`}>
      {project.cover ? (
        <Img
          src={project.cover}
          sizes={sizes}
          alt=""
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="size-full object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
          style={{ viewTransitionName: vtName(project.id) }}
        />
      ) : (
        <div className="flex size-full items-end p-5" style={{ viewTransitionName: vtName(project.id) }}>
          <span className="text-headline font-bold text-ink/20">{project.title}</span>
        </div>
      )}
    </div>
  </div>
);

const ProjectPanel = ({ project, variant = "card", priority = false, headingLevel = "h3", note, tall = false, tone }: Props) => {
  const { t } = useTranslation();
  const Heading = headingLevel;
  const link = (
    <Link
      to={`/progetti/${project.id}`}
      viewTransition
      className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-has-[:focus-visible]:underline"
    >
      {project.title}
    </Link>
  );

  if (variant === "feature") {
    return (
      <article className="group relative grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className="lg:col-span-7">
          <Plate project={project} tone={tone} priority={priority} sizes="(min-width: 1024px) 56vw, 100vw" frame="aspect-[16/10]" />
        </div>
        <div className="flex flex-col items-start lg:col-span-5 lg:pb-2">
          {note && <p className="voice text-[1.5rem] leading-none text-ink-2">{note}</p>}
          <Heading className="mt-3 text-headline font-bold break-words group-hover:underline group-hover:decoration-2">{link}</Heading>
          <p className="mt-4 text-lg text-ink-2">{project.category}</p>
          {project.tags.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label={t("detail.stack")}>
              {project.tags.slice(0, 6).map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </ul>
          )}
          <span aria-hidden="true" className="mt-8 inline-flex items-center gap-3 font-semibold">
            {t("projects.view")}
            <span className="inline-flex size-11 items-center justify-center rounded-full bg-ink text-paper transition-colors duration-200 group-hover:bg-coral">
              <Icon name="arrowRight" size={18} className="transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5" />
            </span>
          </span>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative flex flex-col">
      <Plate
        project={project}
        tone={tone}
        priority={priority}
        sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
        frame={tall ? "aspect-[4/5]" : "aspect-[4/3]"}
      />
      <div className="mt-5 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <Heading className="text-title font-bold break-words group-hover:underline group-hover:decoration-2">{link}</Heading>
          <p className="mt-2 text-[0.9375rem] text-ink-3">{project.category}</p>
        </div>
        <span
          aria-hidden="true"
          className="mt-0.5 inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-ink transition-colors duration-200 group-hover:bg-ink group-hover:text-paper"
        >
          <Icon name="arrowRight" size={18} className="transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
};

export const ProjectPanelSkeleton = ({ variant = "card" }: { variant?: "feature" | "card" }) =>
  variant === "feature" ? (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-10" aria-hidden="true">
      <div className="skeleton aspect-[16/11] lg:col-span-7" />
      <div className="flex flex-col gap-3 lg:col-span-5">
        <div className="skeleton h-6 w-1/3" />
        <div className="skeleton h-14 w-4/5" />
        <div className="skeleton h-5 w-1/2" />
      </div>
    </div>
  ) : (
    <div className="flex flex-col" aria-hidden="true">
      <div className="skeleton aspect-[4/3]" />
      <div className="skeleton mt-5 h-7 w-2/3" />
      <div className="skeleton mt-2 h-4 w-1/3" />
    </div>
  );

export default ProjectPanel;
