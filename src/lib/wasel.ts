/**
 * WASEL CONNECT API CLIENT FOR ANFAS TURKISH GRILL
 * 
 * Direct zero-trust connection to Wasel ordering backend.
 */

export const WASEL_API_BASE =
  typeof window !== 'undefined'
    ? (window as any).__WASEL_API_URL__ || 'http://localhost:3000'
    : 'http://localhost:3000';

export const RESTAURANT_SLUG = 'anfas';

export interface WaselCategory {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
}

export interface WaselModifierOption {
  id: string;
  name: string;
  price: number;
  is_available: boolean;
}

export interface WaselModifierGroup {
  id: string;
  name: string;
  min_selections: number;
  max_selections: number;
  options: WaselModifierOption[];
}

export interface WaselProduct {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  base_price: number;
  image_url: string | null;
  is_available: boolean;
  preparation_time_minutes: number | null;
  calories: number | null;
  is_featured: boolean;
  modifier_groups: WaselModifierGroup[];
}

export interface WaselMenuResponse {
  restaurant: {
    id: string;
    name: string;
    slug: string;
    currency: string;
    is_open: boolean;
  };
  categories: WaselCategory[];
  products: WaselProduct[];
}

export interface WaselBranch {
  id: string;
  name: string;
  address_line: string;
  city: string;
  phone: string;
  latitude: number | null;
  longitude: number | null;
  pickup_enabled: boolean;
  delivery_enabled: boolean;
  is_active: boolean;
}

export interface CartItemOption {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface AnfasCartItem {
  cartItemId: string;
  productId: string;
  name: string;
  nameEn?: string;
  image: string;
  unitPrice: number;
  quantity: number;
  selectedOptions: CartItemOption[];
  specialInstructions?: string;
}

export interface CartValidationResult {
  valid: boolean;
  subtotal: number;
  tax_amount: number;
  delivery_fee: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  estimated_time_minutes: number;
  item_count: number;
  error?: string;
}

export interface PaymentMethodOption {
  id: string;
  type: 'online' | 'cash';
  sub_type: 'card' | 'apple_pay' | 'mada' | 'cash_on_pickup' | 'cash_on_delivery';
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  is_available: boolean;
}

export interface PaymentMethodsResponse {
  restaurant_id: string;
  restaurant_slug: string;
  is_configured: boolean;
  online_payment_enabled: boolean;
  cash_on_pickup_enabled: boolean;
  cash_on_delivery_enabled: boolean;
  provider: string | null;
  environment: 'test' | 'production';
  public_key: string | null;
  available_methods: PaymentMethodOption[];
}

export interface CheckoutPayload {
  restaurant_slug: string;
  branch_id?: string;
  order_type: 'pickup' | 'delivery';
  pickup_type?: 'counter' | 'drive_thru';
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  delivery_address?: {
    address_line: string;
    latitude: number;
    longitude: number;
    unit_number?: string;
    special_instructions?: string;
  };
  payment_method: 'online' | 'card' | 'apple_pay' | 'mada' | 'cash' | 'cash_on_pickup' | 'cash_on_delivery';
  items: Array<{
    product_id: string;
    quantity: number;
    modifier_option_ids?: string[];
    special_instructions?: string;
  }>;
  customer_notes?: string;
  idempotency_key: string;
}

export interface OrderCheckoutResult {
  order_id: string;
  order_number: string | number;
  display_order_number?: string;
  access_token: string;
  tracking_url: string;
  subtotal: number;
  tax_amount: number;
  delivery_fee: number;
  total_amount: number;
  currency: string;
  payment: {
    status: 'pending' | 'paid' | 'unpaid' | 'failed' | 'cancelled';
    payment_method: string;
    transaction_id?: string;
    payment_id?: string;
    payment_url?: string;
    redirect_url?: string;
    client_secret?: string;
  };
  payment_status?: string;
  order_status?: string;
  estimated_ready_time_minutes?: number;
  estimated_ready_time?: string;
}

export interface PaymentVerificationPayload {
  transaction_id?: string;
  order_id?: string;
  access_token?: string;
  outcome?: 'success' | 'failure' | 'cancelled';
  card_brand?: string;
  card_last_four?: string;
  payment_method?: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  status: 'paid' | 'failed' | 'cancelled' | 'pending';
  order_id?: string;
  order_number?: number;
  display_order_number?: string;
  access_token?: string;
  tracking_url?: string;
  total_amount?: number;
  card_brand?: string;
  card_last_four?: string;
  message?: string;
  error?: string;
}

export interface OrderTrackingData {
  order_id: string;
  order_number: string;
  display_order_number?: string;
  restaurant_name: string;
  branch_name: string;
  order_type: 'pickup' | 'delivery';
  pickup_type?: string;
  order_status: 'placed' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';
  payment_status: 'paid' | 'pending' | 'failed' | 'unpaid' | 'cancelled' | 'refunded';
  payment_method: 'online' | 'cash' | 'mada' | 'apple_pay' | 'credit_card' | 'card' | 'cash_on_pickup' | 'cash_on_delivery';
  subtotal: number;
  tax_amount: number;
  delivery_fee: number;
  total_amount: number;
  currency: string;
  customer_name: string;
  customer_phone: string;
  delivery_address?: {
    address_line: string;
  };
  items: Array<{
    product_name: string;
    quantity: number;
    item_total: number;
    special_instructions?: string;
    modifiers?: Array<{
      name: string;
      price: number;
    }>;
  }>;
  created_at: string;
  estimated_ready_at?: string;
}

export const waselClient = {
  /**
   * Fetch live menu & products for Anfas
   */
  async getMenu(): Promise<WaselMenuResponse> {
    const res = await fetch(`${WASEL_API_BASE}/api/v1/restaurants/${RESTAURANT_SLUG}/menu`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Failed to load Anfas menu from Wasel (HTTP ${res.status})`);
    }
    return res.json();
  },

  /**
   * Fetch active branches for Anfas
   */
  async getBranches(): Promise<WaselBranch[]> {
    const res = await fetch(`${WASEL_API_BASE}/api/v1/restaurants/${RESTAURANT_SLUG}/branches`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Failed to load branches from Wasel (HTTP ${res.status})`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : data.branches || [];
  },

  /**
   * Fetch active payment channels & merchant gateway configuration for Anfas
   */
  async getPaymentMethods(): Promise<PaymentMethodsResponse> {
    const res = await fetch(
      `${WASEL_API_BASE}/api/v1/restaurants/${RESTAURANT_SLUG}/payment-methods`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to load payment methods from Wasel (HTTP ${res.status})`);
    }
    return res.json();
  },

  /**
   * Server-side zero-trust cart validation & 15% VAT calculation
   */
  async validateCart(
    items: AnfasCartItem[],
    orderType: 'pickup' | 'delivery' = 'pickup',
    branchId?: string,
    lat?: number,
    lng?: number
  ): Promise<CartValidationResult> {
    const payloadItems = items.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
      modifier_option_ids: item.selectedOptions.map((o) => o.optionId),
      special_instructions: item.specialInstructions,
    }));

    const res = await fetch(`${WASEL_API_BASE}/api/v1/cart/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurant_slug: RESTAURANT_SLUG,
        branch_id: branchId,
        order_type: orderType,
        delivery_location: lat && lng ? { latitude: lat, longitude: lng } : undefined,
        items: payloadItems,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Cart validation failed (HTTP ${res.status})`);
    }

    return res.json();
  },

  /**
   * Place an order with Wasel checkout engine
   */
  async checkout(payload: CheckoutPayload): Promise<OrderCheckoutResult> {
    const res = await fetch(`${WASEL_API_BASE}/api/v1/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Checkout failed (HTTP ${res.status})`);
    }

    return res.json();
  },

  /**
   * Cryptographically verify and confirm payment with Wasel
   */
  async verifyPayment(payload: PaymentVerificationPayload): Promise<PaymentVerificationResult> {
    const res = await fetch(`${WASEL_API_BASE}/api/v1/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok && !data.error) {
      throw new Error(`Payment verification failed (HTTP ${res.status})`);
    }
    return data;
  },

  /**
   * Poll order tracking state by access token
   */
  async getOrderTracking(token: string): Promise<OrderTrackingData> {
    const res = await fetch(`${WASEL_API_BASE}/api/v1/orders/${token}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Order tracking unavailable (HTTP ${res.status})`);
    }

    return res.json();
  },

  /**
   * Fetch connected restaurant website theme configuration
   */
  async getRestaurantTheme(slug: string = RESTAURANT_SLUG): Promise<{
    mode: 'light' | 'dark';
    primary_color: string;
    background_color: string;
    surface_color: string;
    text_color: string;
    muted_text_color: string;
    border_color: string;
    button_color: string;
  }> {
    try {
      const res = await fetch(`${WASEL_API_BASE}/api/v1/restaurants/${slug}/theme`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Theme endpoint unavailable');
      const data = await res.json();
      return data.theme;
    } catch {
      // Default to authentic Anfas Brand Red palette
      return {
        mode: 'light',
        primary_color: '#c8102e',
        background_color: '#ffffff',
        surface_color: '#f7f2ee',
        text_color: '#1a1a1a',
        muted_text_color: '#71717a',
        border_color: '#e4e4e7',
        button_color: '#c8102e',
      };
    }
  },
};

export const WaselClient = waselClient;

