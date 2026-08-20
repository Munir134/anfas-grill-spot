import React, { useState, useEffect } from 'react';
import { useCart } from '../lib/CartContext';
import { useLanguage } from '../lib/LanguageContext';
import { waselClient, OrderTrackingData } from '../lib/wasel';
import {
  X,
  CheckCircle2,
  Clock,
  Flame,
  Bike,
  Store,
  MapPin,
  Phone,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';

export default function AnfasOrderTrackerModal() {
  const { activeTrackingToken, closeTracking } = useCart();
  const { t, lang } = useLanguage();

  const [order, setOrder] = useState<OrderTrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!activeTrackingToken) {
      setOrder(null);
      return;
    }

    let isMounted = true;

    const fetchOrder = async () => {
      try {
        const data = await waselClient.getOrderTracking(activeTrackingToken);
        if (isMounted) {
          setOrder(data);
          setLoading(false);
        }
      } catch (e) {
        console.error('Failed to poll order status:', e);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeTrackingToken]);

  if (!activeTrackingToken) return null;

  const copyOrderNumber = () => {
    if (order?.order_number) {
      const numStr = order.display_order_number || `#${String(order.order_number).padStart(3, '0')}`;
      navigator.clipboard.writeText(numStr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const statusSteps = [
    { key: 'placed', labelAr: 'تم استلام الطلب', labelEn: 'Order Received' },
    { key: 'preparing', labelAr: 'جاري الشواء والتحضير', labelEn: 'Grilling & Preparing' },
    { key: 'ready', labelAr: order?.order_type === 'delivery' ? 'مع المندوب في الطريق' : 'جاهز للاستلام من الفرع', labelEn: order?.order_type === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup' },
    { key: 'completed', labelAr: 'تم التسليم بالهناء والعافية', labelEn: 'Order Completed' },
  ];

  const getStepIndex = (status?: string) => {
    switch (status) {
      case 'placed':
      case 'confirmed':
        return 0;
      case 'preparing':
        return 1;
      case 'ready':
      case 'out_for_delivery':
        return 2;
      case 'completed':
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = getStepIndex(order?.order_status);
  const displayNum = order?.display_order_number || (order ? `#${String(order.order_number).padStart(3, '0')}` : '...');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        onClick={closeTracking}
        className="fixed inset-0 bg-ink/70 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-[#faf8f5] rounded-2xl shadow-2xl border border-border overflow-hidden z-10 my-8">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-6 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 opacity-10">
            <Flame className="w-36 h-36" />
          </div>

          <div className="flex items-start justify-between relative z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-white/80">
                <Flame className="h-4 w-4" />
                <span>{lang === 'ar' ? 'مطعم أنفاس التركي' : 'Anfas Turkish Grill'}</span>
              </div>
              <h2 className="text-2xl font-bold mt-1 text-white flex items-center gap-3">
                <span>{t('orderTracking')}</span>
                <span className="font-mono bg-white/20 px-2.5 py-0.5 rounded-full text-base font-bold">
                  {displayNum}
                </span>
              </h2>
            </div>
            <button
              onClick={closeTracking}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Order Header / Copy number & Payment Status */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border shadow-2xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{t('orderNumber')}</span>
                {order?.payment_status === 'paid' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{lang === 'ar' ? 'مدفوع ✓' : 'PAID ✓'}</span>
                  </span>
                )}
                {order?.payment_status !== 'paid' && (order?.payment_method === 'cash' || order?.payment_method === 'cash_on_pickup' || order?.payment_method === 'cash_on_delivery') && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    <span>
                      {order?.order_type === 'delivery'
                        ? lang === 'ar' ? 'الدفع عند التوصيل' : 'Cash on Delivery'
                        : lang === 'ar' ? 'الدفع عند الاستلام' : 'Pay on Pickup'}
                    </span>
                  </span>
                )}
                {order?.payment_status === 'pending' && order?.payment_method !== 'cash' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    <span>{lang === 'ar' ? 'بانتظار الدفع' : 'Payment Pending'}</span>
                  </span>
                )}
                {order?.payment_status === 'failed' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                    <span>{lang === 'ar' ? 'فشل الدفع' : 'Payment Failed'}</span>
                  </span>
                )}
              </div>
              <div className="text-xl font-bold font-mono text-ink mt-0.5">{displayNum}</div>
            </div>
            <button
              onClick={copyOrderNumber}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-cream hover:bg-cream/80 text-xs font-semibold text-ink transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-600" />
                  <span>{lang === 'ar' ? 'تم النسخ' : 'Copied'}</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{lang === 'ar' ? 'نسخ الرقم' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>

          {/* Stepper Status Bar */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-ink uppercase tracking-wider">
              {t('orderStatus')}
            </div>
            <div className="space-y-4">
              {statusSteps.map((step, idx) => {
                const isPassed = idx < currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div key={step.key} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full grid place-items-center text-xs font-bold transition-all ${
                          isPassed
                            ? 'bg-green-600 text-white shadow-2xs'
                            : isCurrent
                              ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 animate-pulse'
                              : 'bg-cream border border-border text-muted-foreground'
                        }`}
                      >
                        {isPassed ? (
                          <Check className="h-4 w-4" />
                        ) : isCurrent ? (
                          <Flame className="h-3.5 w-3.5" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>
                      {idx < statusSteps.length - 1 && (
                        <div
                          className={`w-0.5 h-6 my-1 ${
                            isPassed ? 'bg-green-600' : 'bg-border'
                          }`}
                        />
                      )}
                    </div>

                    <div className="pt-0.5">
                      <div
                        className={`text-xs font-bold ${
                          isCurrent ? 'text-primary' : isPassed ? 'text-ink' : 'text-muted-foreground'
                        }`}
                      >
                        {lang === 'ar' ? step.labelAr : step.labelEn}
                      </div>
                      {isCurrent && (
                        <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Clock className="h-3 w-3 text-primary animate-spin" />
                          <span>
                            {lang === 'ar'
                              ? 'يتم التحديث المباشر من مطبخ أنفاس...'
                              : 'Live updates from Anfas kitchen...'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Branch & Delivery Info */}
          <div className="p-4 rounded-xl bg-cream border border-border space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <Store className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-ink">
                  {order?.branch_name || (lang === 'ar' ? 'فرع السلامة (صقر قريش)' : 'Al Salamah Branch')}
                </span>
                <p className="text-muted-foreground mt-0.5">{t('pickupBranchAddress')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-1 text-muted-foreground">
              <a
                href="tel:0534900038"
                className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
              >
                <Phone className="h-3 w-3" />
                <span>0534900038</span>
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=%D9%85%D8%B7%D8%B9%D9%85+%D8%A3%D9%86%D9%81%D8%A7%D8%B3+%D8%B5%D9%82%D8%B1+%D9%82%D8%B1%D9%8A%D8%B4+%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%D8%A9+%D8%AC%D8%AF%D8%A9"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
              >
                <MapPin className="h-3 w-3" />
                <span>{t('viewOnMap')}</span>
              </a>
            </div>
          </div>

          {/* Items Receipt */}
          {order?.items && order.items.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="text-xs font-bold text-ink uppercase tracking-wider">
                {lang === 'ar' ? 'تفاصيل الطلب والفاتورة' : 'Order Receipt'}
              </div>
              <div className="space-y-2 divide-y divide-border/60 text-xs">
                {order.items.map((item, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 flex justify-between">
                    <div>
                      <span className="font-semibold text-ink">
                        {item.quantity}x {item.product_name}
                      </span>
                      {item.modifiers && item.modifiers.length > 0 && (
                        <div className="text-[10px] text-muted-foreground">
                          {item.modifiers.map((m) => m.name).join('، ')}
                        </div>
                      )}
                    </div>
                    <span className="font-mono text-ink">
                      {item.item_total ? `${item.item_total.toFixed(2)} ${t('sar')}` : ''}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-3 space-y-1 text-xs border-t border-border">
                <div className="flex justify-between text-muted-foreground">
                  <span>{t('subtotal')}</span>
                  <span className="font-mono">{order.subtotal?.toFixed(2)} {t('sar')}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{t('tax')}</span>
                  <span className="font-mono">{order.tax_amount?.toFixed(2)} {t('sar')}</span>
                </div>
                {order.delivery_fee > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t('deliveryFee')}</span>
                    <span className="font-mono">{order.delivery_fee?.toFixed(2)} {t('sar')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-ink pt-1.5 border-t border-border">
                  <span>{t('total')}</span>
                  <span className="font-mono text-primary">
                    {order.total_amount?.toFixed(2)} {t('sar')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-card flex justify-end">
          <button
            onClick={closeTracking}
            className="px-6 py-2.5 rounded-full bg-cream hover:bg-border text-foreground font-bold text-xs transition-colors"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}
