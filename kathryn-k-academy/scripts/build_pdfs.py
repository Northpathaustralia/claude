#!/usr/bin/env python3
"""Render the Kathryn K Academy business package into designed PDFs."""
import os, sys, markdown, datetime
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "PDF")
os.makedirs(OUT, exist_ok=True)
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"

CSS = """
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
body { margin:0; font-family: Georgia, 'Times New Roman', serif; color:#101014; background:#F7F2EC; }
.page-wrap { padding: 20mm 18mm 16mm 18mm; }
h1 { font-family: Georgia, serif; font-size: 22pt; color:#101014; border-bottom: 2px solid #B76E5B; padding-bottom: 6px; margin-top: 30px;}
h2 { font-family: Georgia, serif; font-size: 16pt; color:#14424A; margin-top: 26px; }
h3 { font-family: Georgia, serif; font-size: 13pt; color:#101014; margin-top: 18px;}
h4 { font-family: Arial, sans-serif; font-size: 11pt; color:#B76E5B; text-transform:uppercase; letter-spacing:0.5px; margin-top: 14px;}
p, li { font-family: Arial, Helvetica, sans-serif; font-size: 10pt; line-height: 1.55; color:#2b2925; }
a { color:#B76E5B; }
table { border-collapse: collapse; width: 100%; margin: 14px 0; font-family: Arial, sans-serif; font-size: 8.8pt; }
th { background:#101014; color:#F7F2EC; text-align:left; padding:6px 8px; }
td { border-bottom: 1px solid #e3d9d0; padding:6px 8px; vertical-align: top;}
tr:nth-child(even) td { background: #FBF8F4; }
strong { color:#101014; }
code { background:#eee3da; padding:1px 4px; border-radius:3px; font-size:8.5pt;}
blockquote { border-left: 3px solid #B76E5B; margin-left:0; padding-left:14px; color:#55504a;}
hr { border:none; border-top:1px solid #d8cbc0; margin:22px 0; }
.chart-block { margin: 14px 0; text-align:center; }
.chart-svg { width:100%; max-width:640px; height:auto; }
.swatch-row { display:flex; gap:8px; margin:14px 0; }
.swatch { flex:1; height:70px; border-radius:6px; display:flex; align-items:center; justify-content:center; text-align:center; }
.swatch span { font-family: Arial, sans-serif; font-size:8.5pt; color:#F7F2EC; font-weight:bold; }
.cover { height: 297mm; width:210mm; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; background: linear-gradient(160deg,#101014 0%, #14424A 55%, #101014 100%); color:#F7F2EC; page-break-after: always; }
.cover .eyebrow { font-family: Arial, sans-serif; letter-spacing:3px; text-transform:uppercase; font-size:10pt; color:#E8C9BD; margin-bottom:18px;}
.cover h1 { border:none; font-size:34pt; color:#F7F2EC; max-width:150mm; line-height:1.25; margin:0 0 14px 0;}
.cover .sub { font-family: Georgia, serif; font-style:italic; font-size:13pt; color:#EED9CF; max-width:130mm;}
.cover .kk { width:70px; height:70px; border-radius:50%; border:2px solid #B76E5B; display:flex; align-items:center; justify-content:center; font-family:Georgia,serif; font-size:22pt; color:#B76E5B; margin-bottom: 28px;}
.cover .foot { position:absolute; bottom:16mm; font-family: Arial, sans-serif; font-size:9pt; color:#a99c92; letter-spacing:1px;}
.section-break { page-break-before: always; }
.evidence { font-family: Arial, sans-serif; font-size:7.5pt; letter-spacing:0.5px; padding:1px 6px; border-radius:3px; }
"""

def md_to_html(path):
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    return markdown.markdown(text, extensions=["tables", "fenced_code", "sane_lists"])

def make_cover(title, subtitle, eyebrow="KATHRYN K ACADEMY"):
    return f"""
    <div class="cover">
      <div class="kk">KK</div>
      <div class="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      <div class="sub">{subtitle}</div>
      <div class="foot">Prepared {datetime.date.today().strftime('%d %B %Y')} · Gold Coast, Queensland</div>
    </div>
    """

def build_pdf(out_name, cover_title, cover_sub, md_files, eyebrow="KATHRYN K ACADEMY"):
    body_html = make_cover(cover_title, cover_sub, eyebrow)
    for i, mdf in enumerate(md_files):
        path = os.path.join(ROOT, mdf)
        frag = md_to_html(path)
        cls = "page-wrap section-break" if i > 0 else "page-wrap section-break"
        body_html += f'<div class="{cls}">{frag}</div>'
    full_html = f"<html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{body_html}</body></html>"
    tmp_path = os.path.join(OUT, out_name.replace(".pdf", ".html"))
    with open(tmp_path, "w", encoding="utf-8") as f:
        f.write(full_html)
    return tmp_path

TARGETS = [
    dict(
        out="LASH_LOCK_COMPLETE_BUSINESS_PLAN.pdf",
        title="The Complete Business Plan",
        sub="Kathryn K Academy — strategy, market, product, financial model & final verdict",
        files=["01_EXECUTIVE_SUMMARY.md","02_AUDIT_MARKET_AND_CUSTOMER.md","03_PRODUCT_SUITE_SPECIFICATION.md",
               "04_VALIDATION_PLAN.md","06_FINANCIAL_MODEL.md","07_OWNERSHIP_ROLES_OPERATIONS.md",
               "12_RED_TEAM_COUNCIL_VERDICT.md"],
    ),
    dict(
        out="KATHRYN_K_ACADEMY_BRAND_GUIDE.pdf",
        title="Brand Guide",
        sub="Naming, story, voice, visual system & creative briefs",
        files=["05_BRAND_GUIDE.md"],
    ),
    dict(
        out="MARKETING_AND_CONTENT_SYSTEM.pdf",
        title="Marketing & Content System",
        sub="Organic strategy, 100 content ideas, Higgsfield AI workflow & website copy",
        files=["08_MARKETING_AND_CONTENT_SYSTEM.md","09_HIGGSFIELD_AI_SYSTEM.md","10_WEBSITE_AND_FUNNEL.md"],
    ),
    dict(
        out="LASH_LOCK_90_DAY_ACTION_PLAN.pdf",
        title="The 90-Day Dummy Guide",
        sub="Step-by-step daily setup plan with finance estimates",
        files=["11_ROADMAP_90_DAY_DUMMY_GUIDE.md"],
    ),
    dict(
        out="KAT_LASH_LOCK_ANNIVERSARY_PRESENTATION.pdf",
        title="Kat, I Built This Around You",
        sub="An anniversary presentation — 19 July 2026",
        files=["13_ANNIVERSARY_PRESENTATION.md","14_LETTER_TO_KAT.md"],
        eyebrow="FOR KAT — WITH LOVE",
    ),
]

def main():
    html_paths = []
    for t in TARGETS:
        p = build_pdf(t["out"], t["title"], t["sub"], t["files"], t.get("eyebrow","KATHRYN K ACADEMY"))
        html_paths.append((p, t["out"]))

    with sync_playwright() as pw:
        browser = pw.chromium.launch(executable_path=CHROME)
        page = browser.new_page()
        for html_path, out_name in html_paths:
            page.goto(f"file://{html_path}")
            page.pdf(
                path=os.path.join(OUT, out_name),
                format="A4",
                print_background=True,
                margin={"top":"0","bottom":"0","left":"0","right":"0"},
            )
            print(f"Rendered {out_name}")
        browser.close()

if __name__ == "__main__":
    main()
