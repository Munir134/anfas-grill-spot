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

    // ── Cart & Ordering ───────────────────────────
    cart: "السلة",
    addToCart: "إضافة للطلب",
    emptyCart: "سلة طلباتك فارغة",
    emptyCartDesc: "تصفح قائمتنا واختر أشهى المشاوي والمقبلات والحلويات التركية.",
    checkout: "إتمام الطلب",
    subtotal: "المجموع الفرعي",
    tax: "ضريبة القيمة المضافة (15%)",
    deliveryFee: "رسوم التوصيل",
    total: "الإجمالي النهائي",
    pickup: "استلام من المطعم",
    delivery: "توصيل إلى العنوان",
    customerInfo: "بيانات العميل",
    customerName: "الاسم الكريم",
    customerPhone: "رقم الجوال",
    deliveryAddress: "عنوان التوصيل في جدة (الحي، الشارع)",
    orderNotes: "ملاحظات إضافية للمطبخ",
    paymentMethod: "طريقة الدفع",
    paymentCash: "الدفع عند الاستلام / نقداً",
    paymentCard: "الدفع الإلكتروني (مدى / Apple Pay)",
    placeOrder: "تأكيد وإرسال الطلب",
    orderSuccessTitle: "تم استلام طلبك بنجاح!",
    orderNumber: "رقم الطلب",
    orderStatus: "حالة الطلب",
    orderTracking: "متابعة الطلب المباشرة",
    preparing: "جاري التحضير والشواء",
    ready: "جاهز للاستلام / مع المندوب",
    completed: "تم التسليم بنجاح",
    close: "إغلاق",
    customize: "تخصيص",
    quantity: "الكمية",
    orderType: "نوع الطلب",
    freeDelivery: "توصيل مجاني",
    branch: "الفرع",
    pickupBranchAddress: "6889 صقر قريش، السلامة، جدة",
    callBranch: "اتصال بالفرع",
    viewOnMap: "الاتجاهات على الخريطة",
    specialInstructionsPlaceholder: "مثلاً: شطة زيادة، بدون بصل، صوص إضافي...",
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
    errorDesc: "You can refresh the page or return to home.",
    tryAgain: "Try Again",
    homeLink: "Home",

    // ── Footer ───────────────────────────────────
    footerContactTitle: "Contact Us",
    footerAddress: "6889 Saqr Quraish, Al Salamah, Jeddah 23436",
    footerHoursTitle: "Opening Hours",
    footerDaily: "Daily",
    footerHoursNote: "Open for lunch, dinner and until late hours.",
    footerCopyright: "Anfas Turkish Grill. All rights reserved.",
    footerDesc: "Authentic Turkish grills on charcoal with warm ambiance in Al Salamah, Jeddah.",

    // ── Home – Hero ──────────────────────────────
    heroTagline: "Turkish Grills · Jeddah",
    heroTitle: "Anfas",
    heroDesc:
      "Authentic Turkish breath over glowing charcoal — Anatolian spiced grilled meats served in Al Salamah, Jeddah.",
    orderNow: "Order Now",
    viewMenu: "View Menu",

    // ── Home – Story ─────────────────────────────
    ourStoryLabel: "Our Story",
    storyTitle1: "A Breath from Anatolia",
    storyTitle2: "to Jeddah",
    storyP1:
      "At Anfas, we bring the authentic Turkish grill experience from Istanbul and Adana — hand-picked meats, freshly ground spices, and master grillers.",
    storyP2:
      "Every dish carrying the heritage of Turkey with warm Saudi hospitality that turns your visit into a lasting memory.",

    // ── Home – Signature Dishes ───────────────────
    signaturesLabel: "Signature Dishes",
    signaturesTitle: "Dishes We Are Proud Of",
    signaturesDesc: "A curated selection of authentic Turkish grills prepared by expert chefs.",
    fullMenuBtn: "Full Menu",

    // ── Home – Atmosphere ─────────────────────────
    atmosphereLabel: "Atmosphere",
    atmosphereTitle: "Warmth, Charcoal & Turkish Tea",

    // ── Home – Features ───────────────────────────
    featuresLabel: "Why Anfas",
    featuresTitle: "A Complete Experience Under One Roof",

    // ── Home – Visit ──────────────────────────────
    visitLabel: "Visit Us",
    visitTitle1: "Welcome to",
    visitTitle2: "Al Salamah District",
    addressLabel: "Address",
    addressValue: "6889 Saqr Quraish, Al Salamah, Jeddah 23436",
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

    // ── Cart & Ordering ───────────────────────────
    cart: "Cart",
    addToCart: "Add to Cart",
    emptyCart: "Your cart is empty",
    emptyCartDesc: "Browse our menu and pick delicious Turkish grills, mezze and sweets.",
    checkout: "Checkout",
    subtotal: "Subtotal",
    tax: "VAT (15%)",
    deliveryFee: "Delivery Fee",
    total: "Total",
    pickup: "Pickup from Restaurant",
    delivery: "Delivery to Address",
    customerInfo: "Customer Details",
    customerName: "Full Name",
    customerPhone: "Phone Number",
    deliveryAddress: "Delivery Address in Jeddah (District, Street)",
    orderNotes: "Kitchen Preparation Notes",
    paymentMethod: "Payment Method",
    paymentCash: "Cash on Delivery / Pickup",
    paymentCard: "Card / Mada / Apple Pay",
    placeOrder: "Confirm & Place Order",
    orderSuccessTitle: "Order Placed Successfully!",
    orderNumber: "Order Number",
    orderStatus: "Order Status",
    orderTracking: "Live Order Tracking",
    preparing: "Preparing & Grilling",
    ready: "Ready for Pickup / Out for Delivery",
    completed: "Completed",
    close: "Close",
    customize: "Customize",
    quantity: "Quantity",
    orderType: "Order Type",
    freeDelivery: "Free Delivery",
    branch: "Branch",
    pickupBranchAddress: "6889 Saqr Quraish, Al Salamah, Jeddah",
    callBranch: "Call Branch",
    viewOnMap: "Get Directions",
    specialInstructionsPlaceholder: "e.g., extra spicy, no onions, extra garlic sauce...",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["ar"];

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
    (translations[lang] as Record<string, string>)[key] ?? (translations["ar"] as Record<string, string>)[key] ?? key;

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
