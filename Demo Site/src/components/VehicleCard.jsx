import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { driveLabelKey } from "@/data/vehicles";

export const VehicleCard = ({ vehicle }) => {
  const { t, formatPrice, isRTL } = useApp();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const model = isRTL && vehicle.modelAr ? vehicle.modelAr : vehicle.model;

  return (
    <Link
      to={`/vehicle/${vehicle.id}`}
      data-testid={`vehicle-card-${vehicle.id}`}
      className="group block bg-white text-black border border-[#1a1a1a] hover:border-black transition-all duration-500"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f5f5]">
        <img
          src={vehicle.image}
          alt={`${vehicle.brand} ${vehicle.model}`}
          loading="lazy"
          className="w-full h-full object-cover lux-img group-hover:scale-105 transition-transform duration-[1200ms] ease-out"
        />
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          <span className="font-display text-[10px] tracking-[0.32em] uppercase bg-black text-white px-3 py-1">
            {t(driveLabelKey(vehicle.drive))}
          </span>
          {vehicle.collections?.length > 0 && (
            <span className="font-display text-[10px] tracking-[0.28em] uppercase bg-white text-black px-3 py-1 border border-black">
              {vehicle.collections[0]}
            </span>
          )}
        </div>
      </div>

      <div className="p-6 md:p-7">
        <p className="font-display text-[11px] tracking-[0.36em] uppercase text-black/60">
          {vehicle.brand}
        </p>
        <h3 className="font-display text-2xl md:text-[26px] leading-tight mt-2 mb-5">
          {model}
        </h3>

        <div className="flex items-end justify-between border-t border-[#1a1a1a] pt-4">
          <div>
            <p className="font-display text-[10px] tracking-[0.32em] uppercase text-black/60">
              {t("gross_price")}
            </p>
            <p data-testid={`vehicle-gross-${vehicle.id}`} className="font-display text-xl md:text-[22px] mt-1">
              {formatPrice(vehicle.grossPriceOMR)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-[10px] tracking-[0.32em] uppercase text-black/60">
              {t("net_export")}
            </p>
            <p data-testid={`vehicle-net-${vehicle.id}`} className="font-display text-base mt-1">
              {formatPrice(vehicle.netExportOMR)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="font-display text-[10px] tracking-[0.32em] uppercase text-black/60">
            {vehicle.year}
          </span>
          <span className="inline-flex items-center gap-2 font-display text-[11px] tracking-[0.32em] uppercase opacity-80 group-hover:opacity-100 transition">
            {t("view_details")}
            <Arrow strokeWidth={1} size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default VehicleCard;
