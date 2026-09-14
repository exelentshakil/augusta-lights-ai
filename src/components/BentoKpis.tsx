"use client";

import React from "react";
import { Clock, ShieldCheck, Ruler, DollarSign, Award } from "lucide-react";

interface BentoKpisProps {
  totalBulbs: number;
  systemType: string;
  activePatternName: string;
  latencyMs: number;
}

export function BentoKpis({
  totalBulbs,
  systemType,
  activePatternName,
  latencyMs,
}: BentoKpisProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {/* KPI 1: In-Car Turnaround Time */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between text-[var(--color-text-muted)] mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">
            In-Car Generation
          </span>
          <Clock className="h-4 w-4 text-amber-500" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[var(--color-text-primary)]">
          {(latencyMs / 1000).toFixed(2)}s
        </div>
        <p className="text-xs font-medium text-[var(--color-text-muted)] mt-1">
          Target: 10–13 min consultation window
        </p>
      </div>

      {/* KPI 2: Architectural Lock */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between text-[var(--color-text-muted)] mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Structure Lock
          </span>
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
          100%
        </div>
        <p className="text-xs font-medium text-[var(--color-text-muted)] mt-1">
          Zero window / roof / brick redesign
        </p>
      </div>

      {/* KPI 3: Commercial Spacing */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between text-[var(--color-text-muted)] mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Hardware Spacing
          </span>
          <Ruler className="h-4 w-4 text-blue-500" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[var(--color-text-primary)]">
          {systemType === "christmas_c9" ? '15"' : '8"'}
        </div>
        <p className="text-xs font-medium text-[var(--color-text-muted)] mt-1">
          {systemType === "christmas_c9"
            ? `${totalBulbs} SMD C9 LEDs active`
            : "Omni vertical downward wash"}
        </p>
      </div>

      {/* KPI 4: Per-Render API Unit Cost */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between text-[var(--color-text-muted)] mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">
            V1 API Unit Cost
          </span>
          <DollarSign className="h-4 w-4 text-amber-500" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[var(--color-text-primary)]">
          $0.012
        </div>
        <p className="text-xs font-medium text-[var(--color-text-muted)] mt-1">
          vs $450/mo manual drafting delays
        </p>
      </div>
    </div>
  );
}
