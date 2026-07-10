import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PRODUCTS, getProduct, fmt, stockFor } from '../data/products.js';
import { useStore } from '../context/StoreContext.jsx';
import GarmentArt from '../components/GarmentArt.jsx';
import FitTool from '../components/FitTool.jsx';
import { Btn, Kicker, StateLine } from '../components/ui.jsx';
import { ProductCard } from '../components/ProductCard.jsx';

export default function ProductPage() {
  const { id } = useParams();
  const product = getProduct(id);
  const { addToCart, recent, touchRecent, requestRestock } = useStore();

  const [colour, setColour] = useState(product?.colours[0]);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('details');
  const [restockEmail, setRestockEmail] = useState('');
  const [restockDone, setRestockDone] = useState(false);

  useEffect(() => {
    if (product) {
      touchRecent(product.id);
      setColour(product.colours[0]);
      setSize(product.sizes.length === 1 ? product.sizes[0] : null);
      setQty(1); setError(''); setTab('details'); setRestockDone(false);
      window.scrollTo(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const recommended = useMemo(
    () => PRODUCTS.filter((p) => p.id !== id).slice(0, 3),
    [id],
  );
  const recentProducts = recent.filter((r) => r !== id).map(getProduct).filter(Boolean).slice(0, 4);

  if (!product) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="font-display text-3xl font-extrabold uppercase">Product not found.</p>
        <Btn to="/shop" className="mt-6">Back to the range</Btn>
      </main>
    );
  }

  const available = size ? stockFor(product, colour, size) : null;
  const soldOutEverywhere = product.sizes.every((s) => stockFor(product, colour, s) <= 0);

  const handleAdd = () => {
    if (!size) { setError('Pick a size first — measurements are below.'); return; }
    if (available <= 0) { setError('That size is sold out in this colour.'); return; }
    setError('');
    addToCart(product.id, colour, size, qty);
  };

  return (
    <main className="pb-24 lg:pb-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-2">
        {/* gallery */}
        <div className="space-y-3">
          <GarmentArt kind={product.kind} colour={colour} className="w-full border border-ink/10" />
          <div className="grid grid-cols-3 gap-3">
            {product.colours.map((c) => (
              <button key={c} onClick={() => setColour(c)} aria-label={`View ${c}`} className={`border-2 ${colour === c ? 'border-cobalt' : 'border-transparent'}`}>
                <GarmentArt kind={product.kind} colour={c} className="w-full" />
              </button>
            ))}
          </div>
          <p className="font-mono text-[10px] uppercase tracking-widest2 text-ink/40">Vector renders — photography lands with the day-41 shoot</p>
        </div>

        {/* buy box */}
        <div>
          <Kicker>Drop 001 · {product.sku} · {product.gsm}gsm</Kicker>
          <h1 className="mt-2 font-display text-4xl font-extrabold uppercase leading-none tracking-tight sm:text-5xl">{product.name}</h1>
          <p className="mt-2 font-mono text-sm text-ink/60">{product.tagline}</p>
          <p className="mt-4 font-display text-2xl font-extrabold" data-testid="pdp-price">{fmt(product.price)} <span className="font-mono text-xs font-normal text-ink/50">AUD · GST incl.</span></p>

          {/* colour */}
          <div className="mt-6">
            <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink/60">Colour — <span className="text-ink">{colour}</span></p>
            <div className="mt-2 flex gap-2">
              {product.colours.map((c) => (
                <button
                  key={c} onClick={() => { setColour(c); setSize(product.sizes.length === 1 ? product.sizes[0] : null); }}
                  data-testid={`colour-${c.replace(/[^a-z]/gi, '')}`}
                  aria-pressed={colour === c}
                  className={`px-3 py-2 font-mono text-[11px] uppercase tracking-wide transition-colors ${colour === c ? 'bg-ink text-bone' : 'bg-ink/5 hover:bg-ink/10'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* size */}
          <div className="mt-5">
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink/60">Size {size && <span className="text-ink">— {size}</span>}</p>
              <Link to="/fit-guide" className="font-mono text-[11px] underline hover:text-cobalt">Fit guide</Link>
            </div>
            <div className="mt-2 grid grid-cols-6 gap-1.5" role="group" aria-label="Select size">
              {product.sizes.map((s) => {
                const st = stockFor(product, colour, s);
                return (
                  <button
                    key={s} disabled={st <= 0}
                    data-testid={`size-${s}`}
                    aria-pressed={size === s}
                    onClick={() => { setSize(s); setError(''); }}
                    className={`relative border-2 py-2.5 font-mono text-xs uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${size === s ? 'border-ink bg-ink text-bone' : 'border-ink/20 hover:border-ink'}`}
                  >
                    {s}
                    {st <= 0 && <span className="absolute inset-x-1 top-1/2 h-px -rotate-12 bg-ink/50" />}
                  </button>
                );
              })}
            </div>
            {size && available > 0 && available <= 10 && (
              <p className="mt-2 font-mono text-[11px] text-signal" data-testid="low-stock">Only {available} left in {colour} / {size} — real count, not theatre.</p>
            )}
          </div>

          {/* qty + add */}
          <div className="mt-6 flex gap-3">
            <div className="flex items-center border-2 border-ink/20">
              <button className="px-3 py-3 font-mono" aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span className="min-w-8 text-center font-mono" data-testid="pdp-qty">{qty}</span>
              <button className="px-3 py-3 font-mono" aria-label="Increase quantity" onClick={() => setQty(Math.min(qty + 1, Math.max(1, available ?? 10)))}>+</button>
            </div>
            <Btn onClick={handleAdd} className="flex-1" data-testid="add-to-cart">
              {soldOutEverywhere ? 'Sold out' : `Add to cart · ${fmt(product.price * qty)}`}
            </Btn>
          </div>
          {error && <p className="mt-2 font-mono text-xs text-signal" role="alert" data-testid="pdp-error">{error}</p>}

          {/* back in stock */}
          {size !== null && available <= 0 && (
            <div className="mt-4 border-2 border-ink/15 p-4" data-testid="back-in-stock">
              {restockDone ? (
                <p className="font-mono text-xs">✓ You're first in line when {colour} / {size} returns.</p>
              ) : (
                <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); requestRestock(product.id, colour, size, restockEmail); setRestockDone(true); }}>
                  <input
                    type="email" required placeholder="Email — notify me when it's back"
                    value={restockEmail} onChange={(e) => setRestockEmail(e.target.value)}
                    aria-label="Email for restock notification"
                    className="min-w-0 flex-1 border-2 border-ink/20 bg-transparent px-3 py-2 font-mono text-xs outline-none focus:border-cobalt"
                  />
                  <Btn type="submit" variant="cobalt">Notify me</Btn>
                </form>
              )}
            </div>
          )}

          {/* trust strip */}
          <ul className="mt-6 space-y-1.5 border-t border-ink/10 pt-4 font-mono text-[11px] text-ink/60">
            <li>→ Free AU shipping over $150 · ships from the Gold Coast in 1–2 business days</li>
            <li>→ First exchange free for first-time customers</li>
            <li>→ 30-day change-of-mind on full-price items + your ACL rights, always</li>
            <li>→ Apple Pay · Google Pay · Shop Pay · Afterpay (where available)</li>
          </ul>

          {/* tabs */}
          <div className="mt-8">
            <div className="flex border-b-2 border-ink/10">
              {[['details', 'Details'], ['measurements', 'Measurements'], ['model', 'On the model']].map(([k, label]) => (
                <button
                  key={k} onClick={() => setTab(k)} data-testid={`tab-${k}`}
                  className={`px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest2 ${tab === k ? 'border-b-2 border-cobalt text-cobalt' : 'text-ink/50'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            {tab === 'details' && (
              <div className="py-4">
                <p className="max-w-lg font-mono text-sm leading-relaxed text-ink/75">{product.description}</p>
                <ul className="mt-4 space-y-1.5 font-mono text-xs text-ink/65">
                  {product.details.map((d) => <li key={d}>· {d}</li>)}
                </ul>
                <p className="mt-4 font-mono text-[11px] text-ink/45">Fit: {product.fit}</p>
              </div>
            )}
            {tab === 'measurements' && (
              <div className="overflow-x-auto py-4" data-testid="measurements-table">
                <table className="w-full border-collapse font-mono text-xs">
                  <thead>
                    <tr className="border-b-2 border-ink/20 text-left">
                      <th className="py-2 pr-3">Size</th>
                      {product.measurements.cols.map((c) => <th key={c} className="py-2 pr-3">{c} (cm)</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(product.measurements.rows).map(([s, vals]) => (
                      <tr key={s} className="border-b border-ink/10">
                        <td className="py-2 pr-3 font-bold">{s}</td>
                        {vals.map((v, i) => <td key={i} className="py-2 pr-3">{v}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-3 font-mono text-[10px] text-ink/45">Garment measurements, ±1cm tolerance. We measure a random unit from every batch on camera.</p>
              </div>
            )}
            {tab === 'model' && (
              <div className="py-4 font-mono text-sm leading-relaxed text-ink/75">
                <p>Model is <strong>{product.model.height}cm</strong>, <strong>{product.model.weight}kg</strong>, chest {product.model.chest}cm, waist {product.model.waist}cm.</p>
                <p className="mt-1">Wears size <strong>{product.model.wears}</strong> · prefers a {String(product.model.prefers).toLowerCase()} fit.</p>
                <p className="mt-3 text-xs text-ink/50">Multi-body fit videos land with the launch shoot — every size on a real person, filmed.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* fit tool */}
      <div className="mx-auto max-w-6xl px-4 pb-4"><div className="max-w-md"><FitTool onResult={(r) => r && product.sizes.includes(r) && setSize(r)} /></div></div>

      {/* reviews — honest empty state until real verified reviews exist */}
      <section className="mx-auto max-w-6xl px-4 py-10" aria-label="Reviews" data-testid="reviews">
        <StateLine className="mb-8" />
        <h2 className="font-display text-2xl font-extrabold uppercase">Reviews</h2>
        <div className="mt-4 border-2 border-dashed border-ink/20 p-8 text-center">
          <p className="font-display text-lg font-bold uppercase">No reviews yet — and we won't fake any.</p>
          <p className="mx-auto mt-2 max-w-md font-mono text-xs leading-relaxed text-ink/60">
            Verified-buyer reviews open here after the first deliveries. Photo and video reviews earn a
            disclosed $10 credit — honest ones, including the critical ones.
          </p>
        </div>
      </section>

      {/* recommended */}
      <section className="mx-auto max-w-6xl px-4 py-10" aria-label="Recommended">
        <h2 className="font-display text-2xl font-extrabold uppercase">Completes the uniform</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {recommended.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* recently viewed */}
      {recentProducts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10" aria-label="Recently viewed" data-testid="recently-viewed">
          <h2 className="font-display text-xl font-extrabold uppercase text-ink/70">Recently viewed</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {recentProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* sticky mobile ATC */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-bone/95 p-3 backdrop-blur lg:hidden" data-testid="sticky-atc">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="truncate font-display text-xs font-extrabold uppercase">{product.name}</p>
            <p className="font-mono text-[11px] text-ink/60">{colour}{size ? ` · ${size}` : ''} · {fmt(product.price)}</p>
          </div>
          <Btn onClick={handleAdd} className="ml-auto flex-1 max-w-52">{size ? 'Add to cart' : 'Select size'}</Btn>
        </div>
      </div>
    </main>
  );
}
