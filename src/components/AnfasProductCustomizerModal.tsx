import React, { useState, useEffect } from 'react';
import { useCart } from '../lib/CartContext';
import { useLanguage } from '../lib/LanguageContext';
import { CartItemOption, WaselModifierOption } from '../lib/wasel';
import { X, Plus, Minus, Check, Flame } from 'lucide-react';

export default function AnfasProductCustomizerModal() {
  const { activeModalProduct, closeCustomizer, addItem } = useCart();
  const { t, lang } = useLanguage();

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<CartItemOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Reset modal state when product changes
  useEffect(() => {
    if (!activeModalProduct) {
      setQuantity(1);
      setSelectedOptions([]);
      setSpecialInstructions('');
      return;
    }

    setQuantity(1);
    setSpecialInstructions('');

    // Preselect defaults for required single-select groups
    const defaults: CartItemOption[] = [];
    if (activeModalProduct.modifier_groups) {
      for (const group of activeModalProduct.modifier_groups) {
        if (group.min_selections > 0 && group.options.length > 0) {
          const firstOpt = group.options[0];
          defaults.push({
            groupId: group.id,
            groupName: group.name,
            optionId: firstOpt.id,
            optionName: firstOpt.name,
            price: firstOpt.price,
          });
        }
      }
    }
    setSelectedOptions(defaults);
  }, [activeModalProduct]);

  if (!activeModalProduct) return null;

  const toggleOption = (
    group: { id: string; name: string; max_selections: number },
    option: WaselModifierOption
  ) => {
    setSelectedOptions((prev) => {
      const isSelected = prev.some((o) => o.optionId === option.id);

      if (isSelected) {
        return prev.filter((o) => o.optionId !== option.id);
      }

      // If single selection group (max = 1)
      if (group.max_selections === 1) {
        const withoutGroup = prev.filter((o) => o.groupId !== group.id);
        return [
          ...withoutGroup,
          {
            groupId: group.id,
            groupName: group.name,
            optionId: option.id,
            optionName: option.name,
            price: option.price,
          },
        ];
      }

      // If multi selection within limit
      const currentInGroup = prev.filter((o) => o.groupId === group.id);
      if (currentInGroup.length >= group.max_selections) {
        return prev;
      }

      return [
        ...prev,
        {
          groupId: group.id,
          groupName: group.name,
          optionId: option.id,
          optionName: option.name,
          price: option.price,
        },
      ];
    });
  };

  const optionTotal = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
  const finalUnitPrice = activeModalProduct.base_price + optionTotal;
  const totalPrice = finalUnitPrice * quantity;

  const handleAddToCart = () => {
    addItem({
      productId: activeModalProduct.id,
      name: activeModalProduct.name,
      image: activeModalProduct.image_url || '',
      unitPrice: activeModalProduct.base_price,
      quantity,
      selectedOptions,
      specialInstructions: specialInstructions.trim() || undefined,
    });
    closeCustomizer();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        onClick={closeCustomizer}
        className="fixed inset-0 bg-ink/70 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#faf8f5] rounded-2xl shadow-2xl border border-border overflow-hidden z-10 my-8">
        {/* Header with image */}
        {activeModalProduct.image_url ? (
          <div className="relative h-48 sm:h-56 bg-cream overflow-hidden">
            <img
              src={activeModalProduct.image_url}
              alt={activeModalProduct.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <button
              onClick={closeCustomizer}
              className="absolute top-4 ltr:right-4 rtl:left-4 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h3 className="text-xl font-bold text-white drop-shadow-sm">
                {activeModalProduct.name}
              </h3>
              <p className="text-xs text-white/80 line-clamp-2 mt-1 drop-shadow-xs">
                {activeModalProduct.description}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 border-b border-border flex items-center justify-between bg-card">
            <div>
              <h3 className="text-xl font-bold text-foreground">{activeModalProduct.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {activeModalProduct.description}
              </p>
            </div>
            <button
              onClick={closeCustomizer}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-cream transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Scrollable Modifier Groups */}
        <div className="p-6 space-y-6 max-h-[50vh] overflow-y-auto">
          {activeModalProduct.modifier_groups &&
            activeModalProduct.modifier_groups.map((group) => (
              <div key={group.id} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                    {group.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {group.max_selections === 1
                      ? lang === 'ar'
                        ? 'اختر خياراً واحداً'
                        : 'Choose 1'
                      : lang === 'ar'
                        ? `حتى ${group.max_selections} خيارات`
                        : `Up to ${group.max_selections}`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {group.options.map((opt) => {
                    const isSelected = selectedOptions.some((o) => o.optionId === opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleOption(group, opt)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all text-start cursor-pointer ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                            : 'border-border bg-card text-foreground hover:border-border/80'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className={`w-4 h-4 rounded-full border grid place-items-center shrink-0 transition-all ${
                              isSelected
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border bg-card'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5" />}
                          </span>
                          <span className="truncate">{opt.name}</span>
                        </div>
                        {opt.price > 0 ? (
                          <span className="font-mono text-muted-foreground shrink-0 ltr:ml-2 rtl:mr-2">
                            +{opt.price} {t('sar')}
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/60 shrink-0">
                            {lang === 'ar' ? 'مجاناً' : 'Free'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

          {/* Special Instructions */}
          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-bold text-foreground">
              {t('orderNotes')}
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder={t('specialInstructionsPlaceholder')}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-card flex items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="inline-flex items-center border border-border rounded-full bg-cream/60 shadow-2xs p-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-full bg-card hover:bg-cream grid place-items-center text-foreground transition-colors shadow-2xs"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="px-3 text-sm font-bold font-mono text-foreground">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-full bg-card hover:bg-cream grid place-items-center text-foreground transition-colors shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-primary hover:bg-brand-deep text-primary-foreground font-bold text-sm shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <Flame className="h-4 w-4" />
            <span>{t('addToCart')}</span>
            <span className="font-mono opacity-90 ltr:ml-1 rtl:mr-1">
              • {totalPrice.toFixed(2)} {t('sar')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
