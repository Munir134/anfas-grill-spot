import { createFileRoute } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";

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
  nameAr: string;
  nameEn: string;
  descAr?: string;
  descEn?: string;
  price: string;
  img: string;
};
type Category = { titleAr: string; titleEn: string; en: string; items: Item[] };

const categories: Category[] = [
  {
    titleAr: "المشاوي",
    titleEn: "Grills",
    en: "GRILL",
    items: [
      {
        nameAr: "أضنة كباب",
        nameEn: "Adana Kebab",
        descAr: "لحم مفروم متبّل حار على الفحم.",
        descEn: "Spicy minced meat kebab grilled on charcoal.",
        price: "٦٥",
        img: dishAdana,
      },
      {
        nameAr: "أورفا كباب",
        nameEn: "Urfa Kebab",
        descAr: "النسخة الأخف حرارة، نكهة دخانية.",
        descEn: "The milder version with a deep smoky flavor.",
        price: "٦٥",
        img: dishUrfa,
      },
      {
        nameAr: "شيش كباب",
        nameEn: "Shish Kebab",
        descAr: "قطع لحم غنم متبّلة مشوية.",
        descEn: "Marinated lamb pieces grilled on charcoal.",
        price: "٧٥",
        img: dishShish,
      },
      {
        nameAr: "شيش طاووق",
        nameEn: "Shish Tawook",
        descAr: "قطع دجاج بتتبيلة تركية على الفحم.",
        descEn: "Chicken pieces with Turkish marinade, grilled on charcoal.",
        price: "٥٥",
        img: dishShish,
      },
      {
        nameAr: "كفتة مشوية",
        nameEn: "Kofte",
        descAr: "كرات لحم بالبقدونس والبصل.",
        descEn: "Meat balls with parsley and onion, grilled on charcoal.",
        price: "٥٥",
        img: dishKofte,
      },
      {
        nameAr: "مشاوي مشكّلة",
        nameEn: "Mixed Grill",
        descAr: "تشكيلة كاملة من مشاويّنا.",
        descEn: "A complete selection of our grills on one plate.",
        price: "١٤٠",
        img: dishMixed,
      },
    ],
  },
  {
    titleAr: "المقبّلات",
    titleEn: "Mezze",
    en: "MEZZE",
    items: [
      {
        nameAr: "حمّص بالطحينة",
        nameEn: "Hummus",
        descAr: "حمّص كريمي مع الطحينة وزيت الزيتون.",
        descEn: "Creamy chickpea dip with tahini and olive oil.",
        price: "٢٥",
        img: dishHummus,
      },
      {
        nameAr: "متبّل باذنجان",
        nameEn: "Baba Ghanoush",
        descAr: "باذنجان مشوي مع الطحينة وعصير الليمون.",
        descEn: "Smoky roasted eggplant dip with tahini and lemon.",
        price: "٢٥",
        img: dishBabaGhanoush,
      },
      {
        nameAr: "شكشوكة تركية",
        nameEn: "Turkish Shakshuka",
        descAr: "بيض مطبوخ بصلصة الطماطم والفلفل التركي.",
        descEn: "Eggs poached in spiced tomato and pepper sauce.",
        price: "٣٠",
        img: dishShakshuka,
      },
      {
        nameAr: "سلطة الرعاة",
        nameEn: "Choban Salad",
        descAr: "سلطة طازجة بالطماطم والخيار والبقدونس.",
        descEn: "Fresh shepherd's salad with tomatoes, cucumber and parsley.",
        price: "٢٠",
        img: dishChobanSalad,
      },
      {
        nameAr: "حمّص كوارما",
        nameEn: "Hummus Kawarma",
        descAr: "حمّص مع لحم خروف متبّل وصنوبر.",
        descEn: "Hummus topped with spiced lamb and pine nuts.",
        price: "٣٥",
        img: dishHummusKawarma,
      },
      {
        nameAr: "لبنة بالنعناع",
        nameEn: "Labneh",
        descAr: "لبنة طازجة بالنعناع وزيت الزيتون.",
        descEn: "Strained yogurt with fresh mint and olive oil.",
        price: "٢٠",
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
        nameAr: "كنافة نابلسية",
        nameEn: "Künefe",
        descAr: "جبنة طازجة، قطر، وفستق حلبي.",
        descEn: "Fresh cheese pastry with syrup and Aleppo pistachios.",
        price: "٤٥",
        img: dishKunefe,
      },
      {
        nameAr: "بقلاوة",
        nameEn: "Baklava",
        descAr: "طبقات فيلو مع الجوز والفستق والعسل.",
        descEn: "Filo pastry layers with nuts and honey syrup.",
        price: "٤٠",
        img: dishBaklava,
      },
      {
        nameAr: "سحلب",
        nameEn: "Sahlab",
        descAr: "مشروب دافئ بالقرفة والفستق.",
        descEn: "Warm creamy drink with cinnamon and pistachios.",
        price: "٢٥",
        img: dishSahlab,
      },
      {
        nameAr: "كازانديبي",
        nameEn: "Kazandibi",
        descAr: "حلوى حليب تركية بقشرة كراميل.",
        descEn: "Turkish burnt milk pudding with caramel crust.",
        price: "٣٥",
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
        nameAr: "شاي تركي",
        nameEn: "Turkish Tea",
        descAr: "شاي تركي تقليدي في كوب التيوليب.",
        descEn: "Traditional Turkish tea served in a tulip glass.",
        price: "١٠",
        img: dishTurkishTea,
      },
      {
        nameAr: "قهوة تركية",
        nameEn: "Turkish Coffee",
        descAr: "قهوة غنية تُحضَّر بالجزوة النحاسية.",
        descEn: "Rich coffee brewed in a traditional copper pot.",
        price: "١٥",
        img: dishTurkishCoffee,
      },
      {
        nameAr: "عيران",
        nameEn: "Ayran",
        descAr: "مشروب الزبادي البارد المنعش.",
        descEn: "Chilled refreshing yogurt drink.",
        price: "١٠",
        img: dishAyran,
      },
      {
        nameAr: "ليموناضة نعناع",
        nameEn: "Mint Lemonade",
        descAr: "ليموناضة طازجة بالنعناع والثلج.",
        descEn: "Fresh mint lemonade with ice.",
        price: "٢٠",
        img: dishAyran,
      },
    ],
  },
];

function MenuPage() {
  const { t, lang } = useLanguage();

  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="bg-cream py-16 md:py-24 border-b border-border/60">
        <div className="container-anfas text-center">
          <span className="divider-dot">{t("menuLabel")}</span>
          <h1 className="mt-6 text-5xl md:text-6xl font-bold text-ink">{t("menuTitle")}</h1>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground">{t("menuDesc")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {/* PDF download button removed — replaced by food photos */}
            <a
              href="tel:0534900038"
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-background px-5 py-2.5 text-sm font-medium text-ink hover:border-primary hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4" />
              {t("orderDelivery")}
            </a>
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
                <h2 className="text-3xl md:text-4xl font-bold text-ink">
                  {lang === "ar" ? cat.titleAr : cat.titleEn}
                </h2>
                <span className="text-xs tracking-[0.4em] text-primary font-latin">{cat.en}</span>
              </div>

              {/* Items grid — each with a photo thumbnail */}
              <ul className="mt-8 divide-y divide-border/60">
                {cat.items.map((item) => (
                  <li
                    key={item.nameAr}
                    className="flex items-center gap-5 py-5"
                  >
                    {/* Thumbnail */}
                    <div className="shrink-0 h-20 w-20 md:h-24 md:w-24 rounded-lg overflow-hidden border border-border/60">
                      <img
                        src={item.img}
                        alt={lang === "ar" ? item.nameAr : item.nameEn}
                        width={200}
                        height={200}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <h3 className="text-lg font-semibold text-ink">
                          {lang === "ar" ? item.nameAr : item.nameEn}
                        </h3>
                        {lang === "ar" && (
                          <span className="text-[11px] tracking-[0.2em] text-muted-foreground font-latin">
                            {item.nameEn}
                          </span>
                        )}
                      </div>
                      {(lang === "ar" ? item.descAr : item.descEn) && (
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed max-w-xl">
                          {lang === "ar" ? item.descAr : item.descEn}
                        </p>
                      )}
                    </div>

                    {/* Price */}
                    <div className="shrink-0 text-lg font-bold text-primary">
                      {item.price}{" "}
                      <span className="text-xs text-muted-foreground font-normal">{t("sar")}</span>
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
