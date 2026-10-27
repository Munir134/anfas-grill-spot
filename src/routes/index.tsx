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
  Minus,
  Check,
  Flame,
  Phone,
} from "lucide-react";

import heroImg from "../assets/hero-grill.jpg";
import interior1 from "../assets/interior-1.jpg";
import interiorGrill from "../assets/interior-grill.jpg";
import interiorTea from "../assets/interior-tea.jpg";
import interiorFamily from "../assets/interior-family.jpg";
import { useReveal } from "../hooks/useReveal";
import { useLanguage } from "../lib/LanguageContext";
import { useCart } from "../lib/CartContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "أنفاس — مشويات تركية أصيلة في جدة" },
      {
        name: "description",
        content:
          "مطعم أنفاس للمشويات التركية في حي السلامة، جدة. أطباق أصيلة على الفحم، أجواء دافئة، ومنيو غني بالمشاوي التركية وطواجن الفخار.",
      },
      { property: "og:title", content: "أنفاس — مشويات تركية أصيلة في جدة" },
      {
        property: "og:description",
        content:
          "مطعم أنفاس للمشويات التركية في حي السلامة، جدة. أطباق أصيلة على الفحم، أجواء دافئة، ومنيو غني بالمشاوي التركية وطواجن الفخار.",
      },
    ],
  }),
  component: Home,
});

// Authentic Signature Dishes from official Anfas Menu
const signatureDishes = [
  {
    id: "p-anfas-anfas-kebab",
    img: "/dishes/anfas-kebab.jpg",
    nameAr: "كباب أنفاس الخاص",
    nameEn: "Anfas Signature Kebab",
    descAr: "ابتكار شيف أنفاس من اللحم البلدي الطازج مع الخلطة السرية والجبن المذاب على الجمر.",
    descEn: "Anfas signature handmade charcoal kebab stuffed with melted cheese and secret spices.",
    price: 55,
    calories: 620,
    badgeAr: "توقيع الشيف",
    badgeEn: "Chef's Signature",
  },
  {
    id: "p-anfas-meat-awsal",
    img: "/dishes/meat-awsal.jpg",
    nameAr: "أوصال لحم طازج",
    nameEn: "Meat Awsal Skewers",
    descAr: "مكعبات لحم ضأن طازج متبلة بالبهارات التركية ومشوية على الفحم مع الطماطم والفلفل.",
    descEn: "Succulent cubes of marinated fresh lamb grilled over natural wood charcoal.",
    price: 47,
    calories: 520,
    badgeAr: "الأكثر طلباً",
    badgeEn: "Most Popular",
  },
  {
    id: "p-anfas-lamb-chops",
    img: "/dishes/lamb-chops.jpg",
    nameAr: "ريش لحم غنم مشوية",
    nameEn: "Grilled Lamb Chops",
    descAr: "ريش غنم طازجة متبلة بالبهارات التركية ومشوية بإتقان على الفحم مع الخضار المشوية.",
    descEn: "Prime tender lamb rib chops marinated in Turkish thyme and charbroiled to perfection.",
    price: 75,
    calories: 680,
    badgeAr: "لحم طازج",
    badgeEn: "Fresh Lamb",
  },
  {
    id: "p-anfas-one-meter-meat",
    img: "/dishes/one-meter-meat.jpg",
    nameAr: "متر كباب لحم تركي",
    nameEn: "1 Meter Meat Kebab",
    descAr: "سيخ كباب لحم ضأن بلدي ممتد بطول متر كامل على خبز البيدا التركي مع الخضار المشوية.",
    descEn: "One full meter continuous charcoal lamb kebab presented on warm pide flatbread with dips.",
    price: 175,
    calories: 2150,
    badgeAr: "وليمة عائلية",
    badgeEn: "Family Feast",
  },
  {
    id: "p-anfas-one-kg-anfas-dome",
    img: "/dishes/one-kg-anfas-dome.jpg",
    nameAr: "كيلو أنفاس بالقبة النحاسية VIP",
    nameEn: "1 KG Anfas VIP Copper Dome",
    descAr: "الطبق الاستعراضي الملكي بأنفاس يقدم تحت قبة نحاسية مبخرة بالفحم العطري مع المشاوي الفاخرة.",
    descEn: "Our royal showstopper served under a grand heated copper dome filled with aromatic wood smoke.",
    price: 220,
    calories: 2350,
    badgeAr: "VIP الملكي",
    badgeEn: "Royal VIP",
  },
  {
    id: "p-anfas-iskender-kebab",
    img: "/dishes/iskender-kebab.jpg",
    nameAr: "إسكندر كباب الأصلي",
    nameEn: "Original Iskender Kebab",
    descAr: "كباب مقطع على خبز البيدا المقرمش مع صلصة الطماطم الغنية والزبدة الساخنة والزبادي.",
    descEn: "Sliced kebab over toasted pide bread, smothered with warm tomato sauce, browned butter & yogurt.",
    price: 49,
    calories: 640,
    badgeAr: "تركي أصيل",
    badgeEn: "Authentic Turkish",
  },
];

function Home() {
  const { t, lang } = useLanguage();
  const { items, addItem, updateQuantity, removeItem, openCart } = useCart();
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  useReveal();

  const handleAddDish = (d: (typeof signatureDishes)[0]) => {
    addItem({
      productId: d.id,
      name: lang === "ar" ? d.nameAr : d.nameEn,
      nameEn: d.nameEn,
      image: d.img,
      unitPrice: d.price,
      quantity: 1,
      selectedOptions: [],
    });

    setRecentlyAddedId(d.id);
    setTimeout(() => setRecentlyAddedId(null), 1200);
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
            <Link
              to="/menu"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-lg hover:bg-brand-deep hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>{t("orderNow")}</span>
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5 rtl:group-hover:-translate-x-0.5 ltr:rotate-180 ltr:group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/5 px-6 py-3.5 text-sm font-medium text-white backdrop-blur hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300"
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
            {signatureDishes.map((d, i) => {
              const isJustAdded = recentlyAddedId === d.id;
              const cartEntry = items.find((ci) => ci.productId === d.id);
              const quantityInCart = cartEntry ? cartEntry.quantity : 0;

              return (
                <article
                  key={d.id}
                  data-reveal
                  data-reveal-delay={String(120 + i * 90)}
                  className="group overflow-hidden rounded-2xl bg-card border border-border/70 hover:border-primary/40 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    {/* Dish Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-cream">
                      <img
                        src={d.img}
                        alt={lang === "ar" ? d.nameAr : d.nameEn}
                        width={800}
                        height={500}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-106"
                      />

                      {/* Badges */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-mono font-medium flex items-center gap-1 shadow-xs">
                          <Flame className="h-3 w-3 text-amber-400" />
                          <span>
                            {d.calories} {lang === "ar" ? "سعرة" : "Kcal"}
                          </span>
                        </span>

                        <span className="px-2.5 py-1 rounded-full bg-primary/90 backdrop-blur-md text-white text-[10px] font-bold shadow-xs">
                          {lang === "ar" ? d.badgeAr : d.badgeEn}
                        </span>
                      </div>

                      {/* In-Cart Pill on Image Top Corner if added */}
                      {quantityInCart > 0 && (
                        <div className="absolute bottom-3 right-3 rtl:right-3 ltr:left-3 px-2.5 py-1 rounded-full bg-emerald-600/95 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 shadow-md animate-in fade-in zoom-in-90 duration-200">
                          <Check className="h-3.5 w-3.5" />
                          <span>
                            {lang === "ar" ? `في الطلب (${quantityInCart})` : `Added (${quantityInCart})`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Dish Details */}
                    <div className="p-6">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-xl font-bold text-ink group-hover:text-primary transition-colors">
                          {lang === "ar" ? d.nameAr : d.nameEn}
                        </h3>
                      </div>
                      <div className="text-[11px] font-latin text-muted-foreground tracking-wider mb-2">
                        {lang === "ar" ? d.nameEn : d.nameAr}
                      </div>
                      <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {lang === "ar" ? d.descAr : d.descEn}
                      </p>
                    </div>
                  </div>

                  {/* Price & Action Area */}
                  <div className="px-6 pb-6 pt-3 flex items-center justify-between border-t border-border/50">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-primary font-mono tracking-tight">
                        {d.price}
                      </span>
                      <span className="text-xs font-bold text-muted-foreground">{t("sar")}</span>
                    </div>

                    {/* Stepper or Add to Bag Button */}
                    {quantityInCart > 0 && cartEntry ? (
                      <div className="flex items-center gap-1.5 p-1 rounded-full bg-cream border border-border/80 shadow-xs">
                        <button
                          type="button"
                          onClick={() => {
                            if (cartEntry.quantity === 1) {
                              removeItem(cartEntry.cartItemId);
                            } else {
                              updateQuantity(cartEntry.cartItemId, -1);
                            }
                          }}
                          className="h-7 w-7 rounded-full bg-background border border-border/80 flex items-center justify-center text-ink hover:text-primary active:scale-90 transition-transform cursor-pointer"
                          aria-label={lang === "ar" ? "تقليل الكمية" : "Decrease quantity"}
                        >
                          <Minus className="h-3 w-3" />
                        </button>

                        <span className="px-2 font-mono font-bold text-xs text-ink min-w-[20px] text-center">
                          {quantityInCart}
                        </span>

                        <button
                          type="button"
                          onClick={() => updateQuantity(cartEntry.cartItemId, 1)}
                          className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-brand-deep active:scale-90 transition-transform cursor-pointer"
                          aria-label={lang === "ar" ? "زيادة الكمية" : "Increase quantity"}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAddDish(d)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold shadow-sm active:scale-95 transition-all duration-200 cursor-pointer ${
                          isJustAdded
                            ? "bg-emerald-600 text-white"
                            : "bg-primary text-primary-foreground hover:bg-brand-deep hover:shadow-md"
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>{lang === "ar" ? "تمت الإضافة" : "Added"}</span>
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5" />
                            <span>{t("addToCart")}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-14 text-center" data-reveal>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 text-sm font-semibold text-white hover:bg-primary hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
            >
              <span>{t("fullMenuBtn")}</span>
              <ArrowLeft className="h-4 w-4 rtl:rotate-0 ltr:rotate-180" />
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
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:bg-brand-deep hover:-translate-y-0.5 transition-all duration-300"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>{t("orderNow")}</span>
              </Link>
              <a
                href="tel:0530387458"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300"
              >
                <Phone className="h-4 w-4" />
                <span>053 038 7458</span>
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
    </div>
  );
}
