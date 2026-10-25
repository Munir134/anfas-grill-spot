import { useEffect, useState } from "react";
import { ArrowLeft, ShoppingBag, Bike, X, MapPin, Phone, MessageCircle, Navigation } from "lucide-react";

type Step = "choice" | "pickup" | "delivery";

const PHONE = "0530387458";
const PHONE_INTL = "+966530387458";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=%D9%85%D8%B7%D8%B9%D9%85+%D8%A3%D9%86%D9%81%D8%A7%D8%B3+%D8%B5%D9%82%D8%B1+%D9%82%D8%B1%D9%8A%D8%B4+%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%D8%A9+%D8%AC%D8%AF%D8%A9";
const WHATSAPP =
  "https://wa.me/966530387458?text=" +
  encodeURIComponent("مرحباً، أرغب بالطلب من مطعم أنفاس.");

export default function OrderModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("choice");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setStep("choice"), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  return (
    <div
      aria-hidden={!open}
      dir="rtl"
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 py-6 transition-opacity duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        onClick={onClose}
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="اطلب الآن"
        className={`relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl border border-border bg-background shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
        }`}
      >
        <button
          onClick={onClose}
          aria-label="إغلاق"
          className="absolute top-4 left-4 z-10 rounded-full p-2 text-muted-foreground hover:text-ink hover:bg-cream transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-8 pt-14 pb-8">
          <div className="text-center">
            <span className="divider-dot">
              {step === "choice" ? "اطلب الآن" : step === "pickup" ? "استلام من المطعم" : "توصيل"}
            </span>
            <h2 className="mt-5 text-3xl sm:text-4xl font-bold text-ink">
              {step === "choice"
                ? "كيف تحب أن تستلم طلبك؟"
                : step === "pickup"
                  ? "نستقبلك في السلامة"
                  : "نوصل لباب بيتك"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {step === "choice"
                ? "استلم من الفرع، أو اطلب توصيلًا ساخنًا إلى بيتك."
                : step === "pickup"
                  ? "6889 صقر قريش، السلامة، جدة 23436"
                  : "اطلب عبر واتساب أو اتصل بنا مباشرة."}
            </p>
          </div>

          <div className="relative mt-8 overflow-hidden">
            <div
              className="flex w-[200%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transform: step === "choice" ? "translateX(0%)" : "translateX(50%)",
              }}
            >
              {/* Step 1: Choice */}
              <div className="w-1/2 shrink-0 pl-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ChoiceCard
                    icon={<ShoppingBag className="h-6 w-6" />}
                    label="استلام"
                    hint="جاهز عند المطعم"
                    onClick={() => setStep("pickup")}
                  />
                  <ChoiceCard
                    icon={<Bike className="h-6 w-6" />}
                    label="توصيل"
                    hint="إلى باب بيتك"
                    onClick={() => setStep("delivery")}
                  />
                </div>
              </div>

              {/* Step 2: Pickup or Delivery actions */}
              <div className="w-1/2 shrink-0 pr-1">
                {step === "pickup" ? (
                  <ul className="space-y-2.5">
                    <ActionRow
                      href={MAPS_URL}
                      icon={<Navigation className="h-4 w-4" />}
                      title="افتح المسار على قوقل"
                      hint="اتجاهات إلى المطعم"
                      external
                    />
                    <ActionRow
                      href={`tel:${PHONE}`}
                      icon={<Phone className="h-4 w-4" />}
                      title="اتصل للحجز أو الطلب"
                      hint="053 038 7458"
                    />
                    <ActionRow
                      href="/menu"
                      icon={<MapPin className="h-4 w-4" />}
                      title="استعرض المنيو"
                      hint="اختر أطباقك قبل الوصول"
                    />
                  </ul>
                ) : (
                  <ul className="space-y-2.5">
                    <ActionRow
                      href={WHATSAPP}
                      icon={<MessageCircle className="h-4 w-4" />}
                      title="اطلب عبر واتساب"
                      hint="أسرع طريقة للطلب"
                      external
                    />
                    <ActionRow
                      href={`tel:${PHONE}`}
                      icon={<Phone className="h-4 w-4" />}
                      title="اتصل بالمطعم"
                      hint={PHONE_INTL}
                    />
                    <ActionRow
                      href="/menu"
                      icon={<MapPin className="h-4 w-4" />}
                      title="استعرض المنيو"
                      hint="اختر أطباقك قبل الطلب"
                    />
                  </ul>
                )}


                <button
                  onClick={() => setStep("choice")}
                  className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
                  رجوع
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChoiceCard({
  icon,
  label,
  hint,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card px-6 py-7 text-center transition-all duration-300 hover:border-primary hover:bg-cream hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(200,16,46,0.35)]"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
        {icon}
      </span>
      <span className="block text-lg font-bold text-ink">{label}</span>
      <span className="block text-xs text-muted-foreground">{hint}</span>
    </button>
  );
}

function ActionRow({
  href,
  icon,
  title,
  hint,
  external,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  hint: string;
  external?: boolean;
}) {
  return (
    <li>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className="group flex w-full items-center gap-4 rounded-xl border border-border bg-card px-4 py-3.5 transition-all duration-300 hover:border-primary/60 hover:bg-cream hover:-translate-y-0.5"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
          {icon}
        </span>
        <span className="flex-1 text-right">
          <span className="block font-bold text-ink leading-tight">{title}</span>
          <span className="block text-xs text-muted-foreground mt-0.5" dir="ltr">
            {hint}
          </span>
        </span>
        <ArrowLeft className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:-translate-x-1" />
      </a>
    </li>
  );
}
