import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";

const Contact = () => {
  const { t } = useApp();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const onChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    toast.success(t("form_success"), { duration: 5000 });
    setSent(true);
    setForm({ name: "", email: "", phone: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="bg-black text-white pt-20">
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 pt-16 pb-20">
        <p className="font-display text-[11px] tracking-[0.4em] uppercase text-white/60 mb-4">
          — Concierge
        </p>
        <h1 className="font-display text-5xl md:text-7xl leading-tight">{t("contact_h")}</h1>
        <p className="font-body italic text-lg md:text-2xl text-white/70 mt-6">{t("contact_sub")}</p>
      </section>

      <section className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 pb-24">
        {/* FORM */}
        <form data-testid="contact-form" onSubmit={onSubmit} className="space-y-10">
          <Field
            label={t("form_name")}
            value={form.name}
            onChange={(v) => onChange("name", v)}
            testid="contact-name"
            required
          />
          <Field
            label={t("form_email")}
            value={form.email}
            onChange={(v) => onChange("email", v)}
            testid="contact-email"
            type="email"
            required
          />
          <Field
            label={t("form_phone")}
            value={form.phone}
            onChange={(v) => onChange("phone", v)}
            testid="contact-phone"
            type="tel"
          />
          <Field
            label={t("form_message")}
            value={form.message}
            onChange={(v) => onChange("message", v)}
            testid="contact-message"
            textarea
            required
          />

          <button
            data-testid="contact-submit"
            type="submit"
            className="bg-white text-black font-display text-[12px] tracking-[0.32em] uppercase px-12 py-5 hover:bg-[#f5f5f5] transition-colors"
          >
            {t("send")}
          </button>

          {sent && (
            <p data-testid="contact-success" className="font-body text-lg text-white/85">
              {t("form_success")}
            </p>
          )}
        </form>

        {/* INFO */}
        <aside className="space-y-10">
          <InfoBlock title={t("contact_address_h")} body={t("contact_address")} testid="contact-address" />
          <InfoBlock title={t("contact_phone_h")} body={t("contact_phone")} testid="contact-phone-info" />
          <InfoBlock title={t("contact_email_h")} body={t("contact_email")} testid="contact-email-info" />
          <InfoBlock title={t("showroom_hours_h")} body={t("appointment_b")} testid="contact-hours-info" />
        </aside>
      </section>
    </div>
  );
};

const Field = ({ label, value, onChange, testid, type = "text", required, textarea }) => (
  <label className="block">
    <span className="font-display text-[11px] tracking-[0.32em] uppercase text-white/60 mb-3 inline-block">
      {label}
    </span>
    {textarea ? (
      <textarea
        data-testid={testid}
        required={required}
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-[#1a1a1a] focus:border-white outline-none py-3 font-body text-lg resize-none transition-colors"
      />
    ) : (
      <input
        data-testid={testid}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-[#1a1a1a] focus:border-white outline-none py-3 font-body text-lg transition-colors"
      />
    )}
  </label>
);

const InfoBlock = ({ title, body, testid }) => (
  <div data-testid={testid} className="border-b border-[#1a1a1a] pb-8">
    <p className="font-display text-[11px] tracking-[0.32em] uppercase text-white/60">{title}</p>
    <p className="font-body text-xl md:text-2xl text-white mt-3 leading-relaxed">{body}</p>
  </div>
);

export default Contact;
