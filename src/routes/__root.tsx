import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Flame, Instagram, Phone, MapPin, Globe } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { LanguageProvider, useLanguage } from "../lib/LanguageContext";

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
        <div className="flex min-h-screen flex-col bg-background text-foreground">
          <SiteHeader />
          <main className="flex-1">
            <Outlet />
          </main>
          <SiteFooter />
        </div>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

function SiteHeader() {
  const { t, lang, toggleLang } = useLanguage();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="container-anfas flex h-16 items-center justify-between md:h-20">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <Flame className="h-5 w-5" strokeWidth={2.4} />
          </span>
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
          <a
            href="tel:0534900038"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-brand-deep hover:-translate-y-0.5 transition-all duration-300"
          >
            <Phone className="h-4 w-4" />
            {t("bookTable")}
          </a>

          {/* Mobile lang toggle */}
          <button
            onClick={toggleLang}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            title={lang === "ar" ? "Switch to English" : "التبديل إلى العربية"}
          >
            <Globe className="h-4 w-4" />
          </button>

          <a
            href="tel:0534900038"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
            aria-label={t("bookTable")}
          >
            <Phone className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  const { t, lang } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border/60 bg-cream">
      <div className="container-anfas py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
              <Flame className="h-5 w-5" strokeWidth={2.4} />
            </span>
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
              <a href="tel:0534900038" dir="ltr" className="hover:text-primary transition-colors">
                053 490 0038
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
        <div className="container-anfas py-5 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            © {year} {t("footerCopyright")}
          </span>
          <span className="font-latin tracking-widest">ANFAS · JEDDAH</span>
        </div>
      </div>
    </footer>
  );
}
