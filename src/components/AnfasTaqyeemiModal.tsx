import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../lib/LanguageContext';
import { Star, X, ExternalLink, Sparkles } from 'lucide-react';
import anfasLogo from '../assets/anfas-emblem.png';

export const TAQYEEMI_REVIEW_URL = 'https://taqyeemi.pages.dev/?c=Anfas';
export const PENDING_REVIEW_KEY = 'anfas_taqyeemi_pending_review';

/**
 * Call this when an order is submitted to WhatsApp.
 * Records the order timestamp so when the customer returns to the site,
 * the Taqyeemi review modal is presented.
 */
export function markPendingTaqyeemiReview() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PENDING_REVIEW_KEY, String(Date.now()));
  } catch (e) {
    console.error('Failed to set pending review flag:', e);
  }
}

export default function AnfasTaqyeemiModal() {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if user returned from WhatsApp after placing an order
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkPendingOrder = () => {
      try {
        const stored = localStorage.getItem(PENDING_REVIEW_KEY);
        if (!stored) return;

        const timestamp = Number(stored);
        if (isNaN(timestamp)) {
          localStorage.removeItem(PENDING_REVIEW_KEY);
          return;
        }

        const elapsed = Date.now() - timestamp;

        // ONLY trigger if at least 5 seconds have passed (meaning user switched to WhatsApp and returned,
        // preventing any accidental trigger during the initial click), and within 30 minutes.
        if (elapsed >= 5000 && elapsed <= 30 * 60 * 1000) {
          // Clear flag immediately so it only triggers ONCE
          localStorage.removeItem(PENDING_REVIEW_KEY);
          setIsOpen(true);
        } else if (elapsed > 30 * 60 * 1000) {
          // Expired (>30 mins)
          localStorage.removeItem(PENDING_REVIEW_KEY);
        }
      } catch (err) {
        console.error('Error checking pending review:', err);
      }
    };

    // 1. Check on initial page load / reload
    checkPendingOrder();

    // 2. Listen for when user returns / switches back to the website from WhatsApp
    let wasHidden = false;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        wasHidden = true;
      } else if (document.visibilityState === 'visible') {
        if (wasHidden) {
          checkPendingOrder();
        }
      }
    };

    const handleFocus = () => {
      if (wasHidden) {
        checkPendingOrder();
      }
    };

    const handlePageShow = () => {
      checkPendingOrder();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  // Handle countdown & auto-redirect when modal is open
  useEffect(() => {
    if (!isOpen) return;

    // Countdown interval
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          window.location.href = TAQYEEMI_REVIEW_URL;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen]);

  const handleManualGo = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    window.location.href = TAQYEEMI_REVIEW_URL;
  };

  const handleDismiss = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-card border border-border/80 shadow-2xl p-6 sm:p-8 text-center text-foreground animate-in zoom-in-95 duration-300 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-primary/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 rtl:left-4 ltr:right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-cream transition-colors cursor-pointer"
          aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Restaurant Logo Badge */}
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-cream border border-border/70 p-2 shadow-sm flex items-center justify-center mb-4">
          <img
            src={anfasLogo}
            alt="أنفاس"
            className="w-full h-full object-contain"
            width={64}
            height={64}
          />
        </div>

        {/* 5 Golden Stars */}
        <div className="flex items-center justify-center gap-1.5 mb-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className="w-6 h-6 fill-amber-400 text-amber-400 animate-in zoom-in duration-300"
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-ink mb-2">
          {lang === 'ar' ? 'شكراً لطلبك من مطعم أنفاس! 🔥' : 'Thank You for Ordering! 🔥'}
        </h3>

        {/* Subtitle / Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-sm mx-auto">
          {lang === 'ar'
            ? 'نسعد جداً بمشاركتنا تقييمك ورأيك عبر قوقل، رأيك يصنع الفرق ويساعدنا في تقديم الأفضل دائماً.'
            : 'We would love to hear your feedback on Google Reviews. Your review means the world to us!'}
        </p>

        {/* Big Action Button (Teleport to Taqyeemi) */}
        <button
          type="button"
          onClick={handleManualGo}
          className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-primary text-white font-bold text-base shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer mb-3"
        >
          <ExternalLink className="w-5 h-5" />
          <span>{lang === 'ar' ? 'تقييم المطعم الآن على قوقل ⭐' : 'Review on Google Now ⭐'}</span>
        </button>

        {/* Countdown notice & dismiss */}
        <div className="flex flex-col items-center gap-2 pt-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>
              {lang === 'ar'
                ? `سيتم نقلك لصفحة التقييم تلقائياً خلال ${countdown} ثوانٍ...`
                : `Teleporting to review in ${countdown}s...`}
            </span>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="text-[11px] text-muted-foreground/80 hover:text-ink hover:underline cursor-pointer pt-1"
          >
            {lang === 'ar' ? 'إغلاق ومتابعة تصفح الموقع' : 'Dismiss and continue browsing'}
          </button>
        </div>
      </div>
    </div>
  );
}
