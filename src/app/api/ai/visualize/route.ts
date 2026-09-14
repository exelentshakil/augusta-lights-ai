import { NextRequest, NextResponse } from "next/server";
import { synthesizeLightingPlanAI } from "@/lib/ai";
import { DEFAULT_CUSTOMER, PROPERTY_PRESETS, CHRISTMAS_PATTERNS, OMNI_PATTERNS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const customer = body.customer || DEFAULT_CUSTOMER;
    const preset =
      PROPERTY_PRESETS.find((p) => p.id === body.presetId) || PROPERTY_PRESETS[0];
    const systemType = body.systemType || "christmas_c9";
    const christmasPattern =
      CHRISTMAS_PATTERNS.find((cp) => cp.id === body.christmasPatternId) ||
      CHRISTMAS_PATTERNS[0];
    const omniPattern =
      OMNI_PATTERNS.find((op) => op.id === body.omniPatternId) ||
      OMNI_PATTERNS[0];

    const decor = body.decor || {
      treeWraps: { enabled: false, lightType: "5mm Warm White Mini", placementNote: "" },
      shrubs: { enabled: false, lightType: "5mm Warm White Mini", placementNote: "" },
      wreaths: { enabled: false, sizeInches: 48, placementNote: "" },
      groundStakes: { enabled: false, location: "driveway", color: "#ffdf9e", placementNote: "" },
    };

    const segments = Array.isArray(body.segments) && body.segments.length > 0
      ? body.segments
      : preset.rooflines;

    const result = await synthesizeLightingPlanAI({
      customer,
      preset,
      systemType,
      christmasPattern,
      omniPattern,
      decor,
      segments,
      naturalLanguageRevision: body.naturalLanguageRevision,
      forceFailover: Boolean(body.forceFailover),
    });

    return NextResponse.json({ success: true, plan: result });
  } catch (error: any) {
    console.error("[Visualize API Route Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to synthesize visualization plan",
      },
      { status: 500 }
    );
  }
}
