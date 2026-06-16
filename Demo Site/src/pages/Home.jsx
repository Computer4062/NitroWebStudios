import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, Globe, Send, Instagram, Youtube, MessageCircle, Facebook } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { VEHICLES, GALLERY_IMAGES } from "@/data/vehicles";
import VehicleCard from "@/components/VehicleCard";

const SocialIcon = ({ icon: Icon, label, testid }) => (
  <a
    data-testid={testid}
    href="#"
    className="group flex flex-col items-center justify-center gap-4 border border-[#1a1a1a] aspect-square hover:bg-white hover:text-black transition-colors duration-500"
  >
    <Icon strokeWidth={1} size={28} className="opacity-80 group-hover:opacity-100" />
    <span className="font-display text-[11px] tracking-[0.32em] uppercase">{label}</span>
  </a>
);

// Simple TikTok glyph SVG (lucide doesn't include TikTok)
const TikTokIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} {...props}>
    <path d="M14 4v9.5a3.5 3.5 0 1 1-3.5-3.5" />
    <path d="M14 4c.4 2.6 2.4 4.6 5 5" />
  </svg>
);

const Home = () => {
  const { t, isRTL } = useApp();
  const carouselRef = useRef(null);
  const [scrollIdx, setScrollIdx] = useState(0);

  // Newest 6
  const newest = [...VEHICLES]
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
    .slice(0, 6);

  const scrollCarousel = (dir) => {
    const el = carouselRef.current;
    if (!el) return;
    const w = el.clientWidth * 0.7;
    el.scrollBy({ left: dir === "next" ? w : -w, behavior: "smooth" });
  };

    const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 4);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-black text-white">
      {/* HERO */}
      <section
        data-testid="home-hero"
        className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-black"
      >
        {/* Carousel slides */}
        {[
          "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1600",
          "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=1600",
          "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&cs=tinysrgb&w=1600",
          "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1600",
        ].map((src, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
              activeSlide === i ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={src}
              alt={`Hero slide ${i + 1}`}
              className="w-full h-full object-cover grayscale brightness-[0.45]"
            />
          </div>
        ))}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/85" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl fade-up">
          <p className="font-display text-[11px] tracking-[0.5em] uppercase text-white/60 mb-8">
            Est. 2026 · Muscat
          </p>
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl leading-[1.05] tracking-tight">
            {t("brand")}
          </h1>
          <div className="mx-auto my-10 h-px w-16 bg-white/35" />
          <p className="font-body text-lg md:text-2xl text-white/75 italic max-w-2xl mx-auto leading-relaxed">
            {t("tagline")}
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/vehicles"
              data-testid="hero-cta-view-inventory"
              className="inline-flex items-center gap-3 bg-white text-black font-display text-[12px] tracking-[0.32em] uppercase px-10 py-5 hover:bg-[#e8e8e8] transition-colors"
            >
              {t("cta_view_inventory")}
              {isRTL ? <ArrowLeft strokeWidth={1} size={16} /> : <ArrowRight strokeWidth={1} size={16} />}
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 border border-white/45 text-white font-display text-[12px] tracking-[0.32em] uppercase px-10 py-5 hover:border-white transition-colors"
            >
              {t("cta_test_drive") ?? "Book a Test Drive"}
            </Link>
          </div>
        </div>

        {/* Carousel dots */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {[0, 1, 2, 3].map((i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`h-px transition-all duration-300 ${
                activeSlide === i ? "w-8 bg-white" : "w-5 bg-white/30"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/35">
          <div className="h-10 w-px bg-white/25" />
          <span className="font-display text-[9px] tracking-[0.4em] uppercase">Scroll</span>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section
        data-testid="home-new-arrivals"
        className="py-24 md:py-32 border-t border-[#1a1a1a]"
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex items-end justify-between mb-12 md:mb-16 gap-6 flex-wrap">
            <div>
              <p className="font-display text-[11px] tracking-[0.4em] uppercase text-white/60 mb-4">
                — 01 / 04
              </p>
              <h2 className="font-display text-4xl md:text-6xl leading-tight">
                {t("new_arrivals")}
              </h2>
              <p className="font-body text-lg md:text-xl text-white/70 italic mt-4 max-w-xl">
                {t("new_arrivals_sub")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                data-testid="carousel-prev"
                onClick={() => scrollCarousel("prev")}
                aria-label="Previous"
                className="w-12 h-12 border border-[#1a1a1a] hover:border-white hover:bg-white hover:text-black flex items-center justify-center transition-colors"
              >
                <ChevronLeft strokeWidth={1} size={20} />
              </button>
              <button
                data-testid="carousel-next"
                onClick={() => scrollCarousel("next")}
                aria-label="Next"
                className="w-12 h-12 border border-[#1a1a1a] hover:border-white hover:bg-white hover:text-black flex items-center justify-center transition-colors"
              >
                <ChevronRight strokeWidth={1} size={20} />
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            data-testid="new-arrivals-carousel"
            className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth pb-4"
          >
            {newest.map((v) => (
              <div
                key={v.id}
                className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[42%] lg:w-[32%] xl:w-[28%]"
              >
                <VehicleCard vehicle={v} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section
        data-testid="home-gallery"
        className="py-24 md:py-32 border-t border-[#1a1a1a] overflow-hidden"
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 mb-12 md:mb-16">
          <p className="font-display text-[11px] tracking-[0.4em] uppercase text-white/60 mb-4">
            — 02 / 04
          </p>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            {t("gallery_heading")}
          </h2>
          <p className="font-body text-lg md:text-xl text-white/70 italic mt-4 max-w-xl">
            {t("gallery_sub")}
          </p>
        </div>

        <GalleryStrip />
      </section>

      {/* REACH US */}
      <section
        data-testid="home-reach-us"
        className="py-24 md:py-32 border-t border-[#1a1a1a]"
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="text-center mb-16">
            <p className="font-display text-[11px] tracking-[0.4em] uppercase text-white/60 mb-4">
              — 03 / 04
            </p>
            <h2 className="font-display text-4xl md:text-6xl leading-tight">
              {t("reach_us")}
            </h2>
            <p className="font-body text-lg md:text-xl text-white/70 italic mt-4 max-w-xl mx-auto">
              {t("reach_us_sub")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-[#1a1a1a] border border-[#1a1a1a]">
            <SocialIcon icon={Globe} label="Website" testid="social-website" />
            <SocialIcon icon={MessageCircle} label="WhatsApp" testid="social-whatsapp" />
            <SocialIcon icon={Send} label="Telegram" testid="social-telegram" />
            <SocialIcon icon={Instagram} label="Instagram" testid="social-instagram" />
            <SocialIcon icon={Youtube} label="YouTube" testid="social-youtube" />
            <SocialIcon icon={Facebook} label="Facebook" testid="social-facebook" />
          </div>
        </div>
      </section>
    </div>
  );
};

const GalleryStrip = () => {
  const stripRef = useRef(null);
  const doubled = [...GALLERY_IMAGES, ...GALLERY_IMAGES];

  const manual = (dir) => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "next" ? 520 : -520, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={stripRef}
        data-testid="gallery-strip"
        className="flex gap-4 overflow-x-auto no-scrollbar"
      >
        <div className="flex gap-4 animate-gallery">
          {doubled.map((src, i) => (
            <div
              key={i}
              className="shrink-0 w-[280px] sm:w-[360px] md:w-[440px] aspect-[4/3] overflow-hidden border border-[#1a1a1a]"
            >
              <img
                src={src}
                alt={`Gallery ${i}`}
                loading="lazy"
                className="w-full h-full object-cover full-mono hover:scale-105 transition-transform duration-1000"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 mt-8 flex justify-end gap-3">
        <button
          data-testid="gallery-prev"
          onClick={() => manual("prev")}
          aria-label="Previous"
          className="w-12 h-12 border border-[#1a1a1a] hover:border-white hover:bg-white hover:text-black flex items-center justify-center transition-colors"
        >
          <ChevronLeft strokeWidth={1} size={20} />
        </button>
        <button
          data-testid="gallery-next"
          onClick={() => manual("next")}
          aria-label="Next"
          className="w-12 h-12 border border-[#1a1a1a] hover:border-white hover:bg-white hover:text-black flex items-center justify-center transition-colors"
        >
          <ChevronRight strokeWidth={1} size={20} />
        </button>
      </div>
    </div>
  );
};

export default Home;
