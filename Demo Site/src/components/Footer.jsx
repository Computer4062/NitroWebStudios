import { useApp } from "@/context/AppContext";

export const Footer = () => {
  const { t } = useApp();
  return (
    <footer
      data-testid="site-footer"
      className="bg-black border-t border-[#1a1a1a] mt-20"
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-16">
        <p className="font-body text-[13px] leading-relaxed text-white/60 max-w-4xl">
          {t("footer_disclaimer")}
        </p>

        <div className="mt-12 flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-[#1a1a1a] pt-8">
          <p className="font-display text-xs tracking-[0.32em] uppercase text-white/70">
            {t("footer_copyright")}
          </p>
          <div className="flex items-center gap-8">
            <a
              data-testid="footer-privacy"
              href="#"
              className="font-display text-xs tracking-[0.28em] uppercase text-white/70 hover:text-white transition"
            >
              {t("footer_privacy")}
            </a>
            <a
              data-testid="footer-imprint"
              href="#"
              className="font-display text-xs tracking-[0.28em] uppercase text-white/70 hover:text-white transition"
            >
              {t("footer_imprint")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
