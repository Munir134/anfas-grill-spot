import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  UtensilsCrossed,
  MapPin,
  Clock,
  Music,
  Users,
  Car,
  Accessibility,
  Truck,
  Baby,
  ShoppingBag,
  Plus,
  Flame,
  Phone,
} from "lucide-react";

import heroImg from "../assets/hero-grill.jpg";
import dishAdana from "../assets/dish-adana.jpg";
import dishUrfa from "../assets/dish-urfa.jpg";
import dishShish from "../assets/dish-shish.jpg";
import dishKofte from "../assets/dish-kofte.jpg";
import dishMixed from "../assets/dish-mixed.jpg";
import dishKunefe from "../assets/dish-kunefe.jpg";
import interior1 from "../assets/interior-1.jpg";
import interiorGrill from "../assets/interior-grill.jpg";
import interiorTea from "../assets/interior-tea.jpg";
import interiorFamily from "../assets/interior-family.jpg";
import OrderModal from "../components/OrderModal";
import { useReveal } from "../hooks/useReveal";
import { useLanguage } from "../lib/LanguageContext";
import { useCart } from "../lib/CartContext";
import { WaselProduct } from "../lib/wasel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "أنفاس — مشويات تركية أصيلة في جدة" },
      {
        name: "description",
        content:
          "مطعم أنفاس للمشويات التركية في حي السلامة، جدة. أطباق أصيلة على الفحم، أجواء دافئة، ومنيو غني بالمشاوي والحلويات التركية.",
      },
      { property: "og:title", content: "أنفاس — مشويات تركية أصيلة في جدة" },
      {
        property: "og:description",
        content:
          "مطعم أنفاس للمشويات التركية في حي السلامة، جدة. أطباق أصيلة على الفحم، أجواء دافئة، ومنيو غني بالمشاوي والحلويات التركية.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [orderOpen, setOrderOpen] = useState(false);
  const { t, lang } = useLanguage();
  const { addItem, openCustomizer, openCart } = useCart();
  useReveal();

  const grillModifiers = [
    {
      id: "mg-anfas-spice",
      name: "درجة الحرارة — Spice Level",
      min_selections: 0,
      max_selections: 1,
      options: [
        { id: "m-anfas-mild", name: "Mild — بارد خفيف", price: 0, is_available: true },
        { id: "m-anfas-med", name: "Medium — متوسط الحرارة", price: 0, is_available: true },
        { id: "m-anfas-spicy", name: "Turkish Spicy — حار تركي أصلي", price: 0, is_available: true },
      ],
    },
    {
      id: "mg-anfas-sides",
      name: "إضافات وصوصات — Extra Sides & Dips",
      min_selections: 0,
      max_selections: 4,
      options: [
        { id: "m-anfas-toum", name: "Extra Garlic Toum — ثوم إضافي", price: 4, is_available: true },
        { id: "m-anfas-rice", name: "Spiced Rice — أرز تركي متبل", price: 6, is_available: true },
        { id: "m-anfas-harissa", name: "Turkish Harissa — شطة تركية", price: 4, is_available: true },
        { id: "m-anfas-pickles", name: "Turkish Pickles — مخلل تركي مشكل", price: 4, is_available: true },
      ],
    },
  ];

  const dishes = [
    {
      id: "p-anfas-adana",
      img: dishAdana,
      name: lang === "ar" ? "أضنة كباب" : "Adana Kebab",
      en: "Adana Kebab",
      desc: t("dish_adana_desc"),
      price: 65,
      hasModifiers: true,
    },
    {
      id: "p-anfas-urfa",
      img: dishUrfa,
      name: lang === "ar" ? "أورفا كباب" : "Urfa Kebab",
      en: "Urfa Kebab",
      desc: t("dish_urfa_desc"),
      price: 65,
      hasModifiers: true,
    },
    {
      id: "p-anfas-shish",
      img: dishShish,
      name: lang === "ar" ? "شيش كباب" : "Shish Kebab",
      en: "Shish Kebab",
      desc: t("dish_shish_desc"),
      price: 75,
      hasModifiers: true,
    },
    {
      id: "p-anfas-kofte",
      img: dishKofte,
      name: lang === "ar" ? "كفتة مشوية" : "Kofte",
      en: "Kofte",
      desc: t("dish_kofte_desc"),
      price: 55,
      hasModifiers: true,
    },
    {
      id: "p-anfas-mixed",
      img: dishMixed,
      name: lang === "ar" ? "مشاوي مشكّلة" : "Mixed Grill",
      en: "Mixed Grill",
      desc: t("dish_mixed_desc"),
      price: 140,
      hasModifiers: true,
    },
    {
      id: "p-anfas-kunefe",
      img: dishKunefe,
      name: lang === "ar" ? "كنافة نابلسية" : "Künefe",
      en: "Künefe",
      desc: t("dish_kunefe_desc"),
      price: 35,
      hasModifiers: false,
    },
  ];

  const handleDishClick = (d: (typeof dishes)[0]) => {
    if (d.hasModifiers) {
      const waselProd: WaselProduct = {
        id: d.id,
        category_id: "c-anfas-grills",
        name: d.name,
        description: d.desc,
        base_price: d.price,
        image_url: d.img,
        is_available: true,
        preparation_time_minutes: 25,
        calories: 550,
        is_featured: true,
        modifier_groups: grillModifiers,
      };
      openCustomizer(waselProd);
    } else {
      addItem({
        productId: d.id,
        name: d.name,
        nameEn: d.en,
        image: d.img,
        unitPrice: d.price,
        quantity: 1,
        selectedOptions: [],
      });
    }
  };

  const features = [
    { icon: UtensilsCrossed, label: t("feat_halal") },
    { icon: Music, label: t("feat_music") },
    { icon: Users, label: t("feat_family") },
    { icon: Car, label: t("feat_parking") },
    { icon: Truck, label: t("feat_delivery") },
    { icon: Accessibility, label: t("feat_wheelchair") },
    { icon: Baby, label: t("feat_kids") },
    { icon: Clock, label: t("feat_late") },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={heroImg}
            alt={lang === "ar" ? "مشاوي تركية على طاولة" : "Turkish grills on a table"}
            width={1920}
            height={1280}
            className="h-full w-full object-cover anim-kenburns"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        <div className="relative container-anfas flex min-h-[85vh] flex-col items-center justify-center py-24 text-center text-white">
          <span
            className="divider-dot text-white/80 anim-fade-up"
            style={{ animationDelay: "80ms" }}
          >
            {t("heroTagline")}
          </span>
          <h1
            className="mt-6 text-6xl md:text-8xl font-bold leading-none anim-fade-up"
            style={{ animationDelay: "180ms" }}
          >
            {t("heroTitle")}
          </h1>
          <div
            className="mt-3 text-xs md:text-sm tracking-[0.5em] text-primary/90 font-latin anim-fade-up"
            style={{ animationDelay: "300ms" }}
          >
            ANFAS · TURKISH GRILL
          </div>
          <p
            className="mt-6 max-w-xl text-base md:text-lg text-white/85 leading-relaxed anim-fade-up"
            style={{ animationDelay: "420ms" }}
          >
            {t("heroDesc")}
          </p>
          <div
            className="mt-10 flex flex-wrap items-center justify-center gap-3 anim-fade-up"
            style={{ animationDelay: "560ms" }}
          >
            <button
              onClick={openCart}
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg hover:bg-brand-deep hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              {t("orderNow")}
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            </button>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300"
            >
              {t("viewMenu")}
            </Link>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="bg-cream py-24">
        <div className="container-anfas grid gap-12 md:grid-cols-2 md:items-center">
          <div data-reveal>
            <span className="divider-dot">{t("ourStoryLabel")}</span>
            <h2 className="mt-6 text-4xl md:text-5xl font-bold text-ink leading-tight">
              {t("storyTitle1")} <br />
              <span className="text-primary">{t("storyTitle2")}</span>
            </h2>
            <p className="mt-6 text-muted-foreground leading-loose">{t("storyP1")}</p>
            <p className="mt-4 text-muted-foreground leading-loose">{t("storyP2")}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src={interiorGrill}
              alt={lang === "ar" ? "شواء اللحم على الفحم" : "Meat grilling on charcoal"}
              width={1280}
              height={960}
              loading="lazy"
              data-reveal
              data-reveal-delay="120"
              className="aspect-[4/5] w-full rounded-lg object-cover hover-lift"
            />
            <img
              src={interior1}
              alt={lang === "ar" ? "داخل مطعم أنفاس" : "Inside Anfas restaurant"}
              width={1280}
              height={960}
              loading="lazy"
              data-reveal
              data-reveal-delay="260"
              className="aspect-[4/5] w-full rounded-lg object-cover mt-8 hover-lift"
            />
          </div>
        </div>
      </section>

      {/* SIGNATURE DISHES */}
      <section className="py-24">
        <div className="container-anfas">
          <div className="text-center" data-reveal>
            <span className="divider-dot">{t("signaturesLabel")}</span>
            <h2 className="mt-6 text-4xl md:text-5xl font-bold text-ink">{t("signaturesTitle")}</h2>
            <p className="mt-4 max-w-xl mx-auto text-muted-foreground">{t("signaturesDesc")}</p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {dishes.map((d, i) => (
              <article
                key={d.en}
                data-reveal
                data-reveal-delay={String(120 + i * 90)}
                className="group overflow-hidden rounded-xl bg-card border border-border/60 hover-lift flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={d.img}
                      alt={d.name}
                      width={1024}
                      height={1024}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-2xl font-bold text-ink">{d.name}</h3>
                      {lang === "ar" && (
                        <span className="text-[11px] tracking-[0.25em] text-primary font-latin">
                          {d.en}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{d.desc}</p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-border/40">
                  <div className="text-xl font-bold font-mono text-primary">
                    {d.price} <span className="text-xs font-normal text-muted-foreground">{t("sar")}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDishClick(d)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary hover:bg-brand-deep text-primary-foreground text-xs font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{d.hasModifiers ? t("customize") : t("addToCart")}</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-14 text-center" data-reveal>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white hover:bg-primary hover:-translate-y-0.5 transition-all duration-300"
            >
              {t("fullMenuBtn")}
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ATMOSPHERE */}
      <section className="bg-cream py-24">
        <div className="container-anfas">
          <div className="text-center" data-reveal>
            <span className="divider-dot">{t("atmosphereLabel")}</span>
            <h2 className="mt-6 text-4xl md:text-5xl font-bold text-ink">{t("atmosphereTitle")}</h2>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-4 md:grid-rows-2 md:h-[520px]">
            <img
              src={interior1}
              alt={lang === "ar" ? "داخل المطعم" : "Inside the restaurant"}
              width={1280}
              height={960}
              loading="lazy"
              data-reveal
              className="rounded-lg object-cover w-full h-full md:col-span-2 md:row-span-2 aspect-video md:aspect-auto hover-lift"
            />
            <img
              src={interiorTea}
              alt={lang === "ar" ? "شاي تركي" : "Turkish tea"}
              width={1024}
              height={1280}
              loading="lazy"
              data-reveal
              data-reveal-delay="120"
              className="rounded-lg object-cover w-full h-full aspect-square md:aspect-auto hover-lift"
            />
            <img
              src={interiorFamily}
              alt={lang === "ar" ? "جلسة عائلية" : "Family seating"}
              width={1024}
              height={1280}
              loading="lazy"
              data-reveal
              data-reveal-delay="240"
              className="rounded-lg object-cover w-full h-full aspect-square md:aspect-auto hover-lift"
            />
            <img
              src={interiorGrill}
              alt={lang === "ar" ? "شواء على الفحم" : "Charcoal grill"}
              width={1280}
              height={960}
              loading="lazy"
              data-reveal
              data-reveal-delay="360"
              className="rounded-lg object-cover w-full h-full md:col-span-2 aspect-video md:aspect-auto hover-lift"
            />
          </div>
        </div>
      </section>

      {/* FEATURES STRIP */}
      <section className="py-20">
        <div className="container-anfas">
          <div className="text-center" data-reveal>
            <span className="divider-dot">{t("featuresLabel")}</span>
            <h2 className="mt-6 text-3xl md:text-4xl font-bold text-ink">{t("featuresTitle")}</h2>
          </div>
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, label }, i) => (
              <div
                key={label}
                data-reveal
                data-reveal-delay={String(80 + i * 70)}
                className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border/60 bg-card p-6 text-center hover:border-primary hover:-translate-y-1 transition-all duration-300"
              >
                <Icon className="h-6 w-6 text-primary" />
                <span className="text-sm text-ink">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VISIT US */}
      <section id="visit" className="bg-ink text-white py-24">
        <div className="container-anfas grid gap-12 md:grid-cols-2 md:items-center">
          <div data-reveal>
            <span className="divider-dot text-white/80">{t("visitLabel")}</span>
            <h2 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">
              {t("visitTitle1")} <br />
              <span className="text-primary">{t("visitTitle2")}</span>
            </h2>
            <ul className="mt-8 space-y-5 text-white/85">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
                <div>
                  <div className="font-semibold text-white">{t("addressLabel")}</div>
                  <div className="text-sm mt-1">{t("addressValue")}</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-1 shrink-0" />
                <div>
                  <div className="font-semibold text-white">{t("hoursLabel")}</div>
                  <div className="text-sm mt-1" dir="ltr">
                    Daily · 1:00 PM – 4:00 AM
                  </div>
                </div>
              </li>
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <button
                onClick={() => setOrderOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-brand-deep hover:-translate-y-0.5 transition-all duration-300"
              >
                <ShoppingBag className="h-4 w-4" />
                {t("orderNow")}
              </button>
              <a
                href="tel:0530387458"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300"
              >
                <Phone className="h-4 w-4" />
                053 038 7458
              </a>
            </div>
          </div>

          <div
            className="overflow-hidden rounded-lg border border-white/10 shadow-2xl"
            data-reveal
            data-reveal-delay="160"
          >
            <iframe
              title={lang === "ar" ? "موقع مطعم أنفاس على الخريطة" : "Anfas Restaurant on the map"}
              src="https://www.google.com/maps?q=6889+Saqr+Quraish,+As+Salamah,+Jeddah+23436&output=embed"
              width="100%"
              height="420"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full"
            />
          </div>
        </div>
      </section>

      <OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} />
    </div>
  );
}
