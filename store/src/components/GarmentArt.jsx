import React from 'react';
import { COLOURS } from '../data/products.js';

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

const KINDS = { tee: Tee, short: Short, hoodie: Hoodie, cap: Cap, jersey: Jersey };

export default function GarmentArt({ kind, colour = 'Washed Ink', className = '', bg = true }) {
  const c = COLOURS[colour] || COLOURS['Washed Ink'];
  const Body = KINDS[kind] || Tee;
  return (
    <svg viewBox="0 0 240 240" className={className} role="img" aria-label={`${kind} in ${colour}`}>
      {bg && (
        <>
          <rect width="240" height="240" fill="#E9E5DA" />
          <g stroke="#DCD7CA" strokeWidth="1">
            <line x1="0" y1="60" x2="240" y2="60" />
            <line x1="0" y1="120" x2="240" y2="120" />
            <line x1="0" y1="180" x2="240" y2="180" />
            <line x1="60" y1="0" x2="60" y2="240" />
            <line x1="180" y1="0" x2="180" y2="240" />
          </g>
          <text x="10" y="230" fontSize="8" fill="#B4AF9F" fontFamily="monospace" letterSpacing="1">28.0167°S</text>
        </>
      )}
      <Body c={c} />
    </svg>
  );
}
