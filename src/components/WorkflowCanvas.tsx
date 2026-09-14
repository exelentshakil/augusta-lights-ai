"use client";

import React, { useState } from "react";
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
} from "lucide-react";

interface WorkflowCanvasProps {
  currentStage: "day" | "dusk_master" | "rendered_hero" | "comparison_2x2";
  onTriggerPipeline: () => void;
  isSimulating: boolean;
  activeProvider: string;
}

export function WorkflowCanvas({
  currentStage,
  onTriggerPipeline,
  isSimulating,
  activeProvider,
}: WorkflowCanvasProps) {
  const [activeStep, setActiveStep] = useState<number>(3);

  const steps = [
    {
      id: 1,
      title: "1. Photo Ingestion",
      subtitle: "Single Front-Facing Capture",
      icon: Camera,
      tag: "390px Mobile View",
      detail: "Captures Texas daytime home with harsh direct sunlight, driveway apron, and mature landscaping.",
      state: "COMPLETED",
    },
    {
      id: 2,
      title: "2. Structural Mask",
      subtitle: "Architectural Geometry Lock",
      icon: ShieldCheck,
      tag: "SAM-2 / Florence",
      detail: "Indexes 100% of window apertures, roof gables, eaves, siding, brickwork, and permanent mature oak trees.",
      state: "LOCKED 100%",
    },
    {
      id: 3,
      title: "3. Dusk Cleanse",
      subtitle: "Twilight & Inpainting Pass",
      icon: MoonStar,
      tag: "Stage 1 Master",
      detail: "Converts scene to deep blue-hour twilight, populates evening stars, illuminates existing windows at 2700K, and inpaints driveway vehicles.",
      state: currentStage === "day" ? "ARMED" : "RENDERED",
    },
    {
      id: 4,
      title: "4. Roofline Engine",
      subtitle: "10-20s Mobile Correction",
      icon: Compass,
      tag: "Front Eaves Only",
      detail: "Isolates front-facing fascia coordinates. GM can tap-to-toggle secondary ridges or lower garage roofs in 15 seconds.",
      state: "VERIFIED",
    },
    {
      id: 5,
      title: "5. Lighting Composite",
      subtitle: "C9 Spacing & Omni Beams",
      icon: Sparkles,
      tag: "Stage 2 Composite",
      detail: "Composites SMD C9 LEDs at 15-inch spacing or Omni 8-inch vertical downward wall-wash directly onto the locked Dusk Master.",
      state: currentStage === "rendered_hero" || currentStage === "comparison_2x2" ? "ACTIVE" : "QUEUED",
    },
    {
      id: 6,
      title: "6. Client Delivery",
      subtitle: "2K Hero & 2x2 Inspiration",
      icon: DownloadCloud,
      tag: "Customer JPEG",
      detail: "Appends 'THE PAYNE RESIDENCE' architectural watermark, Augusta Lights badge, and generates 2x2 comparison sheet.",
      state: currentStage === "rendered_hero" || currentStage === "comparison_2x2" ? "READY" : "STANDBY",
    },
  ];

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 sm:p-6 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[var(--color-border-subtle)]">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-amber-500 shrink-0" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
              2-Stage Generative Architectural Pipeline
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
              Active Provider: {activeProvider}
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Structural preservation architecture: Original Photo ➔ Cleaned Dusk Property Master ➔ Lighting Variations.
          </p>
        </div>

        <button
          onClick={onTriggerPipeline}
          disabled={isSimulating}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 transition-all shadow-sm shrink-0 whitespace-nowrap"
        >
          {isSimulating ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Simulating Pipeline...</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Simulate Pipeline Flow</span>
            </>
          )}
        </button>
      </div>

      {/* Nodes grid */}
      <div className="relative">
        {/* Animated Connector Line for Desktop */}
        <div className="hidden lg:block absolute top-1/2 left-4 right-4 -translate-y-6 h-0.5 bg-gradient-to-r from-amber-500/20 via-emerald-500/30 to-blue-500/20 pointer-events-none z-0">
          <div className="h-full w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-[laserTravel_3s_linear_infinite]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 relative z-10">
          {steps.map((step) => {
            const Icon = step.icon;
            const isStepActive =
              (step.id === 3 && currentStage === "dusk_master") ||
              ((step.id === 5 || step.id === 6) && (currentStage === "rendered_hero" || currentStage === "comparison_2x2"));

            return (
              <div
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`relative flex flex-col justify-between rounded-xl p-3 border transition-all cursor-pointer ${
                  isStepActive || activeStep === step.id
                    ? "border-amber-500/80 bg-amber-500/5 dark:bg-amber-500/10 shadow-sm"
                    : "border-[var(--color-border)] bg-[var(--color-panel-subtle)] hover:border-slate-400 dark:hover:border-slate-600"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`h-7 w-7 rounded-lg flex items-center justify-center ${
                        isStepActive
                          ? "bg-amber-500 text-white shadow-sm"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-mono font-semibold text-[var(--color-text-muted)]">
                      {step.tag}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-[var(--color-text-primary)] leading-snug">
                    {step.title}
                  </h4>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    {step.subtitle}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 font-mono font-medium text-[var(--color-text-secondary)]">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    {step.state}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
