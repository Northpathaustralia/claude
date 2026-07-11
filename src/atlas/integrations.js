// ---------------------------------------------------------------------------
// Universal Integration Centre registry.
// Honest by construction: every integration's status reflects reality.
// AI providers become "connected" when a key is saved; everything else ships
// as "planned" until a real, tested connection path exists (Quality Rule: no
// fake integrations, ever).
// ---------------------------------------------------------------------------

export const INTEGRATION_STATUS = {
  connected: { id: 'connected', label: 'Connected', tone: 'good' },
  not_connected: { id: 'not_connected', label: 'Not Connected', tone: 'neutral' },
  setup_required: { id: 'setup_required', label: 'Setup Required', tone: 'warn' },
  planned: { id: 'planned', label: 'Planned', tone: 'muted' },
  beta: { id: 'beta', label: 'Beta', tone: 'info' },
};

export const INTEGRATION_CATEGORIES = [
  { id: 'ai', label: 'AI Providers' },
  { id: 'business', label: 'Business & CRM' },
  { id: 'google', label: 'Google' },
  { id: 'microsoft', label: 'Microsoft' },
  { id: 'creative', label: 'Creative' },
  { id: 'finance', label: 'Finance' },
  { id: 'dev', label: 'Development' },
  { id: 'automation', label: 'Automation' },
  { id: 'comms', label: 'Communication' },
  { id: 'storage', label: 'Storage' },
  { id: 'social', label: 'Social' },
  { id: 'commerce', label: 'Commerce' },
  { id: 'research', label: 'Research' },
];

/**
 * Registry. `kind: 'ai-key'` items resolve their live status from saved keys;
 * `kind: 'manual'` items support real manual data flows today (CSV/JSON);
 * everything else is architecture-ready but Planned.
 */
export const INTEGRATIONS = [
  { id: 'anthropic', name: 'Anthropic (Claude)', category: 'ai', kind: 'ai-key', description: 'Powers Atlas reasoning. Recommended first connection.' },
  { id: 'openai', name: 'OpenAI (GPT)', category: 'ai', kind: 'ai-key', description: 'Alternative model provider for the router.' },
  { id: 'google-ai', name: 'Google (Gemini)', category: 'ai', kind: 'ai-key', keyId: 'google', description: 'Alternative model provider for the router.' },
  { id: 'xai', name: 'xAI (Grok)', category: 'ai', kind: 'ai-key', description: 'Alternative model provider (browser access untested).' },
  { id: 'mistral', name: 'Mistral', category: 'ai', kind: 'ai-key', description: 'Alternative model provider (browser access untested).' },

  { id: 'hubspot', name: 'HubSpot', category: 'business', kind: 'manual', description: 'Lead import/export via HubSpot-compatible CSV works today in the NorthPath workspace. Live API sync is planned.', manualNote: 'CSV import/export: Working' },
  { id: 'salesforce', name: 'Salesforce', category: 'business', kind: 'planned', description: 'CRM read/write.' },
  { id: 'pipedrive', name: 'Pipedrive', category: 'business', kind: 'planned', description: 'Pipeline sync.' },
  { id: 'monday', name: 'Monday.com', category: 'business', kind: 'planned', description: 'Tasks and boards.' },
  { id: 'clickup', name: 'ClickUp', category: 'business', kind: 'planned', description: 'Tasks and docs.' },
  { id: 'asana', name: 'Asana', category: 'business', kind: 'planned', description: 'Projects and tasks.' },
  { id: 'trello', name: 'Trello', category: 'business', kind: 'planned', description: 'Boards.' },

  { id: 'gmail', name: 'Gmail', category: 'google', kind: 'planned', description: 'Read approved email, draft replies.' },
  { id: 'gcal', name: 'Google Calendar', category: 'google', kind: 'manual', description: 'Appointments in ATLAS carry ISO date/times ready for calendar import. Live sync is planned.', manualNote: 'ICS-ready data: Working' },
  { id: 'gdrive', name: 'Google Drive', category: 'google', kind: 'planned', description: 'File search and analysis.' },
  { id: 'gdocs', name: 'Google Docs', category: 'google', kind: 'planned', description: 'Document creation.' },
  { id: 'gsheets', name: 'Google Sheets', category: 'google', kind: 'manual', description: 'Spreadsheets exported from ATLAS open directly in Sheets (CSV). Live sync is planned.', manualNote: 'CSV export: Working' },
  { id: 'gcontacts', name: 'Google Contacts', category: 'google', kind: 'planned', description: 'Contact lookup.' },
  { id: 'gmaps', name: 'Google Maps', category: 'google', kind: 'planned', description: 'Routes and locations.' },

  { id: 'outlook', name: 'Outlook', category: 'microsoft', kind: 'planned', description: 'Email and calendar.' },
  { id: 'onedrive', name: 'OneDrive', category: 'microsoft', kind: 'planned', description: 'File storage.' },
  { id: 'teams', name: 'Microsoft Teams', category: 'microsoft', kind: 'planned', description: 'Messages and meetings.' },
  { id: 'excel', name: 'Excel', category: 'microsoft', kind: 'manual', description: 'CSV exports from ATLAS open directly in Excel.', manualNote: 'CSV export: Working' },
  { id: 'word', name: 'Word', category: 'microsoft', kind: 'planned', description: 'Document round-trips.' },

  { id: 'canva', name: 'Canva', category: 'creative', kind: 'planned', description: 'Design briefs and asset prep.' },
  { id: 'adobe', name: 'Adobe / Photoshop / Illustrator', category: 'creative', kind: 'planned', description: 'Asset workflows.' },
  { id: 'figma', name: 'Figma', category: 'creative', kind: 'planned', description: 'Design files.' },

  { id: 'xero', name: 'Xero', category: 'finance', kind: 'planned', description: 'Read-only financial summaries first; permission-controlled.' },
  { id: 'myob', name: 'MYOB', category: 'finance', kind: 'planned', description: 'Accounting data.' },
  { id: 'quickbooks', name: 'QuickBooks', category: 'finance', kind: 'planned', description: 'Accounting data.' },
  { id: 'stripe', name: 'Stripe', category: 'finance', kind: 'planned', description: 'Payments and revenue.' },
  { id: 'square', name: 'Square', category: 'finance', kind: 'planned', description: 'Payments.' },
  { id: 'paypal', name: 'PayPal', category: 'finance', kind: 'planned', description: 'Payments.' },

  { id: 'github', name: 'GitHub', category: 'dev', kind: 'planned', description: 'Repos, branches, issues, deployments.' },
  { id: 'gitlab', name: 'GitLab', category: 'dev', kind: 'planned', description: 'Repos and CI.' },
  { id: 'vercel', name: 'Vercel', category: 'dev', kind: 'planned', description: 'Deployments for the future Cloud Edition.' },
  { id: 'cloudflare', name: 'Cloudflare', category: 'dev', kind: 'planned', description: 'DNS and hosting.' },
  { id: 'docker', name: 'Docker', category: 'dev', kind: 'planned', description: 'Containers.' },

  { id: 'zapier', name: 'Zapier', category: 'automation', kind: 'manual', description: 'ATLAS JSON backups use a flat, versioned schema designed for Zapier/Make webhooks. Trigger builder is planned.', manualNote: 'Webhook-ready data: Working' },
  { id: 'make', name: 'Make', category: 'automation', kind: 'planned', description: 'Scenario automation.' },
  { id: 'n8n', name: 'n8n', category: 'automation', kind: 'planned', description: 'Self-hosted automation.' },

  { id: 'slack', name: 'Slack', category: 'comms', kind: 'planned', description: 'Messages and alerts.' },
  { id: 'discord', name: 'Discord', category: 'comms', kind: 'planned', description: 'Community management.' },
  { id: 'whatsapp', name: 'WhatsApp', category: 'comms', kind: 'planned', description: 'Where officially supported.' },
  { id: 'telegram', name: 'Telegram', category: 'comms', kind: 'planned', description: 'Bots and alerts.' },

  { id: 'dropbox', name: 'Dropbox', category: 'storage', kind: 'planned', description: 'File sync.' },
  { id: 'box', name: 'Box', category: 'storage', kind: 'planned', description: 'File sync.' },

  { id: 'instagram', name: 'Instagram', category: 'social', kind: 'planned', description: 'Content preparation; publishing always requires approval.' },
  { id: 'facebook', name: 'Facebook', category: 'social', kind: 'planned', description: 'Pages and ads.' },
  { id: 'linkedin', name: 'LinkedIn', category: 'social', kind: 'planned', description: 'Posts and outreach.' },
  { id: 'x-social', name: 'X', category: 'social', kind: 'planned', description: 'Posts.' },
  { id: 'tiktok', name: 'TikTok', category: 'social', kind: 'planned', description: 'Content.' },
  { id: 'youtube', name: 'YouTube', category: 'social', kind: 'planned', description: 'Video content.' },

  { id: 'shopify', name: 'Shopify', category: 'commerce', kind: 'planned', description: 'Store analytics and products.' },
  { id: 'woocommerce', name: 'WooCommerce', category: 'commerce', kind: 'planned', description: 'Store data.' },

  { id: 'tavily', name: 'Tavily Search', category: 'research', kind: 'search-key', description: 'Live web search powering Research mode with cited sources. Free tier available.' },
  { id: 'brave', name: 'Brave Search', category: 'research', kind: 'search-key', description: 'Independent web index for Research mode. Free tier available.' },
  { id: 'pubmed', name: 'PubMed', category: 'research', kind: 'planned', description: 'Medical literature.' },
  { id: 'scholar', name: 'Google Scholar', category: 'research', kind: 'planned', description: 'Academic search.' },
  { id: 'arxiv', name: 'arXiv', category: 'research', kind: 'planned', description: 'Preprints.' },
  { id: 'gov-data', name: 'Government & public statistics', category: 'research', kind: 'planned', description: 'ABS and public datasets.' },
];

/**
 * Resolve the live status of an integration given saved keys.
 * @param {object} item registry entry
 * @param {object} keys {providerId: apiKey} AI provider keys
 * @param {object} [searchKeys] {tavily|brave: apiKey} search keys
 */
export function integrationStatus(item, keys = {}, searchKeys = {}) {
  if (item.kind === 'ai-key') {
    const keyId = item.keyId || item.id;
    return keys[keyId] ? INTEGRATION_STATUS.connected : INTEGRATION_STATUS.not_connected;
  }
  if (item.kind === 'search-key') {
    return searchKeys[item.id] ? INTEGRATION_STATUS.connected : INTEGRATION_STATUS.not_connected;
  }
  if (item.kind === 'manual') return INTEGRATION_STATUS.beta;
  return INTEGRATION_STATUS.planned;
}
