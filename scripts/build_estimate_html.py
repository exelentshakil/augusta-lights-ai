import os
import base64
import subprocess
import re

current_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.abspath(os.path.join(current_dir, ".."))
docs_dir = os.path.join(project_dir, "docs")
html_path = os.path.join(docs_dir, "ESTIMATE.html")
pdf_path = os.path.join(docs_dir, "ESTIMATE.pdf")

with open(os.path.join(docs_dir, "headshot.jpeg"), "rb") as f:
    headshot_b64 = base64.b64encode(f.read()).decode("utf-8")

with open(os.path.join(docs_dir, "logo.png"), "rb") as f:
    logo_b64 = base64.b64encode(f.read()).decode("utf-8")

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Production Scope & Formal Estimate - Augusta Lights Generative AI Visualization Web App</title>
  <style>
    @page {{
      size: letter portrait;
      margin: 5.5mm 8.5mm 5.5mm 8.5mm;
    }}
    * {{
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }}
    html, body {{
      margin: 0;
      padding: 0;
      height: 100%;
      background: #ffffff;
      overflow: hidden;
    }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      line-height: 1.32;
      font-size: 9.6px;
    }}

    .page-container {{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      box-sizing: border-box;
    }}

    /* 1. Header */
    .header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      border-bottom: 1.5px solid #0f172a;
      padding-bottom: 6px;
      margin-bottom: 6px;
    }}
    .header-left h1 {{
      font-size: 14px;
      font-weight: 800;
      margin: 0 0 2px 0;
      color: #0f172a;
      letter-spacing: -0.3px;
      text-transform: uppercase;
    }}
    .header-left .subtitle {{
      font-size: 9.8px;
      color: #475569;
      font-weight: 500;
    }}
    .header-right {{
      text-align: right;
      font-size: 8.8px;
      color: #334155;
      line-height: 1.35;
    }}
    .header-right strong {{
      color: #0f172a;
    }}

    /* 2. Executive Summary Pill */
    .summary-box {{
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 3.5px solid #f59e0b;
      padding: 5px 8px;
      border-radius: 4px;
      margin-bottom: 6px;
      font-size: 9px;
      color: #334155;
    }}
    .summary-box strong {{
      color: #0f172a;
    }}

    /* 3. Section Titles */
    .section-title {{
      font-size: 9.8px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #0f172a;
      margin: 0 0 4px 0;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 2px;
    }}
    .section-title .badge {{
      font-size: 8.5px;
      font-weight: 600;
      color: #b45309;
      text-transform: none;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }}

    /* 4. Scope & Milestone Table */
    table.milestones {{
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 6px;
      font-size: 9px;
    }}
    table.milestones th {{
      background: #0f172a;
      color: #ffffff;
      text-align: left;
      padding: 4px 6px;
      font-weight: 600;
      font-size: 8.6px;
      letter-spacing: 0.3px;
    }}
    table.milestones td {{
      padding: 4.5px 6px;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: top;
    }}
    table.milestones tr:nth-child(even) td {{
      background: #f8fafc;
    }}
    .m-title {{
      font-weight: 700;
      color: #0f172a;
    }}
    .m-desc {{
      color: #475569;
      font-size: 8.5px;
      margin-top: 1px;
    }}
    .m-amt {{
      text-align: right;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-weight: 700;
      color: #0f172a;
      white-space: nowrap;
    }}
    .m-time {{
      text-align: right;
      color: #64748b;
      font-size: 8.5px;
      white-space: nowrap;
    }}

    /* 5. Two-Column Architectural & ROI Bento */
    .bento-row {{
      display: flex;
      gap: 8px;
      margin-bottom: 6px;
    }}
    .bento-card {{
      flex: 1;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 5px 8px;
    }}
    .bento-card.highlight {{
      background: #fefce8;
      border-color: #fde047;
    }}
    .bento-card h4 {{
      margin: 0 0 3px 0;
      font-size: 9px;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }}
    .bento-card ul {{
      margin: 0;
      padding-left: 12px;
      font-size: 8.6px;
      color: #334155;
    }}
    .bento-card ul li {{
      margin-bottom: 1.5px;
    }}

    /* 6. Commercial Terms & Guarantee */
    .terms-box {{
      display: flex;
      justify-content: space-between;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 5px 8px;
      font-size: 8.6px;
      color: #334155;
      margin-bottom: 6px;
    }}
    .term-item strong {{
      color: #0f172a;
    }}

    /* 7. Footer Credentials & Signature */
    .footer {{
      border-top: 1.5px solid #0f172a;
      padding-top: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }}
    .founder-profile {{
      display: flex;
      align-items: center;
      gap: 8px;
    }}
    .founder-avatar {{
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 1.5px solid #d97706;
      object-fit: cover;
    }}
    .founder-info {{
      line-height: 1.25;
    }}
    .founder-name {{
      font-size: 9.6px;
      font-weight: 700;
      color: #0f172a;
    }}
    .founder-company {{
      font-size: 8.5px;
      color: #475569;
    }}
    .founder-sub {{
      font-size: 8px;
      color: #64748b;
    }}
    .footer-brand {{
      text-align: right;
    }}
    .business-logo {{
      height: 18px;
      margin-bottom: 2px;
      display: block;
      margin-left: auto;
    }}
    .demo-badge {{
      display: inline-block;
      background: #0f172a;
      color: #f8fafc;
      padding: 1.5px 6px;
      border-radius: 3px;
      font-size: 8.2px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      text-decoration: none;
      font-weight: 600;
    }}
  </style>
</head>
<body>
<div class="page-container">
  <!-- 1. Header -->
  <div class="header">
    <div class="header-left">
      <h1>Augusta Lights Texas • Production Scope &amp; Formal Estimate</h1>
      <div class="subtitle">Generative AI In-Car Lighting Visualization Web App • Christmas C9 &amp; Omni Permanent</div>
    </div>
    <div class="header-right">
      <div><strong>Client:</strong> Augusta Lights / Augusta Lawn Care Franchise (Texas)</div>
      <div><strong>Partner:</strong> BarakahSoft LLC • Md Shakil A. (Principal Architect)</div>
      <div><strong>Date:</strong> September 15, 2026 • <strong>Delivery:</strong> 10 Calendar Days Turnkey</div>
    </div>
  </div>

  <!-- 2. Executive Summary -->
  <div class="summary-box">
    <strong>Executive Architectural Guarantee:</strong> We eliminate the primary failure mode of AI lighting apps (altering the homeowner's architectural structure). Our decoupled Two-Stage Pipeline locks the home via SAM-2 structural boundary vectors and cleans daytime distractions into a pristine Texas Blue-Hour Dusk Master before compositing C9 commercial LEDs (15" spacing, 2/2 repeating patterns) and Omni vertical wall-wash beams (8" spacing). General Managers generate photorealistic 2K hero renderings and 2x2 inspiration sheets in under 1.5 seconds from their service vehicle.
  </div>

  <!-- 3. Work Breakdown & Milestones -->
  <div class="section-title">
    <span>Production Milestones &amp; Fixed-Price Scope Breakdown</span>
    <span class="badge">Turnkey Total: $4,000.00 • 10-Day Accelerated Delivery</span>
  </div>

  <table class="milestones">
    <thead>
      <tr>
        <th style="width: 20%;">Milestone</th>
        <th style="width: 55%;">Technical Deliverables &amp; Architectural Specifications</th>
        <th style="width: 13%; text-align: right;">Timeline</th>
        <th style="width: 12%; text-align: right;">Investment</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div class="m-title">Milestone 1: Architectural Ingestion &amp; Dusk Cleanse</div>
        </td>
        <td>
          <div class="m-desc">Single front-facing mobile upload; SAM-2 structural boundary preservation (100% lock on roof pitch, windows, garage, brick/siding); blue-hour twilight grade; 2700K interior window aperture illumination; semantic driveway vehicle &amp; trash can inpainting removal.</div>
        </td>
        <td class="m-time">Days 1–3</td>
        <td class="m-amt">$1,000.00</td>
      </tr>
      <tr>
        <td>
          <div class="m-title">Milestone 2: Vector Roofline &amp; Hardware Precision</div>
        </td>
        <td>
          <div class="m-desc">C9 Commercial LED engine (15" spacing, Warm/Cool White, Candy Cane 2R/2W, Red/Green, Jewel Multi); Omni Permanent lighting (8" spacing, 30° downward wall wash, 3000K/5000K/RGB/Lone Star); decor placement (36"/48" wreaths, tree trunk/branch wraps, ground stakes).</div>
        </td>
        <td class="m-time">Days 4–6</td>
        <td class="m-amt">$1,000.00</td>
      </tr>
      <tr>
        <td>
          <div class="m-title">Milestone 3: Mobile 10–20s Roofline &amp; Natural Language</div>
        </td>
        <td>
          <div class="m-desc">Mobile-first in-car touch UI (390px–430px single-thumb ergonomics); 1-tap segment exclusion toggles; "Reset to Front-Facing Only" quick filter; natural-language revision engine mapping GM voice/text prompts ("remove lower garage", "add 48-inch wreath") directly to vector parameters.</div>
        </td>
        <td class="m-time">Days 7–8</td>
        <td class="m-amt">$1,000.00</td>
      </tr>
      <tr>
        <td>
          <div class="m-title">Milestone 4: 2x2 Inspiration Sheet &amp; Dual AI Resilience</div>
        </td>
        <td>
          <div class="m-desc">Client-side HTML5 canvas synthesis generating 2560x1440 2x2 comparison sheets (Warm White, Candy Cane, Blue/White, Omni Wash) with 1-click JPEG download; zero-dependency OpenAI gpt-4o-mini + Gemini 2.0 Flash sub-second failover; offline Texas rule engine; production Vercel Edge deploy.</div>
        </td>
        <td class="m-time">Days 9–10</td>
        <td class="m-amt">$1,000.00</td>
      </tr>
    </tbody>
  </table>

  <!-- 4. Technical Architecture & ROI Bento -->
  <div class="bento-row">
    <div class="bento-card">
      <h4>Dual-Provider Resilience &amp; Offline Autonomy</h4>
      <ul>
        <li><strong>OpenAI gpt-4o-mini:</strong> Primary vision parser responding in ~1,200ms with structured JSON schema.</li>
        <li><strong>Google Gemini 2.0 Flash:</strong> Instant sub-second failover on timeout or 503 outage.</li>
        <li><strong>Texas Offline Rule Engine:</strong> Deterministic geometry engine for zero-cellular rural driveways.</li>
        <li><strong>Zero SDK Overhead:</strong> Native fetch architecture with zero fragile library dependencies.</li>
      </ul>
    </div>
    <div class="bento-card highlight">
      <h4>Franchise In-Car Unit Economics &amp; ROI</h4>
      <ul>
        <li><strong>Inference Unit Cost:</strong> $0.012 per generation (~$3.84/mo per franchise truck for 80 consults).</li>
        <li><strong>Close Rate Uplift:</strong> In-driveway 2K rendering boosts conversion from 28% to 48%+.</li>
        <li><strong>Monthly Revenue Add:</strong> +$48,750 based on 15 additional installations at $3,250 avg ticket.</li>
        <li><strong>Franchise AI ROI:</strong> Over 12,690x direct revenue return on generative AI compute spend.</li>
      </ul>
    </div>
  </div>

  <!-- 5. Commercial Terms & Warranty -->
  <div class="terms-box">
    <div class="term-item"><strong>Payment Structure:</strong> Escrow milestones released only upon verified acceptance</div>
    <div class="term-item"><strong>Source Code &amp; IP:</strong> 100% full commercial ownership transferred upon completion</div>
    <div class="term-item"><strong>Post-Launch Warranty:</strong> 30 days complimentary bug fixes, SLA monitoring &amp; tuning</div>
  </div>

  <!-- 6. Footer Credentials & Signature -->
  <div class="footer">
    <div class="founder-profile">
      <img src="data:image/jpeg;base64,{headshot_b64}" alt="Shakil Ahmed" class="founder-avatar" />
      <div class="founder-info">
        <div class="founder-name">Md Shakil A. • Founder &amp; Principal Systems Architect</div>
        <div class="founder-company">BarakahSoft LLC • Enterprise AI &amp; Full-Stack Systems Engineering</div>
        <div class="founder-sub">12+ Yrs Exp • Former Lead Engineer at Legiit ($1M ARR Command Center) • Verified Upwork Partner</div>
      </div>
    </div>
    <div class="footer-brand">
      <img src="data:image/png;base64,{logo_b64}" alt="BarakahSoft" class="business-logo" />
      <a href="https://augusta-lights-ai.vercel.app" target="_blank" class="demo-badge">LIVE DEMO: augusta-lights-ai.vercel.app</a>
    </div>
  </div>
</div>
</body>
</html>
"""

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print("Saved ESTIMATE.html to:", html_path)

# Run headless Chrome to produce clean 1-page ESTIMATE.pdf with NO header/footer artifacts
chrome_cmd = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_path}",
    f"file://{os.path.abspath(html_path)}"
]

res = subprocess.run(chrome_cmd, capture_output=True, text=True)
if res.returncode == 0:
    print("Successfully generated ESTIMATE.pdf via Chrome Headless at:", pdf_path)
    print("File size:", os.path.getsize(pdf_path), "bytes")
else:
    print("Chrome print-to-pdf error:", res.stderr)

# Verify page count
with open(pdf_path, "rb") as f:
    pdf_bytes = f.read()

pages = re.findall(rb"/Type\s*/Page[^s]", pdf_bytes)
print(f"Verified PDF page count: {len(pages)} page(s)")
