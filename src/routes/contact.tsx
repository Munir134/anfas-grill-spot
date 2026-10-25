import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Clock, Instagram, Globe } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";
import type React from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "زُرنا — مطعم أنفاس، حي السلامة، جدة" },
      {
        name: "description",
        content:
          "موقع مطعم أنفاس التركي في حي السلامة بجدة، أوقات العمل ووسائل التواصل والحجز.",
      },
      { property: "og:title", content: "زُرنا — مطعم أنفاس بجدة" },
      {
        property: "og:description",
        content: "عنوان مطعم أنفاس، أوقات العمل، وطرق التواصل معنا في جدة.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useLanguage();

  return (
    <div>
      <section className="bg-cream py-16 md:py-24 border-b border-border/60">
        <div className="container-anfas text-center">
          <span className="divider-dot">{t("contactLabel")}</span>
          <h1 className="mt-6 text-5xl md:text-6xl font-bold text-ink">{t("contactTitle")}</h1>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground">{t("contactDesc")}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-anfas grid gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <InfoCard
              icon={MapPin}
              title={t("contactAddress")}
              body={t("footerAddress")}
            />
            <InfoCard
              icon={Phone}
              title={t("contactPhone")}
              body={
                <a href="tel:0530387458" dir="ltr" className="hover:text-primary">
                  053 038 7458
                </a>
              }
            />
            <InfoCard
              icon={Clock}
              title={t("contactHours")}
              body={<span dir="ltr">Daily · 1:00 PM – 4:00 AM</span>}
            />
            <InfoCard
              icon={Instagram}
              title={t("contactInstagram")}
              body={
                <a
                  href="https://instagram.com/anfasrestaurant"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary"
                >
                  @anfasrestaurant
                </a>
              }
            />
            <InfoCard
              icon={Globe}
              title={t("contactWebsite")}
              body={
                <a
                  href="https://anfasrestaurant.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary"
                >
                  anfasrestaurant.com
                </a>
              }
            />
          </div>

          <div className="overflow-hidden rounded-lg border border-border shadow-lg">
            <iframe
              title="موقع مطعم أنفاس"
              src="https://www.google.com/maps?q=6889+Saqr+Quraish,+As+Salamah,+Jeddah+23436&output=embed"
              width="100%"
              height="520"
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

function InfoCard({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-border bg-card p-5">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary shrink-0">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <div className="text-sm font-semibold text-ink">{title}</div>
        <div className="mt-1 text-sm text-muted-foreground">{body}</div>
      </div>
    </div>
  );
}
