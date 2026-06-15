import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useApp } from "@/context/AppContext";

export const Navbar = () => {
  const { t, language, setLanguage, currency, setCurrency, isRTL } = useApp();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/vehicles", label: t("nav_vehicles"), testid: "nav-link-vehicles" },
    { to: "/service", label: t("nav_service"), testid: "nav-link-service" },
    { to: "/about-us", label: t("nav_about"), testid: "nav-link-about" },
    { to: "/contact", label: t("nav_contact"), testid: "nav-link-contact" },
  ];

  const linkCls = ({ isActive }) =>
    `font-display text-[13px] tracking-editorial uppercase transition-opacity duration-300 ${
      isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
    }`;

  return (
    <header
      data-testid="navbar"
      className="fixed top-0 inset-x-0 z-50 bg-black/85 backdrop-blur-md border-b border-[#1a1a1a]"
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex items-center justify-between h-20">
          <Link
            to="/"
            data-testid="navbar-brand"
            className="font-display text-white text-lg sm:text-xl tracking-[0.32em]"
            onClick={() => setOpen(false)}
          >
            {t("brand")}
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                data-testid={l.testid}
                className={linkCls}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2 text-[11px] tracking-[0.24em] font-display">
              <button
                data-testid="lang-toggle-en"
                onClick={() => setLanguage("en")}
                className={`uppercase transition-opacity ${language === "en" ? "opacity-100" : "opacity-40 hover:opacity-80"}`}
              >
                EN
              </button>
              <span className="opacity-30">|</span>
              <button
                data-testid="lang-toggle-ar"
                onClick={() => setLanguage("ar")}
                className={`${language === "ar" ? "opacity-100" : "opacity-40 hover:opacity-80"} font-arabic text-sm`}
              >
                عربي
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] tracking-[0.24em] font-display">
              <button
                data-testid="currency-toggle-omr"
                onClick={() => setCurrency("OMR")}
                className={`uppercase transition-opacity ${currency === "OMR" ? "opacity-100" : "opacity-40 hover:opacity-80"}`}
              >
                OMR
              </button>
              <span className="opacity-30">|</span>
              <button
                data-testid="currency-toggle-usd"
                onClick={() => setCurrency("USD")}
                className={`uppercase transition-opacity ${currency === "USD" ? "opacity-100" : "opacity-40 hover:opacity-80"}`}
              >
                USD
              </button>
            </div>
          </div>

          <button
            data-testid="mobile-menu-toggle"
            className="lg:hidden text-white"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X strokeWidth={1} size={26} /> : <Menu strokeWidth={1} size={26} />}
          </button>
        </div>
      </div>

      {open && (
        <div
          data-testid="mobile-menu-overlay"
          className="lg:hidden fixed inset-0 top-20 bg-black z-40 px-8 py-12 overflow-y-auto"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <nav className="flex flex-col gap-8">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                data-testid={`${l.testid}-mobile`}
                className={`font-display text-3xl tracking-[0.2em] uppercase ${
                  location.pathname === l.to ? "opacity-100" : "opacity-60"
                }`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-[#1a1a1a] mt-12 pt-8 flex items-center gap-8">
            <div className="flex items-center gap-3 text-sm font-display">
              <button
                data-testid="lang-toggle-en-mobile"
                onClick={() => setLanguage("en")}
                className={`uppercase ${language === "en" ? "opacity-100" : "opacity-40"}`}
              >
                EN
              </button>
              <span className="opacity-30">|</span>
              <button
                data-testid="lang-toggle-ar-mobile"
                onClick={() => setLanguage("ar")}
                className={`font-arabic text-lg ${language === "ar" ? "opacity-100" : "opacity-40"}`}
              >
                عربي
              </button>
            </div>
            <div className="flex items-center gap-3 text-sm font-display">
              <button
                data-testid="currency-toggle-omr-mobile"
                onClick={() => setCurrency("OMR")}
                className={`uppercase ${currency === "OMR" ? "opacity-100" : "opacity-40"}`}
              >
                OMR
              </button>
              <span className="opacity-30">|</span>
              <button
                data-testid="currency-toggle-usd-mobile"
                onClick={() => setCurrency("USD")}
                className={`uppercase ${currency === "USD" ? "opacity-100" : "opacity-40"}`}
              >
                USD
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
