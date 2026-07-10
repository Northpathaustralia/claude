import React from 'react';
import { Kicker, H2, StateLine } from '../components/ui.jsx';
import OutfitBuilder from '../components/OutfitBuilder.jsx';

export default function Uniform() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <Kicker>Build your state</Kicker>
      <H2 className="mt-3">Build the uniform.</H2>
      <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-ink/65">
        Pick a top, a bottom, a layer and a cap. Matching preset combinations price
        automatically — bundle discounts are capped so the margin (and the quality) never
        gets cut to make a number look good.
      </p>
      <StateLine className="my-8" />
      <OutfitBuilder />
    </main>
  );
}
