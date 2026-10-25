import { useEffect } from "react";
import { ArrowLeft, X, MapPin, Phone, MessageCircle, Navigation } from "lucide-react";

const PHONE = "0530387458";
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
        aria-label="استلام من المطعم"
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
            <span className="divider-dot">استلام من المطعم</span>
            <h2 className="mt-5 text-3xl sm:text-4xl font-bold text-ink">
              نستقبلك في السلامة
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              6889 صقر قريش، السلامة، جدة 23436 — اطلب عبر واتساب أو اتصل بنا مباشرة.
            </p>
          </div>

          <div className="mt-8">
            <ul className="space-y-2.5">
              <ActionRow
                href={WHATSAPP}
                icon={<MessageCircle className="h-4 w-4" />}
                title="اطلب عبر واتساب"
                hint="053 038 7458"
                external
              />
              <ActionRow
                href={`tel:${PHONE}`}
                icon={<Phone className="h-4 w-4" />}
                title="اتصل بالفرع"
                hint="053 038 7458"
              />
              <ActionRow
                href={MAPS_URL}
                icon={<Navigation className="h-4 w-4" />}
                title="افتح المسار على قوقل"
                hint="اتجاهات إلى المطعم"
                external
              />
              <ActionRow
                href="/menu"
                icon={<MapPin className="h-4 w-4" />}
                title="استعرض المنيو"
                hint="اختر أطباقك قبل الوصول"
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
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
