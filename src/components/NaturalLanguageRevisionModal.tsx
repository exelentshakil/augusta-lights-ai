"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  RefreshCw,
  Send,
  MessageSquare,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";

interface NaturalLanguageRevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRevision: (instruction: string) => Promise<void>;
  isRevising: boolean;
}

export function NaturalLanguageRevisionModal({
  isOpen,
  onClose,
  onApplyRevision,
  isRevising,
}: NaturalLanguageRevisionModalProps) {
  const [instruction, setInstruction] = useState("");

  if (!isOpen) return null;

  const quickChips = [
    "Remove lights from lower garage roof",
    "Center 48-inch wreath above garage",
    "Wrap front oak tree in warm white",
    "Switch roofline to Candy Cane (2 Red / 2 White)",
    "Switch to Omni Permanent Warm White Wall Wash",
    "Add warm white ground stakes along driveway",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim()) return;
    await onApplyRevision(instruction);
    onClose();
  };

  const handleChipClick = (chip: string) => {
    setInstruction(chip);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-[var(--color-panel)] border border-[var(--color-border)] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--color-border)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                Natural-Language Revision
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                In-car adjustments without entering a complex Photoshop editor
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

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">
              Revision Instruction
            </label>
            <textarea
              rows={3}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="e.g. Remove lights from the lower garage roof. Center a 48-inch wreath above garage. Wrap the oak tree in warm white."
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-3 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Quick Suggestions Chips */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)] mb-2">
              <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
              <span>Tap to Quick-Fill:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {quickChips.map((chip, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleChipClick(chip)}
                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--color-panel-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] border border-[var(--color-border)] transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Stage 2 Lighting Layer will be re-synthesized instantly over the locked Stage 1 Dusk Master. Zero changes will occur to windows, roof pitch, or house architecture.
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] text-xs font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-panel-subtle)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isRevising || !instruction.trim()}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              {isRevising ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Re-Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Apply Revision</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
