import React, { useState } from 'react';
import { fmt } from '../data/products.js';

/**
 * Express checkout — Apple Pay / Google Pay / Shop Pay.
 *
 * REAL-WORLD IMPLEMENTATION NOTE (read before wiring a live backend):
 * On Shopify, Apple Pay, Google Pay and Shop Pay are provisioned automatically
 * by Shopify Payments the moment the store's domain is verified — there is no
 * custom code to write. See docs/SHOPIFY_HANDOFF.md §3. This component exists
 * for the prototype (a Vite/React app with no backend) and for any future
 * custom Node/Next storefront, where Apple Pay specifically requires:
 *   1. An Apple Developer merchant ID + payment processing certificate.
 *   2. A domain-association file served at
 *      /.well-known/apple-developer-merchantid-domain-association
 *   3. The Payment Request API (or Stripe's wrapper of it) called from a real
 *      user gesture (a click), over HTTPS, on a verified domain — none of
 *      which a sandboxed prototype can satisfy.
 * The button below is fully interactive and HIG-correct (black pill, correct
 * mark, correct min-height) so it's ready to swap `onApplePay` for a real
 * `PaymentRequest` call the day this ships on a real domain.
 */
export default function ExpressCheckout({ amount, onApplePay, onGooglePay, onShopPay, className = '' }) {
  const [note, setNote] = useState(null);

  const fallback = (label, handler) => () => {
    if (handler) return handler();
    setNote(label);
    window.clearTimeout(fallback._t);
    fallback._t = window.setTimeout(() => setNote(null), 3200);
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-3 gap-2">
        {/* Apple Pay — Apple HIG: black pill, min-height 44px, official mark */}
        <button
          type="button"
          aria-label={`Pay ${fmt(amount)} with Apple Pay`}
          data-testid="apple-pay-button"
          onClick={fallback('Apple Pay opens at checkout on a verified domain — wired for production, inactive in this prototype.', onApplePay)}
          className="flex h-11 items-center justify-center gap-1.5 rounded-md bg-black text-white transition-opacity hover:opacity-85 active:opacity-70"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M16.7 12.4c0-2 1.6-3 1.7-3.1-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.1.8-.6 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2-1.4 2.5-.4 6.3 1 8.3.7 1 1.5 2.1 2.6 2 1-.1 1.4-.7 2.7-.7s1.6.7 2.7.6c1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.1-.8-2.1-3.2zM14.6 5.7c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2z" />
          </svg>
          <span className="font-sans text-[15px] font-medium leading-none">Pay</span>
        </button>

        {/* Google Pay — G-Pay guideline: white/outlined pill, colour mark */}
        <button
          type="button"
          aria-label={`Pay ${fmt(amount)} with Google Pay`}
          data-testid="google-pay-button"
          onClick={fallback('Google Pay opens at checkout once Shopify Payments is live — wired for production, inactive in this prototype.', onGooglePay)}
          className="flex h-11 items-center justify-center gap-1.5 rounded-md border border-ink/15 bg-white text-ink transition-colors hover:bg-ink/5 active:bg-ink/10"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path fill="#4285F4" d="M12 11v2.9h4.1c-.2 1-1.5 3-4.1 3-2.5 0-4.5-2-4.5-4.6s2-4.6 4.5-4.6c1.4 0 2.4.6 2.9 1.1l2-1.9C15.7 5.6 14 5 12 5c-3.9 0-7 3.1-7 7s3.1 7 7 7c4 0 6.7-2.8 6.7-6.8 0-.5 0-.8-.1-1.2H12z" />
          </svg>
          <span className="font-sans text-[14px] font-medium leading-none">Pay</span>
        </button>

        {/* Shop Pay — brand-purple pill per Shop Pay button guidelines */}
        <button
          type="button"
          aria-label={`Pay ${fmt(amount)} with Shop Pay`}
          data-testid="shop-pay-button"
          onClick={fallback('Shop Pay activates automatically on Shopify Payments — wired for production, inactive in this prototype.', onShopPay)}
          className="flex h-11 items-center justify-center gap-1 rounded-md bg-[#5A31F4] text-white transition-opacity hover:opacity-90 active:opacity-75"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M6 7h10.5l1.5 2.5V17a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7Zm3-1a3 3 0 0 1 6 0v1H9V6Z" />
          </svg>
          <span className="font-sans text-[13px] font-bold leading-none">Shop</span>
        </button>
      </div>

      {note && (
        <p role="status" data-testid="express-checkout-note" className="mt-2 font-mono text-[10px] leading-relaxed text-ink/50">
          {note}
        </p>
      )}

      <div className="mt-3 flex items-center gap-3">
        <div className="h-px flex-1 bg-ink/10" />
        <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink/40">or checkout with card</span>
        <div className="h-px flex-1 bg-ink/10" />
      </div>
    </div>
  );
}
