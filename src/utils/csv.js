// ---------------------------------------------------------------------------
// CSV import/export helpers.
//
// Exports use flat, stable column names so files drop straight into HubSpot,
// Google Contacts or a spreadsheet. Import accepts the same format back.
// ---------------------------------------------------------------------------

/** Escape a value for a CSV cell. */
function esc(value) {
  const s = value === null || value === undefined ? '' : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Serialise an array of objects to CSV using the given [key, header] columns. */
export function toCSV(rows, columns) {
  const header = columns.map(([, label]) => esc(label)).join(',');
  const lines = rows.map((row) => columns.map(([key]) => esc(row[key])).join(','));
  return [header, ...lines].join('\n');
}

/** Column map for lead exports — mirrors the lead schema 1:1. */
export const LEAD_COLUMNS = [
  ['name', 'Name'],
  ['phone', 'Phone'],
  ['email', 'Email'],
  ['suburb', 'Suburb'],
  ['postcode', 'Postcode'],
  ['state', 'State'],
  ['employment', 'Employment'],
  ['income', 'Income'],
  ['partnerIncome', 'Partner Income'],
  ['monthlyUnsecuredDebt', 'Monthly Unsecured Debt'],
  ['buyingTimeframe', 'Buying Timeframe'],
  ['creditProfile', 'Credit Profile'],
  ['source', 'Lead Source'],
  ['status', 'Status'],
  ['owner', 'Lead Owner'],
  ['nextFollowUp', 'Next Follow-Up'],
  ['notes', 'Notes'],
  ['createdAt', 'Created At'],
];

/**
 * Minimal CSV parser (handles quoted cells and escaped quotes).
 * Returns an array of row objects keyed by the header labels.
 */
export function parseCSV(text) {
  const rows = [];
  let cell = '';
  let row = [];
  let inQuotes = false;
  const pushCell = () => { row.push(cell); cell = ''; };
  const pushRow = () => { if (row.length > 1 || row[0] !== '') rows.push(row); row = []; };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else cell += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ',') pushCell();
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      pushCell();
      pushRow();
    } else cell += ch;
  }
  if (cell !== '' || row.length) { pushCell(); pushRow(); }

  if (rows.length < 2) return [];
  const [header, ...body] = rows;
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] || '').trim()])));
}

/** Map an imported CSV row (using LEAD_COLUMNS headers) back to a lead object. */
export function rowToLead(row) {
  const byLabel = Object.fromEntries(LEAD_COLUMNS.map(([key, label]) => [label, key]));
  const lead = {};
  for (const [label, value] of Object.entries(row)) {
    const key = byLabel[label];
    if (key) lead[key] = value;
  }
  // Numeric coercion for the money fields.
  for (const key of ['income', 'partnerIncome', 'monthlyUnsecuredDebt']) {
    if (lead[key] !== undefined && lead[key] !== '') lead[key] = Number(lead[key]) || 0;
  }
  return lead;
}

/** Trigger a browser download of a text file. */
export function downloadFile(filename, text, mime = 'text/csv') {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
