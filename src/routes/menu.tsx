import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  ShoppingBag,
  Plus,
  Flame,
  Search,
  X,
  Check,
  SlidersHorizontal,
  Crown,
  Salad,
  Soup,
  Utensils,
  Pizza,
  Croissant,
  Coffee,
  ChevronDown,
  ArrowUp,
  Leaf,
  Layers,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";
import { useCart } from "../lib/CartContext";
import { WaselProduct } from "../lib/wasel";
import {
  anfasCategories,
  MenuItem,
  MenuCategory,
} from "../data/anfasMenuData";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerClose,
} from "../components/ui/drawer";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "منيو أنفاس الأصلي — مطعم أنفاس للمشويات التركية" },
      {
        name: "description",
        content:
          "استكشف القائمة الكاملة لمطعم أنفاس التركي: مشاوي ع الفحم، كباب بالأمتار، طواجن فخار، ستيك فاخر، مقبلات، بيتزا وفطائر تركية أصيلة.",
      },
      { property: "og:title", content: "منيو أنفاس الأصلي — مشاوي تركية على أصولها" },
      {
        property: "og:description",
        content:
          "أكثر من ٨٥ طبقاً تركياً طازجاً على الفحم الطبيعي، طواجن، مقبلات، وحلويات في مطعم أنفاس بجدة.",
      },
    ],
  }),
  component: MenuPage,
});

// Helper for category icons
function CategoryIcon({ name, className = "h-4 w-4" }: { name: string; className?: string }) {
  switch (name) {
    case "Salad":
      return <Salad className={className} />;
    case "Leaf":
      return <Leaf className={className} />;
    case "Flame":
      return <Flame className={className} />;
    case "Crown":
      return <Crown className={className} />;
    case "Soup":
      return <Soup className={className} />;
    case "Utensils":
      return <Utensils className={className} />;
    case "Pizza":
      return <Pizza className={className} />;
    case "Croissant":
      return <Croissant className={className} />;
    case "Coffee":
      return <Coffee className={className} />;
    default:
      return <Flame className={className} />;
  }
}

function MenuPage() {
  const { t, lang } = useLanguage();
  const { addItem, openCustomizer, openCart, totalItemCount, subtotal } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [filterMode, setFilterMode] = useState<"continuous" | "isolated">("continuous");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const pillContainerRef = useRef<HTMLDivElement>(null);

  // Monitor scroll for back-to-top and active section highlight
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);

      if (filterMode === "continuous" && !searchQuery.trim()) {
        const sections = anfasCategories.map((c) => document.getElementById(`section-${c.id}`));
        const scrollPosition = window.scrollY + 200;

        for (let i = sections.length - 1; i >= 0; i--) {
          const sec = sections[i];
          if (sec && sec.offsetTop <= scrollPosition) {
            setActiveCategory(anfasCategories[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filterMode, searchQuery]);

  // Center active pill in pill container
  useEffect(() => {
    if (!pillContainerRef.current) return;
    const activeBtn = pillContainerRef.current.querySelector(
      `[data-category-id="${activeCategory}"]`
    ) as HTMLElement;
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeCategory]);

  // Handle dish click
  const handleItemClick = (item: MenuItem) => {
    if (item.hasModifiers && item.modifierGroups) {
      const waselProd: WaselProduct = {
        id: item.id,
        category_id: `c-anfas-${item.id}`,
        name: lang === "ar" ? item.nameAr : item.nameEn,
        description: lang === "ar" ? item.descAr : item.descEn,
        base_price: item.priceNum,
        image_url: item.img,
        is_available: true,
        preparation_time_minutes: 20,
        calories: item.calories,
        is_featured: !!item.isPopular,
        modifier_groups: item.modifierGroups,
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

      // Visual feedback
      setRecentlyAddedId(item.id);
      setTimeout(() => setRecentlyAddedId(null), 1200);
    }
  };

  // Filter categories and items based on search & active filter
  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return anfasCategories
      .map((cat) => {
        // If single isolated category mode is active and no search query
        if (!q && filterMode === "isolated" && activeCategory !== "all" && cat.id !== activeCategory) {
          return null;
        }

        const matchingItems = cat.items.filter((item) => {
          if (!q) return true;
          return (
            item.nameAr.toLowerCase().includes(q) ||
            item.nameEn.toLowerCase().includes(q) ||
            item.descAr.toLowerCase().includes(q) ||
            item.descEn.toLowerCase().includes(q) ||
            cat.titleAr.toLowerCase().includes(q) ||
            cat.titleEn.toLowerCase().includes(q)
          );
        });

        if (matchingItems.length === 0) return null;
        return {
          ...cat,
          items: matchingItems,
        };
      })
      .filter(Boolean) as MenuCategory[];
  }, [searchQuery, filterMode, activeCategory]);

  const totalMatchingDishes = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0);
  }, [filteredCategories]);

  // Jump smoothly to a category
  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    if (filterMode === "isolated") {
      window.scrollTo({ top: 380, behavior: "smooth" });
      return;
    }
    if (catId === "all") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const elem = document.getElementById(`section-${catId}`);
    if (elem) {
      const topOffset = 110;
      const elementPosition = elem.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - topOffset,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/20 selection:text-primary pb-28">
      {/* ── HERO BANNER ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream via-cream/80 to-background pt-12 pb-10 border-b border-border/50">
        <div className="container-anfas text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
            <Flame className="h-3.5 w-3.5 animate-pulse" />
            <span>مشاوي تركية على الفحم الطبيعي • قائمة أصلية</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-ink tracking-tight">
            {lang === "ar" ? "قائمة أطباق أنفاس" : "Anfas Dining Menu"}
          </h1>

          <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground leading-relaxed">
            {lang === "ar"
              ? "استمتع بأشهى أطباق المشاوي، كباب الأمتار، الطواجن الفخارية، الستيك الفاخر، والمقبلات الطازجة المحضرة يومياً بأنامل شيف تركي متمرس."
              : "Savor prime charcoal grills, meter kebabs, slow-cooked clay pots, steaks, and fresh Turkish mezze crafted daily with authentic Ottoman hospitality."}
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-6 flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-xs text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background border border-border/60 shadow-xs">
              <Layers className="h-3.5 w-3.5 text-primary" />
              <span>١٣ قسماً رئيسياً</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background border border-border/60 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>أكثر من ٨٥ طبقاً طازجاً</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background border border-border/60 shadow-xs">
              <Flame className="h-3.5 w-3.5 text-primary" />
              <span>فحم طبيعي ١٠٠٪</span>
            </span>
          </div>

          {/* Instant Search Bar */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute right-4 rtl:right-4 ltr:left-4 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === "ar"
                    ? "ابحث عن طبقك المفضل (كباب، ستيك، حمص، عيران...)"
                    : "Search dishes (kebab, steak, hummus, ayran...)"
                }
                className="w-full h-12 rounded-2xl bg-background/90 backdrop-blur-md border border-border/80 pr-11 pl-11 rtl:pr-11 rtl:pl-10 ltr:pl-11 ltr:pr-10 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3 rtl:left-3 ltr:right-3 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  aria-label="مسح البحث"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {searchQuery && (
              <div className="mt-2 text-xs text-muted-foreground flex justify-between px-2">
                <span>
                  تم العثور على <strong className="text-primary">{totalMatchingDishes}</strong> طبق
                </span>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-primary hover:underline cursor-pointer"
                >
                  مسح الفلتر
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── STICKY APPLE TRANSLUCENT CATEGORY PILL BAR ────────────────────────── */}
      <nav
        aria-label="أقسام المنيو"
        className="sticky top-0 z-30 bg-background/80 dark:bg-black/80 backdrop-blur-xl border-b border-border/50 py-3 shadow-xs"
      >
        <div className="container-anfas flex items-center gap-3">
          {/* Quick Drawer Launcher Button */}
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <button
                type="button"
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cream border border-border/70 hover:border-primary/50 text-xs font-bold text-ink shadow-xs hover:bg-cream/80 active:scale-95 transition-all cursor-pointer"
                aria-label="فتح قائمة الأقسام الكاملة"
              >
                <Layers className="h-3.5 w-3.5 text-primary" />
                <span className="hidden sm:inline">تصفح الأقسام</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </DrawerTrigger>

            {/* Apple Native Bottom Sheet Drawer */}
            <DrawerContent className="max-h-[85vh] bg-background/95 backdrop-blur-2xl border-t border-border/60">
              <div className="mx-auto w-full max-w-2xl px-4 pb-8">
                <DrawerHeader className="text-center pt-2 pb-4">
                  <DrawerTitle className="text-xl font-bold text-ink flex items-center justify-center gap-2">
                    <Flame className="h-5 w-5 text-primary" />
                    <span>أقسام منيو أنفاس التركي</span>
                  </DrawerTitle>
                  <DrawerDescription className="text-xs text-muted-foreground">
                    اختر القسم للانتقال المباشر وتصفح الأطباق
                  </DrawerDescription>
                </DrawerHeader>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
                  <button
                    onClick={() => {
                      scrollToCategory("all");
                      setIsDrawerOpen(false);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-right transition-all active:scale-[0.97] cursor-pointer ${
                      activeCategory === "all"
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-cream/60 border-border/60 hover:border-primary/40 text-ink"
                    }`}
                  >
                    <div className="h-9 w-9 rounded-xl bg-background/80 flex items-center justify-center shrink-0">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-xs">كافة الأطباق</div>
                      <div className="text-[10px] opacity-75">All Menu</div>
                    </div>
                  </button>

                  {anfasCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        scrollToCategory(cat.id);
                        setIsDrawerOpen(false);
                      }}
                      className={`flex items-center gap-3 p-3 rounded-2xl border text-right transition-all active:scale-[0.97] cursor-pointer ${
                        activeCategory === cat.id
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-cream/60 border-border/60 hover:border-primary/40 text-ink"
                      }`}
                    >
                      <div className="h-9 w-9 rounded-xl bg-background/80 flex items-center justify-center shrink-0">
                        <CategoryIcon name={cat.iconName} className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs truncate">{cat.titleAr}</div>
                        <div className="text-[10px] opacity-75 truncate">{cat.badgeAr}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <DrawerClose asChild>
                    <button className="px-6 py-2 rounded-full bg-cream border border-border text-xs font-medium text-ink hover:bg-muted transition-colors cursor-pointer">
                      إغلاق النافذة
                    </button>
                  </DrawerClose>
                </div>
              </div>
            </DrawerContent>
          </Drawer>

          {/* Smooth Scroll Horizontal Pill Bar */}
          <div
            ref={pillContainerRef}
            className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
          >
            {/* "All / الكل" Pill */}
            <button
              data-category-id="all"
              onClick={() => scrollToCategory("all")}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer ${
                activeCategory === "all"
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                  : "bg-cream/70 hover:bg-cream text-muted-foreground hover:text-ink border border-border/60"
              }`}
            >
              <Sparkles className="h-3 w-3" />
              <span>الكل</span>
            </button>

            {anfasCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  data-category-id={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30 scale-[1.02]"
                      : "bg-cream/70 hover:bg-cream text-muted-foreground hover:text-ink border border-border/60"
                  }`}
                >
                  <CategoryIcon name={cat.iconName} className="h-3.5 w-3.5" />
                  <span>{cat.titleAr}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? "bg-white/20 text-white" : "bg-border/60 text-muted-foreground"
                    }`}
                  >
                    {cat.items.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Continuous vs Single Section View Toggle */}
          <button
            onClick={() => {
              setFilterMode((prev) => (prev === "continuous" ? "isolated" : "continuous"));
            }}
            className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              filterMode === "isolated"
                ? "bg-primary/10 border-primary text-primary"
                : "bg-cream border-border/70 text-muted-foreground hover:text-ink"
            }`}
            title="التبديل بين تصفح قسم واحد أو جميع الأقسام بالتتالي"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>{filterMode === "isolated" ? "تصفية قسم" : "عرض متتابع"}</span>
          </button>
        </div>
      </nav>

      {/* ── MENU SECTIONS ──────────────────────────────────────────────────────── */}
      <main className="container-anfas mt-8 space-y-16">
        {filteredCategories.length === 0 ? (
          <div className="py-20 text-center">
            <div className="h-16 w-16 mx-auto rounded-full bg-cream flex items-center justify-center text-muted-foreground mb-4">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-ink">لم يتم العثور على أطباق تطابق بحثك</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              جرب البحث بكلمات أخرى مثل "كباب"، "حمص"، "ستيك"، أو استعرض الأقسام مباشرة.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
                setFilterMode("continuous");
              }}
              className="mt-5 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:bg-brand-deep transition-all cursor-pointer"
            >
              عرض كافة أطباق المنيو
            </button>
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <section
              key={cat.id}
              id={`section-${cat.id}`}
              className="scroll-mt-24 transition-opacity duration-300"
            >
              {/* Category Header Card */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-border/70 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-xs">
                    <CategoryIcon name={cat.iconName} className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight flex items-center gap-2">
                      <span>{cat.titleAr}</span>
                    </h2>
                    <span className="text-xs text-muted-foreground font-latin tracking-wide">
                      {cat.titleEn}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="px-2.5 py-1 rounded-full bg-cream border border-border/60 font-mono">
                    {cat.items.length} {lang === "ar" ? "أطباق" : "dishes"}
                  </span>
                  <span className="text-primary font-latin text-[11px] tracking-widest uppercase font-semibold">
                    {cat.enCode}
                  </span>
                </div>
              </div>

              {/* Dish Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {cat.items.map((item) => {
                  const isJustAdded = recentlyAddedId === item.id;

                  return (
                    <article
                      key={item.id}
                      className="group flex flex-col justify-between rounded-3xl bg-card border border-border/70 hover:border-primary/40 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    >
                      {/* Image Frame with Badges */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-cream">
                        <img
                          src={item.img}
                          alt={lang === "ar" ? item.nameAr : item.nameEn}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-106"
                          onError={(e) => {
                            // Fallback in case of any network glitch
                            const target = e.target as HTMLImageElement;
                            target.src = "/dishes/anfas-kebab.jpg";
                          }}
                        />

                        {/* Top Badges */}
                        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-mono font-medium flex items-center gap-1 shadow-xs">
                            <Flame className="h-3 w-3 text-amber-400" />
                            <span>{item.calories} سعرة</span>
                          </span>

                          <div className="flex gap-1">
                            {item.isChefSpecial && (
                              <span className="px-2 py-0.8 rounded-full bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-bold shadow-xs flex items-center gap-1">
                                <Crown className="h-2.5 w-2.5" />
                                <span>خاص بأنفاس</span>
                              </span>
                            )}
                            {item.isPopular && (
                              <span className="px-2 py-0.8 rounded-full bg-primary/90 backdrop-blur-md text-white text-[10px] font-bold shadow-xs">
                                الأكثر طلباً
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Dish Title */}
                          <div className="flex items-baseline justify-between gap-2">
                            <h3 className="font-bold text-lg text-ink group-hover:text-primary transition-colors">
                              {item.nameAr}
                            </h3>
                          </div>
                          <div className="text-[11px] font-latin text-muted-foreground tracking-wider mb-2">
                            {item.nameEn}
                          </div>

                          {/* Dish Description */}
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                            {item.descAr}
                          </p>
                        </div>

                        {/* Price and Action Bar */}
                        <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between gap-3">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-primary font-mono tracking-tight">
                              {item.priceNum}
                            </span>
                            <span className="text-xs font-bold text-muted-foreground">
                              {t("sar")}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleItemClick(item)}
                            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold shadow-sm active:scale-95 transition-all duration-200 cursor-pointer ${
                              isJustAdded
                                ? "bg-emerald-600 text-white"
                                : item.hasModifiers
                                  ? "bg-cream border border-border text-ink hover:border-primary hover:text-primary hover:bg-cream/80"
                                  : "bg-primary text-primary-foreground hover:bg-brand-deep hover:shadow-md"
                            }`}
                          >
                            {isJustAdded ? (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                <span>تمت الإضافة</span>
                              </>
                            ) : item.hasModifiers ? (
                              <>
                                <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                                <span>تخصيص الطبق</span>
                              </>
                            ) : (
                              <>
                                <Plus className="h-3.5 w-3.5" />
                                <span>أضف للسلة</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </main>

      {/* ── FLOATING QUICK-JUMP CAPSULE & CART STATUS (Mobile & Tablet) ────────── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2">
        {/* Sections Drawer Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-ink/90 text-white dark:bg-white/90 dark:text-black backdrop-blur-xl border border-white/20 shadow-2xl text-xs font-bold active:scale-95 hover:scale-105 transition-all cursor-pointer"
          aria-label="تصفح جميع أقسام المنيو"
        >
          <Layers className="h-4 w-4 text-primary" />
          <span>الأقسام (١٣)</span>
        </button>

        {/* Floating Cart Launcher if Items exist */}
        {totalItemCount > 0 && (
          <button
            onClick={openCart}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground backdrop-blur-xl shadow-2xl text-xs font-bold active:scale-95 hover:scale-105 transition-all cursor-pointer animate-in fade-in zoom-in-95 duration-300"
            aria-label="عرض سلة الطلبات"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>
              {totalItemCount} {lang === "ar" ? "أطباق" : "items"} • {subtotal} {t("sar")}
            </span>
          </button>
        )}

        {/* Back to top button */}
        {showBackToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="h-10 w-10 rounded-full bg-cream border border-border/80 text-ink shadow-lg flex items-center justify-center hover:bg-muted active:scale-90 transition-all cursor-pointer"
            aria-label="العودة لأعلى الصفحة"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
