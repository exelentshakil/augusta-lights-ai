"use client";

import React from "react";
import {
  Sparkles,
  Shield,
  Code2,
  ExternalLink,
  Layers,
  Cpu,
  Zap,
  Activity,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-panel)] py-10 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: System Branding */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-bold text-sm text-[var(--color-text-primary)] tracking-tight">
                Augusta Lights Texas
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Mission-critical mobile lighting visualization engine engineered for General Managers in the field. Delivers photorealistic 2K dusk renderings and 2x2 inspiration sheets within a 10–13 minute consultation window.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-[var(--color-text-muted)]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Production Edge v2.4 (Texas Central)</span>
            </div>
          </div>

          {/* Col 2: Architecture Specifications */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Architectural Engine
            </h4>
            <ul className="space-y-1.5 text-xs text-[var(--color-text-muted)]">
              <li className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-amber-500" />
                <span>SAM-2 Structural Mask (100% Lock)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-blue-500" />
                <span>Cleaned Dusk Property Master</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-purple-500" />
                <span>Dual AI (OpenAI + Gemini Failover)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-emerald-500" />
                <span>10–20s Mobile Roofline Correction</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Hardware Compliance */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Hardware Precision
            </h4>
            <ul className="space-y-1.5 text-xs text-[var(--color-text-muted)]">
              <li>
                <strong className="text-[var(--color-text-primary)]">Christmas C9:</strong> 15" commercial diode spacing, 2/2 repeating patterns
              </li>
              <li>
                <strong className="text-[var(--color-text-primary)]">Omni Permanent:</strong> 8" spacing, 30° vertical wall-wash cones
              </li>
              <li>
                <strong className="text-[var(--color-text-primary)]">Decor Vectors:</strong> 36"/48" wreaths, tree trunk & canopy branch wraps
              </li>
              <li>
                <strong className="text-[var(--color-text-primary)]">Resolution:</strong> 2560x1440 2K Lossless Canvas JPEG
              </li>
            </ul>
          </div>

          {/* Col 4: Systems Engineering Partner */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Engineering Credentials
            </h4>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Engineered by <strong className="text-[var(--color-text-primary)]">Md Shakil A.</strong>, Principal Systems Architect at BarakahSoft LLC.
            </p>
            <div className="text-xs text-[var(--color-text-muted)] space-y-1">
              <p>• 12+ Years Enterprise Systems Architecture</p>
              <p>• Former Lead Engineer at Legiit ($1M ARR Command Center)</p>
              <p>• 115+ Production AI, SaaS & Automation Systems</p>
            </div>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://github.com/exelentshakil/augusta-lights-ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-500 transition-colors"
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>GitHub Repository</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--color-border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-text-muted)] font-mono">
          <div className="flex items-center gap-4">
            <span>© 2026 Augusta Lights Texas Franchise System</span>
            <span>•</span>
            <a href="/api/health" className="hover:text-amber-500 transition-colors">
              API Status
            </a>
            <span>•</span>
            <span>OpenAI + Gemini Edge Fallback</span>
          </div>

          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-emerald-500" />
            <span>Zero-Signal Texas Offline Rule Engine Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
