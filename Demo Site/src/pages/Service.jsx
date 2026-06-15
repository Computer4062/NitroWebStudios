import { useApp } from "@/context/AppContext";

const ServiceBlock = ({ index, heading, body, testid }) => (
  <div data-testid={testid} className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 md:gap-12 py-12 border-b border-[#1a1a1a]">
    <p className="font-display text-[11px] tracking-[0.4em] uppercase text-white/40">
      — {String(index).padStart(2, "0")}
    </p>
    <div>
      <h3 className="font-display text-3xl md:text-4xl leading-tight">{heading}</h3>
      <p className="font-body text-lg md:text-xl text-white/75 leading-relaxed mt-5 max-w-3xl">
        {body}
      </p>
    </div>
  </div>
);

const Service = () => {
  const { t } = useApp();
  return (
    <div className="bg-black text-white pt-20">
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 pt-16 pb-16">
        <p className="font-display text-[11px] tracking-[0.4em] uppercase text-white/60 mb-4">
          — Services
        </p>
        <h1 className="font-display text-5xl md:text-7xl leading-tight">{t("service_h")}</h1>
        <p className="font-body text-lg md:text-2xl italic text-white/70 mt-6 max-w-3xl">
          {t("service_sub")}
        </p>
      </section>

      <div className="border-t border-[#1a1a1a]" />

      <section className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        <ServiceBlock
          index={1}
          heading={t("service_sourcing_h")}
          body={t("service_sourcing_b")}
          testid="service-sourcing"
        />
        <ServiceBlock
          index={2}
          heading={t("service_custom_h")}
          body={t("service_custom_b")}
          testid="service-custom"
        />
        <ServiceBlock
          index={3}
          heading={t("service_armour_h")}
          body={t("service_armour_b")}
          testid="service-armour"
        />
        <ServiceBlock
          index={4}
          heading={t("service_export_h")}
          body={t("service_export_b")}
          testid="service-export"
        />
      </section>

      <section className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1a1a1a] border border-[#1a1a1a]">
          <img
            src="https://images.unsplash.com/photo-1519440439825-a7a6a4d9d5e7?auto=format&fit=crop&w=1200&q=80"
            className="w-full aspect-[4/3] object-cover full-mono"
            alt=""
          />
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
            className="w-full aspect-[4/3] object-cover full-mono"
            alt=""
          />
          <img
            src="https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=1200&q=80"
            className="w-full aspect-[4/3] object-cover full-mono"
            alt=""
          />
        </div>
      </section>
    </div>
  );
};

export default Service;
