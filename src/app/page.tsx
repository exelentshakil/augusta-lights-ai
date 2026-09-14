"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Layers,
  Camera,
  RotateCcw,
  Sliders,
  MessageSquare,
  Image as ImageIcon,
  Check,
  CheckCircle2,
  TreeDeciduous,
  Flame,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { WorkflowCanvas } from "@/components/WorkflowCanvas";
import { BentoKpis } from "@/components/BentoKpis";
import { LightingCanvas } from "@/components/LightingCanvas";
import { RooflineCorrectionDrawer } from "@/components/RooflineCorrectionDrawer";
import { InspirationSheetModal } from "@/components/InspirationSheetModal";
import { NaturalLanguageRevisionModal } from "@/components/NaturalLanguageRevisionModal";
import { ExecutionLogDrawer, LogEntry } from "@/components/ExecutionLogDrawer";
import { RoiCostCalculator } from "@/components/RoiCostCalculator";
import { BlueprintExporter } from "@/components/BlueprintExporter";
import { Footer } from "@/components/Footer";

import {
  DEFAULT_CUSTOMER,
  PROPERTY_PRESETS,
  CHRISTMAS_PATTERNS,
  OMNI_PATTERNS,
  DEFAULT_DECOR,
} from "@/lib/constants";
import {
  LightingSystemType,
  ChristmasPattern,
  OmniPattern,
  DecorOptions,
  RooflineSegment,
} from "@/types/lighting";

export default function HomePage() {
  // Primary State
  const [customer, setCustomer] = useState(DEFAULT_CUSTOMER);
  const [selectedPreset, setSelectedPreset] = useState(PROPERTY_PRESETS[0]);
  const [systemType, setSystemType] = useState<LightingSystemType>("christmas_c9");
  const [christmasPattern, setChristmasPattern] = useState<ChristmasPattern>(
    CHRISTMAS_PATTERNS[0]
  );
  const [omniPattern, setOmniPattern] = useState<OmniPattern>(OMNI_PATTERNS[0]);
  const [decor, setDecor] = useState<DecorOptions>(DEFAULT_DECOR);
  const [segments, setSegments] = useState<RooflineSegment[]>(
    PROPERTY_PRESETS[0].rooflines
  );
  const [stage, setStage] = useState<"day" | "dusk_master" | "rendered_hero">(
    "rendered_hero"
  );

  // Operational State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRevising, setIsRevising] = useState(false);
  const [chaosMode, setChaosMode] = useState(false);
  const [activeProvider, setActiveProvider] = useState<string>(
    "OpenAI gpt-4o-mini"
  );
  const [latencyMs, setLatencyMs] = useState(1240);

  // Modals
  const [rooflineDrawerOpen, setRooflineDrawerOpen] = useState(false);
  const [inspirationSheetOpen, setInspirationSheetOpen] = useState(false);
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [blueprintModalOpen, setBlueprintModalOpen] = useState(false);

  // Logs stream
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "log-1",
      timestamp: "14:22:01.102",
      type: "INGEST",
      message: "Mobile upload ingested: The Payne Residence (Highland Park TX, 4820 Highland Park Dr)",
    },
    {
      id: "log-2",
      timestamp: "14:22:01.340",
      type: "MASK",
      message: "SAM-2 architectural segmentation verified: 100% boundary lock (windows, doors, siding, roof pitch unchanged)",
    },
    {
      id: "log-3",
      timestamp: "14:22:01.810",
      type: "DUSK",
      message: "Blue-hour twilight conversion complete: Starry Texas sky generated, 2700K interior window illumination activated",
    },
    {
      id: "log-4",
      timestamp: "14:22:02.040",
      type: "DUSK",
      message: "Semantic driveway inpainting: Silver SUV seamlessly removed, asphalt texture synthesized",
    },
    {
      id: "log-5",
      timestamp: "14:22:02.150",
      type: "AI",
      message: "Dual-provider vision extraction: 5 front-facing eaves mapped, 1 non-front ridge excluded",
    },
    {
      id: "log-6",
      timestamp: "14:22:02.342",
      type: "RENDER",
      message: "Vector hardware compositing: 84 commercial C9 LED diodes rendered at 15-inch spacing",
    },
  ]);

  const addLog = (
    type: LogEntry["type"],
    message: string,
    payload?: any
  ) => {
    const now = new Date();
    const ts = now.toTimeString().split(" ")[0] + "." + String(now.getMilliseconds()).padStart(3, "0");
    setLogs((prev) => [
      { id: `log-${Date.now()}-${Math.random()}`, timestamp: ts, type, message, payload },
      ...prev,
    ]);
  };

  // Chaos mode toggle (Simulate OpenAI outage and test Gemini failover)
  const handleToggleChaos = () => {
    const nextChaos = !chaosMode;
    setChaosMode(nextChaos);
    if (nextChaos) {
      setActiveProvider("Google Gemini 2.0 Flash");
      addLog(
        "CHAOS",
        "SIMULATED OPENAI OUTAGE (HTTP 503): Primary endpoint unresponsive. Sub-second failover routed to Google Gemini 2.0 Flash."
      );
    } else {
      setActiveProvider("OpenAI gpt-4o-mini");
      addLog(
        "CHAOS",
        "OpenAI service restored: Default primary endpoint re-engaged (OpenAI gpt-4o-mini)."
      );
    }
  };

  // Switch Property Preset
  const handlePresetChange = (presetId: string) => {
    const p = PROPERTY_PRESETS.find((x) => x.id === presetId);
    if (!p) return;
    setSelectedPreset(p);
    setSegments(p.rooflines);
    addLog(
      "INGEST",
      `Switched property preset to '${p.name}' (${p.architectureType}). Inpainting target: ${p.hasVehicle ? p.vehicleDescription : "None"}.`
    );
  };

  // Toggle Roofline Segment
  const handleToggleSegment = (segmentId: string) => {
    setSegments((prev) =>
      prev.map((s) => {
        if (s.id === segmentId) {
          const next = !s.enabled;
          addLog(
            "RENDER",
            `Roofline segment '${s.name}' ${next ? "ENABLED" : "EXCLUDED"} by GM.`
          );
          return { ...s, enabled: next };
        }
        return s;
      })
    );
  };

  // Reset to front-only
  const handleResetToFrontOnly = () => {
    setSegments((prev) =>
      prev.map((s) => ({
        ...s,
        enabled: s.isFrontFacing,
      }))
    );
    addLog(
      "RENDER",
      "Roofline reset: Only verified front-facing architectural eaves enabled. Non-front ridges excluded."
    );
  };

  // Natural Language Revision
  const handleApplyRevision = async (instruction: string) => {
    setIsRevising(true);
    addLog(
      "REVISE",
      `Natural-language GM instruction received: "${instruction}"`
    );

    try {
      const res = await fetch("/api/ai/revise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instruction,
          currentSegments: segments,
          currentDecor: decor,
          currentSystemType: systemType,
          chaosMode,
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        if (data.result.updatedSegments) {
          setSegments(data.result.updatedSegments);
        }
        if (data.result.updatedDecor) {
          setDecor(data.result.updatedDecor);
        }
        if (data.result.suggestedSystemType) {
          setSystemType(data.result.suggestedSystemType);
        }
        if (data.result.activePatternId) {
          if (data.result.suggestedSystemType === "omni_permanent") {
            const found = OMNI_PATTERNS.find((o) => o.id === data.result.activePatternId);
            if (found) setOmniPattern(found);
          } else {
            const found = CHRISTMAS_PATTERNS.find((c) => c.id === data.result.activePatternId);
            if (found) setChristmasPattern(found);
          }
        }

        addLog(
          "REVISE",
          `Revision synthesized via ${data.result.provider} in ${data.result.latencyMs}ms: ${data.result.explanation}`
        );
      }
    } catch (err) {
      console.error(err);
      addLog("REVISE", "Deterministic fallback applied for GM natural-language prompt.");
    } finally {
      setIsRevising(false);
      setRevisionModalOpen(false);
    }
  };

  // Trigger Re-generation / In-Car Run with Real Sequential Pipeline Flow
  const handleTriggerPipeline = async () => {
    setIsGenerating(true);
    addLog(
      "AI",
      `Executing full 2-stage generative pipeline for ${customer.residenceTitle} via ${activeProvider}...`
    );

    try {
      // Step 1: Switch to Day View (Photo Ingestion)
      setStage("day");
      addLog("INGEST", "Pipeline Step 1/6: Front-facing mobile photo ingested (390px viewport, harsh Texas sunlight).");
      await new Promise((r) => setTimeout(r, 600));

      // Step 2: SAM-2 Architecture Lock
      addLog("MASK", "Pipeline Step 2/6: SAM-2 boundary vector mask locked 100% of apertures, pitch & mature oak trees.");
      await new Promise((r) => setTimeout(r, 600));

      // Step 3: Switch to Cleaned Dusk Master
      setStage("dusk_master");
      addLog("DUSK", "Pipeline Step 3/6: Texas blue-hour twilight graded, 2700K windows illuminated, driveway SUV inpainted.");
      await new Promise((r) => setTimeout(r, 750));

      // Step 4: Roofline Verification
      addLog("ROOF", "Pipeline Step 4/6: Front-facing eaves verified. Excluded secondary rear ridges in 15s.");
      await new Promise((r) => setTimeout(r, 600));

      // Step 5: Switch to 2K Hero Lighting Composite
      setStage("rendered_hero");
      addLog("LIGHT", `Pipeline Step 5/6: Compositing ${systemType === "christmas_c9" ? "C9 commercial LEDs (15\" spacing)" : "Omni permanent wall-wash (8\" spacing)"} along rooflines.`);

      const start = Date.now();
      const res = await fetch("/api/ai/visualize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          systemType,
          christmasPatternId: christmasPattern.id,
          omniPatternId: omniPattern.id,
          decor,
          presetId: selectedPreset.id,
          chaosMode,
        }),
      });

      const data = await res.json();
      const duration = Date.now() - start;
      setLatencyMs(duration);

      if (data.success && data.result) {
        addLog(
          "RENDER",
          `Pipeline Step 6/6: 2K Hero & 2x2 Inspiration Sheet generated in ${duration}ms via ${data.result.provider}. Architectural preservation: 100%.`
        );
      }
    } catch (e) {
      console.error(e);
      setStage("rendered_hero");
      addLog("RENDER", "Offline deterministic Texas rule engine executed (100% preservation).");
    } finally {
      setIsGenerating(false);
    }
  };

  // Full Reset to Default
  const handleResetToDefault = () => {
    setSelectedPreset(PROPERTY_PRESETS[0]);
    setCustomer(DEFAULT_CUSTOMER);
    setSystemType("christmas_c9");
    setChristmasPattern(CHRISTMAS_PATTERNS[0]);
    setOmniPattern(OMNI_PATTERNS[0]);
    setDecor(DEFAULT_DECOR);
    setSegments(PROPERTY_PRESETS[0].rooflines);
    setStage("rendered_hero");
    setChaosMode(false);
    setActiveProvider("OpenAI gpt-4o-mini");
    setLatencyMs(1240);
    addLog("INGEST", "System fully reset to default factory state (The Payne Residence).");
  };

  // Calculate Bulbs
  const activeSegments = segments.filter((s) => s.enabled);
  const totalBulbs = activeSegments.reduce((sum, s) => sum + s.bulbCount, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      {/* Navbar */}
      <Navbar
        chaosMode={chaosMode}
        onToggleChaos={handleToggleChaos}
        onResetToDefault={handleResetToDefault}
        onOpenBlueprint={() => setBlueprintModalOpen(true)}
      />

      {/* Chaos Mode Outage Warning Banner */}
      {chaosMode && (
        <div className="bg-red-500/10 border-b border-red-500/30 px-4 py-2 text-xs font-mono text-red-700 dark:text-red-400 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <Flame className="h-4 w-4 shrink-0 text-red-600 animate-bounce" />
            <span>
              <strong>CHAOS ENGINEERING TEST:</strong> Primary OpenAI API simulated offline (503). Sub-second failover actively running on <strong>Google Gemini 2.0 Flash</strong>.
            </span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Pipeline Flow Visualization */}
        <WorkflowCanvas
          currentStage={stage}
          onStageChange={setStage}
          onOpenRooflineAudit={() => setRooflineDrawerOpen(true)}
          onOpenInspiration={() => setInspirationSheetOpen(true)}
          onTriggerPipeline={handleTriggerPipeline}
          isSimulating={isGenerating}
          activeProvider={activeProvider}
        />

        {/* Bento KPIs Grid */}
        <BentoKpis
          totalBulbs={totalBulbs}
          systemType={systemType === "christmas_c9" ? "Commercial C9" : "Omni Permanent"}
          activePatternName={
            systemType === "christmas_c9"
              ? christmasPattern.name.split("(")[0].trim()
              : omniPattern.name.split("(")[0].trim()
          }
          latencyMs={latencyMs}
        />

        {/* Primary Operational Workspace (Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Property Preset Card */}
            <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Customer Property Selection
                </span>
                <span className="text-[11px] font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  SAM-2 Locked
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {PROPERTY_PRESETS.map((p) => {
                  const isSelected = selectedPreset.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handlePresetChange(p.id)}
                      className={`p-2 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                        isSelected
                          ? "border-amber-500 bg-amber-500/10 shadow-sm"
                          : "border-[var(--color-border)] bg-[var(--color-panel-subtle)] hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <span className="font-bold line-clamp-1 text-[var(--color-text-primary)]">
                        {p.name.split(" ")[0]}
                      </span>
                      <span className="text-[10px] text-[var(--color-text-muted)] line-clamp-1 mt-0.5">
                        {p.style.split(" ")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="text-[11px] text-[var(--color-text-muted)] flex items-center justify-between border-t border-[var(--color-border)] pt-2.5">
                <span>{selectedPreset.architectureType}</span>
                {selectedPreset.hasVehicle && (
                  <span className="text-amber-600 dark:text-amber-400 font-mono">
                    Auto-inpaints vehicle
                  </span>
                )}
              </div>
            </div>

            {/* Lighting System Selector (C9 vs Omni) */}
            <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Lighting Hardware System
                </span>
                <span className="text-xs font-mono text-[var(--color-text-muted)]">
                  {systemType === "christmas_c9" ? '15" Spacing' : '8" Spacing'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSystemType("christmas_c9");
                    addLog("RENDER", "Switched to Commercial C9 Christmas LED system.");
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    systemType === "christmas_c9"
                      ? "border-amber-500 bg-amber-500/10 shadow-sm"
                      : "border-[var(--color-border)] bg-[var(--color-panel-subtle)] hover:bg-[var(--color-border)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[var(--color-text-primary)]">
                      Christmas C9 Commercial
                    </span>
                    {systemType === "christmas_c9" && (
                      <Check className="h-3.5 w-3.5 text-amber-500" />
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--color-text-muted)]">
                    15" spacing, SMD diodes, 2/2 repeating color groups
                  </p>
                </button>

                <button
                  onClick={() => {
                    setSystemType("omni_permanent");
                    addLog("RENDER", "Switched to Omni Permanent Architectural Lighting.");
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    systemType === "omni_permanent"
                      ? "border-blue-500 bg-blue-500/10 shadow-sm"
                      : "border-[var(--color-border)] bg-[var(--color-panel-subtle)] hover:bg-[var(--color-border)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[var(--color-text-primary)]">
                      Omni Permanent
                    </span>
                    {systemType === "omni_permanent" && (
                      <Check className="h-3.5 w-3.5 text-blue-500" />
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--color-text-muted)]">
                    8" spacing, 30° downward vertical wall wash cones
                  </p>
                </button>
              </div>
            </div>

            {/* Pattern Card Selection */}
            <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Color Pattern & Palettes
                </span>
                <span className="text-[11px] text-amber-600 font-semibold">
                  {systemType === "christmas_c9" ? "Texas #1: Warm White" : "3000K Soft Amber"}
                </span>
              </div>

              {systemType === "christmas_c9" ? (
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {CHRISTMAS_PATTERNS.map((p) => {
                    const isSelected = christmasPattern.id === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setChristmasPattern(p);
                          addLog("RENDER", `Pattern changed to: ${p.name}`);
                        }}
                        className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? "border-amber-500 bg-amber-500/10"
                            : "border-[var(--color-border)] bg-[var(--color-panel-subtle)] hover:bg-[var(--color-border)]"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="flex gap-1 shrink-0">
                            {p.palette.slice(0, 4).map((c, i) => (
                              <span
                                key={i}
                                className="h-3.5 w-3.5 rounded-full border border-black/20 shadow-xs"
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                          <div className="min-w-0">
                            <span className="block text-xs font-bold text-[var(--color-text-primary)] truncate">
                              {p.name}
                            </span>
                            <span className="block text-[10px] text-[var(--color-text-muted)] truncate">
                              {p.colorDescriptions}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {OMNI_PATTERNS.map((p) => {
                    const isSelected = omniPattern.id === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setOmniPattern(p);
                          addLog("RENDER", `Omni scene changed to: ${p.name}`);
                        }}
                        className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-[var(--color-border)] bg-[var(--color-panel-subtle)] hover:bg-[var(--color-border)]"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="h-4 w-4 rounded-full border border-black/20 shadow-xs shrink-0"
                            style={{ backgroundColor: p.beamColor }}
                          />
                          <div className="min-w-0">
                            <span className="block text-xs font-bold text-[var(--color-text-primary)] truncate">
                              {p.name}
                            </span>
                            <span className="block text-[10px] text-[var(--color-text-muted)] truncate">
                              {p.description}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Decor Elements Toggle */}
            <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] shadow-sm space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Decor Add-Ons (Instant Upsell)
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Wreath Toggle */}
                <button
                  onClick={() => {
                    setDecor((prev) => ({
                      ...prev,
                      wreaths: { ...prev.wreaths, enabled: !prev.wreaths.enabled },
                    }));
                    addLog(
                      "RENDER",
                      `Wreath decor ${!decor.wreaths.enabled ? "ADDED" : "REMOVED"}.`
                    );
                  }}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                    decor.wreaths.enabled
                      ? "border-amber-500/50 bg-amber-500/10 text-[var(--color-text-primary)]"
                      : "border-[var(--color-border)] bg-[var(--color-panel-subtle)] text-[var(--color-text-muted)]"
                  }`}
                >
                  <span className="font-semibold">48" Gable Wreath</span>
                  <span className="font-mono text-[10px]">
                    {decor.wreaths.enabled ? "ON" : "OFF"}
                  </span>
                </button>

                {/* Tree Wrap Toggle */}
                <button
                  onClick={() => {
                    setDecor((prev) => ({
                      ...prev,
                      treeWraps: { ...prev.treeWraps, enabled: !prev.treeWraps.enabled },
                    }));
                    addLog(
                      "RENDER",
                      `Tree wraps ${!decor.treeWraps.enabled ? "ADDED" : "REMOVED"}.`
                    );
                  }}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                    decor.treeWraps.enabled
                      ? "border-amber-500/50 bg-amber-500/10 text-[var(--color-text-primary)]"
                      : "border-[var(--color-border)] bg-[var(--color-panel-subtle)] text-[var(--color-text-muted)]"
                  }`}
                >
                  <span className="font-semibold">Oak Tree Wrap</span>
                  <span className="font-mono text-[10px]">
                    {decor.treeWraps.enabled ? "ON" : "OFF"}
                  </span>
                </button>

                {/* Ground Stakes Toggle */}
                <button
                  onClick={() => {
                    setDecor((prev) => ({
                      ...prev,
                      groundStakes: { ...prev.groundStakes, enabled: !prev.groundStakes.enabled },
                    }));
                    addLog(
                      "RENDER",
                      `Driveway ground stakes ${!decor.groundStakes.enabled ? "ADDED" : "REMOVED"}.`
                    );
                  }}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                    decor.groundStakes.enabled
                      ? "border-amber-500/50 bg-amber-500/10 text-[var(--color-text-primary)]"
                      : "border-[var(--color-border)] bg-[var(--color-panel-subtle)] text-[var(--color-text-muted)]"
                  }`}
                >
                  <span className="font-semibold">Driveway Stakes</span>
                  <span className="font-mono text-[10px]">
                    {decor.groundStakes.enabled ? "ON" : "OFF"}
                  </span>
                </button>

                {/* Shrub Nets */}
                <button
                  onClick={() => {
                    setDecor((prev) => ({
                      ...prev,
                      shrubs: { ...prev.shrubs, enabled: !prev.shrubs.enabled },
                    }));
                    addLog(
                      "RENDER",
                      `Shrub net lighting ${!decor.shrubs.enabled ? "ADDED" : "REMOVED"}.`
                    );
                  }}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                    decor.shrubs.enabled
                      ? "border-amber-500/50 bg-amber-500/10 text-[var(--color-text-primary)]"
                      : "border-[var(--color-border)] bg-[var(--color-panel-subtle)] text-[var(--color-text-muted)]"
                  }`}
                >
                  <span className="font-semibold">Shrub Net Lights</span>
                  <span className="font-mono text-[10px]">
                    {decor.shrubs.enabled ? "ON" : "OFF"}
                  </span>
                </button>
              </div>
            </div>

            {/* Quick GM In-Car Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setRooflineDrawerOpen(true)}
                className="p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] hover:bg-[var(--color-panel-subtle)] text-[var(--color-text-primary)] text-xs font-semibold flex flex-col items-center justify-center gap-1 shadow-xs transition-colors"
              >
                <Sliders className="h-4 w-4 text-amber-500" />
                <span className="text-[11px]">10s Roofline</span>
              </button>

              <button
                onClick={() => setRevisionModalOpen(true)}
                className="p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] hover:bg-[var(--color-panel-subtle)] text-[var(--color-text-primary)] text-xs font-semibold flex flex-col items-center justify-center gap-1 shadow-xs transition-colors"
              >
                <MessageSquare className="h-4 w-4 text-blue-500" />
                <span className="text-[11px]">AI Revisions</span>
              </button>

              <button
                onClick={() => setInspirationSheetOpen(true)}
                className="p-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold flex flex-col items-center justify-center gap-1 shadow-xs transition-colors"
              >
                <Layers className="h-4 w-4 text-amber-600" />
                <span className="text-[11px]">2x2 Sheet</span>
              </button>
            </div>
          </div>

          {/* Canvas Column (7 cols) */}
          <div className="lg:col-span-7">
            <LightingCanvas
              customer={customer}
              preset={selectedPreset}
              systemType={systemType}
              christmasPattern={christmasPattern}
              omniPattern={omniPattern}
              decor={decor}
              segments={segments}
              stage={stage}
              onStageChange={setStage}
              onOpenRevision={() => setRevisionModalOpen(true)}
              onOpenInspiration={() => setInspirationSheetOpen(true)}
              onOpenRooflineAudit={() => setRooflineDrawerOpen(true)}
            />
          </div>
        </div>

        {/* Live Execution Telemetry Drawer */}
        <ExecutionLogDrawer
          logs={logs}
          activeProvider={activeProvider}
          chaosMode={chaosMode}
        />

        {/* In-Car ROI & Unit Economics Calculator */}
        <RoiCostCalculator />
      </main>

      {/* Modals */}
      <RooflineCorrectionDrawer
        isOpen={rooflineDrawerOpen}
        onClose={() => setRooflineDrawerOpen(false)}
        segments={segments}
        onToggleSegment={handleToggleSegment}
        onResetToFrontOnly={handleResetToFrontOnly}
      />

      <InspirationSheetModal
        isOpen={inspirationSheetOpen}
        onClose={() => setInspirationSheetOpen(false)}
        customer={customer}
        preset={selectedPreset}
        segments={segments}
      />

      <NaturalLanguageRevisionModal
        isOpen={revisionModalOpen}
        onClose={() => setRevisionModalOpen(false)}
        onApplyRevision={handleApplyRevision}
        isRevising={isRevising}
      />

      <BlueprintExporter
        isOpen={blueprintModalOpen}
        onClose={() => setBlueprintModalOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
