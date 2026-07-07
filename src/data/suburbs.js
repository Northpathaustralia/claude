// ---------------------------------------------------------------------------
// Suburb affordability reference data.
//
// A curated, representative sample of Australian suburbs where established
// houses are commonly available at or below ~$900,000 (plus some higher-priced
// suburbs for contrast). Median prices are indicative estimates only and are
// used purely to *prioritise* leads by location — they are never shown to
// customers as valuations or promises.
//
// Priority bands (see suburbPriority):
//   High   — medians comfortably below the $900k ceiling (<= $750k)
//   Medium — medians near the ceiling (> $750k and <= $900k)
//   Low    — medians above the ceiling
//
// Replace or extend this dataset with a live data feed later; the lookup API
// (findSuburb / priorityForLead) will not need to change.
// ---------------------------------------------------------------------------

import { ICP } from '../domain/constants.js';

export const SUBURBS = [
  // --- QLD ---
  { suburb: 'Ipswich', postcode: '4305', state: 'QLD', medianHousePrice: 640000 },
  { suburb: 'Logan Central', postcode: '4114', state: 'QLD', medianHousePrice: 610000 },
  { suburb: 'Caboolture', postcode: '4510', state: 'QLD', medianHousePrice: 660000 },
  { suburb: 'Deception Bay', postcode: '4508', state: 'QLD', medianHousePrice: 690000 },
  { suburb: 'Beenleigh', postcode: '4207', state: 'QLD', medianHousePrice: 650000 },
  { suburb: 'Toowoomba', postcode: '4350', state: 'QLD', medianHousePrice: 620000 },
  { suburb: 'Townsville', postcode: '4810', state: 'QLD', medianHousePrice: 520000 },
  { suburb: 'Cairns', postcode: '4870', state: 'QLD', medianHousePrice: 560000 },
  { suburb: 'Rockhampton', postcode: '4700', state: 'QLD', medianHousePrice: 430000 },
  { suburb: 'Bundaberg', postcode: '4670', state: 'QLD', medianHousePrice: 480000 },
  { suburb: 'Redbank Plains', postcode: '4301', state: 'QLD', medianHousePrice: 620000 },
  { suburb: 'Morayfield', postcode: '4506', state: 'QLD', medianHousePrice: 670000 },
  { suburb: 'Strathpine', postcode: '4500', state: 'QLD', medianHousePrice: 780000 },
  { suburb: 'Springfield Lakes', postcode: '4300', state: 'QLD', medianHousePrice: 760000 },
  { suburb: 'North Lakes', postcode: '4509', state: 'QLD', medianHousePrice: 850000 },
  { suburb: 'Paddington (Brisbane)', postcode: '4064', state: 'QLD', medianHousePrice: 1650000 },

  // --- NSW ---
  { suburb: 'Mount Druitt', postcode: '2770', state: 'NSW', medianHousePrice: 860000 },
  { suburb: 'Campbelltown', postcode: '2560', state: 'NSW', medianHousePrice: 850000 },
  { suburb: 'Penrith', postcode: '2750', state: 'NSW', medianHousePrice: 890000 },
  { suburb: 'Liverpool', postcode: '2170', state: 'NSW', medianHousePrice: 900000 },
  { suburb: 'Blacktown', postcode: '2148', state: 'NSW', medianHousePrice: 890000 },
  { suburb: 'Newcastle (Outer)', postcode: '2287', state: 'NSW', medianHousePrice: 780000 },
  { suburb: 'Maitland', postcode: '2320', state: 'NSW', medianHousePrice: 700000 },
  { suburb: 'Cessnock', postcode: '2325', state: 'NSW', medianHousePrice: 620000 },
  { suburb: 'Wagga Wagga', postcode: '2650', state: 'NSW', medianHousePrice: 560000 },
  { suburb: 'Dubbo', postcode: '2830', state: 'NSW', medianHousePrice: 540000 },
  { suburb: 'Orange', postcode: '2800', state: 'NSW', medianHousePrice: 620000 },
  { suburb: 'Albury', postcode: '2640', state: 'NSW', medianHousePrice: 580000 },
  { suburb: 'Parramatta', postcode: '2150', state: 'NSW', medianHousePrice: 1450000 },
  { suburb: 'Sydney (Inner)', postcode: '2000', state: 'NSW', medianHousePrice: 1900000 },

  // --- VIC ---
  { suburb: 'Melton', postcode: '3337', state: 'VIC', medianHousePrice: 520000 },
  { suburb: 'Werribee', postcode: '3030', state: 'VIC', medianHousePrice: 640000 },
  { suburb: 'Craigieburn', postcode: '3064', state: 'VIC', medianHousePrice: 650000 },
  { suburb: 'Cranbourne', postcode: '3977', state: 'VIC', medianHousePrice: 650000 },
  { suburb: 'Pakenham', postcode: '3810', state: 'VIC', medianHousePrice: 650000 },
  { suburb: 'Frankston', postcode: '3199', state: 'VIC', medianHousePrice: 750000 },
  { suburb: 'Sunshine', postcode: '3020', state: 'VIC', medianHousePrice: 820000 },
  { suburb: 'Geelong (Corio)', postcode: '3214', state: 'VIC', medianHousePrice: 480000 },
  { suburb: 'Ballarat', postcode: '3350', state: 'VIC', medianHousePrice: 570000 },
  { suburb: 'Bendigo', postcode: '3550', state: 'VIC', medianHousePrice: 580000 },
  { suburb: 'Shepparton', postcode: '3630', state: 'VIC', medianHousePrice: 480000 },
  { suburb: 'Brighton (Melbourne)', postcode: '3186', state: 'VIC', medianHousePrice: 2900000 },

  // --- SA ---
  { suburb: 'Elizabeth', postcode: '5112', state: 'SA', medianHousePrice: 430000 },
  { suburb: 'Salisbury', postcode: '5108', state: 'SA', medianHousePrice: 560000 },
  { suburb: 'Morphett Vale', postcode: '5162', state: 'SA', medianHousePrice: 610000 },
  { suburb: 'Port Adelaide', postcode: '5015', state: 'SA', medianHousePrice: 720000 },
  { suburb: 'Mount Gambier', postcode: '5290', state: 'SA', medianHousePrice: 420000 },

  // --- WA ---
  { suburb: 'Armadale', postcode: '6112', state: 'WA', medianHousePrice: 560000 },
  { suburb: 'Rockingham', postcode: '6168', state: 'WA', medianHousePrice: 620000 },
  { suburb: 'Midland', postcode: '6056', state: 'WA', medianHousePrice: 560000 },
  { suburb: 'Mandurah', postcode: '6210', state: 'WA', medianHousePrice: 600000 },
  { suburb: 'Ellenbrook', postcode: '6069', state: 'WA', medianHousePrice: 640000 },
  { suburb: 'Cottesloe', postcode: '6011', state: 'WA', medianHousePrice: 3200000 },

  // --- TAS ---
  { suburb: 'Glenorchy', postcode: '7010', state: 'TAS', medianHousePrice: 580000 },
  { suburb: 'Launceston', postcode: '7250', state: 'TAS', medianHousePrice: 560000 },
  { suburb: 'Devonport', postcode: '7310', state: 'TAS', medianHousePrice: 480000 },

  // --- NT / ACT ---
  { suburb: 'Palmerston', postcode: '0830', state: 'NT', medianHousePrice: 520000 },
  { suburb: 'Darwin (Northern)', postcode: '0810', state: 'NT', medianHousePrice: 580000 },
  { suburb: 'Canberra (Belconnen)', postcode: '2617', state: 'ACT', medianHousePrice: 940000 },
];

/**
 * Classify a median house price into a lead-location priority band.
 * @param {number} medianHousePrice
 * @returns {'High'|'Medium'|'Low'}
 */
export function priorityForPrice(medianHousePrice) {
  if (medianHousePrice <= 750000) return 'High';
  if (medianHousePrice <= ICP.AFFORDABLE_SUBURB_PRICE_CEILING) return 'Medium';
  return 'Low';
}

/**
 * Find a suburb record by suburb name and/or postcode.
 * Postcode match wins because it is the most reliable signal.
 * @returns {object|null}
 */
export function findSuburb({ suburb, postcode }) {
  const pc = (postcode || '').trim();
  const name = (suburb || '').trim().toLowerCase();
  if (pc) {
    const byPostcode = SUBURBS.find((s) => s.postcode === pc);
    if (byPostcode) return byPostcode;
  }
  if (name) {
    const byName = SUBURBS.find((s) => s.suburb.toLowerCase().startsWith(name));
    if (byName) return byName;
  }
  return null;
}

/**
 * Location priority for a lead. Unknown suburbs default to Medium so a data
 * gap never buries an otherwise strong lead.
 * @returns {'High'|'Medium'|'Low'}
 */
export function priorityForLead(lead) {
  const record = findSuburb({ suburb: lead.suburb, postcode: lead.postcode });
  if (!record) return 'Medium';
  return priorityForPrice(record.medianHousePrice);
}
