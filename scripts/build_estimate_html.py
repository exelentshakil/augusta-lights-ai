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
  <title>Production Scope & Formal Estimate - Augusta Lights Generative AI Lighting Web App</title>
  <style>
    @page {{
      size: letter portrait;
      margin: 8mm 9mm 8mm 9mm;
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
      line-height: 1.36;
      font-size: 9.8px;
    }}

    /* The 6 Direct Flex Children Architecture - Uniform Natural Spacing */
    .page-container {{
      display: flex;
      flex-direction: column;
      gap: 8px;
      height: 100%;
      box-sizing: border-box;
    }}

    /* 1. Executive Header */
    .header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      border-bottom: 2px solid #d97706;
      padding-bottom: 6px;
    }}
    .header-left {{
      flex: 1;
      min-width: 0;
    }}
    .brand-title {{
      font-size: 8.5px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #d97706;
      margin-bottom: 2px;
      white-space: nowrap;
    }}
    h1 {{
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 2px 0;
      letter-spacing: -0.02em;
      line-height: 1.15;
      white-space: nowrap;
    }}
    .subtitle {{
      font-size: 8.8px;
      color: #475569;
      margin: 0;
      line-height: 1.25;
      white-space: nowrap;
    }}
    .meta-card {{
      flex-shrink: 0;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 6px 10px;
      font-size: 8.4px;
      text-align: right;
      line-height: 1.38;
      box-shadow: 0 1px 2px rgba(0,0,0,0.02);
      white-space: nowrap;
    }}
    .meta-card strong {{
      color: #0f172a;
    }}
    .live-badge {{
      display: inline-block;
      background: #ecfdf5;
      color: #059669;
      border: 1px solid #a7f3d0;
      font-weight: 700;
      padding: 1.5px 5.5px;
      border-radius: 9999px;
      font-size: 7.8px;
      text-transform: uppercase;
      margin-left: 3px;
    }}

    /* Executive Problem & Principle Callout */
    .exec-summary {{
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-left: 3.5px solid #d97706;
      padding: 7px 10px;
      border-radius: 4px;
      font-size: 8.6px;
      color: #78350f;
      line-height: 1.36;
    }}
    .exec-summary strong {{
      color: #92400e;
    }}

    /* 2. Scope Table */
    .section-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3.5px;
    }}
    .section-title {{
      font-size: 9.8px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #1e293b;
      border-left: 3px solid #d97706;
      padding-left: 6px;
      margin: 0;
    }}
    .section-meta {{
      font-size: 8.4px;
      color: #64748b;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }}
    table {{
      width: 100%;
      border-collapse: collapse;
    }}
    th {{
      background: #f1f5f9;
      color: #334155;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 8.4px;
      letter-spacing: 0.04em;
      border: 1px solid #cbd5e1;
      padding: 5px 7px;
      text-align: left;
    }}
    td {{
      border: 1px solid #e2e8f0;
      padding: 6.8px 7px;
      font-size: 8.8px;
      vertical-align: top;
    }}
    .phase-num {{
      font-weight: 800;
      color: #1e293b;
      font-size: 8.8px;
      white-space: nowrap;
    }}
    .phase-name {{
      font-weight: 700;
      color: #0f172a;
      font-size: 9.3px;
    }}
    .phase-desc {{
      color: #475569;
      font-size: 8.3px;
      margin-top: 2.2px;
      line-height: 1.3;
    }}
    .phase-0-row {{
      background: #f0fdf4;
    }}
    .phase-0-badge {{
      color: #15803d;
      font-weight: 800;
    }}
    .total-row {{
      background: #0f172a;
      color: #ffffff;
      font-weight: 800;
      border: 1px solid #0f172a;
    }}
    .total-row td {{
      border: 1px solid #0f172a;
      padding: 6.5px 7px;
      font-size: 9.2px;
    }}

    /* 3. 2-Column Grid */
    .grid-2col {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }}
    .card-box {{
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #f8fafc;
      padding: 8px 11px;
    }}
    .card-box-title {{
      font-size: 8.9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #1e293b;
      margin: 0 0 4.5px 0;
      display: flex;
      align-items: center;
      gap: 4px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 3px;
    }}
    .milestone-item {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
      border-bottom: 1px dotted #cbd5e1;
      padding: 3.6px 0;
      font-size: 8.3px;
    }}
    .milestone-item:last-child {{
      border-bottom: none;
      padding-bottom: 0;
    }}
    .milestone-name {{
      color: #334155;
    }}
    .milestone-val {{
      font-weight: 800;
      color: #0f172a;
      font-family: ui-monospace, monospace;
      white-space: nowrap;
    }}
    .guardrail-item {{
      font-size: 8.2px;
      color: #334155;
      margin-bottom: 3.5px;
      padding-left: 11px;
      position: relative;
      line-height: 1.28;
    }}
    .guardrail-item:last-child {{
      margin-bottom: 0;
    }}
    .guardrail-item::before {{
      content: "✓";
      position: absolute;
      left: 0;
      color: #16a34a;
      font-weight: 800;
      font-size: 7.5px;
    }}

    /* 4. Commercial Terms Section */
    .terms-box {{
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #ffffff;
      padding: 8px 11px;
    }}
    .terms-grid {{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }}
    .term-col {{
      font-size: 8px;
      line-height: 1.28;
    }}
    .term-title {{
      font-weight: 800;
      color: #d97706;
      text-transform: uppercase;
      font-size: 7.9px;
      margin-bottom: 2.5px;
    }}
    .term-body {{
      color: #475569;
    }}

    /* 5. Formal Acceptance Authorization Block */
    .auth-block {{
      border: 1px solid #94a3b8;
      border-radius: 6px;
      background: #f8fafc;
      padding: 8px 13px;
    }}
    .auth-title {{
      font-size: 8.6px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #0f172a;
      margin-bottom: 4.5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 3px;
    }}
    .auth-grid {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }}
    .auth-party {{
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 8.2px;
    }}
    .auth-party-title {{
      font-weight: 700;
      color: #334155;
      text-transform: uppercase;
      font-size: 7.9px;
      margin-bottom: 1.5px;
    }}
    .auth-sign-line {{
      display: flex;
      align-items: flex-end;
      gap: 8px;
      margin-top: 4px;
    }}
    .auth-sign-field {{
      flex: 1;
      border-bottom: 1.2px solid #475569;
      min-height: 28px;
      display: flex;
      align-items: flex-end;
      font-family: "Brush Script MT", "Apple Chancery", "Segoe Script", cursive, sans-serif;
      font-size: 15.5px;
      color: #1e3a8a;
      padding-left: 4px;
      padding-bottom: 1px;
    }}
    .auth-date-field {{
      width: 75px;
      border-bottom: 1.2px solid #475569;
      min-height: 28px;
      font-family: ui-monospace, monospace;
      font-size: 8.3px;
      color: #334155;
      text-align: center;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding-bottom: 1px;
    }}
    .auth-label {{
      font-size: 7.1px;
      color: #64748b;
      text-transform: uppercase;
      margin-top: 2px;
    }}

    /* 6. Executive Signature Footer */
    .footer-container {{
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #f8fafc;
      padding: 7px 13px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    }}
    .footer-founder {{
      display: flex;
      align-items: center;
      gap: 9px;
      flex: 1;
      min-width: 0;
    }}
    .founder-avatar {{
      width: 37px;
      height: 37px;
      border-radius: 50%;
      object-fit: cover;
      border: 1.5px solid #d97706;
      box-shadow: 0 1px 3px rgba(217,119,6,0.15);
      flex-shrink: 0;
    }}
    .founder-info {{
      display: flex;
      flex-direction: column;
      gap: 1px;
      min-width: 0;
    }}
    .founder-name {{
      font-size: 8.9px;
      color: #0f172a;
      line-height: 1.2;
      white-space: nowrap;
    }}
    .founder-name strong {{
      color: #0f172a;
      font-weight: 800;
    }}
    .founder-company {{
      font-size: 8.1px;
      color: #334155;
      line-height: 1.2;
      white-space: nowrap;
    }}
    .founder-company strong {{
      color: #1e293b;
      font-weight: 700;
    }}
    .founder-sub {{
      font-size: 7.6px;
      color: #475569;
      line-height: 1.2;
      white-space: nowrap;
    }}
    .footer-brand {{
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2.5px;
      flex-shrink: 0;
    }}
    .business-logo {{
      height: 18px;
      width: auto;
      object-fit: contain;
    }}
    .demo-badge {{
      font-size: 7.7px;
      color: #d97706;
      background: #fffbeb;
      border: 1px solid #fde68a;
      padding: 1.5px 6px;
      border-radius: 3px;
      font-weight: 700;
      font-family: ui-monospace, monospace;
      text-decoration: none;
      white-space: nowrap;
    }}
  </style>
</head>
<body>
<div class="page-container">
  <!-- 1. Executive Header -->
  <div class="header">
    <div class="header-left">
      <div class="brand-title">BarakahSoft LLC • Systems Architecture • Ref #BS-2026-AUG-049</div>
      <h1>Augusta Lights Texas • In-Car Lighting Visualization Web App</h1>
      <p class="subtitle">Two-Stage Generative Dusk &amp; Inpainting Pipeline, C9 &amp; Omni Vector Engine, 10s Mobile Roofline &amp; 2x2 Sheet</p>
    </div>
    <div class="meta-card">
      <div><strong>Client:</strong> Augusta Lights / Augusta Lawn Care Franchise (Texas)</div>
      <div><strong>Timeline:</strong> 10 Calendar Days (Accelerated Delivery)</div>
      <div><strong>Contract Value:</strong> <strong>$4,000.00 Fixed Price (Turnkey Package)</strong></div>
      <div><strong>Live Prototype:</strong> <span class="live-badge">Verified &amp; Audited</span></div>
    </div>
  </div>

  <!-- Executive Guarantee Callout -->
  <div class="exec-summary">
    <strong>Architectural Preservation Guarantee:</strong> We eliminate the primary failure mode of AI lighting apps (modifying home structure). Our decoupled Two-Stage Pipeline locks the property geometry via SAM-2 boundary vectors (windows, roof pitch, brick, mature trees remain 100% identical) and cleans daytime distractions into a Texas Blue-Hour Dusk Master before compositing C9 commercial LEDs (15" spacing) and Omni vertical wall-wash beams (8" spacing). GMs generate 2K renders in &lt;1.5s from the truck.
  </div>

  <!-- 2. Scope Table -->
  <div class="scope-block">
    <div class="section-header">
      <h2 class="section-title">Milestone Scope &amp; Delivery Schedule</h2>
      <div class="section-meta">Live Demo: https://augusta-lights-ai.vercel.app</div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 13%;">Phase</th>
          <th style="width: 55%;">Engineering Deliverables &amp; Architectural Specifications</th>
          <th style="width: 10%; text-align: center;">Timeline</th>
          <th style="width: 10%; text-align: right;">Rate</th>
          <th style="width: 12%; text-align: right;">Investment</th>
        </tr>
      </thead>
      <tbody>
        <tr class="phase-0-row">
          <td class="phase-num"><span class="phase-0-badge">Phase 0</span></td>
          <td>
            <div class="phase-name">Interactive Working Architecture Prototype &amp; Live In-Car Cockpit</div>
            <div class="phase-desc">Two-stage generative pipeline, SAM-2 structural preservation mask, blue-hour dusk grading with 2700K window illumination, driveway vehicle inpainting, C9/Omni vector preview, and 10s roofline drawer. Delivered upfront in &lt;30m to eliminate all architectural risk.</div>
          </td>
          <td style="text-align: center; font-weight: 700; white-space: nowrap;">0.5 hrs (&lt;30m)</td>
          <td style="text-align: right; color: #16a34a; font-weight: 700;">$0.00</td>
          <td style="text-align: right; font-weight: 800; color: #16a34a;">$0.00 (Live)</td>
        </tr>
        <tr>
          <td class="phase-num">Phase 1</td>
          <td>
            <div class="phase-name">Architectural Ingestion, SAM-2 Boundary Lock &amp; Dusk Cleanse</div>
            <div class="phase-desc">Single front-facing mobile upload integration; SAM-2 structural boundary segmentation locking windows, doors, garage, roof pitch, brick, and mature oak trees at 100% fidelity. Blue-hour twilight conversion, 2700K window illumination, and semantic driveway vehicle/bin inpainting.</div>
          </td>
          <td style="text-align: center; font-weight: 600;">Days 1–3</td>
          <td style="text-align: right;">Fixed</td>
          <td style="text-align: right; font-weight: 700;">$1,000.00</td>
        </tr>
        <tr>
          <td class="phase-num">Phase 2</td>
          <td>
            <div class="phase-name">Vector Roofline Compositor, C9 &amp; Omni Hardware Precision</div>
            <div class="phase-desc">Commercial C9 LED engine with authentic 15" diode spacing and 2/2 repeating patterns (Warm White, Cool White, Candy Cane 2R/2W, Winter Blue, Red/Green, Jewel Multi). Omni Permanent lighting with 8" spacing, 30° vertical downward wall wash, 3000K/5000K/RGB/Lone Star scenes, and decor vectors.</div>
          </td>
          <td style="text-align: center; font-weight: 600;">Days 4–6</td>
          <td style="text-align: right;">Fixed</td>
          <td style="text-align: right; font-weight: 700;">$1,000.00</td>
        </tr>
        <tr>
          <td class="phase-num">Phase 3</td>
          <td>
            <div class="phase-name">Field GM In-Car Ergonomics, 10–20s Roofline &amp; Voice Revisions</div>
            <div class="phase-desc">Mobile-first touch UI (390px–430px single-thumb ergonomics). 10–20 second touch-toggle roofline exclusion tool for non-front ridges, 1-tap "Reset to Front-Facing Only" quick action, and natural-language voice/text intent parser mapping commands directly to vector states.</div>
          </td>
          <td style="text-align: center; font-weight: 600;">Days 7–8</td>
          <td style="text-align: right;">Fixed</td>
          <td style="text-align: right; font-weight: 700;">$1,000.00</td>
        </tr>
        <tr>
          <td class="phase-num">Phase 4</td>
          <td>
            <div class="phase-name">Client-Side 2x2 Inspiration Sheet &amp; Dual AI Resilience</div>
            <div class="phase-desc">Client-side HTML5 canvas synthesis generating 2560x1440 2x2 comparison sheets (Warm White, Candy Cane, Blue/White, Omni Wash) with 1-click lossless JPEG download. Zero-dependency dual-provider failover (OpenAI gpt-4o-mini + Gemini 2.0 Flash) and Texas offline rule engine for zero-signal driveways.</div>
          </td>
          <td style="text-align: center; font-weight: 600;">Days 9–10</td>
          <td style="text-align: right;">Fixed</td>
          <td style="text-align: right; font-weight: 700;">$1,000.00</td>
        </tr>
        <tr class="total-row">
          <td colspan="2" style="text-align: left; font-weight: 800;">TOTAL COMPLETE TURNKEY ROLLOUT (ALL 4 MILESTONES + STAGING)</td>
          <td style="text-align: center; font-weight: 800;">10 Days</td>
          <td style="text-align: right; font-weight: 800;">Fixed Price</td>
          <td style="text-align: right; font-weight: 800;">$4,000.00</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 3. 2-Column Milestone & Architecture Grid -->
  <div class="grid-2col">
    <!-- Modular Milestone Options Box -->
    <div class="card-box">
      <div class="card-box-title">Modular Milestone Options (Escrow Flexibility)</div>
      <div class="milestone-item">
        <span class="milestone-name"><strong>Option A:</strong> Milestone 1 Only (Dusk Cleanse + Inpainting + SAM-2 Lock)</span>
        <span class="milestone-val">$1,000.00 (Days 1–3)</span>
      </div>
      <div class="milestone-item">
        <span class="milestone-name"><strong>Option B:</strong> Milestone 2 Only (C9 15" Spacing + Omni 8" Wall Wash)</span>
        <span class="milestone-val">$1,000.00 (Days 4–6)</span>
      </div>
      <div class="milestone-item">
        <span class="milestone-name"><strong>Option C:</strong> Milestone 3 Only (Mobile 10s Roofline + Natural Language)</span>
        <span class="milestone-val">$1,000.00 (Days 7–8)</span>
      </div>
      <div class="milestone-item">
        <span class="milestone-name"><strong>Option D:</strong> Complete Turnkey Package (All 4 Milestones + Warranty)</span>
        <span class="milestone-val">$4,000.00 (10 Days)</span>
      </div>
    </div>

    <!-- Architecture Guardrails Box -->
    <div class="card-box">
      <div class="card-box-title">Architecture Guardrails &amp; Performance Guarantees</div>
      <div class="guardrail-item"><strong>100% Architectural Lock:</strong> SAM-2 boundary vector mask prevents generative hallucination; windows, roof pitches, siding, and mature trees remain structurally identical.</div>
      <div class="guardrail-item"><strong>In-Car Speed (&lt;1.5s):</strong> Dual-provider LLM response in ~1.2s, generating 2K JPEG hero renders and 2x2 inspiration sheets well within the 10–13 minute driveway window.</div>
      <div class="guardrail-item"><strong>Zero-Signal Rural Driveway Safe:</strong> Offline deterministic Texas lighting rule engine guarantees 100% operational uptime even without cellular reception.</div>
    </div>
  </div>

  <!-- 4. Commercial Terms & Conditions -->
  <div class="terms-box">
    <div class="card-box-title" style="margin-bottom: 4px;">Commercial Terms &amp; Production Engagement Conditions</div>
    <div class="terms-grid">
      <div class="term-col">
        <div class="term-title">Escrow Milestones</div>
        <div class="term-body">100% milestone-based on Upwork. Funds deposited in escrow per phase and released strictly upon verified staging sign-off.</div>
      </div>
      <div class="term-col">
        <div class="term-title">Full IP Ownership</div>
        <div class="term-body">Complete copyright, source code, Next.js repository, canvas synthesis scripts, and prompt architectures transfer to Augusta Lights.</div>
      </div>
      <div class="term-col">
        <div class="term-title">30-Day Hypercare SLA</div>
        <div class="term-body">Includes 30 days of complimentary post-deployment monitoring, prompt tuning, and priority bug resolution at zero cost.</div>
      </div>
      <div class="term-col">
        <div class="term-title">Turnkey Validity</div>
        <div class="term-body">Valid for 30 days through October 15, 2026. Turnkey fixed price of $4,000.00 covers all specified deliverables with zero hidden fees.</div>
      </div>
    </div>
  </div>

  <!-- 5. Formal Acceptance Authorization -->
  <div class="auth-block">
    <div class="auth-title">
      <span>Formal Authorization &amp; Engagement Acceptance</span>
      <span style="font-weight: 500; font-size: 7.6px; color: #475569;">Binding upon signature by authorized representatives</span>
    </div>
    <div class="auth-grid">
      <div class="auth-party">
        <div class="auth-party-title">Authorized Provider: BarakahSoft LLC (Wyoming, USA)</div>
        <div>Signatory: <strong>Shakil Ahmed</strong> • Principal Systems Architect &amp; Founder</div>
        <div class="auth-sign-line">
          <div class="auth-sign-field">Shakil Ahmed</div>
          <div class="auth-date-field">15 Sep 2026</div>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span class="auth-label">Authorized Provider Signature</span>
          <span class="auth-label" style="width: 75px; text-align: center;">Date</span>
        </div>
      </div>

      <div class="auth-party">
        <div class="auth-party-title">Authorized Client: Augusta Lights / Franchise Partner (Texas)</div>
        <div>Signatory: <strong>Authorized Representative</strong> • Franchise Leadership</div>
        <div class="auth-sign-line">
          <div class="auth-sign-field" style="color: #64748b; font-family: inherit; font-size: 8.4px; font-style: italic;">[ Accepted via Upwork Contract Offer / Sign-off ]</div>
          <div class="auth-date-field">___ / ___ / 2026</div>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span class="auth-label">Authorized Client Signature</span>
          <span class="auth-label" style="width: 75px; text-align: center;">Date</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 6. Executive Signature Footer -->
  <div class="footer-container">
    <div class="footer-founder">
      <img src="data:image/jpeg;base64,{headshot_b64}" alt="Shakil Ahmed" class="founder-avatar" />
      <div class="founder-info">
        <div class="founder-name"><strong>Shakil Ahmed</strong> • Founder &amp; Lead Systems Architect (12+ Yrs Exp)</div>
        <div class="founder-company"><strong>BarakahSoft LLC</strong> • Enterprise Systems Engineering Partner</div>
        <div class="founder-sub">Former Lead Engineer at Legiit ($1M ARR Command Center) • Verified Upwork Partner</div>
      </div>
    </div>
    <div class="footer-brand">
      <img src="data:image/png;base64,{logo_b64}" alt="BarakahSoft" class="business-logo" />
      <a href="https://augusta-lights-ai.vercel.app" target="_blank" class="demo-badge">augusta-lights-ai.vercel.app</a>
    </div>
  </div>
</div>
</body>
</html>
"""

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print("Saved updated ESTIMATE.html to:", html_path)

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
    print("Successfully recompiled ESTIMATE.pdf at:", pdf_path)
else:
    print("Chrome print-to-pdf error:", res.stderr)

with open(pdf_path, "rb") as f:
    pdf_bytes = f.read()

pages = re.findall(rb"/Type\s*/Page[^s]", pdf_bytes)
print(f"Verified PDF page count: {len(pages)} page(s)")
