import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fmt, totalStock } from '../data/products.js';
import GarmentArt from './GarmentArt.jsx';

export function ProductCard({ product, badge }) {
  const [colour, setColour] = useState(product.colours[0]);
  const low = totalStock(product) <= 10;
  return (
    <article className="group border border-ink/10 bg-white/40 transition-shadow hover:shadow-lg" data-testid={`card-${product.id}`}>
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden">
          <GarmentArt kind={product.kind} colour={colour} className="aspect-square w-full transition-transform duration-500 group-hover:scale-[1.04]" />
          {badge && <span className="absolute left-3 top-3 bg-signal px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest2 text-ink">{badge}</span>}
          {low && <span className="absolute right-3 top-3 bg-ink px-2 py-1 font-mono text-[10px] uppercase tracking-widest2 text-bone">Low stock</span>}
        </div>
        <div className="px-4 pt-3">
          <h3 className="font-display text-sm font-extrabold uppercase tracking-wide">{product.name}</h3>
          <p className="mt-0.5 line-clamp-1 font-mono text-[11px] text-ink/55">{product.tagline}</p>
        </div>
      </Link>
      <div className="flex items-center justify-between px-4 pb-4 pt-2">
        <div className="flex gap-1.5" role="group" aria-label={`${product.name} colours`}>
          {product.colours.map((c) => (
            <button
              key={c}
              aria-label={`Show ${c}`}
              onClick={() => setColour(c)}
              className={`h-4 w-4 rounded-full border ${colour === c ? 'ring-2 ring-cobalt ring-offset-1' : 'border-ink/20'}`}
              style={{ background: c === 'Bone' || c === 'Bone/Concrete' ? '#E9E5DA' : c === 'Cobalt' || c === 'Ink/Cobalt' ? '#1747FF' : c === 'Signal Orange' ? '#FF4A1F' : '#1d1d1b' }}
            />
          ))}
        </div>
        <p className="font-mono text-sm font-bold">{fmt(product.price)}</p>
      </div>
    </article>
  );
}

const SORTS = {
  featured: { label: 'Featured', fn: () => 0 },
  'price-asc': { label: 'Price ↑', fn: (a, b) => a.price - b.price },
  'price-desc': { label: 'Price ↓', fn: (a, b) => b.price - a.price },
  name: { label: 'A–Z', fn: (a, b) => a.name.localeCompare(b.name) },
};

export function ProductGrid({ products, showFilters = true, badgeFor }) {
  const [kind, setKind] = useState('all');
  const [maxPrice, setMaxPrice] = useState(200);
  const [sort, setSort] = useState('featured');

  const kinds = useMemo(() => ['all', ...new Set(products.map((p) => p.kind))], [products]);
  const visible = useMemo(
    () =>
      products
        .filter((p) => (kind === 'all' || p.kind === kind) && p.price <= maxPrice)
        .sort(SORTS[sort].fn),
    [products, kind, maxPrice, sort],
  );

  return (
    <div>
      {showFilters && (
        <div className="mb-6 flex flex-wrap items-center gap-3 border-y border-ink/10 py-3" data-testid="filter-bar">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by type">
            {kinds.map((k) => (
              <button
                key={k}
                data-testid={`filter-${k}`}
                onClick={() => setKind(k)}
                className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest2 transition-colors ${kind === k ? 'bg-ink text-bone' : 'bg-ink/5 text-ink hover:bg-ink/10'}`}
              >
                {k}
              </button>
            ))}
          </div>
          <label className="ml-auto flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-ink/60">
            Max {fmt(maxPrice)}
            <input
              type="range" min="50" max="200" step="5" value={maxPrice}
              onChange={(e) => setMaxPrice(+e.target.value)} aria-label="Maximum price"
            />
          </label>
          <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-ink/60">
            Sort
            <select
              value={sort} onChange={(e) => setSort(e.target.value)} data-testid="sort-select"
              className="border border-ink/20 bg-transparent px-2 py-1.5 font-mono text-[11px] uppercase"
            >
              {Object.entries(SORTS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
            </select>
          </label>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3" data-testid="product-grid">
        {visible.map((p) => <ProductCard key={p.id} product={p} badge={badgeFor?.(p)} />)}
      </div>
      {visible.length === 0 && (
        <p className="py-16 text-center font-mono text-sm text-ink/50">Nothing matches those filters — loosen the price or type.</p>
      )}
    </div>
  );
}
