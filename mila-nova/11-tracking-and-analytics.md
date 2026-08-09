# 11. Tracking & Analytics — Know What's Actually Working

You cannot double the winning format if you don't know which one is winning.
This is the free, dead-simple tracking setup — no paid analytics tools needed.

## The one metric that matters most

**Link clicks → email signups → paid subscribers.** Everything else (likes,
views, follower count) is a leading indicator at best. Track the bottom of
the funnel from week one, even at tiny numbers, so you're not guessing later.

## UTM links — how to see which platform actually sends people who pay

A UTM link is your normal landing-page link with a tracking tag glued on the
end. Build one per platform so your email tool / Fanvue can tell you where
signups came from.

**Pattern:**
`https://yourdomain.com?utm_source=SOURCE&utm_medium=social&utm_campaign=launch`

**Ready-to-use links (swap in your real domain):**

| Platform | Link to put in bio |
| --- | --- |
| Instagram | `https://milanova.ai?utm_source=instagram&utm_medium=social&utm_campaign=launch` |
| TikTok | `https://milanova.ai?utm_source=tiktok&utm_medium=social&utm_campaign=launch` |
| X | `https://milanova.ai?utm_source=x&utm_medium=social&utm_campaign=launch` |
| Reddit/communities | `https://milanova.ai?utm_source=reddit&utm_medium=community&utm_campaign=launch` |
| Email | `https://milanova.ai?utm_source=email&utm_medium=email&utm_campaign=friday-render` |

Most link-in-bio tools (or a free one like Linktree/Beacons) let you set ONE
bio link that fans out to multiple buttons — use that, and put a UTM-tagged
link behind each platform's button.

## Free analytics stack

1. **Platform-native insights** (Instagram/TikTok/X built-in analytics) —
   reach, saves, watch-through %. Check weekly, not daily; daily creates
   noise-chasing.
2. **A free site analytics tool** (e.g. Plausible free trial, or Cloudflare
   Web Analytics — free, privacy-friendly, one `<script>` tag) on the landing
   page to see: visits by UTM source, and how many hit the pricing section.
3. **MailerLite's own dashboard** — open rate, click rate, and (this is the
   important one) which UTM source produced the subscriber.
4. **Fanvue's creator dashboard** — subscriber count, tier mix, churn. This
   is ground truth for revenue; the rest is funnel diagnostics feeding it.

## The weekly numbers snapshot (fill in every Friday)

```
Week of: ______
Reach:        IG ____   TikTok ____   X ____
Profile taps: IG ____   TikTok ____   X ____
Link clicks:  IG ____   TikTok ____   X ____   Email ____
Landing page visits: ____   →  Pricing section views: ____
Email signups: ____   (source: __________)
New subscribers: ____   Cancelled: ____   (net: ____)
Revenue: $____
Best-performing post: ____________________ (why, in one line)
Worst-performing post: ___________________ (why, in one line)
```

Paste this into the same spreadsheet as the revenue tracker in
[10-launch-guide.md](10-launch-guide.md) — one sheet, one Friday habit.

## What to actually do with the numbers

- **High reach, low profile-taps:** the content is entertaining but the
  account/bio isn't converting curiosity into a follow. Fix the bio, not the content.
- **High profile-taps, low link-clicks:** bio CTA is weak or buried. Put the
  link and a reason to click it in the first line.
- **High link-clicks, low landing-page-to-pricing:** the landing page hero
  isn't earning the scroll. Strengthen the headline or hero image.
- **High pricing-views, low signups:** price or tier clarity problem — re-read
  tier copy in [03-subscription-tiers.md](03-subscription-tiers.md) fresh, as a stranger would.
- **Subscribers churning fast:** a delivery problem, not a marketing problem —
  check the weekly-engine cadence in [07-marketing-strategy.md](07-marketing-strategy.md) is actually being kept.
