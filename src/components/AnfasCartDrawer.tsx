import React, { useState, useEffect } from 'react';
import { useCart } from '../lib/CartContext';
import { useLanguage } from '../lib/LanguageContext';
import {
  waselClient,
  CartValidationResult,
  CheckoutPayload,
  PaymentMethodsResponse,
  PaymentMethodOption,
  OrderCheckoutResult,
} from '../lib/wasel';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Bike,
  Store,
  CreditCard,
  Banknote,
  Loader2,
  AlertCircle,
  MapPin,
  Flame,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Lock,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

export default function AnfasCartDrawer() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    isCartOpen,
    closeCart,
    openTracking,
  } = useCart();
  const { t, lang } = useLanguage();

  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Payment configuration & methods state
  const [paymentMethodsConfig, setPaymentMethodsConfig] = useState<PaymentMethodsResponse | null>(null);
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(false);
  const [selectedMethodId, setSelectedMethodId] = useState<string>('card');

  // Online Payment Interface Modal State
  const [activePaymentOrder, setActivePaymentOrder] = useState<OrderCheckoutResult | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Card form fields for online payments
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState<CartValidationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch live payment methods from Wasel
  useEffect(() => {
    if (!isCartOpen) return;
    let isMounted = true;
    setIsLoadingPaymentMethods(true);

    waselClient
      .getPaymentMethods()
      .then((res) => {
        if (isMounted) {
          setPaymentMethodsConfig(res);
          setIsLoadingPaymentMethods(false);

          // Select sensible default payment method
          if (res.online_payment_enabled) {
            setSelectedMethodId('card');
          } else if (orderType === 'pickup' && res.cash_on_pickup_enabled) {
            setSelectedMethodId('cash_on_pickup');
          } else if (orderType === 'delivery' && res.cash_on_delivery_enabled) {
            setSelectedMethodId('cash_on_delivery');
          } else if (res.available_methods.length > 0) {
            setSelectedMethodId(res.available_methods[0].id);
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to fetch payment methods:', err);
          setIsLoadingPaymentMethods(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isCartOpen, orderType]);

  // Validate cart with server whenever items or orderType change
  useEffect(() => {
    if (!isCartOpen || items.length === 0) {
      setValidation(null);
      return;
    }

    let active = true;
    setIsValidating(true);
    setErrorMsg(null);

    waselClient
      .validateCart(items, orderType)
      .then((res) => {
        if (active) {
          setValidation(res);
          setIsValidating(false);
        }
      })
      .catch((err) => {
        if (active) {
          setErrorMsg(err.message || 'Validation error');
          setIsValidating(false);
        }
      });

    return () => {
      active = false;
    };
  }, [items, orderType, isCartOpen]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isCartOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activePaymentOrder) {
          handleCancelPayment();
        } else {
          closeCart();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prev;
    };
  }, [isCartOpen, closeCart, activePaymentOrder]);

  // Format credit card number with spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format expiry date MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardExpiry(raw);
  };

  // Auto fill test card helpers
  const fillTestCard = (type: 'mada' | 'visa' | 'mastercard') => {
    if (type === 'mada') {
      setCardNumber('5888 4500 0000 4821');
      setCardHolder('محمد العمري (MADA TEST)');
      setCardExpiry('12/28');
      setCardCvv('123');
    } else if (type === 'visa') {
      setCardNumber('4000 0000 0000 0002');
      setCardHolder('Anfas Test User');
      setCardExpiry('08/29');
      setCardCvv('456');
    } else {
      setCardNumber('5105 1051 0510 5100');
      setCardHolder('Anfas Test User');
      setCardExpiry('10/27');
      setCardCvv('789');
    }
    setPaymentError(null);
  };

  const handleCheckout = async (e: React.FormEvent) => {
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
          ? 'يرجى إدخال رقم جوال سعودي صحيح (مثال: 0534900038)'
          : 'Please enter a valid Saudi phone number'
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

    setIsSubmitting(true);

    try {
      const isOnline = ['card', 'apple_pay', 'mada', 'online'].includes(selectedMethodId);

      const payload: CheckoutPayload = {
        restaurant_slug: 'anfas',
        order_type: orderType,
        pickup_type: orderType === 'pickup' ? 'counter' : undefined,
        customer: {
          name: customerName.trim(),
          phone: cleanPhone,
        },
        delivery_address:
          orderType === 'delivery'
            ? {
                address_line: deliveryAddress.trim(),
                latitude: 21.5833,
                longitude: 39.1558,
              }
            : undefined,
        payment_method: isOnline ? 'online' : (selectedMethodId as any),
        customer_notes: orderNotes.trim() || undefined,
        items: items.map((i) => ({
          product_id: i.productId,
          quantity: i.quantity,
          modifier_option_ids: i.selectedOptions.map((o) => o.optionId),
          special_instructions: i.specialInstructions,
        })),
        idempotency_key: `anfas_ord_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      };

      const result = await waselClient.checkout(payload);

      if (isOnline) {
        // Online payment flow: Open payment sheet interface for card or Apple Pay
        setActivePaymentOrder(result);
        setPaymentError(null);
        setPaymentSuccess(false);

        // Pre-fill card holder if empty
        if (!cardHolder) {
          setCardHolder(customerName.trim());
        }
      } else {
        // Cash payment flow: Directly confirmed as unpaid, open tracker
        clearCart();
        closeCart();
        openTracking(result.access_token);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Process Online Payment Verification
  const handleProcessPayment = async (simulatedOutcome: 'success' | 'failure' = 'success') => {
    if (!activePaymentOrder) return;
    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      const isApplePay = selectedMethodId === 'apple_pay';
      let cardBrand = isApplePay ? 'Apple Pay' : 'Mada';
      if (!isApplePay && cardNumber.startsWith('4')) cardBrand = 'Visa';
      if (!isApplePay && cardNumber.startsWith('5')) cardBrand = 'Mastercard';

      const lastFour = isApplePay ? '4821' : cardNumber.replace(/\D/g, '').slice(-4) || '4821';

      const verification = await waselClient.verifyPayment({
        transaction_id: activePaymentOrder.payment?.transaction_id,
        order_id: activePaymentOrder.order_id,
        access_token: activePaymentOrder.access_token,
        outcome: simulatedOutcome,
        card_brand: cardBrand,
        card_last_four: lastFour,
        payment_method: isApplePay ? 'apple_pay' : 'card',
      });

      if (!verification.success) {
        setPaymentError(
          verification.error ||
            (lang === 'ar'
              ? 'تم رفض عملية الدفع من البنك. يرجى تجربة بطاقة أخرى.'
              : 'Payment was declined by the gateway. Please try another card.')
        );
        setIsProcessingPayment(false);
        return;
      }

      // Payment successful!
      setPaymentSuccess(true);
      setTimeout(() => {
        clearCart();
        setActivePaymentOrder(null);
        closeCart();
        openTracking(activePaymentOrder.access_token);
      }, 1400);
    } catch (err: any) {
      setPaymentError(err.message || 'Payment verification failed');
      setIsProcessingPayment(false);
    }
  };

  const handleCancelPayment = async () => {
    if (activePaymentOrder) {
      try {
        await waselClient.verifyPayment({
          transaction_id: activePaymentOrder.payment?.transaction_id,
          order_id: activePaymentOrder.order_id,
          access_token: activePaymentOrder.access_token,
          outcome: 'cancelled',
        });
      } catch {}
    }
    setActivePaymentOrder(null);
    setPaymentError(null);
    setIsProcessingPayment(false);
  };

  if (!isCartOpen) return null;

  // Filter available payment methods for the active order type
  const availableMethods = (paymentMethodsConfig?.available_methods || []).filter((m) => {
    if (m.type === 'online') return true;
    if (orderType === 'pickup' && m.sub_type === 'cash_on_pickup') return true;
    if (orderType === 'delivery' && m.sub_type === 'cash_on_delivery') return true;
    return false;
  });

  // Calculate instant accurate local price summary
  const localSubtotal = items.reduce((sum, item) => {
    const modTotal = item.selectedOptions.reduce((mSum, opt) => mSum + opt.price, 0);
    return sum + (item.unitPrice + modTotal) * item.quantity;
  }, 0);

  const localDeliveryFee = orderType === 'delivery' ? 15 : 0;
  const localTax = Math.round(localSubtotal * 0.15 * 100) / 100;

  const subtotalAmount = validation?.subtotal !== undefined && validation.subtotal > 0
    ? validation.subtotal
    : localSubtotal;

  const taxAmount = validation?.tax_amount !== undefined && validation.tax_amount > 0
    ? validation.tax_amount
    : localTax;

  const deliveryFeeAmount = validation?.delivery_fee !== undefined
    ? validation.delivery_fee
    : localDeliveryFee;

  const totalAmount = validation?.total_amount !== undefined && validation.total_amount > 0
    ? validation.total_amount
    : (subtotalAmount + taxAmount + (orderType === 'delivery' ? deliveryFeeAmount : 0));

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        onClick={() => {
          if (!activePaymentOrder) closeCart();
        }}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
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
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-cream mx-auto grid place-items-center text-muted-foreground">
                  <Flame className="w-8 h-8 text-primary/40" />
                </div>
                <h3 className="text-lg font-bold text-ink">{t('emptyCart')}</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  {t('emptyCartDesc')}
                </p>
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
                <form id="anfas-checkout-form" onSubmit={handleCheckout} className="space-y-3 pt-2">
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
                            ? 'حي السلامة، شارع صقر قريش، عمارة 12، شقة 4'
                            : 'Al Salamah, Saqr Quraish St, Bldg 12, Apt 4'
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

                  {/* Payment Method Selector (Dynamically Loaded from Wasel) */}
                  <div className="pt-3 border-t border-border/80">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                        {lang === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
                      </label>
                      {paymentMethodsConfig?.environment === 'test' && (
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-400 border border-amber-300 dark:border-amber-800 rounded font-bold">
                          🧪 Sandbox Mode
                        </span>
                      )}
                    </div>

                    {isLoadingPaymentMethods ? (
                      <div className="p-4 rounded-xl bg-card border border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span>{lang === 'ar' ? 'جاري تحميل خيارات الدفع المتاحة...' : 'Loading payment methods...'}</span>
                      </div>
                    ) : availableMethods.length === 0 ? (
                      <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                        <span>
                          {lang === 'ar'
                            ? 'الدفع الإلكتروني غير متاح حالياً. يرجى التواصل مع المطعم.'
                            : 'Online payment is currently unavailable.'}
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {availableMethods.map((method) => {
                          const isSelected = selectedMethodId === method.id;
                          return (
                            <button
                              key={method.id}
                              type="button"
                              onClick={() => setSelectedMethodId(method.id)}
                              className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs transition-all text-start cursor-pointer ${
                                isSelected
                                  ? 'border-primary bg-primary/10 ring-1 ring-primary/30 shadow-2xs font-semibold'
                                  : 'border-border bg-card text-muted-foreground hover:border-gray-300 hover:text-foreground'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={`p-2 rounded-lg ${
                                    isSelected
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-cream text-muted-foreground'
                                  }`}
                                >
                                  {method.id === 'card' && <CreditCard className="w-4 h-4" />}
                                  {method.id === 'apple_pay' && <Smartphone className="w-4 h-4" />}
                                  {method.type === 'cash' && <Banknote className="w-4 h-4" />}
                                </span>
                                <div>
                                  <div className="font-bold text-foreground text-xs">
                                    {lang === 'ar' ? method.name_ar : method.name_en}
                                  </div>
                                  <div className="text-[10px] text-muted-foreground mt-0.5">
                                    {lang === 'ar' ? method.description_ar : method.description_en}
                                  </div>
                                </div>
                              </div>
                              <div
                                className={`w-4 h-4 rounded-full border grid place-items-center ${
                                  isSelected
                                    ? 'border-primary bg-primary text-white'
                                    : 'border-border bg-card'
                                }`}
                              >
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Footer with Price Summary & Submit CTA */}
          {items.length > 0 && (
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
                    {subtotalAmount.toFixed(2)} {t('sar')}
                  </span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>{t('tax')}</span>
                  <span className="font-mono font-medium">
                    {taxAmount.toFixed(2)} {t('sar')}
                  </span>
                </div>

                {orderType === 'delivery' && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t('deliveryFee')}</span>
                    <span className="font-mono font-medium">
                      {deliveryFeeAmount.toFixed(2)} {t('sar')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-bold text-ink pt-2 border-t border-border/80">
                  <span>{t('total')}</span>
                  <span className="font-mono text-primary text-base font-bold">
                    {totalAmount.toFixed(2)} {t('sar')}
                  </span>
                </div>
              </div>

              {/* Place Order / Pay CTA Button */}
              <button
                form="anfas-checkout-form"
                type="submit"
                disabled={isSubmitting || items.length === 0 || availableMethods.length === 0}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-full bg-primary hover:bg-brand-deep text-primary-foreground font-bold text-sm shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{lang === 'ar' ? 'جاري معالجة الطلب...' : 'Processing Order...'}</span>
                  </>
                ) : (
                  <>
                    {['card', 'apple_pay', 'mada', 'online'].includes(selectedMethodId) ? (
                      <>
                        <Lock className="h-4 w-4" />
                        <span>
                          {lang === 'ar'
                            ? `المتابعة للدفع (${totalAmount.toFixed(2)} ريال)`
                            : `Proceed to Pay (${totalAmount.toFixed(2)} SAR)`}
                        </span>
                      </>
                    ) : (
                      <>
                        <Flame className="h-4 w-4" />
                        <span>
                          {lang === 'ar'
                            ? `تأكيد الطلب (${totalAmount.toFixed(2)} ريال)`
                            : `Confirm Order (${totalAmount.toFixed(2)} SAR)`}
                        </span>
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Online Payment Interface Sheet / Modal */}
      {activePaymentOrder && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={handleCancelPayment}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          />

          <div className="relative w-full max-w-md bg-card text-foreground rounded-3xl shadow-2xl border border-border overflow-hidden z-10 animate-scaleUp my-8">
            {/* Header Banner */}
            <div className="bg-primary text-primary-foreground p-5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/10 grid place-items-center">
                    <Flame className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">
                      {lang === 'ar' ? 'بوابة الدفع الآمنة — مطعم أنفاس' : 'Secure Payment — Anfas Turkish Grill'}
                    </h3>
                    <p className="text-[11px] text-white/80 font-mono">
                      Order {activePaymentOrder.display_order_number || `#${activePaymentOrder.order_number}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCancelPayment}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {paymentSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto grid place-items-center animate-bounce">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground">
                    {lang === 'ar' ? 'تم الدفع بنجاح! ✓' : 'Payment Successful! ✓'}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {lang === 'ar'
                      ? 'تم تأكيد طلبك وإرساله إلى مطبخ أنفاس للتحضير'
                      : 'Your payment was verified. Kitchen is preparing your order.'}
                  </p>
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {activePaymentOrder.display_order_number || `#${activePaymentOrder.order_number}`} — PAID ✓
                  </div>
                </div>
              ) : (
                <>
                  {/* Amount Badge */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-cream border border-border">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {lang === 'ar' ? 'المبلغ المطلوب سداده:' : 'Amount to Pay:'}
                    </span>
                    <span className="text-lg font-bold font-mono text-primary">
                      {activePaymentOrder.total_amount.toFixed(2)} {activePaymentOrder.currency || 'SAR'}
                    </span>
                  </div>

                  {paymentError && (
                    <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">{lang === 'ar' ? 'فشلت العملية' : 'Transaction Failed'}: </span>
                        <span>{paymentError}</span>
                      </div>
                    </div>
                  )}

                  {/* Payment Details Input Form */}
                  {selectedMethodId === 'apple_pay' ? (
                    <div className="space-y-4 py-4 text-center">
                      <p className="text-xs text-muted-foreground">
                        {lang === 'ar'
                          ? 'اضغط على الزر أدناه لتأكيد الدفع عبر Apple Pay'
                          : 'Click below to authorize with Apple Pay'}
                      </p>

                      <button
                        type="button"
                        onClick={() => handleProcessPayment('success')}
                        disabled={isProcessingPayment}
                        className="w-full py-4 rounded-2xl bg-black hover:bg-neutral-900 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 cursor-pointer disabled:opacity-50"
                      >
                        {isProcessingPayment ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                            <span>{lang === 'ar' ? 'جاري التحقق...' : 'Authorizing Apple Pay...'}</span>
                          </>
                        ) : (
                          <>
                            <span className="text-base font-serif"></span>
                            <span>Pay with Apple Pay</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {/* Supported Card Badges */}
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{lang === 'ar' ? 'بيانات البطاقة البنكية' : 'Card Information'}</span>
                        <div className="flex items-center gap-1.5 font-bold text-foreground">
                          <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[10px]">
                            مدى mada
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[10px]">
                            Visa
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px]">
                            Mastercard
                          </span>
                        </div>
                      </div>

                      {/* Card Number */}
                      <div>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4000 0000 0000 0000"
                          maxLength={19}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono tracking-wider"
                        />
                      </div>

                      {/* Cardholder Name */}
                      <div>
                        <input
                          type="text"
                          required
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder={lang === 'ar' ? 'الاسم كما هو مطبوع على البطاقة' : 'Cardholder Name'}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>

                      {/* Expiry & CVV */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM / YY"
                          maxLength={5}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-center"
                        />
                        <input
                          type="password"
                          required
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.slice(0, 4))}
                          placeholder="CVV / CVC"
                          maxLength={4}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-center"
                        />
                      </div>

                      {/* Sandbox Quick Fill Helpers */}
                      {paymentMethodsConfig?.environment === 'test' && (
                        <div className="pt-2 border-t border-border/80 space-y-1.5">
                          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            🧪 {lang === 'ar' ? 'اختبار سريع (Sandbox)' : 'Quick Test Cards'}
                          </div>
                          <div className="grid grid-cols-3 gap-1.5">
                            <button
                              type="button"
                              onClick={() => fillTestCard('mada')}
                              className="py-1 px-1.5 rounded-lg bg-cream hover:bg-slate-800 border border-border text-[10px] font-bold text-foreground transition-colors cursor-pointer"
                            >
                              مدى Mada
                            </button>
                            <button
                              type="button"
                              onClick={() => fillTestCard('visa')}
                              className="py-1 px-1.5 rounded-lg bg-cream hover:bg-gray-200 border border-border text-[10px] font-bold text-ink transition-colors cursor-pointer"
                            >
                              Visa Card
                            </button>
                            <button
                              type="button"
                              onClick={() => handleProcessPayment('failure')}
                              className="py-1 px-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-[10px] font-bold text-red-800 transition-colors cursor-pointer"
                            >
                              Test Decline
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Submit Payment CTA */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => handleProcessPayment('success')}
                          disabled={isProcessingPayment || !cardNumber || !cardExpiry || !cardCvv}
                          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-primary hover:bg-brand-deep text-primary-foreground font-bold text-xs shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {isProcessingPayment ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>
                                {lang === 'ar'
                                  ? 'جاري التحقق من الدفع وتأكيد الطلب...'
                                  : 'Verifying payment with gateway...'}
                              </span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-4 h-4" />
                              <span>
                                {lang === 'ar'
                                  ? `ادفع الآن (${activePaymentOrder.total_amount.toFixed(2)} ريال)`
                                  : `Pay Now (${activePaymentOrder.total_amount.toFixed(2)} SAR)`}
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Cancel / Return Button */}
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={handleCancelPayment}
                      disabled={isProcessingPayment}
                      className="text-xs text-muted-foreground hover:text-ink font-semibold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {lang === 'ar' ? 'إلغاء والعودة إلى سلة المشتريات' : 'Cancel and return to cart'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
