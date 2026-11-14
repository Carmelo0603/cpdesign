import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "../hooks/usePage";
import { ButtonLink } from "../components/ui/Button";
import { Container } from "../components/ui/Section";
import { LostAnchor } from "../components/illustrations/Illustrations";

const NotFoundPage = () => {
  const { t } = useTranslation();
  useDocumentTitle(t("meta.notFound"));
  return (
    <section className="on-blue bg-violet text-sand">
      <Container className="grid grid-cols-1 items-center gap-10 py-20 md:py-28 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <p className="voice text-[2rem] leading-none text-lilac">404</p>
          <h1 className="condensed mt-4 text-masthead">
            <span className="mast-in block">{t("notFound.title")}</span>
          </h1>
          <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-lilac">{t("notFound.text")}</p>
          <ButtonLink to="/" className="mt-10" variant="light" size="lg" icon="arrowRight">
            {t("notFound.home")}
          </ButtonLink>
        </div>
        <LostAnchor className="block h-auto w-full max-w-[520px] lg:col-span-6 lg:justify-self-end" />
      </Container>
    </section>
  );
};

export default NotFoundPage;
