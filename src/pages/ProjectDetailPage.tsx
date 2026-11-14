import { useState, type KeyboardEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useProject, useProjects } from "../hooks/useProjects";
import { useDocumentTitle, useLang } from "../hooks/usePage";
import { isImageUrl, localize, vtName } from "../lib/projects";
import { ButtonAnchor, ButtonLink } from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import Img from "../components/ui/Img";
import Tag from "../components/ui/Tag";
import { TONE_BG, toneAt, type Tone } from "../lib/tone";
import { Container, StatusBlock } from "../components/ui/Section";

const fileName = (url: string) => decodeURIComponent(url.split("/").pop()?.split("?")[0] ?? url);

const Gallery = ({ id, images, title, tone }: { id: string; images: string[]; title: string; tone: Tone }) => {
  const { t } = useTranslation();
  const pictures = images.filter(isImageUrl);
  const files = images.filter((u) => !isImageUrl(u));
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const total = pictures.length;
  const go = (delta: number) => setIndex((i) => (i + delta + total) % total);

  const onKey = (e: KeyboardEvent) => {
    if (total < 2) return;
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  if (total === 0 && files.length === 0) {
    return <div className="flex aspect-[4/3] items-center justify-center bg-paper-2 text-ink-3">{t("detail.noImages")}</div>;
  }

  const current = pictures[index];

  return (
    <div className="flex flex-col gap-4">
      {current && (
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={t("detail.gallery")}
          tabIndex={total > 1 ? 0 : -1}
          onKeyDown={onKey}
          className={`relative flex items-center justify-center overflow-hidden ${TONE_BG[tone]} p-[4%] ${loaded[current] ? "" : "aspect-[16/10]"}`}
        >
          {!loaded[current] && <div className="skeleton absolute inset-0" aria-hidden="true" />}
          <Img
            key={current}
            src={current}
            sizes="(min-width: 1024px) 64vw, 100vw"
            alt={t("detail.imageOf", { current: index + 1, total }) + ` — ${title}`}
            onLoad={() => setLoaded((l) => ({ ...l, [current]: true }))}
            className={`relative block h-auto max-h-[78vh] w-auto max-w-full object-contain transition-[opacity,filter] duration-500 ease-[var(--ease-out-expo)] ${
              loaded[current] ? "opacity-100 blur-0" : "opacity-0 blur-sm"
            }`}
            style={index === 0 ? { viewTransitionName: vtName(id) } : undefined}
          />
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={t("detail.prev")}
                className="absolute top-1/2 left-3 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink transition-colors duration-150 hover:bg-ink hover:text-paper active:scale-95 md:left-5"
              >
                <Icon name="arrowLeft" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={t("detail.next")}
                className="absolute top-1/2 right-3 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink transition-colors duration-150 hover:bg-ink hover:text-paper active:scale-95 md:right-5"
              >
                <Icon name="arrowRight" />
              </button>
            </>
          )}
        </div>
      )}

      {total > 1 && (
        <div className="flex items-center gap-4">
          <ol className="flex flex-1 gap-2 overflow-x-auto pb-1">
            {pictures.map((src, i) => (
              <li key={src} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={t("detail.imageOf", { current: i + 1, total })}
                  aria-current={i === index}
                  className={`block h-16 w-20 overflow-hidden border-2 transition-[border-color,opacity] duration-150 ${
                    i === index ? "border-ink opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Img src={src} sizes="80px" alt="" loading="lazy" className="size-full object-cover" />
                </button>
              </li>
            ))}
          </ol>
          <p className="shrink-0 text-sm font-semibold tabular-nums" aria-live="polite">
            {index + 1} / {total}
          </p>
        </div>
      )}

      {files.length > 0 && (
        <ul className="flex flex-col border-t border-rule">
          {files.map((url) => (
            <li key={url} className="border-b border-rule">
              <a href={url} target="_blank" rel="noreferrer" className="group flex items-center gap-3 py-3 text-[0.9375rem] font-medium hover:text-violet">
                <Icon name="file" size={18} />
                <span className="min-w-0 flex-1 truncate">{fileName(url)}</span>
                <span className="text-sm text-ink-3">{t("detail.file")}</span>
                <Icon name="arrowUpRight" size={16} />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Detail = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const lang = useLang();
  const { project, status } = useProject(id);
  const { projects } = useProjects();
  const p = project ? localize(project, lang) : null;
  useDocumentTitle(p ? `${p.title} — Carmelo Provenzani` : undefined);

  if (status === "loading" && !p) {
    return (
      <Container className="grid gap-10 py-12 lg:grid-cols-12">
        <div className="skeleton aspect-[16/10] lg:col-span-12" />
        <div className="flex flex-col gap-3 lg:col-span-8">
          <div className="skeleton h-4 w-1/3" />
          <div className="skeleton h-12 w-4/5" />
          <div className="skeleton mt-6 h-40" />
        </div>
      </Container>
    );
  }

  if (!p) {
    return (
      <Container className="py-16">
        <StatusBlock
          action={
            <ButtonLink to="/progetti" variant="outline" icon="arrowRight">
              {t("detail.back")}
            </ButtonLink>
          }
        >
          {t("detail.notFound")}
        </StatusBlock>
      </Container>
    );
  }

  const i = projects.findIndex((x) => x.id === id);
  const next = i >= 0 && projects.length > 1 ? localize(projects[(i + 1) % projects.length], lang) : null;

  const paragraphs = (p.description || t("detail.noDescription"))
    .split(/\n+/)
    .map((para) => para.trim())
    .filter(Boolean);
  const [lede, ...body] = paragraphs;

  return (
    <article>
      <Container className="pt-6 md:pt-8">
        <Link to="/progetti" viewTransition className="group inline-flex items-center gap-2 py-2 text-sm font-semibold text-ink-2 hover:text-ink">
          <Icon name="arrowLeft" size={16} className="transition-transform duration-200 ease-out group-hover:-translate-x-0.5" />
          {t("detail.back")}
        </Link>
      </Container>

      <Container className="grid grid-cols-1 gap-10 pt-6 pb-12 md:pb-16 lg:grid-cols-12 lg:items-end lg:gap-8">
        <h1 className="condensed text-display break-words lg:col-span-8">
          <span className="mast-in block">{p.title}</span>
        </h1>
        <dl className="grid grid-cols-1 gap-6 border-t border-ink pt-5 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
          <div>
            <dt className="voice text-[1.25rem] leading-none text-ink-2">{t("detail.category")}</dt>
            <dd className="mt-2 text-lg font-semibold">{p.category}</dd>
          </div>
          {p.tags.length > 0 && (
            <div>
              <dt className="voice text-[1.25rem] leading-none text-ink-2">{t("detail.stack")}</dt>
              <dd className="mt-3">
                <ul className="flex flex-wrap gap-2">
                  {p.tags.map((tag) => (
                    <Tag key={tag} label={tag} />
                  ))}
                </ul>
              </dd>
            </div>
          )}
        </dl>
      </Container>

      <Container>
        <Gallery id={p.id} images={p.images} title={p.title} tone={toneAt(i)} />
      </Container>

      <Container className="grid grid-cols-1 gap-10 py-20 md:py-28 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <h2 className="text-headline font-bold">{t("detail.about")}</h2>
          {p.links.length > 0 && (
            <div className="mt-8 flex flex-col items-start gap-3">
              {p.links.map((l, idx) => (
                <ButtonAnchor
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  variant={idx === 0 ? "primary" : "outline"}
                  icon="arrowUpRight"
                >
                  {l.label}
                </ButtonAnchor>
              ))}
            </div>
          )}
        </div>
        <div className="flex max-w-[65ch] flex-col gap-5 lg:col-span-7 lg:col-start-6">
          {lede && (
            <p className={lede.length > 280 ? "text-xl leading-relaxed text-ink md:text-[1.375rem]" : "voice text-[1.75rem] leading-snug md:text-[2rem]"}>{lede}</p>
          )}
          {body.map((para, i) => (
            <p key={i} className="text-[1.0625rem] leading-relaxed text-ink-2">
              {para}
            </p>
          ))}
        </div>
      </Container>

      {next && (
        <Link to={`/progetti/${next.id}`} viewTransition className="on-blue group block bg-violet text-sand">
          <Container className="flex items-end justify-between gap-6 py-14 md:py-20">
            <span className="min-w-0">
              <span className="voice block text-[1.5rem] leading-none text-lilac">{t("detail.nextProject")}</span>
              <span className="condensed mt-4 block text-display break-words group-hover:underline group-hover:decoration-4">{next.title}</span>
            </span>
            <span
              aria-hidden="true"
              className="inline-flex size-16 shrink-0 items-center justify-center rounded-full bg-sand text-night transition-colors duration-200 group-hover:bg-peach md:size-20"
            >
              <Icon name="arrowRight" size={32} className="transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1" />
            </span>
          </Container>
        </Link>
      )}
    </article>
  );
};

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  return id ? <Detail key={id} id={id} /> : null;
};

export default ProjectDetailPage;
