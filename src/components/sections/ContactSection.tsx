import { useState, useRef, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { useTranslation } from "react-i18next";

const ContactSection = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const { t } = useTranslation();

  const sendEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );
      setStatusMessage("success");
      formRef.current.reset();
    } catch (error) {
      console.error("Errore invio mail:", error);
      setStatusMessage("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contatti" className="flex flex-col lg:flex-row border-t-8 border-dark bg-light w-full">
      <div className="w-full lg:w-1/2 p-6 md:p-12 border-b-8 lg:border-b-0 lg:border-r-8 border-dark text-dark flex flex-col justify-between">
        <h2 className="font-heading font-black text-6xl md:text-8xl uppercase tracking-tighter leading-[0.85] mb-8">
          {t("contact_title_1")}
          <br />
          {t("contact_title_2")}
        </h2>
        <div>
          <span className="font-heading font-black text-3xl md:text-5xl text-dark border-4 border-dark px-4 py-2 bg-neon inline-block shadow-brutal">[04]</span>
        </div>
      </div>

      <div className="w-full lg:w-1/2 p-6 md:p-12 bg-neon text-dark">
        <form ref={formRef} onSubmit={sendEmail} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="user_name" className="font-heading font-black text-xl uppercase">
              {t("contact_name")}
            </label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              required
              placeholder={t("contact_name_ph")}
              className="bg-light border-4 border-dark p-4 font-heading font-black uppercase text-xl placeholder:text-dark/50 focus:outline-none focus:shadow-brutal transition-shadow"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="user_email" className="font-heading font-black text-xl uppercase">
              {t("contact_email")}
            </label>
            <input
              type="email"
              id="user_email"
              name="user_email"
              required
              placeholder={t("contact_email_ph")}
              className="bg-light border-4 border-dark p-4 font-heading font-black uppercase text-xl placeholder:text-dark/50 focus:outline-none focus:shadow-brutal transition-shadow"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="font-heading font-black text-xl uppercase">
              {t("contact_message")}
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              placeholder={t("contact_message_ph")}
              className="bg-light border-4 border-dark p-4 font-heading font-black uppercase text-xl placeholder:text-dark/50 focus:outline-none focus:shadow-brutal transition-shadow resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`font-heading font-black text-2xl uppercase p-6 border-4 border-dark shadow-brutal transition-all mt-4 ${
              isSubmitting
                ? "bg-gray-400 text-dark shadow-none translate-y-1 translate-x-1 cursor-not-allowed"
                : "bg-dark text-neon hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            }`}
          >
            {isSubmitting ? t("contact_submitting") : t("contact_submit")}
          </button>

          {statusMessage === "success" && (
            <div className="bg-dark text-neon p-4 font-heading font-black uppercase border-4 border-dark mt-4">{t("contact_success")}</div>
          )}
          {statusMessage === "error" && (
            <div className="bg-red-500 text-dark p-4 font-heading font-black uppercase border-4 border-dark mt-4">{t("contact_error")}</div>
          )}
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
