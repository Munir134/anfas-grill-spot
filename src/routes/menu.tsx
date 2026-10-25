import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBag, Plus, Sparkles, Flame } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";
import { useCart } from "../lib/CartContext";
import { WaselProduct } from "../lib/wasel";

// ── Existing dish assets ──────────────────────────────────────────────────────
import dishAdana from "../assets/dish-adana.jpg";
import dishUrfa from "../assets/dish-urfa.jpg";
import dishShish from "../assets/dish-shish.jpg";
import dishKofte from "../assets/dish-kofte.jpg";
import dishMixed from "../assets/dish-mixed.jpg";
import dishKunefe from "../assets/dish-kunefe.jpg";

// ── Generated mezze / dessert / beverage assets ───────────────────────────────
import dishHummus from "../assets/dish-hummus.jpg";
import dishBabaGhanoush from "../assets/dish-baba-ghanoush.jpg";
import dishShakshuka from "../assets/dish-shakshuka.jpg";
import dishChobanSalad from "../assets/dish-choban-salad.jpg";
import dishHummusKawarma from "../assets/dish-hummus-kawarma.jpg";
import dishLabneh from "../assets/dish-labneh.jpg";
import dishBaklava from "../assets/dish-baklava.jpg";
import dishSahlab from "../assets/dish-sahlab.jpg";
import dishKazandibi from "../assets/dish-kazandibi.jpg";
import dishTurkishTea from "../assets/dish-turkish-tea.jpg";
import dishTurkishCoffee from "../assets/dish-turkish-coffee.jpg";
import dishAyran from "../assets/dish-ayran.jpg";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "المنيو — مطعم أنفاس التركي" },
      {
        name: "description",
        content:
          "استعرض قائمة أطباق مطعم أنفاس التركي: مشاوي، مقبّلات، حلويات ومشروبات تركية أصيلة.",
      },
      { property: "og:title", content: "المنيو — مطعم أنفاس التركي" },
      {
        property: "og:description",
        content: "قائمة كاملة من المشاوي والمقبّلات والحلويات التركية في مطعم أنفاس بجدة.",
      },
    ],
  }),
  component: MenuPage,
});

type Item = {
  id: string;
  nameAr: string;
  nameEn: string;
  descAr?: string;
  descEn?: string;
  price: string;
  priceNum: number;
  img: string;
  hasModifiers?: boolean;
};

type Category = { titleAr: string; titleEn: string; en: string; items: Item[] };

const categories: Category[] = [
  {
    titleAr: "المشاوي",
    titleEn: "Grills",
    en: "GRILL",
    items: [
      {
        id: "p-anfas-adana",
        nameAr: "أضنة كباب",
        nameEn: "Adana Kebab",
        descAr: "لحم مفروم متبّل حار على الفحم.",
        descEn: "Spicy minced meat kebab grilled on charcoal.",
        price: "٦٥",
        priceNum: 65,
        img: dishAdana,
        hasModifiers: true,
      },
      {
        id: "p-anfas-urfa",
        nameAr: "أورفا كباب",
        nameEn: "Urfa Kebab",
        descAr: "النسخة الأخف حرارة، نكهة دخانية.",
        descEn: "The milder version with a deep smoky flavor.",
        price: "٦٥",
        priceNum: 65,
        img: dishUrfa,
        hasModifiers: true,
      },
      {
        id: "p-anfas-shish",
        nameAr: "شيش كباب",
        nameEn: "Shish Kebab",
        descAr: "قطع لحم غنم متبّلة مشوية.",
        descEn: "Marinated lamb pieces grilled on charcoal.",
        price: "٧٥",
        priceNum: 75,
        img: dishShish,
        hasModifiers: true,
      },
      {
        id: "p-anfas-tawook",
        nameAr: "شيش طاووق",
        nameEn: "Shish Tawook",
        descAr: "قطع دجاج بتتبيلة تركية على الفحم.",
        descEn: "Chicken pieces with Turkish marinade, grilled on charcoal.",
        price: "٥٥",
        priceNum: 55,
        img: dishShish,
        hasModifiers: true,
      },
      {
        id: "p-anfas-kofte",
        nameAr: "كفتة مشوية",
        nameEn: "Kofte",
        descAr: "كرات لحم بالبقدونس والبصل.",
        descEn: "Meat balls with parsley and onion, grilled on charcoal.",
        price: "٥٥",
        priceNum: 55,
        img: dishKofte,
        hasModifiers: true,
      },
      {
        id: "p-anfas-mixed",
        nameAr: "مشاوي مشكّلة",
        nameEn: "Mixed Grill",
        descAr: "تشكيلة كاملة من مشاويّنا.",
        descEn: "A complete selection of our grills on one plate.",
        price: "١٤٠",
        priceNum: 140,
        img: dishMixed,
        hasModifiers: true,
      },
    ],
  },
  {
    titleAr: "المقبّلات",
    titleEn: "Mezze",
    en: "MEZZE",
    items: [
      {
        id: "p-anfas-hummus",
        nameAr: "حمّص بالطحينة",
        nameEn: "Hummus",
        descAr: "حمّص كريمي مع الطحينة وزيت الزيتون.",
        descEn: "Creamy chickpea dip with tahini and olive oil.",
        price: "٢٥",
        priceNum: 25,
        img: dishHummus,
      },
      {
        id: "p-anfas-baba",
        nameAr: "متبّل باذنجان",
        nameEn: "Baba Ghanoush",
        descAr: "باذنجان مشوي مع الطحينة وعصير الليمون.",
        descEn: "Smoky roasted eggplant dip with tahini and lemon.",
        price: "٢٥",
        priceNum: 25,
        img: dishBabaGhanoush,
      },
      {
        id: "p-anfas-shakshuka",
        nameAr: "شكشوكة تركية",
        nameEn: "Turkish Shakshuka",
        descAr: "بيض مطبوخ بصلصة الطماطم والفلفل التركي.",
        descEn: "Eggs poached in spiced tomato and pepper sauce.",
        price: "٣٠",
        priceNum: 30,
        img: dishShakshuka,
      },
      {
        id: "p-anfas-choban",
        nameAr: "سلطة الرعاة",
        nameEn: "Choban Salad",
        descAr: "سلطة طازجة بالطماطم والخيار والبقدونس.",
        descEn: "Fresh shepherd's salad with tomatoes, cucumber and parsley.",
        price: "٢٠",
        priceNum: 20,
        img: dishChobanSalad,
      },
      {
        id: "p-anfas-kawarma",
        nameAr: "حمّص كوارما",
        nameEn: "Hummus Kawarma",
        descAr: "حمّص مع لحم خروف متبّل وصنوبر.",
        descEn: "Hummus topped with spiced lamb and pine nuts.",
        price: "٣٥",
        priceNum: 35,
        img: dishHummusKawarma,
      },
      {
        id: "p-anfas-labneh",
        nameAr: "لبنة بالنعناع",
        nameEn: "Labneh",
        descAr: "لبنة طازجة بالنعناع وزيت الزيتون.",
        descEn: "Strained yogurt with fresh mint and olive oil.",
        price: "٢٢",
        priceNum: 22,
        img: dishLabneh,
      },
    ],
  },
  {
    titleAr: "الحلويات",
    titleEn: "Desserts",
    en: "DESSERTS",
    items: [
      {
        id: "p-anfas-kunefe",
        nameAr: "كنافة بالجبنة",
        nameEn: "Künefe",
        descAr: "جبنة طازجة، قطر، وفستق حلبي.",
        descEn: "Fresh cheese pastry with syrup and Aleppo pistachios.",
        price: "٣٥",
        priceNum: 35,
        img: dishKunefe,
      },
      {
        id: "p-anfas-baklava",
        nameAr: "بقلاوة بالفستق",
        nameEn: "Baklava",
        descAr: "طبقات فيلو مع الجوز والفستق والعسل.",
        descEn: "Filo pastry layers with nuts and honey syrup.",
        price: "٤٠",
        priceNum: 40,
        img: dishBaklava,
      },
      {
        id: "p-anfas-sahlab",
        nameAr: "سحلب تركي",
        nameEn: "Sahlab",
        descAr: "مشروب دافئ بالقرفة والمكسرات.",
        descEn: "Warm creamy drink with cinnamon and pistachios.",
        price: "٢٠",
        priceNum: 20,
        img: dishSahlab,
      },
      {
        id: "p-anfas-kazandibi",
        nameAr: "كازانديبي",
        nameEn: "Kazandibi",
        descAr: "حلوى حليب تركية بقشرة كراميل.",
        descEn: "Turkish burnt milk pudding with caramel crust.",
        price: "٢٨",
        priceNum: 28,
        img: dishKazandibi,
      },
    ],
  },
  {
    titleAr: "المشروبات",
    titleEn: "Beverages",
    en: "BEVERAGES",
    items: [
      {
        id: "p-anfas-tea",
        nameAr: "شاي تركي",
        nameEn: "Turkish Tea",
        descAr: "شاي تركي تقليدي في كوب التيوليب.",
        descEn: "Traditional Turkish tea served in a tulip glass.",
        price: "٨",
        priceNum: 8,
        img: dishTurkishTea,
      },
      {
        id: "p-anfas-coffee",
        nameAr: "قهوة تركية",
        nameEn: "Turkish Coffee",
        descAr: "قهوة غنية تُحضَّر بالجزوة النحاسية.",
        descEn: "Rich coffee brewed in a traditional copper pot.",
        price: "١٥",
        priceNum: 15,
        img: dishTurkishCoffee,
      },
      {
        id: "p-anfas-ayran",
        nameAr: "عيران طازج",
        nameEn: "Ayran",
        descAr: "مشروب الزبادي البارد المنعش.",
        descEn: "Chilled refreshing yogurt drink.",
        price: "١٢",
        priceNum: 12,
        img: dishAyran,
      },
      {
        id: "p-anfas-mint",
        nameAr: "ليموناضة نعناع",
        nameEn: "Mint Lemonade",
        descAr: "ليموناضة طازجة بالنعناع والثلج.",
        descEn: "Fresh mint lemonade with ice.",
        price: "١٨",
        priceNum: 18,
        img: dishAyran,
      },
    ],
  },
];

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

function MenuPage() {
  const { t, lang } = useLanguage();
  const { addItem, openCustomizer, openCart } = useCart();

  const handleItemClick = (item: Item) => {
    if (item.hasModifiers) {
      const waselProd: WaselProduct = {
        id: item.id,
        category_id: "c-anfas-grills",
        name: lang === "ar" ? item.nameAr : item.nameEn,
        description: lang === "ar" ? item.descAr || null : item.descEn || null,
        base_price: item.priceNum,
        image_url: item.img,
        is_available: true,
        preparation_time_minutes: 25,
        calories: 550,
        is_featured: true,
        modifier_groups: grillModifiers,
      };
      openCustomizer(waselProd);
    } else {
      addItem({
        productId: item.id,
        name: lang === "ar" ? item.nameAr : item.nameEn,
        nameEn: item.nameEn,
        image: item.img,
        unitPrice: item.priceNum,
        quantity: 1,
        selectedOptions: [],
      });
    }
  };

  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="bg-cream py-16 md:py-24 border-b border-border/60">
        <div className="container-anfas text-center">
          <span className="divider-dot">{t("menuLabel")}</span>
          <h1 className="mt-6 text-5xl md:text-6xl font-bold text-ink">{t("menuTitle")}</h1>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground">{t("menuDesc")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={openCart}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md hover:bg-brand-deep hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>{t("cart")}</span>
            </button>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20">
        <div className="container-anfas space-y-20">
          {categories.map((cat) => (
            <div key={cat.titleAr}>
              {/* Category header */}
              <div className="flex items-baseline justify-between gap-4 border-b border-border pb-4">
                <h2 className="text-3xl md:text-4xl font-bold text-ink flex items-center gap-2">
                  <span>{lang === "ar" ? cat.titleAr : cat.titleEn}</span>
                </h2>
                <span className="text-xs tracking-[0.4em] text-primary font-latin">{cat.en}</span>
              </div>

              {/* Items grid */}
              <ul className="mt-8 divide-y divide-border/60">
                {cat.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Thumbnail */}
                      <div className="shrink-0 h-20 w-20 md:h-24 md:w-24 rounded-xl overflow-hidden border border-border/60 bg-cream">
                        <img
                          src={item.img}
                          alt={lang === "ar" ? item.nameAr : item.nameEn}
                          width={200}
                          height={200}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      {/* Text */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <h3 className="text-lg font-bold text-ink">
                            {lang === "ar" ? item.nameAr : item.nameEn}
                          </h3>
                          {lang === "ar" && (
                            <span className="text-[11px] tracking-[0.2em] text-muted-foreground font-latin">
                              {item.nameEn}
                            </span>
                          )}
                        </div>
                        {(lang === "ar" ? item.descAr : item.descEn) && (
                          <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
                            {lang === "ar" ? item.descAr : item.descEn}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Price and Add to Cart Button */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                      <div className="text-lg font-bold text-primary font-mono">
                        {item.priceNum}{" "}
                        <span className="text-xs text-muted-foreground font-normal">{t("sar")}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleItemClick(item)}
                        aria-label={`${t("addToCart")} ${lang === "ar" ? item.nameAr : item.nameEn}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary hover:bg-brand-deep text-primary-foreground text-xs font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>{item.hasModifiers ? t("customize") : t("addToCart")}</span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
