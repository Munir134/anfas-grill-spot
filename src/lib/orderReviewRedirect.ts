import { useEffect } from 'react';

export const ANFAS_REVIEW_URL = 'https://taqyeemi.pages.dev/?c=Anfas';
export const POST_ORDER_REVIEW_KEY = 'anfas_post_order_review_pending';
export const REVIEW_REDIRECTED_KEY = 'anfas_review_redirected_session';

/**
 * Marks that a client has finished and sent an order to WhatsApp.
 * Stored in both localStorage and sessionStorage for cross-tab and reload resilience.
 */
export function markOrderSentForReview() {
  if (typeof window === 'undefined') return;
  const now = Date.now();
  try {
    localStorage.setItem(POST_ORDER_REVIEW_KEY, String(now));
    sessionStorage.setItem(POST_ORDER_REVIEW_KEY, String(now));
    sessionStorage.removeItem(REVIEW_REDIRECTED_KEY);
  } catch (err) {
    console.error('Failed to store order review state:', err);
  }
}

/**
 * Checks if the customer has an active pending review after ordering,
 * and if so, teleports them to Taqyeemi (Google Reviews) and clears the state.
 */
export function checkAndTeleportToReview(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    // Prevent redirect loops if already teleported in this session
    if (sessionStorage.getItem(REVIEW_REDIRECTED_KEY)) {
      return false;
    }

    const stored =
      localStorage.getItem(POST_ORDER_REVIEW_KEY) ||
      sessionStorage.getItem(POST_ORDER_REVIEW_KEY);

    if (!stored) return false;

    const timestamp = Number(stored);
    if (isNaN(timestamp)) {
      localStorage.removeItem(POST_ORDER_REVIEW_KEY);
      sessionStorage.removeItem(POST_ORDER_REVIEW_KEY);
      return false;
    }

    const elapsed = Date.now() - timestamp;

    // Must be at least 2.5 seconds after order click (ensuring user actually launched WhatsApp / switched away)
    // and within 30 minutes.
    if (elapsed >= 2500 && elapsed <= 30 * 60 * 1000) {
      // Consume flag immediately to prevent back-button loops
      localStorage.removeItem(POST_ORDER_REVIEW_KEY);
      sessionStorage.removeItem(POST_ORDER_REVIEW_KEY);
      sessionStorage.setItem(REVIEW_REDIRECTED_KEY, '1');

      // Teleport customer to the Google Reviews portal
      window.location.href = ANFAS_REVIEW_URL;
      return true;
    } else if (elapsed > 30 * 60 * 1000) {
      // Expired token (> 30 mins old)
      localStorage.removeItem(POST_ORDER_REVIEW_KEY);
      sessionStorage.removeItem(POST_ORDER_REVIEW_KEY);
    }
  } catch (err) {
    console.error('Error in review teleport check:', err);
  }
  return false;
}

/**
 * React hook to globally monitor when a client returns from WhatsApp to the restaurant website.
 * Mounts at the root level so it covers any page the user returns to.
 */
export function usePostOrderReviewRedirect() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Check on initial mount (in case mobile browser reloaded the tab upon returning)
    checkAndTeleportToReview();

    let hasBeenHidden = false;

    // 2. Monitor visibility change (user switching back to the browser tab from WhatsApp)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        hasBeenHidden = true;
      } else if (document.visibilityState === 'visible') {
        if (hasBeenHidden) {
          checkAndTeleportToReview();
        }
      }
    };

    // 3. Monitor window focus (desktop switching tabs or mobile window regain)
    const handleFocus = () => {
      if (hasBeenHidden) {
        checkAndTeleportToReview();
      }
    };

    // 4. Monitor pageshow (browser back/forward cache restore or app resume)
    const handlePageShow = () => {
      checkAndTeleportToReview();
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
}
