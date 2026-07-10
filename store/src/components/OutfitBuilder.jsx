import React, { useMemo, useState } from 'react';
import { PRODUCTS, BUNDLES, fmt, getProduct, stockFor } from '../data/products.js';
import { useStore } from '../context/StoreContext.jsx';
import GarmentArt from './GarmentArt.jsx';
import { Btn } from './ui.jsx';

/**
 * BUILD YOUR STATE — interactive outfit builder.
 * Pick a piece per slot; matching preset bundles price automatically
 * (discounts are capped at ~12% to preserve margin — docs/PRODUCT_RANGE.md).
 */
const SLOTS = [
  { key: 'top', label: 'Top', kinds: ['tee', 'jersey'] },
  { key: 'bottom', label: 'Bottom', kinds: ['short'] },
  { key: 'layer', label: 'Layer', kinds: ['hoodie'] },
  { key: 'cap', label: 'Cap', kinds: ['cap'] },
];

export default function OutfitBuilder() {
  const { addToCart } = useStore();
  const [picks, setPicks] = useState({ top: null, bottom: null, layer: null, cap: null }); // {productId, colour, size}
  const [added, setAdded] = useState(false);

  const chosen = Object.values(picks).filter(Boolean);
  const solo = chosen.reduce((a, c) => a + getProduct(c.productId).price, 0);

  const bundle = useMemo(() => {
    const ids = chosen.map((c) => c.productId).sort();
    return BUNDLES.find((b) => {
      const bids = [...b.items].sort();
      return bids.length === ids.length && bids.every((x, i) => x === ids[i]);
    });
  }, [chosen]);

  const total = bundle ? bundle.price : solo;

  const setPick = (slot, productId, colour, size) =>
    setPicks((prev) => ({ ...prev, [slot]: productId ? { productId, colour, size } : null }));

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]" data-testid="outfit-builder">
      <div className="space-y-6">
        {SLOTS.map((slot) => {
          const options = PRODUCTS.filter((p) => slot.kinds.includes(p.kind));
          const pick = picks[slot.key];
          return (
            <div key={slot.key} className="border border-ink/10 bg-white/40 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink/50">{slot.label}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {options.map((p) => {
                  const selected = pick?.productId === p.id;
                  return (
                    <div key={p.id} className={`border-2 p-3 transition-colors ${selected ? 'border-cobalt bg-cobalt/5' : 'border-ink/10'}`}>
                      <button
                        className="flex w-full items-center gap-3 text-left"
                        data-testid={`pick-${slot.key}-${p.id}`}
                        onClick={() =>
                          selected
                            ? setPick(slot.key, null)
                            : setPick(slot.key, p.id, p.colours[0], p.sizes.includes('M') ? 'M' : p.sizes[0])
                        }
                        aria-pressed={selected}
                      >
                        <div className="h-16 w-16 shrink-0"><GarmentArt kind={p.kind} colour={selected ? pick.colour : p.colours[0]} className="h-full w-full" /></div>
                        <div>
                          <p className="font-display text-xs font-extrabold uppercase">{p.name}</p>
                          <p className="font-mono text-[11px] text-ink/55">{fmt(p.price)}</p>
                        </div>
                        <span className={`ml-auto flex h-6 w-6 items-center justify-center rounded-full border-2 font-mono text-xs ${selected ? 'border-cobalt bg-cobalt text-bone' : 'border-ink/20 text-transparent'}`}>✓</span>
                      </button>
                      {selected && (
                        <div className="mt-3 flex flex-wrap gap-2 border-t border-ink/10 pt-3">
                          <select
                            aria-label={`${p.name} colour`} value={pick.colour}
                            onChange={(e) => setPick(slot.key, p.id, e.target.value, pick.size)}
                            className="border border-ink/20 bg-transparent px-2 py-1 font-mono text-[11px]"
                          >
                            {p.colours.map((c) => <option key={c}>{c}</option>)}
                          </select>
                          <select
                            aria-label={`${p.name} size`} value={pick.size}
                            onChange={(e) => setPick(slot.key, p.id, pick.colour, e.target.value)}
                            className="border border-ink/20 bg-transparent px-2 py-1 font-mono text-[11px]"
                          >
                            {p.sizes.map((s) => (
                              <option key={s} disabled={stockFor(p, pick.colour, s) <= 0}>{s}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <aside className="h-fit border-2 border-ink bg-ink p-5 text-bone lg:sticky lg:top-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-concrete">Your state</p>
        <ul className="mt-3 min-h-16 space-y-1.5 font-mono text-xs">
          {chosen.length === 0 && <li className="text-concrete/60">Pick pieces to build the uniform…</li>}
          {chosen.map((c) => {
            const p = getProduct(c.productId);
            return <li key={c.productId} className="flex justify-between gap-2"><span>{p.name} · {c.size}</span><span>{fmt(p.price)}</span></li>;
          })}
        </ul>
        {bundle && (
          <p className="mt-3 bg-cobalt px-2 py-1.5 font-mono text-[11px] uppercase tracking-wide" data-testid="bundle-hit">
            {bundle.name} bundle — save {fmt(solo - bundle.price)}
          </p>
        )}
        <div className="mt-4 flex items-baseline justify-between border-t border-bone/15 pt-3">
          <span className="font-mono text-[11px] uppercase tracking-widest2 text-concrete">Total</span>
          <span className="font-display text-2xl font-extrabold" data-testid="outfit-total">
            {fmt(total)}
            {bundle && <s className="ml-2 font-mono text-sm font-normal text-concrete/60">{fmt(solo)}</s>}
          </span>
        </div>
        <Btn
          variant="bone" className="mt-4 w-full" disabled={chosen.length === 0}
          data-testid="outfit-add"
          onClick={() => {
            chosen.forEach((c) => addToCart(c.productId, c.colour, c.size, 1));
            setAdded(true);
          }}
        >
          Add outfit to cart
        </Btn>
        {added && <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-wide text-concrete">Added — bundle pricing applies at checkout.</p>}
        <p className="mt-3 font-mono text-[10px] leading-relaxed text-concrete/70">
          Bundle discounts are fixed sets, capped ≤12% — we protect margin instead of running fake sales.
        </p>
      </aside>
    </div>
  );
}
