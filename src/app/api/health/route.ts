import { NextResponse } from "next/server";

export async function GET() {
  const hasOpenAI = Boolean(
    process.env.OPENAI_API_KEY &&
    !process.env.OPENAI_API_KEY.includes("placeholder")
  );
  const hasGemini = Boolean(
    process.env.GEMINI_API_KEY &&
    !process.env.GEMINI_API_KEY.includes("placeholder")
  );

  return NextResponse.json({
    status: "healthy",
    service: "augusta-lights-ai",
    architecture: "2-Stage Generative Dusk & Lighting Preservation Pipeline",
    franchise: "Augusta Lights · Texas Locations",
    version: "1.0.0-PROD",
    providers: {
      openai: {
        active: hasOpenAI,
        model: "gpt-4o-mini",
        role: "Primary Structured Plan & In-Car Field Vision Director",
      },
      gemini: {
        active: hasGemini,
        model: "gemini-2.0-flash",
        role: "Sub-second Secondary Failover & Multimodal Evaluation",
      },
      deterministicEngine: {
        active: true,
        model: "Augusta-Lighting-Matrix-v1.4",
        role: "In-Car Vehicle Offline Rule Engine (100% Signal Immunity)",
      },
    },
    lightingSpecs: {
      christmas: "SMD C9 Commercial LED · 15-inch spacing · Front Rooflines",
      omniPermanent: "Omni Architectural LED · 8-inch spacing · Vertical Downward Wall Wash",
      decor: "5mm Commercial Mini-Lights (Trees/Shrubs) · 36/48/60-inch Pre-Lit Wreaths",
    },
    timestamp: new Date().toISOString(),
  });
}
