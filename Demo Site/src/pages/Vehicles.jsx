import { useMemo, useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useApp } from "@/context/AppContext";
import {
  VEHICLES,
  BRANDS,
  COLLECTIONS,
  BODY_TYPES,
  DRIVE_TYPES,
  driveLabelKey,
  bodyLabelKey,
  collectionLabelKey,
} from "@/data/vehicles";
import VehicleCard from "@/components/VehicleCard";

const BrandLogo = ({ name, active, onClick, testid }) => (
  <button
    data-testid={testid}
    onClick={onClick}
    className={`shrink-0 px-6 md:px-8 py-6 md:py-8 border-r border-[#1a1a1a] flex items-center justify-center transition-all duration-300 ${
      active ? "bg-white text-black" : "text-white hover:bg-[#1a1a1a]"
    }`}
  >
    <span className="font-display text-base md:text-lg tracking-[0.18em] uppercase whitespace-nowrap">
      {name}
    </span>
  </button>
);

const PRICE_MIN_OMR = 18000; // ~ €50,000
const PRICE_MAX_OMR = 3000000; // ~ €8,000,000

const Vehicles = () => {
  const { t, isRTL, currency, formatPrice } = useApp();

  const [activeBrand, setActiveBrand] = useState(null); // single brand bar selection
  const [activeCollectionPill, setActiveCollectionPill] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date_newest");
  const [showFilters, setShowFilters] = useState(false);

  // Filter state (advanced)
  const [filterBrands, setFilterBrands] = useState([]);
  const [filterBodies, setFilterBodies] = useState([]);
  const [filterDrives, setFilterDrives] = useState([]);
  const [filterCollections, setFilterCollections] = useState([]);
  const [priceMin, setPriceMin] = useState(PRICE_MIN_OMR);
  const [priceMax, setPriceMax] = useState(PRICE_MAX_OMR);

  const selectBrand = (b) => {
    if (activeBrand === b) {
      setActiveBrand(null);
      setFilterBrands([]);
    } else {
      setActiveBrand(b);
      setFilterBrands([b]);
    }
  };

  const selectCollectionPill = (c) => {
    if (activeCollectionPill === c) {
      setActiveCollectionPill(null);
      setFilterCollections([]);
    } else {
      setActiveCollectionPill(c);
      setFilterCollections([c]);
    }
  };

  const toggleArr = (arr, val, setter) =>
    setter(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const filtered = useMemo(() => {
    let out = VEHICLES.filter((v) => {
      if (filterBrands.length && !filterBrands.includes(v.brand)) return false;
      if (filterBodies.length && !filterBodies.includes(v.bodyType)) return false;
      if (filterDrives.length && !filterDrives.includes(v.drive)) return false;
      if (
        filterCollections.length &&
        !v.collections.some((c) => filterCollections.includes(c))
      )
        return false;
      if (v.grossPriceOMR < priceMin || v.grossPriceOMR > priceMax) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const hay = `${v.brand} ${v.model} ${v.modelAr || ""} ${v.bodyType} ${v.drive} ${v.collections.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    switch (sort) {
      case "name_az":
        out.sort((a, b) => a.model.localeCompare(b.model));
        break;
      case "name_za":
        out.sort((a, b) => b.model.localeCompare(a.model));
        break;
      case "date_oldest":
        out.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
        break;
      case "price_low":
        out.sort((a, b) => a.grossPriceOMR - b.grossPriceOMR);
        break;
      case "price_high":
        out.sort((a, b) => b.grossPriceOMR - a.grossPriceOMR);
        break;
      case "date_newest":
      default:
        out.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        break;
    }
    return out;
  }, [
    filterBrands,
    filterBodies,
    filterDrives,
    filterCollections,
    priceMin,
    priceMax,
    search,
    sort,
  ]);

  const resetAll = () => {
    setActiveBrand(null);
    setActiveCollectionPill(null);
    setSearch("");
    setSort("date_newest");
    setFilterBrands([]);
    setFilterBodies([]);
    setFilterDrives([]);
    setFilterCollections([]);
    setPriceMin(PRICE_MIN_OMR);
    setPriceMax(PRICE_MAX_OMR);
  };

  return (
    <div className="bg-black text-white pt-20">
      {/* HEADING */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 pt-16 pb-12">
        <p className="font-display text-[11px] tracking-[0.4em] uppercase text-white/60 mb-4">
          — Collection
        </p>
        <h1 className="font-display text-5xl md:text-7xl leading-tight">
          {t("our_inventory")}
        </h1>
        <p className="font-body text-lg md:text-xl text-white/70 italic mt-4 max-w-2xl">
          {t("inventory_sub")}
        </p>
      </section>

      {/* BRAND LOGO BAR */}
      <div
        data-testid="brand-bar"
        className="border-y border-[#1a1a1a] overflow-x-auto 
                  /* 🚀 TAILWIND/SAFARI/CHROME FORCED SCROLLBAR STYLING */
                  [&::-webkit-scrollbar]:block
                  [&::-webkit-scrollbar]:h-[8px] 
                  [&::-webkit-scrollbar-track]:bg-[#0d0d0d] 
                  [&::-webkit-scrollbar-track]:border-t
                  [&::-webkit-scrollbar-track]:border-[#1a1a1a]
                  [&::-webkit-scrollbar-thumb]:bg-[#333333] 
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  hover:[&::-webkit-scrollbar-thumb]:bg-[#444444]
                  
                  /* FIREFOX FORCED STYLING */
                  [scrollbar-width:thin]
                  [scrollbar-color:#333333_#0d0d0d]"
      >
        <div className="flex min-w-max">
          <button
            data-testid="brand-pill-all"
            onClick={() => { setActiveBrand(null); setFilterBrands([]); }}
            className={`shrink-0 px-6 md:px-8 py-6 md:py-8 border-r border-[#1a1a1a] flex items-center justify-center transition-all duration-300 ${
              !activeBrand ? "bg-white text-black" : "text-white hover:bg-[#1a1a1a]"
            }`}
          >
            <span className="font-display text-base md:text-lg tracking-[0.18em] uppercase whitespace-nowrap">
              {t("all_brands")}
            </span>
          </button>
          
          {BRANDS.map((b) => (
            <BrandLogo
              key={b}
              name={b}
              active={activeBrand === b}
              onClick={() => selectBrand(b)}
              testid={`brand-pill-${b.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            />
          ))}
        </div>
      </div>

      {/* COLLECTION PILLS */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-display text-[11px] tracking-[0.32em] uppercase text-white/60 me-3">
            {t("f_collection")}
          </span>
          {COLLECTIONS.map((c) => (
            <button
              key={c}
              data-testid={`collection-pill-${c.toLowerCase()}`}
              onClick={() => selectCollectionPill(c)}
              className={`font-display text-[11px] tracking-[0.28em] uppercase px-5 py-2 border transition-colors ${
                activeCollectionPill === c
                  ? "bg-white text-black border-white"
                  : "border-[#1a1a1a] hover:border-white"
              }`}
            >
              {t(collectionLabelKey(c))}
            </button>
          ))}
        </div>
      </div>

      {/* SEARCH + SORT BAR */}
      <div className="border-y border-[#1a1a1a]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <div className="flex-1 flex items-center gap-3 border border-[#1a1a1a] px-4 py-3">
            <Search strokeWidth={1} size={18} className="opacity-60" />
            <input
              data-testid="search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search_placeholder")}
              className="flex-1 bg-transparent outline-none font-body text-base placeholder:text-white/40"
            />
            {search && (
              <button data-testid="search-clear" onClick={() => setSearch("")}>
                <X strokeWidth={1} size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button
              data-testid="filter-toggle"
              onClick={() => setShowFilters((v) => !v)}
              className="flex items-center gap-2 border border-[#1a1a1a] px-5 py-3 font-display text-[11px] tracking-[0.28em] uppercase hover:border-white transition-colors"
            >
              <SlidersHorizontal strokeWidth={1} size={14} />
              {t("filters")}
            </button>

            <div className="flex items-center gap-3 border border-[#1a1a1a] px-4 py-3">
              <span className="font-display text-[11px] tracking-[0.28em] uppercase text-white/60">
                {t("sort_by")}
              </span>
              <select
                data-testid="sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-black text-white font-body text-base outline-none cursor-pointer"
              >
                <option value="date_newest">{t("sort_newest")}</option>
                <option value="date_oldest">{t("sort_oldest")}</option>
                <option value="name_az">{t("sort_az")}</option>
                <option value="name_za">{t("sort_za")}</option>
                <option value="price_low">{t("sort_price_low")}</option>
                <option value="price_high">{t("sort_price_high")}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12">
          {/* FILTER PANEL */}
          <aside
            data-testid="filter-panel"
            className={`${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="border border-[#1a1a1a] p-6 space-y-8 sticky top-28">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xs tracking-[0.4em] uppercase">
                  {t("filters")}
                </h3>
                <button
                  data-testid="reset-filters"
                  onClick={resetAll}
                  className="font-display text-[10px] tracking-[0.28em] uppercase opacity-60 hover:opacity-100 underline-offset-4 hover:underline"
                >
                  {t("reset_filters")}
                </button>
              </div>

              {/* Brand multi */}
              <FilterGroup title={t("f_brand")}>
                <div className="max-h-44 overflow-y-auto pe-2 space-y-2">
                  {BRANDS.map((b) => (
                    <CheckRow
                      key={b}
                      label={b}
                      checked={filterBrands.includes(b)}
                      onChange={() => toggleArr(filterBrands, b, setFilterBrands)}
                      testid={`filter-brand-${b.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    />
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup title={t("f_body")}>
                <div className="space-y-2">
                  {BODY_TYPES.map((b) => (
                    <CheckRow
                      key={b}
                      label={t(bodyLabelKey(b))}
                      checked={filterBodies.includes(b)}
                      onChange={() => toggleArr(filterBodies, b, setFilterBodies)}
                      testid={`filter-body-${b.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    />
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup title={t("f_drive")}>
                <div className="space-y-2">
                  {DRIVE_TYPES.map((d) => (
                    <CheckRow
                      key={d}
                      label={t(driveLabelKey(d))}
                      checked={filterDrives.includes(d)}
                      onChange={() => toggleArr(filterDrives, d, setFilterDrives)}
                      testid={`filter-drive-${d.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    />
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup title={t("f_price")}>
                <PriceRange
                  min={PRICE_MIN_OMR}
                  max={PRICE_MAX_OMR}
                  valMin={priceMin}
                  valMax={priceMax}
                  setMin={setPriceMin}
                  setMax={setPriceMax}
                  formatPrice={formatPrice}
                  t={t}
                  currency={currency}
                />
              </FilterGroup>

              <FilterGroup title={t("f_collection")}>
                <div className="space-y-2">
                  {COLLECTIONS.map((c) => (
                    <CheckRow
                      key={c}
                      label={t(collectionLabelKey(c))}
                      checked={filterCollections.includes(c)}
                      onChange={() =>
                        toggleArr(filterCollections, c, setFilterCollections)
                      }
                      testid={`filter-collection-${c.toLowerCase()}`}
                    />
                  ))}
                </div>
              </FilterGroup>
            </div>
          </aside>

          {/* GRID */}
          <div>
            <p
              data-testid="results-count"
              className="font-display text-[11px] tracking-[0.32em] uppercase text-white/60 mb-6"
            >
              {filtered.length} {t("showing_results")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="border border-[#1a1a1a] py-24 text-center">
                <p className="font-display text-xl tracking-[0.2em] uppercase opacity-70">
                  No vehicles match the current filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterGroup = ({ title, children }) => (
  <div>
    <h4 className="font-display text-[11px] tracking-[0.32em] uppercase text-white/80 mb-3 pb-2 border-b border-[#1a1a1a]">
      {title}
    </h4>
    {children}
  </div>
);

const CheckRow = ({ label, checked, onChange, testid }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <span
      data-testid={testid}
      onClick={onChange}
      className={`inline-block w-4 h-4 border ${checked ? "bg-white border-white" : "border-white/40 group-hover:border-white"} transition-colors`}
    />
    <span className="font-body text-base text-white/80 group-hover:text-white transition-colors">
      {label}
    </span>
  </label>
);

const PriceRange = ({ min, max, valMin, valMax, setMin, setMax, formatPrice, t, currency }) => {
  const handleMin = (v) => {
    const n = Math.min(Number(v), valMax - 1);
    setMin(Math.max(min, n));
  };
  const handleMax = (v) => {
    const n = Math.max(Number(v), valMin + 1);
    setMax(Math.min(max, n));
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-[11px] font-display tracking-[0.24em] uppercase text-white/70">
        <span>{formatPrice(valMin)}</span>
        <span>{formatPrice(valMax)}</span>
      </div>

      <div className="relative h-2">
        <div className="absolute inset-0 bg-[#1a1a1a]" />
        <div
          className="absolute h-full bg-white"
          style={{
            left: `${((valMin - min) / (max - min)) * 100}%`,
            right: `${100 - ((valMax - min) / (max - min)) * 100}%`,
          }}
        />
        <input
          data-testid="price-slider-min"
          type="range"
          min={min}
          max={max}
          value={valMin}
          step={1000}
          onChange={(e) => handleMin(e.target.value)}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <input
          data-testid="price-slider-max"
          type="range"
          min={min}
          max={max}
          value={valMax}
          step={1000}
          onChange={(e) => handleMax(e.target.value)}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <label className="block">
          <span className="font-display text-[10px] tracking-[0.28em] uppercase text-white/60">
            {t("min")}
          </span>
          <input
            data-testid="price-min-input"
            type="number"
            value={valMin}
            onChange={(e) => handleMin(e.target.value)}
            className="w-full bg-transparent border border-[#1a1a1a] focus:border-white outline-none px-3 py-2 font-body text-base"
          />
        </label>
        <label className="block">
          <span className="font-display text-[10px] tracking-[0.28em] uppercase text-white/60">
            {t("max")}
          </span>
          <input
            data-testid="price-max-input"
            type="number"
            value={valMax}
            onChange={(e) => handleMax(e.target.value)}
            className="w-full bg-transparent border border-[#1a1a1a] focus:border-white outline-none px-3 py-2 font-body text-base"
          />
        </label>
      </div>
    </div>
  );
};

export default Vehicles;
