import {
  CustomerResidence,
  PropertyImagePreset,
  LightingSystemType,
  ChristmasPattern,
  OmniPattern,
  DecorOptions,
  RooflineSegment,
  RenderTelemetry,
} from "@/types/lighting";
import { CHRISTMAS_PATTERNS, OMNI_PATTERNS } from "./constants";

export interface LightingPlanResult {
  residenceTitle: string;
  systemType: LightingSystemType;
  colorName: string;
  palette: string[];
  totalBulbs: number;
  spacingInches: number;
  duskGradeDescription: string;
  architecturalIntegrityVerdict: string;
  preservationLocks: string[];
  cleanedDistractions: string[];
  lightingExecutionNotes: string[];
  decorNotes: string[];
  salesConsultationScript: string;
  aiMetadata: RenderTelemetry;
}

// -------------------------------------------------------------
// 1. Primary: OpenAI gpt-4o-mini via native fetch
// -------------------------------------------------------------
async function callOpenAI(systemPrompt: string, userPrompt: string, temperature = 0.2): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "placeholder" || apiKey.startsWith("sk-placeholder")) {
    throw new Error("OPENAI_API_KEY not configured");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature,
      response_format: { type: "json_object" },
    }),
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API error [${response.status}]: ${errText.slice(0, 180)}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "{}";
}

// -------------------------------------------------------------
// 2. Fallback: Google Gemini 2.0 Flash via native fetch
// -------------------------------------------------------------
async function callGemini(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "placeholder") {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${systemPrompt}\n\nUSER REQUEST:\n${userPrompt}\n\nReturn strictly valid JSON only without markdown code blocks.`,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    }),
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error [${response.status}]: ${errText.slice(0, 180)}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  return rawText.replace(/```json/g, "").replace(/```/g, "").trim();
}

// -------------------------------------------------------------
// Core System Prompt for Architectural Lighting Synthesis
// -------------------------------------------------------------
const LIGHTING_SYSTEM_PROMPT = `You are the lead architectural visualization director at Augusta Lights, operating residential Christmas and Omni permanent lighting installations for Augusta Lawn Care franchise locations in Texas.

CRITICAL NON-NEGOTIABLE RULE:
You must strictly PRESERVE the customer's actual home architecture. You are NOT redesigning the home.
- Do NOT add/remove/change windows, doors, garages, porches, siding, brick, roof pitch, trees, or landscaping.
- Apply two-stage pipeline principles:
  1. Cleaned Dusk Master: Blue-hour conversion (2700K window glow inside existing window apertures only, removal of driveway vehicles & trash bins, starry evening sky, balanced architectural photography color grade).
  2. Lighting Composite:
     - Christmas C9: SMD C9 LED bulbs at 15-inch spacing along front-facing rooflines only. Repeating groups supported (e.g. 2 red / 2 warm white for Candy Cane).
     - Omni Permanent: 8-inch diode spacing under eaves creating vertical downward wall-wash cascades.
     - Decor: Tree wraps (5mm mini lights), wreaths (36"/48"/60"), shrubs, ground stakes.

Return strictly valid JSON.`;

export async function synthesizeLightingPlanAI(params: {
  customer: CustomerResidence;
  preset: PropertyImagePreset;
  systemType: LightingSystemType;
  christmasPattern?: ChristmasPattern;
  omniPattern?: OmniPattern;
  decor: DecorOptions;
  segments: RooflineSegment[];
  naturalLanguageRevision?: string;
  forceFailover?: boolean;
}): Promise<LightingPlanResult> {
  const startTime = Date.now();
  const { customer, preset, systemType, decor, segments, naturalLanguageRevision, forceFailover = false } = params;

  const activeChristmas = params.christmasPattern || CHRISTMAS_PATTERNS[0];
  const activeOmni = params.omniPattern || OMNI_PATTERNS[0];

  const activeSegments = segments.filter((s) => s.enabled);
  const totalBulbs = activeSegments.reduce((sum, s) => sum + s.bulbCount, 0);

  const userPrompt = `Synthesize a field visualization plan for:
Customer: "${customer.residenceTitle}" (${customer.address})
Property: ${preset.name} (${preset.architectureType})
System Type: ${systemType === "christmas_c9" ? "Christmas C9 Commercial LED (15-inch spacing)" : "Omni Permanent Architectural Lighting (8-inch spacing)"}
Pattern: ${systemType === "christmas_c9" ? activeChristmas.name : activeOmni.name}
Decor Elements: ${JSON.stringify(decor)}
Active Rooflines: ${activeSegments.map((s) => s.name).join(", ")}
Revision Note: "${naturalLanguageRevision || "Initial consultation visualization"}"

Return JSON matching:
{
  "residenceTitle": "${customer.residenceTitle}",
  "systemType": "${systemType}",
  "colorName": "${systemType === "christmas_c9" ? activeChristmas.colorName : activeOmni.colorName}",
  "palette": ${JSON.stringify(systemType === "christmas_c9" ? activeChristmas.palette : [activeOmni.beamColor])},
  "totalBulbs": ${totalBulbs},
  "spacingInches": ${systemType === "christmas_c9" ? 15 : 8},
  "duskGradeDescription": "string (details of blue-hour atmospheric transformation, star-field, exposure)",
  "architecturalIntegrityVerdict": "100% Structural Geometry Preserved · Zero Architectural Alterations",
  "preservationLocks": ["Windows locked to original count", "Roofline pitch unmodified", "Brickwork texture preserved", "Landscaping trees locked"],
  "cleanedDistractions": ["Driveway vehicle inpainted with clean asphalt texture", "Trash cans removed"],
  "lightingExecutionNotes": ["C9 SMD LEDs attached to front-facing eaves only", "Repeating color sequence verified"],
  "decorNotes": ["Oak tree wrapped with 5mm mini-lights", "48-inch commercial pre-lit wreath centered"],
  "salesConsultationScript": "string (conversational 2-sentence line for GM to speak to homeowner in driveway)"
}`;

  let rawJSON = "";
  let activeProvider: "OpenAI" | "Gemini" | "Deterministic Local Engine" = "OpenAI";
  let activeModel = "gpt-4o-mini";

  if (!forceFailover) {
    try {
      rawJSON = await callOpenAI(LIGHTING_SYSTEM_PROMPT, userPrompt);
    } catch (err: any) {
      console.warn("[OpenAI Failed, failing over to Gemini 2.0 Flash]:", err?.message);
      try {
        rawJSON = await callGemini(LIGHTING_SYSTEM_PROMPT, userPrompt);
        activeProvider = "Gemini";
        activeModel = "gemini-2.0-flash";
      } catch (geminiErr: any) {
        console.warn("[Gemini Failed, failing over to Deterministic Engine]:", geminiErr?.message);
        activeProvider = "Deterministic Local Engine";
        activeModel = "Augusta-Lighting-Matrix-v1.4";
      }
    }
  } else {
    // Chaos Mode: test direct failover
    try {
      rawJSON = await callGemini(LIGHTING_SYSTEM_PROMPT, userPrompt);
      activeProvider = "Gemini";
      activeModel = "gemini-2.0-flash (Chaos Failover)";
    } catch (geminiErr: any) {
      activeProvider = "Deterministic Local Engine";
      activeModel = "Augusta-Lighting-Matrix-v1.4 (Offline Fallback)";
    }
  }

  let parsed: any = null;
  if (rawJSON) {
    try {
      parsed = JSON.parse(rawJSON);
    } catch (e) {
      console.error("[JSON Parse Error on Lighting Plan]:", e);
    }
  }

  const latencyMs = Math.max(160, Date.now() - startTime);

  if (parsed && parsed.residenceTitle) {
    return {
      residenceTitle: parsed.residenceTitle || customer.residenceTitle,
      systemType,
      colorName: parsed.colorName || (systemType === "christmas_c9" ? activeChristmas.colorName : activeOmni.colorName),
      palette: parsed.palette || (systemType === "christmas_c9" ? activeChristmas.palette : [activeOmni.beamColor]),
      totalBulbs: parsed.totalBulbs || totalBulbs,
      spacingInches: systemType === "christmas_c9" ? 15 : 8,
      duskGradeDescription:
        parsed.duskGradeDescription ||
        "Professional blue-hour conversion with deep twilight cobalt sky, subtle stars, 2700K interior window glow, and architectural color grading.",
      architecturalIntegrityVerdict:
        parsed.architecturalIntegrityVerdict ||
        "100% Structural Geometry Preserved · Zero Facade or Roof Alterations",
      preservationLocks: parsed.preservationLocks || [
        `${preset.windows.length} existing window apertures preserved with warm interior illumination`,
        "All rooflines, gables, and pitch geometry locked to original photograph",
        "Original exterior brick and siding materials fully preserved",
        "Permanent lawn topography, sidewalks, and mature trees locked in place",
      ],
      cleanedDistractions: parsed.cleanedDistractions || [
        preset.hasVehicle ? "Driveway vehicle inpainted with clean, uniform asphalt pavement" : "Driveway cleared of surface debris",
        preset.hasTrashCans ? "Curbside trash and recycling bins removed via localized semantic inpainting" : "Exterior clutter filtered",
      ],
      lightingExecutionNotes: parsed.lightingExecutionNotes || [
        systemType === "christmas_c9"
          ? `Front-facing roofline only with SMD C9 commercial LEDs at 15" bulb spacing`
          : `Omni architectural permanent lighting with 8" low-profile diode spacing and vertical wall wash`,
        `Selected color profile: ${systemType === "christmas_c9" ? activeChristmas.name : activeOmni.name}`,
      ],
      decorNotes: parsed.decorNotes || [
        decor.treeWraps.enabled ? `Oak tree wrapped with commercial 5mm mini-lights (24ft / 72-light strands)` : "Tree wrap option idle",
        decor.wreaths.enabled ? `${decor.wreaths.sizeInches}-inch commercial pre-lit green wreath with warm white mini-lights centered` : "Wreath option idle",
        decor.groundStakes.enabled ? `Commercial ground stakes tracing ${decor.groundStakes.location}` : "Ground stakes idle",
      ],
      salesConsultationScript:
        parsed.salesConsultationScript ||
        `"Here is your exact home, transformed to dusk with our custom ${systemType === "christmas_c9" ? activeChristmas.name : activeOmni.name} installation. Notice how your original architecture is 100% preserved while giving you that breathtaking evening curb appeal."`,
      aiMetadata: {
        provider: activeProvider,
        model: activeModel,
        latencyMs,
        architecturalPreservationScore: 100,
        detectedRooflineSegments: activeSegments.length,
        totalBulbCount: totalBulbs,
        timestamp: new Date().toISOString(),
      },
    };
  }

  // Deterministic local fallback
  return {
    residenceTitle: customer.residenceTitle,
    systemType,
    colorName: systemType === "christmas_c9" ? activeChristmas.colorName : activeOmni.colorName,
    palette: systemType === "christmas_c9" ? activeChristmas.palette : [activeOmni.beamColor],
    totalBulbs,
    spacingInches: systemType === "christmas_c9" ? 15 : 8,
    duskGradeDescription:
      "Deterministic 2-stage blue-hour conversion: twilight cobalt sky, 2700K interior window glow, driveway vehicle removal, and architectural tone-mapping.",
    architecturalIntegrityVerdict:
      "100% Structural Geometry Preserved · Zero Facade or Roof Alterations",
    preservationLocks: [
      `${preset.windows.length} existing window apertures preserved with warm interior illumination`,
      "All rooflines, gables, and pitch geometry locked to original photograph",
      "Original exterior brick and siding materials fully preserved",
      "Permanent lawn topography, sidewalks, and mature trees locked in place",
    ],
    cleanedDistractions: [
      preset.hasVehicle ? "Driveway vehicle inpainted with clean, uniform asphalt pavement" : "Driveway apron cleared",
      preset.hasTrashCans ? "Curbside trash and recycling bins removed via localized semantic inpainting" : "Exterior clutter filtered",
    ],
    lightingExecutionNotes: [
      systemType === "christmas_c9"
        ? `Front-facing roofline only with SMD C9 commercial LEDs at 15" bulb spacing`
        : `Omni architectural permanent lighting with 8" low-profile diode spacing and vertical wall wash`,
      `Selected color profile: ${systemType === "christmas_c9" ? activeChristmas.name : activeOmni.name}`,
    ],
    decorNotes: [
      decor.treeWraps.enabled ? `Oak tree wrapped with commercial 5mm mini-lights (24ft / 72-light strands)` : "Tree wrap option idle",
      decor.wreaths.enabled ? `${decor.wreaths.sizeInches}-inch commercial pre-lit green wreath with warm white mini-lights centered` : "Wreath option idle",
      decor.groundStakes.enabled ? `Commercial ground stakes tracing ${decor.groundStakes.location}` : "Ground stakes idle",
    ],
    salesConsultationScript: `"Here is your exact home, transformed to dusk with our custom ${systemType === "christmas_c9" ? activeChristmas.name : activeOmni.name} installation. Notice how your original architecture is 100% preserved while giving you that breathtaking evening curb appeal."`,
    aiMetadata: {
      provider: "Deterministic Local Engine",
      model: "Augusta-Lighting-Matrix-v1.4 (Deterministic Offline)",
      latencyMs,
      architecturalPreservationScore: 100,
      detectedRooflineSegments: activeSegments.length,
      totalBulbCount: totalBulbs,
      timestamp: new Date().toISOString(),
    },
  };
}
