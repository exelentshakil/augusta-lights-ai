"use client";

import React from "react";
import { RooflineSegment } from "@/types/lighting";
import {
  X,
  Compass,
  CheckCircle2,
  XCircle,
  Sliders,
  Sparkles,
  Zap,
  Info,
} from "lucide-react";

interface RooflineCorrectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  segments: RooflineSegment[];
  onToggleSegment: (segmentId: string) => void;
  onResetToFrontOnly: () => void;
}

export function RooflineCorrectionDrawer({
  isOpen,
  onClose,
  segments,
  onToggleSegment,
  onResetToFrontOnly,
}: RooflineCorrectionDrawerProps) {
  if (!isOpen) return null;

  const totalBulbs = segments
    .filter((s) => s.enabled)
    .reduce((sum, s) => sum + s.bulbCount, 0);

  const activeFootage = Math.round((totalBulbs * 15) / 12); // 15 inches per bulb

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-[var(--color-panel)] border border-[var(--color-border)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--color-border)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                10–20s Mobile Roofline Audit
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                Tap to toggle front-facing eaves or exclude unwanted segments
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-panel-subtle)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick 1-Tap Presets */}
        <div className="p-4 bg-[var(--color-panel-subtle)] border-b border-[var(--color-border)] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-semibold">Quick Actions:</span>
          </div>
          <button
            onClick={onResetToFrontOnly}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Reset to Front-Facing Only</span>
          </button>
        </div>

        {/* Segment Toggles List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
            Detected Roofline Segments ({segments.length})
          </div>

          {segments.map((seg) => (
            <div
              key={seg.id}
              onClick={() => onToggleSegment(seg.id)}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                seg.enabled
                  ? "border-amber-500/60 bg-amber-500/5 dark:bg-amber-500/10 shadow-xs"
                  : "border-[var(--color-border)] bg-[var(--color-panel)] opacity-60"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                    seg.enabled
                      ? "bg-amber-500 text-white"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                  }`}
                >
                  {seg.enabled ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--color-text-primary)] truncate">
                      {seg.name}
                    </span>
                    {seg.isFrontFacing ? (
                      <span className="inline-flex px-1.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                        Front
                      </span>
                    ) : (
                      <span className="inline-flex px-1.5 py-0.5 rounded text-[11px] font-semibold bg-slate-500/10 text-slate-500 border border-slate-500/20 whitespace-nowrap">
                        Rear Ridge
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    {seg.bulbCount} C9 bulbs · ~{Math.round((seg.bulbCount * 15) / 12)} linear ft
                  </p>
                </div>
              </div>

              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-md border shrink-0 ${
                  seg.enabled
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700"
                }`}
              >
                {seg.enabled ? "ACTIVE" : "OFF"}
              </span>
            </div>
          ))}
        </div>

        {/* Live Hardware Measurement Footer */}
        <div className="p-4 bg-[var(--color-panel-subtle)] border-t border-[var(--color-border)] flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-[var(--color-text-primary)]">
              Total Active: {totalBulbs} C9 Bulbs (~{activeFootage} ft)
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              Front-facing roofline ONLY by default (no windows/garage trim)
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
