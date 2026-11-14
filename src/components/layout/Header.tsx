import { useEffect, useId, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../../config/i18n";
import { SITE } from "../../config/site";
import { useLang } from "../../hooks/usePage";
import Icon from "../ui/Icon";
import Wordmark from "../ui/Wordmark";

const LanguageSwitch = ({ onChange, large = false, onDark = false }: { onChange?: () => void; large?: boolean; onDark?: boolean }) => {
  const { t, i18n } = useTranslation();
  const lang = useLang();
  return (
    <div role="group" aria-label={t("nav.language")} className={`flex items-center ${large ? "gap-6 text-2xl" : "gap-3 text-sm"}`}>
      {LANGUAGES.map((lng) => (
        <button
          key={lng}
          type="button"
          lang={lng}
          aria-pressed={lang === lng}
          onClick={() => {
            i18n.changeLanguage(lng);
            onChange?.();
          }}
          className={`font-semibold uppercase transition-colors duration-150 ${
            onDark
              ? lang === lng
                ? "text-sand underline decoration-peach decoration-2 underline-offset-[6px]"
                : "text-lilac hover:text-sand"
              : lang === lng
                ? "text-ink underline decoration-violet decoration-2 underline-offset-[6px]"
                : "text-ink-3 hover:text-ink"
          }`}
        >
          {lng}
        </button>
      ))}
    </div>
  );
};

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `relative py-1 transition-colors duration-150 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-ink after:transition-transform after:duration-300 after:ease-[var(--ease-out-expo)] hover:after:scale-x-100 ${
    isActive ? "after:scale-x-100" : "after:scale-x-0"
  }`;

const Header = () => {
  const { t } = useTranslation();
  const lang = useLang();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const menuId = useId();

  // Close the mobile menu on navigation
  const [path, setPath] = useState(location.pathname);
  if (path !== location.pathname) {
    setPath(location.pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { to: "/progetti", label: t("nav.projects") },
    { to: "/chisono", label: t("nav.about") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/80 text-ink backdrop-blur-md">
      <a
        href="#main"
        className="absolute top-2 left-2 z-[60] -translate-y-20 rounded-full bg-peach px-4 py-2 font-semibold text-night focus:translate-y-0"
      >
        {t("nav.skip")}
      </a>
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:h-[72px] lg:px-10">
        <Link to="/" aria-label={`CPDESIGN — ${t("nav.home")}`} className="-m-2 p-2">
          <Wordmark />
        </Link>

        <nav aria-label={t("nav.main")} className="hidden items-center gap-9 text-[0.9375rem] font-medium md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={navLinkClass} viewTransition>
              {l.label}
            </NavLink>
          ))}
          <a href="#contatti" className={navLinkClass({ isActive: false })}>
            {t("nav.contact")}
          </a>
          <span aria-hidden="true" className="h-5 w-px bg-ink/20" />
          <LanguageSwitch />
          <a
            href={SITE.cv[lang]}
            download
            className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-paper transition-colors duration-200 hover:bg-coral active:scale-[0.97]"
          >
            <Icon name="download" size={16} />
            {t("nav.cv")}
          </a>
        </nav>

        <button
          type="button"
          className="-mr-2 inline-flex size-11 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? t("nav.menuClose") : t("nav.menuOpen")}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "close" : "menu"} size={24} />
        </button>
      </div>

      {open && (
        <div id={menuId} className="on-blue menu-reveal fixed inset-x-0 top-16 bottom-0 flex h-[calc(100dvh-4rem)] flex-col overflow-y-auto bg-violet px-4 pt-6 pb-8 text-sand sm:px-6 md:hidden">
          <nav aria-label={t("nav.main")} className="flex flex-col">
            {links.map((l, i) => (
              <Link
                key={l.to}
                to={l.to}
                viewTransition
                onClick={() => setOpen(false)}
                className="fade-in condensed flex items-center justify-between border-b border-sand/25 py-5 text-[2.75rem] leading-none"
                style={{ ["--delay" as string]: `${60 + i * 50}ms` }}
              >
                {l.label}
                <Icon name="arrowRight" size={24} />
              </Link>
            ))}
            <a
              href="#contatti"
              onClick={() => setOpen(false)}
              className="fade-in condensed flex items-center justify-between border-b border-sand/25 py-5 text-[2.75rem] leading-none"
              style={{ ["--delay" as string]: "160ms" }}
            >
              {t("nav.contact")}
              <Icon name="arrowRight" size={24} />
            </a>
          </nav>
          <div className="mt-8 flex items-center justify-between">
            <LanguageSwitch large onDark onChange={() => setOpen(false)} />
          </div>
          <a
            href={SITE.cv[lang]}
            download
            className="mt-auto inline-flex h-14 items-center justify-center gap-3 rounded-full bg-sand text-base font-semibold text-night active:scale-[0.98]"
          >
            <Icon name="download" size={18} />
            {t("nav.cv")}
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
