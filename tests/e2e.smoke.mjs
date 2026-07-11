// ATLAS ONE end-to-end smoke test against the built app.
// Not part of `npm test` (needs a browser). Run with:
//   npm run build && npm run preview -- --port 4173 &
//   npm i --no-save playwright-core && node tests/e2e.smoke.mjs
// Set PW_CHROMIUM to your Chromium path if not /opt/pw-browsers/chromium.
import { chromium } from 'playwright-core';

const BASE = 'http://localhost:4173';
let failures = 0;
const ok = (name, cond) => {
  console.log(`${cond ? '✅' : '❌'} ${name}`);
  if (!cond) failures += 1;
};

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium' });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

// 1. Home: shell + briefing
await page.goto(`${BASE}/#/`, { waitUntil: 'networkidle' });
ok('Home loads with ATLAS ONE brand', await page.getByText('ATLAS ONE').first().isVisible());
ok('Briefing greets James', (await page.textContent('body')).includes('James'));
ok('Honest system map shows Planned items', (await page.textContent('body')).includes('Planned'));
ok('Provider warning shown when not connected', (await page.textContent('body')).includes("isn't fully awake"));

// 2. Chat: new conversation, memory command round-trip
await page.goto(`${BASE}/#/chat/new`);
await page.waitForURL(/#\/chat\/conv_/);
const composer = page.locator('textarea');
await composer.fill('Remember that I prefer short answers');
await composer.press('Enter');
await page.getByText('Saved to memory').waitFor({ timeout: 5000 });
ok('Memory command stored + confirmed in chat', true);

await composer.fill('What do you remember about me?');
await composer.press('Enter');
await page.waitForTimeout(500);
ok('Recall lists the stored memory', (await page.textContent('body')).includes('prefer short answers'));

// 3. Demo-mode honesty for a normal question with no key
await composer.fill('What should NorthPath focus on this week?');
await composer.press('Enter');
await page.waitForTimeout(700);
const body3 = await page.textContent('body');
ok('No-key reply is a labelled demonstration', body3.includes('Demonstration reply') && body3.includes('no AI provider'));

// 4. Memory page shows the stored record (memories render as editable inputs)
await page.goto(`${BASE}/#/memory`);
await page.waitForTimeout(400);
const memValues = await page.locator('.atlas-card input').evaluateAll((els) => els.map((e) => e.value));
ok('Memory page lists stored memory', memValues.some((v) => v.includes('prefer short answers')));

// 5. Mode chips exist (Fast..X10)
await page.goto(`${BASE}/#/chat/new`);
await page.waitForURL(/#\/chat\/conv_/);
let modesOk = true;
for (const m of ['Fast', 'Smart', 'Deep Think', 'X10 Mode', 'Research', 'Build', 'Creative', 'Executive']) {
  if (!(await page.getByRole('button', { name: m, exact: true }).count())) modesOk = false;
}
ok('All 8 intelligence modes present', modesOk);

// 6. Projects: create one
await page.goto(`${BASE}/#/projects`);
await page.fill('input[placeholder*="New project"]', 'Smoke Test Project');
await page.click('button:has-text("Create")');
await page.waitForTimeout(300);
ok('Project created', (await page.textContent('body')).includes('Smoke Test Project'));

// 7. Council roster + specialist preview
await page.goto(`${BASE}/#/council`);
await page.fill('textarea', 'Should NorthPath increase advertising spend on finance leads?');
await page.waitForTimeout(300);
const councilBody = await page.textContent('body');
ok('Council roster shows specialists', councilBody.includes('FORGE') && councilBody.includes('VAULT'));
ok('Council previews selected specialists', councilBody.includes('Will convene'));

// 8. Studio engines render
await page.goto(`${BASE}/#/studio`);
const studioBody = await page.textContent('body');
ok('Studio shows engines', studioBody.includes('Spreadsheet') && studioBody.includes('Presentation'));

// 9. NorthPath workspace: leads table with seed data + lead detail
await page.goto(`${BASE}/#/leads`);
await page.waitForTimeout(500);
ok('NorthPath leads page renders with data', (await page.locator('a[href^="#/leads/lead"]').count()) > 0);
try {
  const leadLink = page.locator('a[href^="#/leads/lead"]').first();
  await leadLink.waitFor({ timeout: 5000 });
  const leadName = (await leadLink.textContent()).trim();
  await leadLink.click();
  // The detail page shows the lead's profile: name heading + recommended action.
  await page.getByRole('heading', { name: leadName }).waitFor({ timeout: 5000 });
  await page.getByText('next action', { exact: false }).first().waitFor({ timeout: 5000 });
  ok('Lead detail opens with profile and next action', true);
} catch (e) {
  ok(`Lead detail opens (${String(e).slice(0, 100)})`, false);
}

// 10. NorthPath dashboard under /northpath
await page.goto(`${BASE}/#/northpath`);
await page.waitForTimeout(400);
ok('NorthPath dashboard renders inside Atlas shell', (await page.textContent('body')).includes('NorthPath Workspace'));

// 11. Integrations honesty
await page.goto(`${BASE}/#/integrations`);
const intBody = await page.textContent('body');
ok('Integrations show honest statuses', intBody.includes('Not Connected') && intBody.includes('Planned'));

// 12. Settings + finance + business render
await page.goto(`${BASE}/#/settings`);
ok('Settings shows provider section', (await page.textContent('body')).includes('AI Providers'));
await page.goto(`${BASE}/#/finance`);
ok('Finance centre renders with honesty banner', (await page.textContent('body')).includes('Educational analysis only'));
await page.goto(`${BASE}/#/business`);
const bizBody = await page.textContent('body');
ok('Business centre shows live NorthPath card', bizBody.includes('Open leads') && bizBody.includes('Open workspace'));

// 13. Research & search settings + chat save-to-outputs + edit affordances
await page.goto(`${BASE}/#/settings`);
const setBody = await page.textContent('body');
ok('Settings shows Research & web search section', setBody.includes('Research & web search') && setBody.includes('Tavily'));
ok('Settings shows Security section (encryption off by default)', setBody.includes('app lock & encryption') && setBody.includes('Not encrypted'));

await page.goto(`${BASE}/#/integrations`);
await page.fill('input[placeholder*="Search integrations"]', 'Tavily');
await page.waitForTimeout(200);
ok('Tavily listed as honest Not Connected integration', (await page.textContent('body')).includes('Not Connected'));

// Save a chat reply to Saved Outputs
await page.goto(`${BASE}/#/chat`);
await page.locator('aside >> text=Remember that I prefer short a').first().click();
await page.getByText('Demonstration reply').first().waitFor({ timeout: 5000 });
ok('Conversation search box present', (await page.locator('input[placeholder*="Search conversations"]').count()) === 1);
ok('Edit button present on user messages', (await page.getByText('✏️ Edit').count()) >= 1);
await page.locator('button:has-text("Save")').last().click();
await page.goto(`${BASE}/#/studio`);
await page.waitForTimeout(300);
ok('Chat reply saved to Saved Outputs', (await page.textContent('body')).includes('Chat: Remember that I prefer short answers'));

// 14. App lock: enable → reload → wrong pass → unlock → data intact → remove
await page.goto(`${BASE}/#/settings`);
const sec = page.locator('section', { hasText: 'Security — app lock & encryption' }).first();
await sec.locator('input[type="password"]').nth(0).fill('test-pass-123');
await sec.locator('input[type="password"]').nth(1).fill('test-pass-123');
await sec.getByRole('button', { name: 'Turn on app lock' }).click();
await page.getByText('App lock is ON').waitFor({ timeout: 10000 });
const encState = await page.evaluate(() => ({
  meta: !!localStorage.getItem('atlas.lock.v1'),
  plainAtlas: localStorage.getItem('atlas.v1'),
  encAtlas: !!localStorage.getItem('enc.atlas.v1'),
}));
ok('Lock enabled: ciphertext present, plaintext removed', encState.meta && encState.encAtlas && encState.plainAtlas === null);

await page.reload({ waitUntil: 'networkidle' });
await page.getByText('ATLAS ONE is locked').waitFor({ timeout: 5000 });
ok('Lock screen appears after reload', true);

await page.fill('input[placeholder="Passphrase"]', 'wrong-pass');
await page.getByRole('button', { name: 'Unlock' }).click();
await page.getByText('not correct').waitFor({ timeout: 10000 });
ok('Wrong passphrase rejected', true);

await page.fill('input[placeholder="Passphrase"]', 'test-pass-123');
await page.getByRole('button', { name: 'Unlock' }).click();
// URL was #/settings when the lock engaged, so unlocking lands back on Settings.
await page.getByRole('heading', { name: 'Intelligence routing' }).waitFor({ timeout: 10000 });
ok('Correct passphrase unlocks the app', true);

await page.goto(`${BASE}/#/memory`);
await page.waitForTimeout(400);
const memAfterLock = await page.locator('.atlas-card input').evaluateAll((els) => els.map((e) => e.value));
ok('Data intact after lock/unlock cycle', memAfterLock.some((v) => v.includes('prefer short answers')));

await page.goto(`${BASE}/#/settings`);
const sec2 = page.locator('section', { hasText: 'Security — app lock & encryption' }).first();
await sec2.getByText('Encryption ON').waitFor({ timeout: 5000 });
await sec2.locator('input[type="password"]').last().fill('test-pass-123');
page.once('dialog', (d) => d.accept());
await sec2.getByRole('button', { name: 'Remove app lock' }).click();
await page.getByText('App lock removed').waitFor({ timeout: 10000 });
const plainRestored = await page.evaluate(() => ({
  meta: !!localStorage.getItem('atlas.lock.v1'),
  plainAtlas: !!localStorage.getItem('atlas.v1'),
}));
ok('Lock removed: plaintext restored, metadata gone', !plainRestored.meta && plainRestored.plainAtlas);

// Console errors
const realErrors = errors.filter((e) => !/favicon|Download the React DevTools/i.test(e));
ok(`No console/page errors (${realErrors.length})`, realErrors.length === 0);
if (realErrors.length) console.log(realErrors.slice(0, 5));

await browser.close();
console.log(failures === 0 ? '\nSMOKE: ALL PASS' : `\nSMOKE: ${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
