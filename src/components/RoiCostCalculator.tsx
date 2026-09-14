"use client";

import React, { useState } from "react";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Zap,
  ShieldCheck,
  Building,
} from "lucide-react";

export function RoiCostCalculator() {
  const [consultationsPerMonth, setConsultationsPerMonth] = useState(85);
  const [baselineCloseRate, setBaselineCloseRate] = useState(28);
  const [projectedCloseRate, setProjectedCloseRate] = useState(48);
  const [avgJobValue, setAvgJobValue] = useState(3250);
  const [grossMargin, setGrossMargin] = useState(52);

  // Calculations
  const baselineWins = Math.round(consultationsPerMonth * (baselineCloseRate / 100));
  const projectedWins = Math.round(consultationsPerMonth * (projectedCloseRate / 100));
  const incrementalWins = Math.max(0, projectedWins - baselineWins);

  const monthlyIncrementalRevenue = incrementalWins * avgJobValue;
  const annualIncrementalRevenue = monthlyIncrementalRevenue * 12;
  const monthlyIncrementalProfit = Math.round(
    monthlyIncrementalRevenue * (grossMargin / 100)
  );
  const annualIncrementalProfit = monthlyIncrementalProfit * 12;

  // AI compute cost (4 renderings per consultation for 2x2 sheet at $0.012 per LLM call)
  const monthlyAiCost = +(consultationsPerMonth * 4 * 0.012).toFixed(2);
  const roiMultiplier = monthlyAiCost > 0 ? Math.round(monthlyIncrementalRevenue / monthlyAiCost) : 0;

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] overflow-hidden shadow-sm">
      <div className="p-5 border-b border-[var(--color-border)] bg-[var(--color-panel-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--color-text-primary)]">
              Franchise In-Car Consultation ROI Engine
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Unit economics of instant 2K visual delivery during the 10-13 minute driveway window
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-semibold">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>+{incrementalWins} Closed Jobs / Mo</span>
        </div>
      </div>

      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls (Left 6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div>
            <div className="flex justify-between text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
              <span>Monthly In-Home Consultations</span>
              <span className="font-mono font-bold text-[var(--color-text-primary)]">
                {consultationsPerMonth} properties
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="300"
              step="5"
              value={consultationsPerMonth}
              onChange={(e) => setConsultationsPerMonth(Number(e.target.value))}
              className="w-full h-2 bg-[var(--color-panel-subtle)] rounded-lg appearance-none cursor-pointer accent-amber-500 border border-[var(--color-border)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                <span>Current Close %</span>
                <span className="font-mono font-bold text-slate-500">{baselineCloseRate}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="1"
                value={baselineCloseRate}
                onChange={(e) => setBaselineCloseRate(Number(e.target.value))}
                className="w-full h-2 bg-[var(--color-panel-subtle)] rounded-lg appearance-none cursor-pointer accent-slate-500 border border-[var(--color-border)]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                <span>In-Car Visual Close %</span>
                <span className="font-mono font-bold text-emerald-600">{projectedCloseRate}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="75"
                step="1"
                value={projectedCloseRate}
                onChange={(e) => setProjectedCloseRate(Number(e.target.value))}
                className="w-full h-2 bg-[var(--color-panel-subtle)] rounded-lg appearance-none cursor-pointer accent-emerald-500 border border-[var(--color-border)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                <span>Avg Ticket (C9/Omni)</span>
                <span className="font-mono font-bold text-[var(--color-text-primary)]">
                  ${avgJobValue.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="1500"
                max="6500"
                step="250"
                value={avgJobValue}
                onChange={(e) => setAvgJobValue(Number(e.target.value))}
                className="w-full h-2 bg-[var(--color-panel-subtle)] rounded-lg appearance-none cursor-pointer accent-amber-500 border border-[var(--color-border)]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                <span>Gross Margin %</span>
                <span className="font-mono font-bold text-[var(--color-text-primary)]">{grossMargin}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="75"
                step="1"
                value={grossMargin}
                onChange={(e) => setGrossMargin(Number(e.target.value))}
                className="w-full h-2 bg-[var(--color-panel-subtle)] rounded-lg appearance-none cursor-pointer accent-amber-500 border border-[var(--color-border)]"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--color-panel-subtle)] border border-[var(--color-border)] text-xs text-[var(--color-text-muted)] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[var(--color-text-primary)]">
              <ShieldCheck className="h-4 w-4 text-amber-500" />
              <span>In-Car Consultation Mechanics</span>
            </div>
            <p>
              Presenting a realistic 2K dusk lighting rendering before leaving the driveway creates emotional ownership. Homeowners commit on the spot instead of shopping multiple bids.
            </p>
          </div>
        </div>

        {/* Results Bento (Right 6 cols) */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-3.5">
          <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] flex flex-col justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
              Monthly Revenue Add
            </span>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 tabular-nums">
                +${monthlyIncrementalRevenue.toLocaleString()}
              </span>
              <span className="block text-xs text-[var(--color-text-muted)] mt-0.5">
                Based on +{incrementalWins} additional installations
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Annualized: +${annualIncrementalRevenue.toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] flex flex-col justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
              Monthly Gross Profit
            </span>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-500 tabular-nums">
                +${monthlyIncrementalProfit.toLocaleString()}
              </span>
              <span className="block text-xs text-[var(--color-text-muted)] mt-0.5">
                At {grossMargin}% franchise margin
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Annualized: +${annualIncrementalProfit.toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Monthly AI Compute Cost
              </span>
              <Zap className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-[var(--color-text-primary)] tabular-nums">
                ${monthlyAiCost}
              </span>
              <span className="block text-xs text-[var(--color-text-muted)] mt-0.5">
                {consultationsPerMonth * 4} total model inferences
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Unit cost: $0.012 / rendering
            </span>
          </div>

          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                AI Compute ROI
              </span>
              <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 tabular-nums">
                {roiMultiplier.toLocaleString()}x
              </span>
              <span className="block text-xs text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">
                Revenue generated per $1 AI spend
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-600/70">
              Infinite leverage on franchise margins
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
