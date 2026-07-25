import React, { useState } from 'react';

/**
 * Fit recommendation tool — maps height/weight/fit preference onto the unisex
 * size curve used across the range (tees/hoodies/jerseys). Guidance only;
 * exact garment measurements on every PDP remain the source of truth.
 */
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export function recommendSize(heightCm, weightKg, preference) {
  if (!heightCm || !weightKg) return null;
  const bmiish = weightKg / ((heightCm / 100) ** 2);
  let idx =
    bmiish < 20 ? 1 :
    bmiish < 23 ? 2 :
    bmiish < 26 ? 3 :
    bmiish < 30 ? 4 : 5;
  if (heightCm < 165) idx -= 1;
  if (heightCm > 188) idx += 1;
  if (preference === 'regular') idx -= 1; // range is cut oversized
  if (preference === 'extra') idx += 1;
  return SIZES[Math.max(0, Math.min(SIZES.length - 1, idx))];
}

export default function FitTool({ onResult }) {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [pref, setPref] = useState('relaxed');
  const [result, setResult] = useState(null);

  return (
    <form
      className="border-2 border-ink/15 bg-white/40 p-5"
      data-testid="fit-tool"
      onSubmit={(e) => {
        e.preventDefault();
        const r = recommendSize(+height, +weight, pref);
        setResult(r);
        onResult?.(r);
      }}
    >
      <p className="font-display text-sm font-extrabold uppercase tracking-widest2">Fit without the guesswork</p>
      <p className="mt-1 font-mono text-[11px] text-ink/55">Our cut is oversized. Answer three things; we'll call your size.</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="font-mono text-[11px] uppercase tracking-wide text-ink/60">
          Height (cm)
          <input type="number" min="140" max="215" required value={height} onChange={(e) => setHeight(e.target.value)}
            data-testid="fit-height"
            className="mt-1 w-full border-2 border-ink/20 bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-cobalt" />
        </label>
        <label className="font-mono text-[11px] uppercase tracking-wide text-ink/60">
          Weight (kg)
          <input type="number" min="40" max="160" required value={weight} onChange={(e) => setWeight(e.target.value)}
            data-testid="fit-weight"
            className="mt-1 w-full border-2 border-ink/20 bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-cobalt" />
        </label>
      </div>
      <fieldset className="mt-3">
        <legend className="font-mono text-[11px] uppercase tracking-wide text-ink/60">How do you want it to sit?</legend>
        <div className="mt-1.5 flex gap-1.5">
          {[['regular', 'Closer'], ['relaxed', 'As designed'], ['extra', 'Extra room']].map(([v, label]) => (
            <button
              key={v} type="button" onClick={() => setPref(v)}
              className={`flex-1 px-2 py-2 font-mono text-[11px] uppercase tracking-wide transition-colors ${pref === v ? 'bg-ink text-bone' : 'bg-ink/5 hover:bg-ink/10'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>
      <button type="submit" data-testid="fit-submit" className="mt-4 w-full bg-cobalt px-4 py-3 font-display text-xs font-bold uppercase tracking-widest2 text-bone transition-colors hover:bg-ink">
        Get my size
      </button>
      {result && (
        <p className="mt-3 border-t border-ink/10 pt-3 text-center font-display text-lg font-extrabold uppercase" data-testid="fit-result" aria-live="polite">
          We'd put you in a <span className="text-cobalt">{result}</span>
          <span className="mt-1 block font-mono text-[10px] font-normal normal-case text-ink/50">Check the exact garment measurements below before ordering — first exchange is free.</span>
        </p>
      )}
    </form>
  );
}
