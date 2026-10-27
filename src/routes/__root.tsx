import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Instagram, Phone, MapPin, Globe, ShoppingBag } from "lucide-react";
import anfasLogo from "../assets/anfas-emblem.png";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { LanguageProvider, useLanguage } from "../lib/LanguageContext";
import { CartProvider, useCart } from "../lib/CartContext";
import AnfasCartDrawer from "../components/AnfasCartDrawer";
import AnfasProductCustomizerModal from "../components/AnfasProductCustomizerModal";
import AnfasOrderTrackerModal from "../components/AnfasOrderTrackerModal";
import { AnfasPrivacyPolicyModal } from "../components/AnfasPrivacyPolicyModal";
import { WaselClient } from "../lib/wasel";

function NotFoundComponent() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{t("notFound")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("notFoundDesc")}</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const { t } = useLanguage();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{t("errorTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("errorDesc")}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("tryAgain")}
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {t("homeLink")}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "أنفاس — مشويات تركية أصيلة في جدة" },
      {
        name: "description",
        content:
          "مطعم أنفاس للمشويات التركية في حي السلامة، جدة. أطباق أصيلة على الفحم، أجواء دافئة، ومنيو غني بالمشاوي والحلويات التركية.",
      },
      { name: "author", content: "Anfas Restaurant" },
      { property: "og:title", content: "أنفاس — مشويات تركية أصيلة في جدة" },
      {
        property: "og:description",
        content:
          "مطعم أنفاس للمشويات التركية في حي السلامة، جدة. أطباق أصيلة على الفحم، أجواء دافئة، ومنيو غني بالمشاوي والحلويات التركية.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "أنفاس — مشويات تركية أصيلة في جدة" },
      {
        name: "twitter:description",
        content:
          "مطعم أنفاس للمشويات التركية في حي السلامة، جدة. أطباق أصيلة على الفحم، أجواء دافئة، ومنيو غني بالمشاوي والحلويات التركية.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/114b85a7-3b0b-45f8-a192-a59f338fe396/id-preview-18b2c8d5--1bd7513e-7d18-420f-8a46-85bf40b815d7.lovable.app-1785090278395.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/114b85a7-3b0b-45f8-a192-a59f338fe396/id-preview-18b2c8d5--1bd7513e-7d18-420f-8a46-85bf40b815d7.lovable.app-1785090278395.png",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Playfair+Display:wght@400;600;700&family=Tajawal:wght@300;400;500;700;900&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: "Anfas Turkish Grill — مطعم أنفاس للمشويات التركية",
          image:
            "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/114b85a7-3b0b-45f8-a192-a59f338fe396/id-preview-18b2c8d5--1bd7513e-7d18-420f-8a46-85bf40b815d7.lovable.app-1785090278395.png",
          servesCuisine: ["Turkish", "Middle Eastern", "Grill", "BBQ"],
          priceRange: "$$",
          telephone: "+966500000000",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Al Salamah District — حي السلامة",
            addressLocality: "Jeddah — جدة",
            addressRegion: "Makkah",
            addressCountry: "SA",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 21.5833,
            longitude: 39.1667,
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ],
              opens: "13:00",
              closes: "02:00",
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponentWrapper,
  errorComponent: ErrorComponentWrapper,
});

function NotFoundComponentWrapper() {
  return (
    <LanguageProvider>
      <NotFoundComponent />
    </LanguageProvider>
  );
}

function ErrorComponentWrapper({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <LanguageProvider>
      <ErrorComponent error={error} reset={reset} />
    </LanguageProvider>
  );
}

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <CartProvider>
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <SiteHeader />
            <main className="flex-1">
              <Outlet />
            </main>
            <SiteFooter />
          </div>
          {/* Wasel Global Ordering Modals & Floating Red Cart */}
          <FloatingCartButton />
          <AnfasCartDrawer />
          <AnfasProductCustomizerModal />
          <AnfasOrderTrackerModal />
        </CartProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

function FloatingCartButton() {
  const { openCart, totalItemCount, subtotal } = useCart();
  const { t } = useLanguage();

  return (
    <aside aria-label={t("cart")} className="fixed bottom-6 end-6 z-40 pointer-events-auto">
      <button
        onClick={openCart}
        type="button"
        aria-label={t("cart")}
        className="group relative flex items-center gap-3 rounded-full bg-primary px-5 py-3.5 text-primary-foreground shadow-2xl hover:bg-brand-deep hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border-2 border-white/20"
      >
        <div className="relative flex items-center justify-center">
          <ShoppingBag className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
          {totalItemCount > 0 && (
            <span className="absolute -top-2.5 -end-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 font-mono text-[11px] font-black text-primary shadow-md">
              {totalItemCount}
            </span>
          )}
        </div>
        <div className="flex flex-col text-start leading-tight">
          <span className="text-xs font-bold">{t("cart")}</span>
          {subtotal > 0 ? (
            <span className="font-mono text-[11px] font-semibold text-white/90">
              {subtotal} {t("sar")}
            </span>
          ) : (
            <span className="text-[10px] text-white/80">{t("orderNow")}</span>
          )}
        </div>
      </button>
    </aside>
  );
}

function SiteHeader() {
  const { t, lang, toggleLang } = useLanguage();
  const { openCart, totalItemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="container-anfas flex h-16 items-center justify-between md:h-20">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={anfasLogo}
            alt="أنفاس — Anfas Turkish Grill"
            className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-105"
            width={40}
            height={40}
          />
          <div className="leading-tight">
            <div className="text-xl font-bold text-ink">{lang === "ar" ? "أنفاس" : "Anfas"}</div>
            <div className="text-[10px] tracking-[0.3em] text-primary font-latin">ANFAS</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex text-sm font-medium">
          <Link
            to="/"
            className="text-ink hover:text-primary transition-colors"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-primary" }}
          >
            {t("home")}
          </Link>
          <Link
            to="/menu"
            className="text-ink hover:text-primary transition-colors"
            activeProps={{ className: "text-primary" }}
          >
            {t("menuNav")}
          </Link>
          <Link
            to="/contact"
            className="text-ink hover:text-primary transition-colors"
            activeProps={{ className: "text-primary" }}
          >
            {t("visitNav")}
          </Link>

          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            title={lang === "ar" ? "Switch to English" : "التبديل إلى العربية"}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 px-3 py-1 text-xs font-semibold tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-latin"
          >
            <Globe className="h-3.5 w-3.5" />
            {t("toggleLang")}
          </button>
        </nav>

        <div className="flex items-center gap-2">
          {/* Brand Red Cart Button */}
          <button
            onClick={openCart}
            aria-label={t("cart")}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-primary-foreground shadow-sm hover:bg-brand-deep hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{t("cart")}</span>
            {totalItemCount > 0 && (
              <span className="grid h-5 min-w-5 px-1 place-items-center rounded-full bg-white text-primary text-[11px] font-bold font-mono shadow-2xs">
                {totalItemCount}
              </span>
            )}
          </button>

          {/* Mobile lang toggle */}
          <button
            onClick={toggleLang}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            title={lang === "ar" ? "Switch to English" : "التبديل إلى العربية"}
          >
            <Globe className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}


function SiteFooter() {
  const { t, lang } = useLanguage();
  const year = new Date().getFullYear();
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <>
      <footer className="mt-24 border-t border-border/60 bg-cream">
        <div className="container-anfas py-14 grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={anfasLogo}
                alt="أنفاس — Anfas Turkish Grill"
                className="h-10 w-10 object-contain"
                width={40}
                height={40}
              />
              <div className="leading-tight">
                <div className="text-xl font-bold text-ink">{lang === "ar" ? "أنفاس" : "Anfas"}</div>
                <div className="text-[10px] tracking-[0.3em] text-primary font-latin">ANFAS</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
              {t("footerDesc")}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink tracking-widest">{t("footerContactTitle")}</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>{t("footerAddress")}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:0530387458" dir="ltr" className="hover:text-primary transition-colors">
                  053 038 7458
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-primary" />
                <a
                  href="https://instagram.com/anfasrestaurant"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  @anfasrestaurant
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink tracking-widest">{t("footerHoursTitle")}</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex justify-between border-b border-border/60 pb-2">
                <span>{t("footerDaily")}</span>
                <span dir="ltr">1:00 PM – 4:00 AM</span>
              </li>
              <li className="text-xs text-muted-foreground/80 mt-2">{t("footerHoursNote")}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/60">
          <div className="container-anfas py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>
              © {year} {t("footerCopyright")}
            </span>
            <button
              type="button"
              onClick={() => setIsPrivacyOpen(true)}
              className="text-xs text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              سياسة الخصوصية | Privacy Policy
            </button>
            <span className="font-latin tracking-widest">ANFAS · JEDDAH</span>
          </div>
        </div>
      </footer>

      <AnfasPrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </>
  );
}
