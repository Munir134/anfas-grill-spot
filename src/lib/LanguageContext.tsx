import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Lang = "ar" | "en";

const translations = {
  ar: {
    // ── Nav ──────────────────────────────────────
    home: "الرئيسية",
    menuNav: "المنيو",
    visitNav: "زُرنا",
    bookTable: "احجز طاولة",
    toggleLang: "EN",

    // ── 404 / Error ──────────────────────────────
    notFound: "الصفحة غير موجودة",
    notFoundDesc: "الصفحة التي تبحث عنها غير متاحة أو تم نقلها.",
    backHome: "العودة للرئيسية",
    errorTitle: "حدث خطأ ما",
    errorDesc: "يمكنك تحديث الصفحة أو العودة إلى الرئيسية.",
    tryAgain: "حاول مجدداً",
    homeLink: "الرئيسية",

    // ── Footer ───────────────────────────────────
    footerContactTitle: "تواصل معنا",
    footerAddress: "6889 صقر قريش، السلامة، جدة 23436",
    footerHoursTitle: "أوقات العمل",
    footerDaily: "يومياً",
    footerHoursNote: "مفتوح للغداء والعشاء وحتى ساعات متأخرة.",
    footerCopyright: "مطعم أنفاس. جميع الحقوق محفوظة.",
    footerDesc: "مشويات تركية أصيلة على الفحم، بأجواء دافئة في قلب حي السلامة بجدة.",

    // ── Home – Hero ──────────────────────────────
    heroTagline: "مشويات تركية · جدة",
    heroTitle: "أنفاس",
    heroDesc:
      "نفَسٌ تركيٌ أصيل على جمر الفحم — أطباق مشويّة بتوابل الأناضول، تُقدَّم في قلب حي السلامة بجدة.",
    orderNow: "اطلب الآن",
    viewMenu: "عرض المنيو",

    // ── Home – Story ─────────────────────────────
    ourStoryLabel: "قصتنا",
    storyTitle1: "نفَسٌ من الأناضول",
    storyTitle2: "إلى جدة",
    storyP1:
      "في مطعم أنفاس، ننقل تجربة المشاوي التركية كما تُعدّ في أزقّة إسطنبول وأضنة — لحوم مختارة بعناية، توابل مطحونة يومياً، وشوّاؤون يجيدون فنّ إتقان الجمر.",
    storyP2:
      "كل طبق يخرج من مطبخنا يحمل نفَسَ التراث التركي، بلمسة ضيافة سعودية دافئة تجعل من زيارتك ذكرى.",

    // ── Home – Signature Dishes ───────────────────
    signaturesLabel: "قائمتنا المميزة",
    signaturesTitle: "أطباقٌ نفتخر بها",
    signaturesDesc: "نخبة من أشهر المشاوي التركية، محضّرة بأيدي شوّائين مختصّين.",
    fullMenuBtn: "المنيو الكامل",

    // ── Home – Atmosphere ─────────────────────────
    atmosphereLabel: "الأجواء",
    atmosphereTitle: "دفءٌ، فحمٌ، وشايٌ تركي",

    // ── Home – Features ───────────────────────────
    featuresLabel: "ما يميّزنا",
    featuresTitle: "تجربة كاملة تحت سقف واحد",

    // ── Home – Visit ──────────────────────────────
    visitLabel: "زُرنا",
    visitTitle1: "نستقبلك في",
    visitTitle2: "حي السلامة",
    addressLabel: "العنوان",
    addressValue: "6889 صقر قريش، السلامة، جدة 23436",
    hoursLabel: "أوقات العمل",

    // ── Features list ─────────────────────────────
    feat_halal: "طعام حلال",
    feat_music: "موسيقى حية",
    feat_family: "مناسب للعائلة",
    feat_parking: "مواقف مجانية",
    feat_delivery: "خدمة توصيل",
    feat_wheelchair: "مناسب للكراسي المتحركة",
    feat_kids: "قائمة للأطفال",
    feat_late: "مفتوح حتى ٤ صباحاً",

    // ── Home – Dish descriptions ──────────────────
    dish_adana_desc: "كباب لحم مفروم حار مشوي على الفحم، توابل تركية أصيلة.",
    dish_urfa_desc: "النسخة الأخف حرارة من الكباب، بنكهة دخانية عميقة.",
    dish_shish_desc: "قطع لحم غنم متبّلة ومشوية على الجمر مع الخضار.",
    dish_kofte_desc: "كرات لحم متبّلة بالبقدونس والبصل، مشوية على الفحم.",
    dish_mixed_desc: "تشكيلة من أفضل مشاويّنا في طبق واحد، للعائلة والمجموعات.",
    dish_kunefe_desc: "كنافة بالجبنة الطازجة والقطر، مزيّنة بالفستق الحلبي.",

    // ── Menu page ─────────────────────────────────
    menuLabel: "قائمة الطعام",
    menuTitle: "المنيو",
    menuDesc:
      "نخبة من أشهر الأطباق التركية، تُحضَّر يومياً من مكوّنات طازجة. الأسعار بالريال السعودي وتشمل الضريبة.",
    orderDelivery: "اطلب توصيل",
    sar: "ر.س",

    // ── Contact page ──────────────────────────────
    contactLabel: "تواصل معنا",
    contactTitle: "زُرنا",
    contactDesc: "في قلب حي السلامة بجدة، ننتظر زيارتك يومياً حتى ساعات متأخرة.",
    contactAddress: "العنوان",
    contactPhone: "الهاتف",
    contactHours: "أوقات العمل",
    contactInstagram: "إنستقرام",
    contactWebsite: "الموقع الإلكتروني",
  },

  en: {
    // ── Nav ──────────────────────────────────────
    home: "Home",
    menuNav: "Menu",
    visitNav: "Visit Us",
    bookTable: "Book a Table",
    toggleLang: "عربي",

    // ── 404 / Error ──────────────────────────────
    notFound: "Page Not Found",
    notFoundDesc: "The page you are looking for is not available or has been moved.",
    backHome: "Back to Home",
    errorTitle: "Something went wrong",
    errorDesc: "You can refresh the page or go back to home.",
    tryAgain: "Try Again",
    homeLink: "Home",

    // ── Footer ───────────────────────────────────
    footerContactTitle: "Contact Us",
    footerAddress: "6889 Saqr Quraish, Al-Salamah, Jeddah 23436",
    footerHoursTitle: "Working Hours",
    footerDaily: "Daily",
    footerHoursNote: "Open for lunch, dinner and late night hours.",
    footerCopyright: "Anfas Restaurant. All rights reserved.",
    footerDesc:
      "Authentic Turkish charcoal grills in a warm atmosphere in the heart of Al-Salamah district, Jeddah.",

    // ── Home – Hero ──────────────────────────────
    heroTagline: "Turkish Grill · Jeddah",
    heroTitle: "Anfas",
    heroDesc:
      "An authentic Turkish breath on charcoal — grilled dishes with Anatolian spices, served in the heart of Al-Salamah district, Jeddah.",
    orderNow: "Order Now",
    viewMenu: "View Menu",

    // ── Home – Story ─────────────────────────────
    ourStoryLabel: "Our Story",
    storyTitle1: "A Breath from Anatolia",
    storyTitle2: "to Jeddah",
    storyP1:
      "At Anfas Restaurant, we bring the Turkish grill experience as it is prepared in the alleys of Istanbul and Adana — carefully selected meats, daily-ground spices, and grill masters who have mastered the art of charcoal.",
    storyP2:
      "Every dish that comes out of our kitchen carries the breath of Turkish heritage, with a warm Saudi hospitality touch that makes your visit a lasting memory.",

    // ── Home – Signature Dishes ───────────────────
    signaturesLabel: "Our Signature Menu",
    signaturesTitle: "Dishes We're Proud Of",
    signaturesDesc:
      "A selection of the most famous Turkish grills, prepared by specialist grill chefs.",
    fullMenuBtn: "Full Menu",

    // ── Home – Atmosphere ─────────────────────────
    atmosphereLabel: "Atmosphere",
    atmosphereTitle: "Warmth, Charcoal & Turkish Tea",

    // ── Home – Features ───────────────────────────
    featuresLabel: "What Sets Us Apart",
    featuresTitle: "A Complete Experience Under One Roof",

    // ── Home – Visit ──────────────────────────────
    visitLabel: "Visit Us",
    visitTitle1: "We Welcome You in",
    visitTitle2: "Al-Salamah District",
    addressLabel: "Address",
    addressValue: "6889 Saqr Quraish, Al-Salamah, Jeddah 23436",
    hoursLabel: "Working Hours",

    // ── Features list ─────────────────────────────
    feat_halal: "Halal Food",
    feat_music: "Live Music",
    feat_family: "Family Friendly",
    feat_parking: "Free Parking",
    feat_delivery: "Delivery Service",
    feat_wheelchair: "Wheelchair Accessible",
    feat_kids: "Kids Menu",
    feat_late: "Open Until 4 AM",

    // ── Home – Dish descriptions ──────────────────
    dish_adana_desc: "Spicy minced meat kebab grilled on charcoal with authentic Turkish spices.",
    dish_urfa_desc: "The milder version of kebab with a deep smoky flavor.",
    dish_shish_desc: "Marinated lamb pieces grilled over charcoal with vegetables.",
    dish_kofte_desc: "Seasoned meat balls with parsley and onion, grilled on charcoal.",
    dish_mixed_desc: "A selection of our best grills on one plate — perfect for families and groups.",
    dish_kunefe_desc: "Cheese pastry with syrup, topped with Aleppo pistachios.",

    // ── Menu page ─────────────────────────────────
    menuLabel: "Food Menu",
    menuTitle: "Menu",
    menuDesc:
      "A selection of the most famous Turkish dishes, prepared daily from fresh ingredients. Prices in Saudi Riyal, inclusive of tax.",
    orderDelivery: "Order Delivery",
    sar: "SAR",

    // ── Contact page ──────────────────────────────
    contactLabel: "Contact Us",
    contactTitle: "Visit Us",
    contactDesc: "In the heart of Al-Salamah district, Jeddah — we welcome you daily until late hours.",
    contactAddress: "Address",
    contactPhone: "Phone",
    contactHours: "Working Hours",
    contactInstagram: "Instagram",
    contactWebsite: "Website",
  },
} as const;

type TranslationKey = keyof (typeof translations)["ar"];

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const toggleLang = () => setLang((prev) => (prev === "ar" ? "en" : "ar"));

  const t = (key: TranslationKey): string =>
    (translations[lang] as Record<string, string>)[key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
