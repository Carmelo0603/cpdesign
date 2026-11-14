import { useTranslation } from "react-i18next";
import { SITE } from "../../config/site";
import Icon from "../ui/Icon";
import Wordmark from "../ui/Wordmark";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-rule bg-paper-2 text-ink">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <Wordmark />
          <p className="text-sm text-band-muted">{t("footer.rights", { year: new Date().getFullYear() })}</p>
        </div>
        <div className="flex items-center gap-6 text-sm font-semibold">
          <a href={SITE.linkedin} target="_blank" rel="noreferrer" className="text-band-soft hover:text-ink">
            LinkedIn
          </a>
          <a href={SITE.github} target="_blank" rel="noreferrer" className="text-band-soft hover:text-ink">
            GitHub
          </a>
          <a href="#top" className="group inline-flex items-center gap-2 text-band-soft hover:text-ink">
            {t("footer.top")}
            <Icon name="arrowUp" size={16} className="transition-transform duration-200 ease-out group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
