"use client";

import React from "react";
import { useTheme } from "next-themes";
import {
  Sparkles,
  Sun,
  Moon,
  ShieldCheck,
  Zap,
  Flame,
  Layers,
  FileCode,
  RotateCcw,
} from "lucide-react";

interface NavbarProps {
  chaosMode: boolean;
  onToggleChaos: () => void;
  onResetToDefault: () => void;
  onOpenBlueprint: () => void;
}

export function Navbar({
  chaosMode,
  onToggleChaos,
  onResetToDefault,
  onOpenBlueprint,
}: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-panel)]/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Brand & Franchise Workspace */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-sm">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-[var(--color-text-primary)]">
                  Augusta Lights
                </span>
                <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20 whitespace-nowrap">
                  Texas Franchise AI
                </span>
              </div>
              <p className="truncate text-xs font-medium text-[var(--color-text-muted)]">
                Dallas / Fort Worth · Austin · Houston Franchise Network
              </p>
            </div>
          </div>

          {/* Center Badges (Desktop) */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-panel-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-secondary)] whitespace-nowrap">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Architectural Lock: 100%</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-panel-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-secondary)] whitespace-nowrap">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>In-Car Window: &lt; 90s</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-panel-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-secondary)] whitespace-nowrap">
              <Layers className="h-3.5 w-3.5 text-blue-500" />
              <span>2-Stage Pipeline</span>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Chaos Failover Toggle */}
            <button
              onClick={onToggleChaos}
              title="Simulate primary OpenAI API outage to test sub-second failover to Gemini 2.0 Flash"
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                chaosMode
                  ? "bg-red-500/15 text-red-600 border border-red-500/30"
                  : "bg-[var(--color-panel-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] border border-[var(--color-border)]"
              }`}
            >
              <Flame className={`h-3.5 w-3.5 ${chaosMode ? "text-red-600 animate-bounce" : "text-gray-400"}`} />
              <span className="hidden sm:inline">Chaos Mode:</span>
              <span>{chaosMode ? "Gemini Failover ON" : "Normal"}</span>
            </button>

            {/* Export Blueprint */}
            <button
              onClick={onOpenBlueprint}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] px-2.5 py-1.5 text-xs font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-colors whitespace-nowrap"
            >
              <FileCode className="h-3.5 w-3.5 text-amber-600" />
              <span className="hidden md:inline">Blueprints</span>
            </button>

            {/* Reset Defaults */}
            <button
              onClick={onResetToDefault}
              title="Reset Consultation to Default Preset"
              className="p-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-panel-subtle)] transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {/* Theme Toggle (Light / Dark) */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-panel-subtle)] transition-colors"
                title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 text-amber-400" />
                ) : (
                  <Moon className="h-4 w-4 text-slate-600" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
