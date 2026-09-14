# Product Requirements Document (PRD)
## Augusta Lights AI — Mobile Architectural Lighting Visualization Platform

**Version:** 1.0.0-PROD  
**Author:** Shakil Ahmed · Founder & Principal Systems Architect, BarakahSoft LLC  
**Target Organization:** Augusta Lawn Care / Augusta Lights Franchise Network (Texas Locations)  
**Target Users:** General Managers (GMs), In-Home Lighting Sales Specialists  
**Operating Environment:** Mobile Web Application (Optimized for iPhone/Android in-vehicle field use)  

---

### 1. Executive Summary & Problem Statement

Augusta Lights operates residential Christmas lighting and Omni permanent architectural lighting installations across multiple Augusta Lawn Care franchise locations in Texas. During in-home sales consultations, General Managers (GMs) meet with homeowners, assess property architecture, discuss design preferences, and provide an initial ballpark estimate. 

Following this discussion, GMs have an approximately **10–13 minute window in their service vehicle** while the homeowner considers the proposal. Today, generating realistic visual proofs during this window is either impossible or plagued by generic generative AI tools that hallucinate structural changes—inventing windows, altering roof pitches, replacing brick/siding, or shifting permanent landscaping. When a homeowner sees an image where their home has been redesigned, trust is destroyed and the rendering is classified as a **FAILED installation visualization**.

**Augusta Lights AI** is a purpose-built, mobile-first operational web application engineered specifically for Texas franchise GMs. It allows a GM to snap a single front-facing photograph, enter the customer's residence name, select lighting specifications (C9 Christmas or Omni Permanent), adjust roofline detection in 10–20 seconds, and produce a photorealistic 2K hero architectural rendering and a 2x2 inspiration sheet—all within the 10–13 minute in-car window.

---

### 2. Core Architectural Principle: Zero Structural Redesign

The platform is strictly governed by the **Defensibility Hook**:
> **"SAME EXACT PROPERTY + PROFESSIONAL DUSK TRANSFORMATION + REALISTIC PROPOSED LIGHTING INSTALLATION."**  
> *The AI must never redesign the customer's home. A beautiful image that materially changes the architecture is a failed rendering.*

#### Unbreakable Preservation Rules
The system enforces strict structural constraints preventing the AI model from:
1. Adding, removing, or resizing windows.
2. Adding, removing, or modifying front or garage doors.
3. Adding porches, porticos, columns, or overhangs not present in the original photograph.
4. Altering rooflines, dormers, valleys, ridges, or roof pitch geometry.
5. Changing brick, mortar, stone, stucco, or siding materials and textures.
6. Altering permanent landscaping, mature trees, lawn topography, or sidewalks.
7. Changing driveway geometry, curbs, or property layout.
8. Adding synthetic structural elements.

---

### 3. The 100-Person Virtual Studio Team Discovery Analysis

To ensure production-grade depth, this platform was analyzed across 7 specialized discipline perspectives:

1. **Lead Product Designer**:
   - High-density mobile-first viewport (390px–430px iPhone standard) with tablet/desktop expansion.
   - 12px+ typography scale (strict compliance with design system standards, zero unreadable micro-text).
   - High-contrast touch targets (minimum 44x44px) for rapid, single-thumb operation inside a service truck.
   - Interactive 10–20 second roofline correction with tactile segment toggles and vertex nudges.
   - Split-screen comparison slider allowing instant inspection of Daytime Original ➔ Cleaned Dusk Master ➔ Final 2K Hero.

2. **Systems Architect**:
   - Decoupled **Two-Stage Generative Pipeline**:
     - *Stage 1 (Cleaned Dusk Master)*: Normalizes daytime photo into blue-hour twilight, populates realistic evening sky, adds warm interior window glow to existing apertures, and removes vehicles/trash cans via structural inpainting.
     - *Stage 2 (Lighting Layer Variations)*: Locks the Stage 1 master as the immutable base canvas and composites lighting passes (C9 rooflines, Omni wall wash, wreaths, wraps) onto verified coordinates.
   - Guarantees 100% house consistency across 2x2 inspiration sheet variations.

3. **Full-Stack Programmer**:
   - Next.js 15 App Router with zero hydration discrepancies.
   - Defensive typing across all lighting parameters, color arrays, and coordinate objects.
   - Local storage session caching to prevent lost data if cellular connectivity dips during in-car consultations.
   - High-performance client-side image canvas compositing with instant 2K export.

4. **AI Research Specialist**:
   - Zero-dependency dual-provider fallback engine: OpenAI (`gpt-4o-mini`) primary with sub-second failover to Google Gemini (`gemini-2.0-flash`).
   - Server-side image transformation architecture evaluating Gemini 2.5 Flash Image / Nano Banana, FLUX.1 Fill with ControlNet Canny/Depth edge retention, and SAM-2 semantic segmentation.
   - Strict structural prompt engineering isolating scene lighting from architectural geometry.

5. **Motion / Animation Designer**:
   - Interactive SVG visual workflow pipeline canvas (`WorkflowCanvas.tsx`) showing real-time execution states: Ingestion ➔ Preservation Mask ➔ Dusk Cleanse ➔ Roofline Vectoring ➔ Lighting Composite ➔ 2K Hero.
   - Dynamic glowing laser packet pulses along SVG spline connectors indicating active background processing.

6. **Product Marketer & Franchise Operations**:
   - Positioned as a closing tool: transforms a verbal quote into an emotional, high-conversion visual moment ("THAT'S MY HOUSE").
   - Instant 2x2 comparison sheets allowing homeowners to compare Warm White (#1 seller) with Candy Cane or Omni Wall Wash.
   - Augusta Lights architectural branding and customized "THE PAYNE RESIDENCE" typography.

7. **End-User / Client QA (Field General Manager)**:
   - Zero unnecessary SaaS clutter: no CRM, no billing, no user management.
   - Pre-loaded Texas franchise test homes (Texas Red Brick, Suburban Ranch with Driveway SUV, Hill Country Limestone, Modern Craftsman) for immediate client demonstration.
   - Natural language revision box for quick GM tweaks ("Remove lower garage roofline, change oak wrap to warm white").

---

### 4. Detailed Functional Scope

#### 4.1 In-Car GM Workflow (10–13 Minute Window)
```
[1. Upload/Photo Capture] 
         │
[2. Customer Last Name] ───> Formats: "THE [NAME] RESIDENCE"
         │
[3. System Selection] ────> Christmas Lights (C9) OR Omni Permanent Lights
         │
[4. Pattern & Colorways] ──> Warm White (#1) | Cool White | Candy Cane | Blue/White | Red/Green | RGB
         │
[5. Optional Decor] ──────> Tree Wraps | Shrub Mini-Lights | Wreaths (36"/48"/60") | Ground Stakes
         │
[6. 15-Sec Roofline Audit] ─> Interactive Tap-to-Toggle Segments (Front-Facing Eaves Only)
         │
[7. Generate Visualization] ─> Stage 1 (Dusk Master) ➔ Stage 2 (Lighting Composite)
         │
[8. Review & Revise] ─────> Download 2K Hero | Natural Language Revise | 2x2 Comparison Sheet
```

#### 4.2 Christmas Lighting Specifications
- **Bulb Type**: Commercial SMD C9 LED bulbs.
- **Spacing**: Exactly 15-inch bulb spacing along rooflines.
- **Placement**: Front-facing rooflines only by default (gable peaks, horizontal fascia eaves). Windows, doors, and garage outlines excluded by default.
- **Pattern Logic**:
  - *Warm White*: Pure 2700K architectural warm white (#1 seller).
  - *Cool White*: Crisp 6000K winter white.
  - *Candy Cane*: Repeating groups of 2 Red / 2 Warm White (not alternating single bulbs).
  - *Blue / White*: Repeating groups of 2 Blue / 2 Cool White.
  - *Red / Green*: Repeating groups of 2 Red / 2 Green.
  - *Custom*: Multi-color or bespoke sequences.

#### 4.3 Omni Permanent Architectural Lighting Specifications
- **Light Spacing**: Approximately 8-inch low-profile diode spacing under fascia/soffit.
- **Optical Effect**: True vertical architectural wall wash. Light cascades downward along brick/siding surfaces toward foundation beds, rather than appearing as exposed protruding bulbs.
- **Color Profiles**: Warm Architectural White (3000K), Cool White (5000K), RGB Spectrum, Custom Duo-tones.

#### 4.4 Optional Decorative Elements
- **Tree Wraps**: 5mm warm white or cool white mini-lights (24 ft / 72-light commercial strands) wrapped around trunk and major lower canopy branches. Natural language or tap placement.
- **Shrub & Bed Lighting**: 5mm commercial mini-lights distributed across foundation shrubs.
- **Commercial Green Wreaths**: Pre-lit with 5mm warm white mini-lights. Available in 36-inch, 48-inch, and 60-inch diameters. Auto-centered on prominent gables or above garage doors.
- **Ground Stakes**: C9 or C7 warm white bulbs mounted on 10-inch commercial stakes tracing driveways, entry sidewalks, and landscape beds.

#### 4.5 Roofline Detection & 10–20 Second Mobile Correction
- Computer vision edge detection isolates front-facing eaves, gable peaks, and fascia lines.
- Mobile GM interface provides high-contrast interactive tap zones:
  - Tap any segment to toggle ON / OFF (e.g. disable lower side garage eave with 1 tap).
  - Quick vertex drag handles to snap endpoints to true architectural corners.
  - One-tap "Front Roofline Only" filter to instantly strip secondary ridges.

#### 4.6 2x2 Inspiration Sheet Generator
- Takes the validated Stage 1 Dusk Property Master and generates 4 distinct lighting variations simultaneously:
  1. *Option A*: Warm White C9 Classic (Reference Standard)
  2. *Option B*: Candy Cane (2 Red / 2 White) Holiday Festive
  3. *Option C*: Winter Blue & White (2 Blue / 2 White)
  4. *Option D*: Omni Permanent Architectural Wall Wash
- Assembles into a high-resolution 2x2 grid with clear architectural labels, residence title, and franchise branding.

---

### 5. What V1 Does NOT Include (Strict Out-of-Scope Enforcement)

To keep V1 lean, fast, and 100% focused on image quality and field usability, the following are strictly excluded:
- ❌ CRM database or lead management.
- ❌ Billing, payments, or subscription processing.
- ❌ Native iOS or Android App Store builds (pure mobile web app).
- ❌ Complex user role management or franchise reporting.
- ❌ Automated PDF proposal or estimate generators.
- ❌ Commercial municipal lighting support.
- ❌ Video or animated RGB permanent lighting patterns.
- ❌ Complex Photoshop-style multi-layer masking editors.

---

### 6. Technical Stack & Architecture

- **Frontend**: Next.js 15 App Router, TypeScript, Tailwind CSS v4, Lucide Icons.
- **Theme**: Light Mode default with dark mode toggle; Apple / Architectural design archetype.
- **AI Core**: Native dual-provider fallback engine (`src/lib/ai.ts`):
  - Primary: OpenAI `gpt-4o-mini` (structured lighting plan & prompt engineering).
  - Fallback: Google Gemini `gemini-2.0-flash` (sub-second failover).
  - Deterministic Fallback: Offline rule engine ensuring 100% uptime in low-signal Texas driveways.
- **Image Pipeline**: Canvas/SVG procedural lighting engine with real-time bloom shaders, photorealistic C9 diode placement at 15" spacing, vertical wall-wash gradients, window luminance extraction, vehicle occlusion removal, and 2K JPEG export.
- **Deployment**: Vercel Serverless Edge, GitHub CI/CD, centralized traffic telemetry (`demo-traffic.vercel.app`).

---

### 7. Acceptance Criteria Checklist (Verified against Client Brief)

- [x] **In-Car 10–13 Minute Workflow**: 1-click photo upload, customer name, lighting selection, and render in under 90 seconds.
- [x] **Architectural Preservation**: Windows, doors, roof pitch, siding, brick, and trees remain 100% structurally identical.
- [x] **Dusk Transformation**: Automatic blue-hour twilight grade with realistic starry evening sky.
- [x] **Window Illumination**: Warm interior glow added strictly to existing home windows; zero new windows created.
- [x] **Vehicle & Distraction Removal**: Driveway vehicle inpainting and trash bin removal active in Stage 1.
- [x] **C9 Christmas Lighting**: 15-inch bulb spacing, front roofline default, repeating 2/2 color patterns supported.
- [x] **Omni Permanent Lighting**: 8-inch spacing, vertical architectural wall-wash effect cascading to ground.
- [x] **Decor Options**: Tree wraps (5mm mini lights), wreaths (36"/48"/60"), shrubs, and ground stakes with placement instructions.
- [x] **10–20 Second Roofline Correction**: Mobile tap-to-toggle segments and lightweight vertex snapping.
- [x] **Natural Language Revision Box**: GM can type simple instructions without entering a complex photo editor.
- [x] **2x2 Comparison Sheet**: Single-click generation of 4 synchronized variations on the identical house master.
- [x] **Augusta Lights Branding**: High-resolution output with "THE PAYNE RESIDENCE" and Augusta Lights badge.
- [x] **Zero Fluff**: Clean, focused operational tool without unnecessary CRM or billing overhead.
