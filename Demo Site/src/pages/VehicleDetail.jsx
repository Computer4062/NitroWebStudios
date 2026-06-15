import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";
import { VEHICLES, driveLabelKey, bodyLabelKey, collectionLabelKey } from "@/data/vehicles";

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, formatPrice, isRTL } = useApp();
  const v = VEHICLES.find((x) => x.id === id);
  const [activeImg, setActiveImg] = useState(0);

  if (!v) {
    return (
      <div className="bg-black text-white min-h-screen pt-32 px-6 md:px-12 text-center">
        <h1 className="font-display text-4xl">{t("vehicle_not_found")}</h1>
        <Link
          to="/vehicles"
          className="inline-block mt-8 font-display text-[12px] tracking-[0.32em] uppercase border-b border-white pb-1"
        >
          {t("back_to_inventory")}
        </Link>
      </div>
    );
  }

  const Arrow = isRTL ? ArrowRight : ArrowLeft;
  const model = isRTL && v.modelAr ? v.modelAr : v.model;

  const requestInfo = () => {
    toast.success(t("form_success"), {
      duration: 5000,
    });
  };

  return (
    <div className="bg-black text-white pt-20">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-12">
        <button
          data-testid="back-to-inventory"
          onClick={() => navigate("/vehicles")}
          className="inline-flex items-center gap-2 font-display text-[11px] tracking-[0.32em] uppercase text-white/60 hover:text-white transition"
        >
          <Arrow strokeWidth={1} size={14} />
          {t("back_to_inventory")}
        </button>
      </div>

      {/* HERO IMAGE */}
      <div data-testid="vehicle-hero" className="relative aspect-[16/9] md:aspect-[21/9] bg-[#0a0a0a] overflow-hidden">
        <img
          src={v.images[activeImg] || v.image}
          alt={`${v.brand} ${v.model}`}
          className="w-full h-full object-cover full-mono"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

        <div className="absolute bottom-10 left-0 right-0 px-6 md:px-12 lg:px-16">
          <div className="max-w-[1600px] mx-auto">
            <p className="font-display text-[12px] tracking-[0.4em] uppercase text-white/70">
              {v.brand} · {v.year}
            </p>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl leading-tight mt-3">
              {model}
            </h1>
          </div>
        </div>
      </div>

      {v.images?.length > 1 && (
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 mt-6 flex gap-3 overflow-x-auto no-scrollbar">
          {v.images.map((src, i) => (
            <button
              key={i}
              data-testid={`vehicle-thumb-${i}`}
              onClick={() => setActiveImg(i)}
              className={`shrink-0 w-32 md:w-44 aspect-[4/3] overflow-hidden border ${activeImg === i ? "border-white" : "border-[#1a1a1a]"} transition`}
            >
              <img src={src} alt="" className="w-full h-full object-cover full-mono" />
            </button>
          ))}
        </div>
      )}

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-16">
        {/* SPECS */}
        <section>
          <p className="font-display text-[11px] tracking-[0.4em] uppercase text-white/60 mb-4">
            — Specifications
          </p>
          <h2 className="font-display text-3xl md:text-4xl mb-10">
            {t("notes")}
          </h2>

          <table className="w-full text-left border-t border-[#1a1a1a]" data-testid="spec-table">
            <tbody>
              <SpecRow label={t("f_brand")} value={v.brand} />
              <SpecRow label={t("f_body")} value={t(bodyLabelKey(v.bodyType))} />
              <SpecRow label={t("f_drive")} value={t(driveLabelKey(v.drive))} />
              <SpecRow label={t("energy")} value={v.energy} />
              <SpecRow label={t("co2")} value={v.co2} />
              <SpecRow label={t("co2_class")} value={v.co2Class} />
              {v.collections.length > 0 && (
                <SpecRow
                  label={t("f_collection")}
                  value={v.collections.map((c) => t(collectionLabelKey(c))).join(" · ")}
                />
              )}
              <SpecRow label="Year" value={v.year} />
            </tbody>
          </table>

          <div className="mt-10 border border-[#1a1a1a] p-6 md:p-8">
            <p className="font-display text-[11px] tracking-[0.32em] uppercase text-white/60 mb-3">
              {t("notes")}
            </p>
            <p className="font-body text-lg leading-relaxed text-white/85">
              {v.notes}
            </p>
          </div>
        </section>

        {/* PRICING */}
        <aside className="lg:sticky lg:top-28 self-start space-y-8">
          <div className="border border-[#1a1a1a]">
            <div className="p-6 md:p-8 border-b border-[#1a1a1a]">
              <p className="font-display text-[11px] tracking-[0.32em] uppercase text-white/60">
                {t("gross_price")}
              </p>
              <p data-testid="detail-gross-price" className="font-display text-4xl md:text-5xl mt-3">
                {formatPrice(v.grossPriceOMR)}
              </p>
            </div>
            <div className="p-6 md:p-8">
              <p className="font-display text-[11px] tracking-[0.32em] uppercase text-white/60">
                {t("net_export")}
              </p>
              <p data-testid="detail-net-price" className="font-display text-2xl md:text-3xl mt-3">
                {formatPrice(v.netExportOMR)}
              </p>
            </div>
          </div>

          <button
            data-testid="request-information"
            onClick={requestInfo}
            className="w-full bg-white text-black font-display text-[12px] tracking-[0.32em] uppercase py-5 hover:bg-[#f5f5f5] transition-colors"
          >
            {t("request_information")}
          </button>

          <p className="font-body text-sm text-white/55 leading-relaxed">
            {t("vat_note")}
          </p>
        </aside>
      </div>
    </div>
  );
};

const SpecRow = ({ label, value }) => (
  <tr className="border-b border-[#1a1a1a]">
    <th className="font-display text-[11px] tracking-[0.32em] uppercase text-white/60 py-5 pe-6 align-top text-start font-normal w-1/2">
      {label}
    </th>
    <td className="font-body text-lg py-5 text-white align-top">{value}</td>
  </tr>
);

export default VehicleDetail;
