import React, { useId } from 'react';
import { COLOURS } from '../data/products.js';
import { RIVIERA_COLOURS } from '../data/riviera.js';

const ALL_COLOURS = { ...COLOURS, ...RIVIERA_COLOURS };

/**
 * Vector product renders — placeholder photography for the prototype.
 * Flat-lay garment illustrations in exact brand colourways so every card,
 * PDP and cart line stays on-system until real photography replaces them
 * (swap point documented in docs/SHOPIFY_HANDOFF.md).
 */

const Tee = ({ c }) => (
  <g>
    <path
      d="M60 78 L102 58 Q120 50 138 58 L180 78 L168 112 L146 102 L146 196 Q120 204 94 196 L94 102 L72 112 Z"
      fill={c.hex} stroke="rgba(9,9,9,0.18)" strokeWidth="1.5"
    />
    <path d="M104 60 Q120 70 136 60 Q128 74 112 74 Q106 68 104 60Z" fill="rgba(9,9,9,0.15)" />
    {/* chest wordmark */}
    <rect x="104" y="96" width="24" height="4" fill={c.text} opacity="0.85" />
    {/* back-graphic hint: tide bars at hem */}
    <g opacity="0.5">
      <rect x="100" y="170" width="6" height="16" fill={c.text} />
      <rect x="110" y="176" width="6" height="10" fill={c.text} />
      <rect x="120" y="180" width="6" height="6" fill={c.accent || '#FF4A1F'} />
    </g>
  </g>
);

const Short = ({ c }) => (
  <g>
    <path
      d="M78 76 L162 76 L172 176 L128 182 L120 122 L112 182 L68 176 Z"
      fill={c.hex} stroke="rgba(9,9,9,0.18)" strokeWidth="1.5"
    />
    <rect x="78" y="76" width="84" height="12" fill="rgba(9,9,9,0.18)" />
    <path d="M112 88 q8 10 16 0" stroke={c.text} strokeWidth="2.5" fill="none" />
    {/* zip phone pocket */}
    <rect x="138" y="104" width="20" height="3" rx="1.5" fill={c.text} opacity="0.8" />
    <rect x="70" y="160" width="10" height="4" fill={c.accent || '#FF4A1F'} opacity="0.9" />
  </g>
);

const Hoodie = ({ c }) => (
  <g>
    <path
      d="M62 88 L98 62 Q120 44 142 62 L178 88 L166 124 L150 114 L150 196 Q120 206 90 196 L90 114 L74 124 Z"
      fill={c.hex} stroke="rgba(9,9,9,0.18)" strokeWidth="1.5"
    />
    {/* structured hood */}
    <path d="M96 64 Q120 34 144 64 Q136 82 120 84 Q104 82 96 64Z" fill={c.hex} stroke="rgba(9,9,9,0.25)" strokeWidth="1.5" />
    <path d="M104 66 Q120 46 136 66" stroke="rgba(9,9,9,0.25)" strokeWidth="1.5" fill="none" />
    {/* kangaroo pocket */}
    <path d="M98 156 L142 156 L136 190 L104 190 Z" fill="rgba(9,9,9,0.12)" />
    {/* yoke seam echoing tide-bar motif */}
    <path d="M90 118 L150 106" stroke="rgba(9,9,9,0.2)" strokeWidth="1.5" />
    <rect x="108" y="100" width="24" height="4" fill={c.text} opacity="0.85" />
  </g>
);

const Cap = ({ c }) => (
  <g>
    <path d="M70 130 Q70 78 120 78 Q170 78 170 130 Z" fill={c.hex} stroke="rgba(9,9,9,0.2)" strokeWidth="1.5" />
    <path d="M64 130 L176 130 Q186 132 184 142 L60 142 Q56 132 64 130Z" fill={c.hex} stroke="rgba(9,9,9,0.25)" strokeWidth="1.5" />
    <path d="M120 78 L120 130" stroke="rgba(9,9,9,0.15)" strokeWidth="1.5" />
    {/* breakline icon */}
    <g>
      <rect x="104" y="98" width="7" height="22" fill={c.text} />
      <rect x="115" y="105" width="7" height="15" fill={c.text} />
      <rect x="126" y="111" width="7" height="9" fill={c.accent || (c.hex === '#FF4A1F' ? '#090909' : '#FF4A1F')} />
    </g>
  </g>
);

const Jersey = ({ c }) => (
  <g>
    <path
      d="M60 78 L102 58 Q120 50 138 58 L180 78 L168 112 L146 102 L146 196 Q120 204 94 196 L94 102 L72 112 Z"
      fill={c.hex} stroke="rgba(9,9,9,0.18)" strokeWidth="1.5"
    />
    <path d="M104 60 Q120 70 136 60 L134 66 Q120 74 106 66 Z" fill="#F1EEE6" opacity="0.9" />
    {/* speed block */}
    <rect x="94" y="118" width="52" height="22" fill={c.accent || '#1747FF'} />
    <rect x="94" y="142" width="52" height="3" fill={c.text} opacity="0.6" />
    {/* race plate */}
    <rect x="126" y="168" width="18" height="12" rx="2" fill="#F1EEE6" />
    <text x="135" y="177" textAnchor="middle" fontSize="8" fontWeight="700" fill="#090909" fontFamily="sans-serif">001</text>
    <rect x="104" y="124" width="32" height="4" fill="#F1EEE6" />
  </g>
);

/** Camp-collar short-sleeve shirt — Riviera capsule. Supports stripe/check/solid fill. */
const CampShirt = ({ c, pattern = 'solid', uid }) => {
  const stripeId = `stripe-${uid}`;
  const checkId = `check-${uid}`;
  const fill = pattern === 'stripe' ? `url(#${stripeId})` : pattern === 'check' ? `url(#${checkId})` : c.hex;
  return (
    <g>
      <defs>
        <pattern id={stripeId} width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill={c.hex} />
          <rect width="5" height="10" fill="#F1EEE6" opacity="0.92" />
        </pattern>
        <pattern id={checkId} width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#F1EEE6" />
          <rect width="10" height="2" fill={c.hex} opacity="0.85" />
          <rect width="2" height="10" fill={c.hex} opacity="0.85" />
        </pattern>
      </defs>
      {/* shirt: open camp collar, short sleeve */}
      <path
        d="M64 84 L100 60 L112 72 L108 84 L120 92 L132 84 L128 72 L140 60 L176 84 L166 116 L146 106 L146 194 Q120 202 94 194 L94 106 L74 116 Z"
        fill={fill} stroke="rgba(9,9,9,0.2)" strokeWidth="1.5"
      />
      {/* open collar V + placket */}
      <path d="M108 84 L120 150 L132 84" fill="none" stroke="rgba(9,9,9,0.22)" strokeWidth="1.5" />
      <circle cx="120" cy="106" r="1.6" fill="rgba(9,9,9,0.35)" />
      <circle cx="120" cy="128" r="1.6" fill="rgba(9,9,9,0.35)" />
      <circle cx="120" cy="150" r="1.6" fill="rgba(9,9,9,0.35)" />
      {/* chest pocket */}
      <rect x="96" y="108" width="16" height="18" fill="none" stroke="rgba(9,9,9,0.28)" strokeWidth="1.2" />
      {/* matching short, grounded lower in frame */}
      <path d="M84 178 L156 178 L162 208 L128 212 L120 190 L112 212 L78 208 Z" fill={fill} stroke="rgba(9,9,9,0.2)" strokeWidth="1.5" />
    </g>
  );
};

const KINDS = { tee: Tee, short: Short, hoodie: Hoodie, cap: Cap, jersey: Jersey, campshirt: CampShirt };

/**
 * Product visual. If the product has a real `photo` URL it renders that (this is
 * the drop-in point for AI-model or studio photography — see
 * docs/PHOTOGRAPHY_AND_AI_MODELS.md). Otherwise it renders an art-directed
 * vector "studio" render: soft top-light, radial vignette, grounded floor
 * shadow — deliberately moody, not clip-art.
 */
export default function GarmentArt({ kind, colour = 'Washed Ink', className = '', bg = true, photo, alt, pattern }) {
  const c = ALL_COLOURS[colour] || COLOURS['Washed Ink'];
  const Body = KINDS[kind] || Tee;
  const uid = useId().replace(/:/g, '');

  if (photo) {
    return <img src={photo} alt={alt || `${kind} in ${colour}`} loading="lazy" className={`object-cover ${className}`} />;
  }

  return (
    <svg viewBox="0 0 240 240" className={className} role="img" aria-label={alt || `${kind} in ${colour}`}>
      {bg && (
        <>
          <defs>
            <radialGradient id={`studio-${uid}`} cx="50%" cy="34%" r="78%">
              <stop offset="0%" stopColor="#F3F0E8" />
              <stop offset="62%" stopColor="#E9E5DA" />
              <stop offset="100%" stopColor="#D8D3C6" />
            </radialGradient>
            <radialGradient id={`floor-${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(9,9,9,0.22)" />
              <stop offset="100%" stopColor="rgba(9,9,9,0)" />
            </radialGradient>
          </defs>
          <rect width="240" height="240" fill={`url(#studio-${uid})`} />
          {/* grounded floor shadow */}
          <ellipse cx="120" cy="205" rx="72" ry="12" fill={`url(#floor-${uid})`} />
          <text x="12" y="228" fontSize="7.5" fill="#B4AF9F" fontFamily="monospace" letterSpacing="1.5">28.0167°S / 153.4000°E</text>
        </>
      )}
      <Body c={c} pattern={pattern} uid={uid} />
    </svg>
  );
}
