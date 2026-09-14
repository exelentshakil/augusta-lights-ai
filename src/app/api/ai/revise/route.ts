import { NextRequest, NextResponse } from "next/server";
import { synthesizeLightingPlanAI } from "@/lib/ai";
import { DEFAULT_CUSTOMER, PROPERTY_PRESETS, CHRISTMAS_PATTERNS, OMNI_PATTERNS } from "@/lib/constants";
import { RooflineSegment } from "@/types/lighting";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const revisionInstruction: string = (body.instruction || "").toLowerCase();

    const customer = body.customer || DEFAULT_CUSTOMER;
    const preset =
      PROPERTY_PRESETS.find((p) => p.id === body.presetId) || PROPERTY_PRESETS[0];
    let systemType = body.systemType || "christmas_c9";
    let christmasPattern =
      CHRISTMAS_PATTERNS.find((cp) => cp.id === body.christmasPatternId) ||
      CHRISTMAS_PATTERNS[0];
    let omniPattern =
      OMNI_PATTERNS.find((op) => op.id === body.omniPatternId) ||
      OMNI_PATTERNS[0];

    const decor = body.decor || {
      treeWraps: { enabled: false, lightType: "5mm Warm White Mini", placementNote: "" },
      shrubs: { enabled: false, lightType: "5mm Warm White Mini", placementNote: "" },
      wreaths: { enabled: false, sizeInches: 48, placementNote: "" },
      groundStakes: { enabled: false, location: "driveway", color: "#ffdf9e", placementNote: "" },
    };

    let segments: RooflineSegment[] = Array.isArray(body.segments) && body.segments.length > 0
      ? JSON.parse(JSON.stringify(body.segments))
      : JSON.parse(JSON.stringify(preset.rooflines));

    // Natural Language Intent Extraction
    if (revisionInstruction.includes("remove") && (revisionInstruction.includes("garage") || revisionInstruction.includes("lower"))) {
      segments = segments.map((s) =>
        s.id.includes("garage") || s.name.toLowerCase().includes("garage")
          ? { ...s, enabled: false }
          : s
      );
    }
    if (revisionInstruction.includes("add") && revisionInstruction.includes("garage")) {
      segments = segments.map((s) =>
        s.id.includes("garage") || s.name.toLowerCase().includes("garage")
          ? { ...s, enabled: true }
          : s
      );
    }
    if (revisionInstruction.includes("candy cane")) {
      christmasPattern = CHRISTMAS_PATTERNS.find((p) => p.id === "candy-cane") || christmasPattern;
      systemType = "christmas_c9";
    } else if (revisionInstruction.includes("warm white")) {
      christmasPattern = CHRISTMAS_PATTERNS.find((p) => p.id === "warm-white") || christmasPattern;
    } else if (revisionInstruction.includes("blue")) {
      christmasPattern = CHRISTMAS_PATTERNS.find((p) => p.id === "blue-white") || christmasPattern;
    } else if (revisionInstruction.includes("omni") || revisionInstruction.includes("permanent") || revisionInstruction.includes("wall wash")) {
      systemType = "omni_permanent";
    }

    if (revisionInstruction.includes("wreath")) {
      decor.wreaths.enabled = !revisionInstruction.includes("remove wreath");
      if (revisionInstruction.includes("48") || revisionInstruction.includes("48-inch")) {
        decor.wreaths.sizeInches = 48;
      } else if (revisionInstruction.includes("60")) {
        decor.wreaths.sizeInches = 60;
      } else if (revisionInstruction.includes("36")) {
        decor.wreaths.sizeInches = 36;
      }
      decor.wreaths.placementNote = "Centered above garage / main gable per consultation revision";
    }

    if (revisionInstruction.includes("tree") || revisionInstruction.includes("oak")) {
      decor.treeWraps.enabled = !revisionInstruction.includes("remove tree");
      decor.treeWraps.placementNote = "Trunk and lower canopy wrapped with 5mm warm white mini-lights";
    }

    const result = await synthesizeLightingPlanAI({
      customer,
      preset,
      systemType,
      christmasPattern,
      omniPattern,
      decor,
      segments,
      naturalLanguageRevision: body.instruction,
      forceFailover: Boolean(body.forceFailover),
    });

    return NextResponse.json({
      success: true,
      updatedSegments: segments,
      updatedSystemType: systemType,
      updatedChristmasPatternId: christmasPattern.id,
      updatedDecor: decor,
      plan: result,
    });
  } catch (error: any) {
    console.error("[Revise API Route Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to process revision instruction",
      },
      { status: 500 }
    );
  }
}
