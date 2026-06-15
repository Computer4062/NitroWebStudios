import { useApp } from "@/context/AppContext";

const About = () => {
  const { t } = useApp();
  return (
    <div className="bg-black text-white pt-20">
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 pt-16 pb-20">
        <p className="font-display text-[11px] tracking-[0.4em] uppercase text-white/60 mb-4">
          — Maison
        </p>
        <h1 className="font-display text-5xl md:text-7xl leading-tight">{t("about_h")}</h1>
      </section>

      <section className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 pb-24">
        <p data-testid="about-p1" className="font-body text-xl md:text-2xl leading-relaxed text-white/85">
          {t("about_p1")}
        </p>
        <p data-testid="about-p2" className="font-body text-lg md:text-xl leading-relaxed text-white/75">
          {t("about_p2")}
        </p>
      </section>

      <section className="border-y border-[#1a1a1a]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1a1a1a]">
          <div className="bg-black p-10 md:p-14">
            <p className="font-display text-[11px] tracking-[0.4em] uppercase text-white/60 mb-3">
              — Presence
            </p>
            <h3 className="font-display text-3xl md:text-4xl">{t("about_presence_h")}</h3>
            <p className="font-body text-lg md:text-xl text-white/75 mt-6 leading-relaxed">
              {t("about_presence_b")}
            </p>
          </div>
          <div className="bg-black p-10 md:p-14">
            <p className="font-display text-[11px] tracking-[0.4em] uppercase text-white/60 mb-3">
              — Expertise
            </p>
            <h3 className="font-display text-3xl md:text-4xl">{t("about_expertise_h")}</h3>
            <p className="font-body text-lg md:text-xl text-white/75 mt-6 leading-relaxed">
              {t("about_expertise_b")}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1a1a1a] border border-[#1a1a1a]">
          {[
            "https://images.unsplash.com/photo-1519120433933-22bc753101f3?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=80",
          ].map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="w-full aspect-square object-cover full-mono hover:scale-105 transition-transform duration-1000"
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
