import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { SITE } from "../../config/site";
import { Button } from "../ui/Button";
import Icon from "../ui/Icon";

type Status = "idle" | "sending" | "success" | "error";

const field =
  "w-full border-0 border-b-2 border-ink/25 bg-transparent px-0 py-3 text-lg text-ink placeholder:text-ink-3 transition-[border-color] duration-200 hover:border-ink/60 focus:border-coral focus:outline-none";

/** A round button that leans toward the pointer and copies the email address. */
const MagneticCopy = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const zone = el.parentElement;
    if (!zone) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * 0.28}px, ${dy * 0.28}px)`;
    };
    const onLeave = () => {
      el.style.transform = "";
    };
    zone.addEventListener("pointermove", onMove);
    zone.addEventListener("pointerleave", onLeave);
    return () => {
      zone.removeEventListener("pointermove", onMove);
      zone.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.location.href = `mailto:${SITE.email}`;
    }
  };

  return (
    <div className="-m-10 p-10">
      <button
        ref={ref}
        type="button"
        onClick={copy}
        data-cursor={copied ? "✓" : t("contact.copyCursor")}
        className="magnetic flex size-44 flex-col items-center justify-center gap-2 rounded-full bg-coral text-night shadow-[0_30px_60px_-24px_rgb(232_115_90/0.7)] transition-[transform,background-color] duration-500 ease-[var(--ease-out-expo)] hover:bg-peach md:size-52"
      >
        <Icon name={copied ? "check" : "mail"} size={26} />
        <span className="px-6 text-center text-[0.9375rem] leading-tight font-semibold" aria-live="polite">
          {copied ? t("contact.copied") : t("contact.copy")}
        </span>
      </button>
    </div>
  );
};

const ContactSection = () => {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    // Honeypot: bots fill every field
    if ((form.elements.namedItem("company") as HTMLInputElement | null)?.value) return;
    setStatus("sending");
    try {
      const { default: emailjs } = await import("@emailjs/browser");
      await emailjs.sendForm(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, form, {
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      });
      setStatus("success");
      form.reset();
    } catch (error) {
      console.error("EmailJS:", error);
      setStatus("error");
    }
  };

  const direct = [
    { href: `mailto:${SITE.email}`, label: SITE.email, kind: "Email" },
    { href: SITE.linkedin, label: "LinkedIn", kind: "LinkedIn", external: true },
    { href: SITE.github, label: "GitHub", kind: "GitHub", external: true },
  ];

  return (
    <section id="contatti" aria-labelledby="contact-title" className="relative scroll-mt-16 overflow-hidden lg:scroll-mt-[72px]">
      <span aria-hidden="true" className="contact-glow" />
      <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-14 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-12 lg:gap-8 lg:px-10">
        <div className="lg:col-span-6">
          <h2 id="contact-title" className="text-[clamp(3rem,1.4rem+6vw,7.5rem)] leading-[0.88] font-bold tracking-[-0.045em]">
            {t("contact.title")}
            <span className="voice mt-2 block text-[0.62em] tracking-[-0.01em] text-coral">{t("contact.titleAccent")}</span>
          </h2>
          <p className="mt-8 max-w-[46ch] text-lg leading-relaxed text-ink-2">{t("contact.lead")}</p>

          <div className="mt-10 flex flex-col gap-10 sm:flex-row sm:items-center">
            <MagneticCopy />
            <ul className="min-w-0 flex-1 border-t border-rule">
              {direct.map((d) => (
                <li key={d.kind} className="border-b border-rule">
                  <a
                    href={d.href}
                    {...(d.external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="group flex items-center justify-between gap-4 py-4 text-base font-medium break-all transition-colors duration-150 hover:text-coral"
                  >
                    {d.label}
                    <Icon
                      name={d.external ? "arrowUpRight" : "arrowRight"}
                      size={18}
                      className="shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <form ref={formRef} onSubmit={send} className="flex flex-col gap-8 rounded-[28px] border border-rule bg-paper-2/70 p-6 backdrop-blur-sm sm:p-10 lg:col-span-5 lg:col-start-8 lg:self-end">
          <p className="voice text-[1.75rem] leading-none">{t("contact.formTitle")}</p>
          <div className="grid gap-8 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-ink-2">{t("contact.name")}</span>
              <input type="text" name="user_name" autoComplete="name" required placeholder={t("contact.namePh")} className={field} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-ink-2">{t("contact.email")}</span>
              <input type="email" name="user_email" autoComplete="email" required placeholder={t("contact.emailPh")} className={field} />
            </label>
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-ink-2">{t("contact.message")}</span>
            <textarea name="message" required rows={4} placeholder={t("contact.messagePh")} className={`${field} resize-y`} />
          </label>
          <label className="sr-only" aria-hidden="true">
            Company
            <input type="text" name="company" tabIndex={-1} autoComplete="off" />
          </label>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button type="submit" size="lg" icon={status === "sending" ? undefined : "arrowRight"} disabled={status === "sending"}>
              {status === "sending" ? t("contact.submitting") : t("contact.submit")}
            </Button>
            <p role="status" aria-live="polite" className="text-[0.9375rem]">
              {status === "success" && (
                <span className="fade-in inline-flex items-center gap-2">
                  <span aria-hidden="true" className="size-2.5 rounded-full bg-lilac" />
                  {t("contact.success")}
                </span>
              )}
              {status === "error" && (
                <span className="fade-in inline-flex items-start gap-2">
                  <span aria-hidden="true" className="mt-1.5 size-2.5 shrink-0 rounded-full bg-coral" />
                  {t("contact.error")}
                </span>
              )}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
