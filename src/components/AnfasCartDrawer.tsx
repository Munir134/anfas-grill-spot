import React, { useState, useEffect } from 'react';
import { useCart } from '../lib/CartContext';
import { useLanguage } from '../lib/LanguageContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Bike,
  Store,
  MapPin,
  Flame,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  Banknote,
} from 'lucide-react';

const ANFAS_WHATSAPP_PHONE = '966534900038';

export default function AnfasCartDrawer() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    isCartOpen,
    closeCart,
  } = useCart();
  const { t, lang } = useLanguage();

  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  // Handle ESC key to close
  useEffect(() => {
    if (!isCartOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prev;
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  // Local calculation of accurate item totals
  const subtotal = items.reduce((sum, item) => {
    const modTotal = item.selectedOptions.reduce((mSum, opt) => mSum + opt.price, 0);
    return sum + (item.unitPrice + modTotal) * item.quantity;
  }, 0);

  const deliveryFee = orderType === 'delivery' ? 15 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckoutWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (items.length === 0) return;

    if (!customerName.trim()) {
      setErrorMsg(lang === 'ar' ? 'يرجى إدخال اسمك الكريم' : 'Please enter your name');
      return;
    }

    const cleanPhone = customerPhone.replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      setErrorMsg(
        lang === 'ar'
          ? 'يرجى إدخال رقم جوال صحيح (مثال: 0534900038)'
          : 'Please enter a valid phone number'
      );
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setErrorMsg(
        lang === 'ar'
          ? 'يرجى كتابة عنوان التوصيل بالتفصيل'
          : 'Please provide delivery address'
      );
      return;
    }

    // Build human-friendly WhatsApp message
    const orderTypeText =
      orderType === 'delivery'
        ? lang === 'ar'
          ? 'توصيل لباب البيت 🛵'
          : 'Delivery to Door 🛵'
        : lang === 'ar'
          ? 'استلام من الفرع (حي السلامة) 🏪'
          : 'Pickup from Al Salamah Branch 🏪';

    let message = '';
    if (lang === 'ar') {
      message += `*طلب جديد من مطعم أنفاس للمشويات التركية* 🔥\n`;
      message += `━━━━━━━━━━━━━━━━━━━━\n`;
      message += `📍 *نوع الطلب:* ${orderTypeText}\n`;
      message += `👤 *الاسم:* ${customerName.trim()}\n`;
      message += `📱 *الجوال:* ${cleanPhone}\n`;
      if (orderType === 'delivery') {
        message += `🏠 *العنوان:* ${deliveryAddress.trim()}\n`;
      }
      if (orderNotes.trim()) {
        message += `📝 *ملاحظات:* ${orderNotes.trim()}\n`;
      }
      message += `━━━━━━━━━━━━━━━━━━━━\n`;
      message += `📋 *الأصناف المطلوبة:*\n`;

      items.forEach((item, index) => {
        const modTotal = item.selectedOptions.reduce((s, o) => s + o.price, 0);
        const itemLinePrice = (item.unitPrice + modTotal) * item.quantity;
        message += `${index + 1}. *${item.name}* × ${item.quantity} (${itemLinePrice} ر.س)\n`;
        if (item.selectedOptions && item.selectedOptions.length > 0) {
          item.selectedOptions.forEach((opt) => {
            message += `   • ${opt.optionName}${opt.price > 0 ? ` (+${opt.price} ر.س)` : ''}\n`;
          });
        }
        if (item.specialInstructions) {
          message += `   • ملاحظة الصنف: ${item.specialInstructions}\n`;
        }
      });

      message += `━━━━━━━━━━━━━━━━━━━━\n`;
      message += `💰 *الحساب:*\n`;
      message += `• المجموع الفرعي: ${subtotal.toFixed(2)} ر.س\n`;
      if (orderType === 'delivery') {
        message += `• رسوم التوصيل: ${deliveryFee.toFixed(2)} ر.س\n`;
      }
      message += `*• الإجمالي الكلي: ${total.toFixed(2)} ر.س*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━\n`;
      message += `طريقة الدفع: الدفع عند الاستلام (كاش / شبكة مدى) 💳\n`;
    } else {
      message += `*New Order from Anfas Turkish Grill* 🔥\n`;
      message += `━━━━━━━━━━━━━━━━━━━━\n`;
      message += `📍 *Order Type:* ${orderTypeText}\n`;
      message += `👤 *Name:* ${customerName.trim()}\n`;
      message += `📱 *Phone:* ${cleanPhone}\n`;
      if (orderType === 'delivery') {
        message += `🏠 *Address:* ${deliveryAddress.trim()}\n`;
      }
      if (orderNotes.trim()) {
        message += `📝 *Notes:* ${orderNotes.trim()}\n`;
      }
      message += `━━━━━━━━━━━━━━━━━━━━\n`;
      message += `📋 *Items:*\n`;

      items.forEach((item, index) => {
        const modTotal = item.selectedOptions.reduce((s, o) => s + o.price, 0);
        const itemLinePrice = (item.unitPrice + modTotal) * item.quantity;
        message += `${index + 1}. *${item.nameEn || item.name}* x ${item.quantity} (${itemLinePrice} SAR)\n`;
        if (item.selectedOptions && item.selectedOptions.length > 0) {
          item.selectedOptions.forEach((opt) => {
            message += `   • ${opt.optionName}${opt.price > 0 ? ` (+${opt.price} SAR)` : ''}\n`;
          });
        }
        if (item.specialInstructions) {
          message += `   • Note: ${item.specialInstructions}\n`;
        }
      });

      message += `━━━━━━━━━━━━━━━━━━━━\n`;
      message += `💰 *Summary:*\n`;
      message += `• Subtotal: ${subtotal.toFixed(2)} SAR\n`;
      if (orderType === 'delivery') {
        message += `• Delivery Fee: ${deliveryFee.toFixed(2)} SAR\n`;
      }
      message += `*• Total: ${total.toFixed(2)} SAR*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━\n`;
      message += `Payment: Pay on Delivery / Pickup (Cash / Card) 💳\n`;
    }

    const whatsappUrl = `https://wa.me/${ANFAS_WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    setIsSent(true);
    setTimeout(() => {
      clearCart();
      setIsSent(false);
      closeCart();
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Slide-out drawer */}
      <div className="fixed inset-y-0 max-w-full flex ltr:right-0 rtl:left-0 pl-10">
        <div className="w-screen max-w-md bg-background text-foreground shadow-2xl flex flex-col border-s border-border">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-card sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-xs">
                <ShoppingBag className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <span>{t('cart')}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-bold">
                    {items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                </h2>
                <p className="text-xs text-muted-foreground">
                  {lang === 'ar' ? 'مطعم أنفاس للمشويات التركية' : 'Anfas Turkish Grill'}
                </p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-cream transition-colors cursor-pointer"
              aria-label={t('close')}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {isSent ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mx-auto grid place-items-center">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-xl font-bold text-ink">
                  {lang === 'ar' ? 'جارٍ تحويلك إلى واتساب...' : 'Redirecting to WhatsApp...'}
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  {lang === 'ar'
                    ? 'تم تجهيز طلبك بكل تفاصيله لإرساله فوراً إلى طاقم مطعم أنفاس.'
                    : 'Your order details have been prepared and sent directly to Anfas Grill.'}
                </p>
              </div>
            ) : items.length === 0 ? (
              <div className="py-16 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-cream mx-auto grid place-items-center text-muted-foreground">
                  <Flame className="w-8 h-8 text-primary/50" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-ink">{t('emptyCart')}</h3>
                  <p className="mt-1 text-sm text-muted-foreground max-w-xs mx-auto">
                    {t('emptyCartDesc')}
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2.5 max-w-xs mx-auto">
                  <a
                    href={`https://wa.me/${ANFAS_WHATSAPP_PHONE}?text=${encodeURIComponent(
                      lang === 'ar'
                        ? 'مرحباً، أرغب بالطلب من مطعم أنفاس.'
                        : 'Hello, I would like to order from Anfas Grill.'
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'الطلب عبر واتساب مباشرة' : 'Order directly via WhatsApp'}</span>
                  </a>

                  <button
                    onClick={closeCart}
                    className="py-2.5 px-4 rounded-xl border border-border bg-card hover:bg-cream text-xs font-semibold text-ink transition-colors cursor-pointer"
                  >
                    {lang === 'ar' ? 'تصفح قائمة الطعام' : 'Browse Menu'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Order Type Toggle */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-cream rounded-xl border border-border">
                  <button
                    type="button"
                    onClick={() => setOrderType('pickup')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      orderType === 'pickup'
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-ink'
                    }`}
                  >
                    <Store className="h-4 w-4" />
                    <span>{t('pickup')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      orderType === 'delivery'
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-ink'
                    }`}
                  >
                    <Bike className="h-4 w-4" />
                    <span>{t('delivery')}</span>
                  </button>
                </div>

                {orderType === 'pickup' && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-ink">
                        {lang === 'ar' ? 'فرع السلامة (صقر قريش)' : 'Al Salamah Branch (Saqr Quraish)'}
                      </div>
                      <div className="text-muted-foreground mt-0.5">
                        {t('pickupBranchAddress')}
                      </div>
                    </div>
                  </div>
                )}

                {/* Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                    <span>{lang === 'ar' ? 'الأطباق المختارة' : 'Selected Dishes'}</span>
                    <button
                      onClick={clearCart}
                      className="text-primary hover:underline cursor-pointer"
                    >
                      {lang === 'ar' ? 'مسح الكل' : 'Clear All'}
                    </button>
                  </div>

                  <div className="space-y-3 divide-y divide-border/60">
                    {items.map((item) => {
                      const modTotal = item.selectedOptions.reduce(
                        (sum, opt) => sum + opt.price,
                        0
                      );
                      const itemTotal = (item.unitPrice + modTotal) * item.quantity;

                      return (
                        <div key={item.cartItemId} className="pt-3 first:pt-0 flex gap-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-xl border border-border shrink-0 bg-cream"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-bold text-sm text-ink truncate">
                                {item.name}
                              </h4>
                              <span className="font-bold text-sm text-primary shrink-0 font-mono">
                                {itemTotal.toFixed(2)} {t('sar')}
                              </span>
                            </div>

                            {/* Options tags */}
                            {item.selectedOptions.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.selectedOptions.map((opt) => (
                                  <span
                                    key={opt.optionId}
                                    className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded bg-cream border border-border text-muted-foreground"
                                  >
                                    {opt.optionName}
                                    {opt.price > 0 && ` (+${opt.price} ${t('sar')})`}
                                  </span>
                                ))}
                              </div>
                            )}

                            {item.specialInstructions && (
                              <div className="text-[11px] text-muted-foreground italic mt-1">
                                "{item.specialInstructions}"
                              </div>
                            )}

                            {/* Stepper */}
                            <div className="flex items-center justify-between mt-2.5">
                              <div className="inline-flex items-center border border-border rounded-lg bg-card shadow-2xs">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.cartItemId, -1)}
                                  className="p-1 hover:bg-cream text-muted-foreground hover:text-foreground rounded-s-lg transition-colors cursor-pointer"
                                  aria-label="Decrease"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="px-3 text-xs font-bold font-mono text-foreground">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.cartItemId, 1)}
                                  className="p-1 hover:bg-cream text-muted-foreground hover:text-foreground rounded-e-lg transition-colors cursor-pointer"
                                  aria-label="Increase"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeItem(item.cartItemId)}
                                className="p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Customer Details Form */}
                <form id="anfas-whatsapp-checkout-form" onSubmit={handleCheckoutWhatsApp} className="space-y-3 pt-2">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {t('customerInfo')}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      {t('customerName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={lang === 'ar' ? 'مثال: محمد العمري' : 'e.g. Mohammed Al-Amri'}
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      {t('customerPhone')} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="0534900038"
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    />
                  </div>

                  {orderType === 'delivery' && (
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        {t('deliveryAddress')} *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder={
                          lang === 'ar'
                            ? 'حي السلامة، شارع صقر قريش، عمارة 12'
                            : 'Al Salamah, Saqr Quraish St, Bldg 12'
                        }
                        className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      {t('orderNotes')}
                    </label>
                    <input
                      type="text"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder={t('specialInstructionsPlaceholder')}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  {/* Payment notice badge */}
                  <div className="pt-2">
                    <div className="p-3 rounded-xl bg-cream border border-border text-xs flex items-center gap-2.5 text-muted-foreground">
                      <Banknote className="w-4 h-4 shrink-0 text-primary" />
                      <span>
                        {lang === 'ar'
                          ? 'الدفع عند الاستلام (كاش أو بطاقة مدى)'
                          : 'Payment upon delivery/pickup (Cash or Mada card)'}
                      </span>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Footer with Price Summary & WhatsApp CTA */}
          {items.length > 0 && !isSent && (
            <div className="border-t border-border bg-card p-6 space-y-4">
              {errorMsg && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Price summary */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>{t('subtotal')}</span>
                  <span className="font-mono font-medium">
                    {subtotal.toFixed(2)} {t('sar')}
                  </span>
                </div>

                {orderType === 'delivery' && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t('deliveryFee')}</span>
                    <span className="font-mono font-medium">
                      {deliveryFee.toFixed(2)} {t('sar')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-bold text-ink pt-2 border-t border-border/80">
                  <span>{t('total')}</span>
                  <span className="font-mono text-primary text-base font-bold">
                    {total.toFixed(2)} {t('sar')}
                  </span>
                </div>
              </div>

              {/* WhatsApp CTA Button */}
              <button
                form="anfas-whatsapp-checkout-form"
                type="submit"
                disabled={items.length === 0}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <MessageCircle className="h-4.5 w-4.5 fill-white/20" />
                <span>
                  {lang === 'ar'
                    ? `إرسال الطلب عبر واتساب (${total.toFixed(2)} ريال)`
                    : `Send Order via WhatsApp (${total.toFixed(2)} SAR)`}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
