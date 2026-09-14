"use client";

import React from "react";
import {
  Camera,
  ShieldCheck,
  MoonStar,
  Compass,
  Sparkles,
  DownloadCloud,
  CheckCircle2,
  RefreshCw,
  Play,
  Layers,
  ArrowRight,
} from "lucide-react";

interface WorkflowCanvasProps {
  currentStage: "day" | "dusk_master" | "rendered_hero" | "comparison_2x2";
  onStageChange?: (stage: "day" | "dusk_master" | "rendered_hero") => void;
  onOpenRooflineAudit?: () => void;
  onOpenInspiration?: () => void;
  onTriggerPipeline: () => void;
  isSimulating: boolean;
  activeProvider: string;
}

export function WorkflowCanvas({
  currentStage,
  onStageChange,
  onOpenRooflineAudit,
  onOpenInspiration,
  onTriggerPipeline,
  isSimulating,
  activeProvider,
}: WorkflowCanvasProps) {
  const steps = [
    {
      id: 1,
      stageGroup: "Stage 1: Dusk Master",
      title: "1. Photo Ingestion",
      subtitle: "Single Front-Facing Capture",
      icon: Camera,
      tag: "390px Mobile",
      detail: "Daytime Texas home with harsh direct sunlight & driveway apron.",
      statusText: currentStage === "day" ? "VIEWING" : "COMPLETED",
      isCurrentView: currentStage === "day",
      isCompleted: currentStage !== "day",
      onClick: () => onStageChange?.("day"),
    },
    {
      id: 2,
      stageGroup: "Stage 1: Dusk Master",
      title: "2. Structural Mask",
      subtitle: "Architectural Geometry Lock",
      icon: ShieldCheck,
      tag: "SAM-2 Lock",
      detail: "Locks windows, roof pitch, brickwork, and mature oak trees at 100%.",
      statusText: "LOCKED 100%",
      isCurrentView: false,
      isCompleted: true,
      onClick: () => onStageChange?.("day"),
    },
    {
      id: 3,
      stageGroup: "Stage 1: Dusk Master",
      title: "3. Dusk Cleanse",
      subtitle: "Twilight & Inpainting Pass",
      icon: MoonStar,
      tag: "Stage 1 Master",
      detail: "Blue-hour twilight sky, 2700K window illumination & SUV removal.",
      statusText:
        currentStage === "dusk_master"
          ? "VIEWING"
          : currentStage === "day"
          ? "PENDING"
          : "RENDERED",
      isCurrentView: currentStage === "dusk_master",
      isCompleted: currentStage === "rendered_hero" || currentStage === "comparison_2x2",
      onClick: () => onStageChange?.("dusk_master"),
    },
    {
      id: 4,
      stageGroup: "Stage 2: Lighting",
      title: "4. Roofline Engine",
      subtitle: "10-20s Mobile Correction",
      icon: Compass,
      tag: "Front Eaves",
      detail: "Isolates front-facing fascia. 1-tap quick action for non-front ridges.",
      statusText: currentStage === "day" ? "QUEUED" : "VERIFIED",
      isCurrentView: false,
      isCompleted: currentStage === "rendered_hero" || currentStage === "comparison_2x2",
      onClick: () => onOpenRooflineAudit?.(),
    },
    {
      id: 5,
      stageGroup: "Stage 2: Lighting",
      title: "5. Lighting Composite",
      subtitle: "C9 Spacing & Omni Beams",
      icon: Sparkles,
      tag: "Stage 2 Composite",
      detail: "SMD C9 LEDs at 15\" spacing or Omni 8\" vertical downward wall-wash.",
      statusText:
        currentStage === "rendered_hero" || currentStage === "comparison_2x2"
          ? "ACTIVE"
          : "QUEUED",
      isCurrentView: currentStage === "rendered_hero" || currentStage === "comparison_2x2",
      isCompleted: currentStage === "comparison_2x2",
      onClick: () => onStageChange?.("rendered_hero"),
    },
    {
      id: 6,
      stageGroup: "Stage 2: Lighting",
      title: "6. Client Delivery",
      subtitle: "2K Hero & 2x2 Inspiration",
      icon: DownloadCloud,
      tag: "Customer 2K",
      detail: "Watermarked Payne Residence 2K JPEG & 2x2 comparison inspiration sheet.",
      statusText:
        currentStage === "rendered_hero" || currentStage === "comparison_2x2"
          ? "READY"
          : "STANDBY",
      isCurrentView: false,
      isCompleted: currentStage === "rendered_hero" || currentStage === "comparison_2x2",
      onClick: () => onOpenInspiration?.(),
    },
  ];

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 sm:p-5 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[var(--color-border-subtle)]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              <Layers className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
              2-Stage Generative Architectural Pipeline
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
              Active Provider: {activeProvider}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-[var(--color-text-muted)] flex-wrap">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">Stage 1:</span> Cleaned Dusk Property Master
            <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />
            <span className="font-semibold text-amber-600 dark:text-amber-400">Stage 2:</span> Vector Roofline Compositor (C9 &amp; Omni)
            <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Delivery:</span> 2K Renders in &lt;1.5s
          </div>
        </div>

        <button
          onClick={onTriggerPipeline}
          disabled={isSimulating}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 transition-all shadow-sm shrink-0 whitespace-nowrap active:scale-98"
        >
          {isSimulating ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-400" />
              <span>Synthesizing Live Flow...</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current text-amber-400" />
              <span>Simulate Pipeline Flow</span>
            </>
          )}
        </button>
      </div>

      {/* Stage Group Header Pills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-2">
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-indigo-500/5 border border-indigo-500/20 text-xs">
          <span className="font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider text-[11px]">
            Stage 1 · Cleaned Dusk Property Master
          </span>
          <span className="text-[11px] font-mono text-indigo-600/80 dark:text-indigo-400/80">
            SAM-2 Geometry Lock + Inpainting
          </span>
        </div>
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs">
          <span className="font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider text-[11px]">
            Stage 2 · Vector Lighting Composite &amp; Delivery
          </span>
          <span className="text-[11px] font-mono text-amber-600/80 dark:text-amber-400/80">
            C9 / Omni Hardware Accuracy
          </span>
        </div>
      </div>

      {/* Nodes grid with clean card layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
        {steps.map((step, idx) => {
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              onClick={step.onClick}
              title={`Click to inspect ${step.title}`}
              className={`group relative flex flex-col justify-between rounded-xl p-3 border transition-all cursor-pointer select-none ${
                step.isCurrentView
                  ? "border-amber-500 bg-amber-500/10 shadow-sm ring-1 ring-amber-500/30"
                  : step.isCompleted
                  ? "border-slate-300 dark:border-slate-700 bg-[var(--color-panel)] hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-sm"
                  : "border-[var(--color-border)] bg-[var(--color-panel-subtle)] opacity-75 hover:opacity-100 hover:border-slate-400"
              }`}
            >
              <div>
                {/* Card Top Row: Icon + Badge + Flow Arrow */}
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center transition-colors ${
                      step.isCurrentView
                        ? "bg-amber-500 text-white shadow-sm"
                        : step.isCompleted
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>

                  <span className="text-[11px] font-mono font-semibold text-[var(--color-text-muted)] bg-[var(--color-panel-subtle)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
                    {step.tag}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-[var(--color-text-primary)] leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {step.title}
                </h4>
                <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5 line-clamp-1">
                  {step.subtitle}
                </p>
              </div>

              {/* Card Footer: Status Indicator */}
              <div className="mt-3 pt-2 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1 font-mono font-semibold">
                  {step.isCompleted ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                      <span className="text-emerald-700 dark:text-emerald-400">
                        {step.statusText}
                      </span>
                    </>
                  ) : step.isCurrentView ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                      <span className="text-amber-700 dark:text-amber-300">
                        {step.statusText}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                      <span className="text-[var(--color-text-muted)]">
                        {step.statusText}
                      </span>
                    </>
                  )}
                </span>

                <span className="text-[10px] text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 font-mono transition-colors">
                  {idx < 5 ? "➔" : "✓"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
