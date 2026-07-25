import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
import { getProduct, fmt, FREE_SHIPPING_THRESHOLD } from '../data/products.js';
import GarmentArt from './GarmentArt.jsx';
import { Btn } from './ui.jsx';
import ExpressCheckout from './ExpressCheckout.jsx';

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeLine, cartTotal, clearCart } = useStore();

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setCartOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setCartOpen]);

  if (!cartOpen) return null;

  const remaining = FREE_SHIPPING_THRESHOLD - cartTotal;
  const progress = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Cart" data-testid="cart-drawer">
      <button className="absolute inset-0 bg-ink/60" aria-label="Close cart" onClick={() => setCartOpen(false)} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-bone shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 className="font-display text-lg font-extrabold uppercase tracking-widest2">Your State</h2>
          <button onClick={() => setCartOpen(false)} aria-label="Close cart" data-testid="cart-close" className="p-2 hover:text-signal">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        {/* free shipping progress */}
        <div className="border-b border-ink/10 px-5 py-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em]">
            {remaining > 0 ? <>Add <strong>{fmt(remaining)}</strong> for free AU shipping</> : <span className="text-cobalt">✓ Free AU shipping unlocked</span>}
          </p>
          <div className="mt-2 h-1.5 w-full bg-concrete/40">
            <div className="h-full bg-cobalt transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="font-display text-xl font-bold uppercase">Nothing in here yet.</p>
              <p className="font-mono text-xs text-ink/60">Five pieces. One uniform. Start anywhere.</p>
              <Btn to="/shop" onClick={() => setCartOpen(false)}>Shop Drop 001</Btn>
            </div>
          ) : (
            <ul className="space-y-4" data-testid="cart-lines">
              {cart.map((line, i) => {
                const p = getProduct(line.productId);
                if (!p) return null;
                return (
                  <li key={`${line.productId}-${line.colour}-${line.size}`} className="flex gap-3 border border-ink/10 bg-white/40 p-3">
                    <Link to={`/product/${p.id}`} onClick={() => setCartOpen(false)} className="h-20 w-20 shrink-0 overflow-hidden">
                      <GarmentArt kind={p.kind} colour={line.colour} className="h-full w-full" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-bold uppercase">{p.name}</p>
                      <p className="font-mono text-[11px] text-ink/60">{line.colour} · {line.size}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex items-center border border-ink/20">
                          <button className="px-2 py-1 font-mono" aria-label="Decrease quantity" data-testid={`qty-dec-${i}`} onClick={() => updateQty(i, line.qty - 1)}>−</button>
                          <span className="min-w-6 text-center font-mono text-sm" data-testid={`qty-${i}`}>{line.qty}</span>
                          <button className="px-2 py-1 font-mono" aria-label="Increase quantity" data-testid={`qty-inc-${i}`} onClick={() => updateQty(i, line.qty + 1)}>+</button>
                        </div>
                        <button className="font-mono text-[11px] uppercase tracking-wide text-ink/50 underline hover:text-signal" data-testid={`remove-${i}`} onClick={() => removeLine(i)}>
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className="font-mono text-sm font-bold">{fmt(p.price * line.qty)}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-ink/10 px-5 py-4">
            <div className="flex justify-between font-mono text-sm">
              <span className="uppercase tracking-widest2">Subtotal</span>
              <strong data-testid="cart-subtotal">{fmt(cartTotal)}</strong>
            </div>
            <p className="mt-1 font-mono text-[10px] text-ink/50">GST included. Shipping calculated at checkout.</p>
            <ExpressCheckout amount={cartTotal} className="mt-4" />
            <Btn className="w-full" onClick={() => alert('Prototype checkout — connects to Shopify checkout in production (see docs/SHOPIFY_HANDOFF.md).')}>
              Checkout with card · {fmt(cartTotal)}
            </Btn>
            <button className="mt-3 w-full text-center font-mono text-[11px] uppercase tracking-widest2 text-ink/40 underline" onClick={clearCart} data-testid="cart-clear">
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
