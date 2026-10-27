import React, { useEffect } from "react";
import { ShieldCheck, X, Building2, Database, Target, Share2, Clock, UserCheck, MessageCircle } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";

interface AnfasPrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AnfasPrivacyPolicyModal({ isOpen, onClose }: AnfasPrivacyPolicyModalProps) {
  const { lang } = useLanguage();

  // Close on ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Lock body scroll when modal is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="anfas-privacy-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Backdrop with dark charcoal dim & blur */}
      <div
        className="fixed inset-0 bg-[#0c0908]/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl bg-[#14100E] border border-orange-500/25 rounded-3xl shadow-2xl shadow-black/80 text-[#FAF4EB] overflow-hidden my-auto z-10 animate-in zoom-in-95 duration-200">
        {/* Ambient Top Glow */}
        <div
          aria-hidden="true"
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-36 bg-orange-600/20 blur-3xl pointer-events-none rounded-full"
        />

        {/* Modal Header */}
        <div className="relative flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 id="anfas-privacy-title" className="text-xl sm:text-2xl font-bold tracking-tight text-[#FAF4EB]">
                {lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
              </h2>
              <div className="text-xs text-orange-400 font-latin tracking-wider uppercase mt-0.5">
                {lang === "ar" ? "Privacy Policy · Anfas Turkish Grill" : "سياسة الخصوصية · مطعم أنفاس"}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={lang === "ar" ? "إغلاق النافذة" : "Close modal"}
            className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Content Sections */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-sm leading-relaxed no-scrollbar">
          {/* 1. Identity */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-orange-500/20 transition-colors">
            <div className="flex items-center gap-2.5 text-orange-400 font-bold mb-1.5">
              <Building2 className="h-4 w-4 shrink-0" />
              <span>من نحن · Identity</span>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm">
              مطعم أنفاس للمشاوي التركية — <strong>Anfas Turkish Grill</strong>، جدة، المملكة العربية السعودية.
            </p>
          </div>

          {/* 2. Data Collected */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-orange-500/20 transition-colors">
            <div className="flex items-center gap-2.5 text-orange-400 font-bold mb-1.5">
              <Database className="h-4 w-4 shrink-0" />
              <span>البيانات التي نجمعها · Data Collected</span>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm">
              عند التواصل أو إرسال الطلبات عبر الموقع أو الواتساب، نجمع فقط الاسم، رقم الهاتف، تفاصيل الطلب، وموقع التوصيل إن وُجد، بالإضافة إلى ملفات تعريف الارتباط التقنية الضرورية لتشغيل واستقرار الموقع.
            </p>
          </div>

          {/* 3. Purpose */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-orange-500/20 transition-colors">
            <div className="flex items-center gap-2.5 text-orange-400 font-bold mb-1.5">
              <Target className="h-4 w-4 shrink-0" />
              <span>الغرض والاستخدام · Purpose</span>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm">
              تُستخدم هذه البيانات حصراً لتجهيز الطلبات، التنسيق المباشر مع العميل، وتوفير خدمة عملاء سريعة وموثوقة.
            </p>
          </div>

          {/* 4. Third Parties */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-orange-500/20 transition-colors">
            <div className="flex items-center gap-2.5 text-orange-400 font-bold mb-1.5">
              <Share2 className="h-4 w-4 shrink-0" />
              <span>مزودو الخدمة والطرف الثالث · Third Parties</span>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm">
              تتم معالجة الرسائل والطلبات عبر تطبيق واتساب (WhatsApp/Meta)، وتتم استضافة الموقع عبر خوادم سحابية آمنة (Cloudflare). نحن <strong>لا نبيع ولا نؤجر</strong> بيانات العملاء لأي طرف ثالث نهائياً.
            </p>
          </div>

          {/* 5. Retention & Security */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-orange-500/20 transition-colors">
            <div className="flex items-center gap-2.5 text-orange-400 font-bold mb-1.5">
              <Clock className="h-4 w-4 shrink-0" />
              <span>مدة الاحتفاظ والأمان · Retention & Security</span>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm">
              نحتفظ بالبيانات فقط للمدة اللازمة لإتمام الخدمة والالتزامات المحاسبية مع تطبيق تدابير حماية تقنية وتشفير ملائم لمنع الوصول غير المصرح به.
            </p>
          </div>

          {/* 6. Customer Rights */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-orange-500/20 transition-colors">
            <div className="flex items-center gap-2.5 text-orange-400 font-bold mb-1.5">
              <UserCheck className="h-4 w-4 shrink-0" />
              <span>حقوق العميل · Customer Rights</span>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm">
              يحق للعميل طلب مراجعة، تعديل، أو حذف بيانات التواصل الخاصة به في أي وقت بمراسلتنا مباشرة عبر رقم الواتساب الرسمي الخاص بالمطعم.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-black/40 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href="https://wa.me/966530387458?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D9%84%D8%AF%D9%8A%20%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%AD%D9%88%D9%84%20%D8%A7%D9%84%D8%AE%D8%B5%D9%88%D8%B5%D9%8A%D8%A9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-orange-400 hover:text-orange-300 transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>{lang === "ar" ? "للاستفسارات وممارسة حقوق البيانات: واتساب أنفاس" : "Privacy Inquiries: Contact on WhatsApp"}</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs transition-all active:scale-95 cursor-pointer shadow-md shadow-orange-950/40"
          >
            {lang === "ar" ? "إغلاق النافذة" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
