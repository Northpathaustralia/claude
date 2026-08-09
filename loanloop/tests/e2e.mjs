// End-to-end smoke test driven by a real Chromium instance via Playwright.
// Not wired into `npm test` (Playwright isn't a project dependency) — run it
// manually per docs/MVP_LAUNCH_STEPS.md whenever the widget or site pages
// change. Requires a static file server for loanloop/ on PORT (see below)
// and a Playwright install — falls back to this sandbox's global install if
// no local `playwright` package is found.
let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  ({ chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs'));
}

const PORT = process.env.LOANLOOP_TEST_PORT || 8934;
const BASE = `http://localhost:${PORT}/site`;
const results = [];
const record = (name, pass, detail) => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'} — ${name}${detail ? `: ${detail}` : ''}`);
};

const browser = await chromium.launch();
let overallFail = false;

try {
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`));

  // 1. Landing page loads
  await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  record('landing page loads', (await page.title()).includes('LoanLoop'));

  // 2. Signup flow: create a broker, get an embed snippet
  await page.goto(`${BASE}/signup.html`, { waitUntil: 'networkidle' });
  await page.fill('input[name=businessName]', 'Test Finance Co');
  await page.fill('input[name=email]', 'broker@testfinance.example');
  await page.fill('input[name=headline]', 'We guarantee approval instantly!'); // must be sanitised
  await page.click('button[type=submit]');
  await page.waitForSelector('#result:not([hidden])');
  const snippet = await page.textContent('#snippet');
  record('signup produces an embed snippet', snippet.includes('data-loanloop-id="test-finance-co"'), snippet.slice(0, 60));
  record('signup sanitises banned compliance phrases in headline', !/guarantee|instant approval/i.test(snippet), snippet);

  // 3. Demo page: fill in and submit the actual widget for this broker
  await page.goto(`${BASE}/demo.html?brokerId=test-finance-co`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.loanloop-widget.loanloop-mounted');
  const headline = await page.textContent('.loanloop-heading');
  const isDefaultHeadline = headline.trim() === 'See what you could borrow';
  record(
    'demo page picks up broker customisation',
    !isDefaultHeadline && !/guarantee/i.test(headline),
    headline
  );

  const widget = page.locator('.loanloop-widget');
  await widget.locator('input[name=annualIncome]').fill('140000');
  await widget.locator('input[name=monthlyDebts]').fill('400');
  await widget.locator('input[name=dependents]').fill('1');
  await widget.locator('input[name=deposit]').fill('80000');
  await widget.locator('input[name=name]').fill('Jane Smith');
  await widget.locator('input[name=email]').fill('jane@example.com');
  await widget.locator('input[name=phone]').fill('0400000000');
  await widget.locator('input[name=consent]').check();
  await widget.locator('button.loanloop-submit').click();

  await widget.locator('.loanloop-result').waitFor({ state: 'visible' });
  const resultText = await widget.locator('.loanloop-result').innerText();
  record('widget renders an estimate range after submit', /Estimated borrowing power/.test(resultText), resultText);

  // 4. Validation: empty required fields should block submission (no crash, error shown)
  await page.goto(`${BASE}/demo.html?brokerId=test-finance-co`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.loanloop-widget.loanloop-mounted');
  const widget2 = page.locator('.loanloop-widget');
  await widget2.locator('input[name=annualIncome]').fill(''); // required field left blank
  await widget2.locator('input[name=name]').fill('No Income Guy');
  await widget2.locator('input[name=email]').fill('noincome@example.com');
  await widget2.locator('input[name=consent]').check();
  await widget2.locator('button.loanloop-submit').click();
  await page.waitForTimeout(200);
  const errorText = await widget2.locator('.loanloop-errors').innerText();
  record('widget blocks submission with a validation error instead of crashing', errorText.trim().length > 0, errorText);

  // 5. Honeypot: a bot filling the hidden field should NOT create a lead
  await page.goto(`${BASE}/demo.html?brokerId=test-finance-co`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.loanloop-widget.loanloop-mounted');
  const leadsBeforeHoneypot = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem('loanloop_demo_leads_test-finance-co') || '[]').length
  );
  const widget3 = page.locator('.loanloop-widget');
  await widget3.locator('input[name=annualIncome]').fill('100000');
  await widget3.locator('input[name=name]').fill('Bot Name');
  await widget3.locator('input[name=email]').fill('bot@example.com');
  await widget3.locator('input[name=consent]').check();
  await page.evaluate(() => {
    document.querySelector('.loanloop-widget input[name="company_website"]').value = 'http://spam.example';
  });
  await widget3.locator('button.loanloop-submit').click();
  await page.waitForTimeout(300);
  const leadsAfterHoneypot = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem('loanloop_demo_leads_test-finance-co') || '[]').length
  );
  record('honeypot silently drops bot submissions', leadsAfterHoneypot === leadsBeforeHoneypot, `${leadsBeforeHoneypot} -> ${leadsAfterHoneypot}`);

  // 6. XSS: a broker name containing a script-like string must never execute or be treated as HTML
  await page.goto(`${BASE}/signup.html`, { waitUntil: 'networkidle' });
  let dialogFired = false;
  page.on('dialog', async (dialog) => { dialogFired = true; await dialog.dismiss(); });
  await page.fill('input[name=businessName]', '<img src=x onerror=alert(1)>');
  await page.fill('input[name=email]', 'xss@example.com');
  await page.click('button[type=submit]');
  await page.waitForSelector('#result:not([hidden])');
  await page.goto(`${BASE}/demo.html?brokerId=img-src-x-onerror-alert-1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  record('malicious business name does not execute as script on the demo page', !dialogFired);

  // 7. Dashboard shows the captured lead
  await page.goto(`${BASE}/dashboard.html?brokerId=test-finance-co`, { waitUntil: 'networkidle' });
  await page.selectOption('#broker-select', 'test-finance-co');
  await page.waitForTimeout(200);
  const rowCount = await page.locator('table.leads-table tbody tr').count();
  record('dashboard lists the captured lead for the right broker', rowCount === 1, `rows=${rowCount}`);
  const leadCountText = await page.textContent('#lead-count');
  record('dashboard lead counter matches table', leadCountText.startsWith('1 lead'), leadCountText);

  // 8. CSV export produces a real download with expected content
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('#export-btn'),
  ]);
  const csvPath = await download.path();
  const fs = await import('node:fs');
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  record('CSV export contains the lead email', csvContent.includes('jane@example.com'), csvContent.split('\r\n')[0]);

  // 9. No unexpected console errors anywhere in the run
  record('no console/page errors during the whole run', consoleErrors.length === 0, consoleErrors.join(' | '));

  overallFail = results.some((r) => !r.pass);
} catch (err) {
  console.error('E2E RUN THREW:', err);
  overallFail = true;
} finally {
  await browser.close();
}

console.log('\n--- SUMMARY ---');
for (const r of results) console.log(`${r.pass ? 'ok ' : 'FAIL'} ${r.name}`);
process.exit(overallFail ? 1 : 0);
