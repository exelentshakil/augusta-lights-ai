"use client";

import React, { useState } from "react";
import {
  CustomerResidence,
  PropertyImagePreset,
  RooflineSegment,
  ChristmasPattern,
  OmniPattern,
} from "@/types/lighting";
import { X, Download, Layers, Sparkles, CheckCircle2 } from "lucide-react";
import { CHRISTMAS_PATTERNS, OMNI_PATTERNS } from "@/lib/constants";

interface InspirationSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerResidence;
  preset: PropertyImagePreset;
  segments: RooflineSegment[];
}

export function InspirationSheetModal({
  isOpen,
  onClose,
  customer,
  preset,
  segments,
}: InspirationSheetModalProps) {
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const activeSegments = segments.filter((s) => s.enabled);
  const warmWhite = CHRISTMAS_PATTERNS[0];
  const candyCane = CHRISTMAS_PATTERNS[2];
  const blueWhite = CHRISTMAS_PATTERNS[3];
  const omniWash = OMNI_PATTERNS[0];

  const panels = [
    {
      id: "panel-1",
      title: "Option A: 2700K Warm White (Classic #1 Seller)",
      badge: "#1 Texas Seller",
      palette: warmWhite.palette,
      system: "christmas_c9",
      specs: "SMD C9 Commercial LED · 15\" Spacing",
      note: "Pure golden architectural tone · Timeless holiday elegance",
    },
    {
      id: "panel-2",
      title: "Option B: Candy Cane (2 Red / 2 White Groups)",
      badge: "Festive Tradition",
      palette: candyCane.palette,
      system: "christmas_c9",
      specs: "SMD C9 Commercial LED · 2 Red / 2 White",
      note: "Authentic repeating bulb groupings · High holiday impact",
    },
    {
      id: "panel-3",
      title: "Option C: Winter Blue & White (2 Blue / 2 White)",
      badge: "Cool Contrast",
      palette: blueWhite.palette,
      system: "christmas_c9",
      specs: "SMD C9 Commercial LED · 2 Blue / 2 White",
      note: "Vibrant evening contrast · Crisp winter brilliance",
    },
    {
      id: "panel-4",
      title: "Option D: Omni Permanent Architectural Lighting",
      badge: "Year-Round Omni",
      palette: [omniWash.beamColor],
      system: "omni_permanent",
      specs: "Omni Architectural Diode · 8\" Spacing",
      note: "Downward vertical wall-wash cascading to landscape beds",
    },
  ];

  const handleDownloadSheet = () => {
    setIsExporting(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 2400;
      canvas.height = 2400;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Dark background ground
      ctx.fillStyle = "#070b14";
      ctx.fillRect(0, 0, 2400, 2400);

      // Header Banner
      ctx.fillStyle = "#0d1527";
      ctx.fillRect(60, 60, 2280, 200);
      ctx.strokeStyle = "rgba(245, 158, 11, 0.6)";
      ctx.lineWidth = 3;
      ctx.strokeRect(60, 60, 2280, 200);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 56px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(customer.residenceTitle, 100, 145);

      ctx.fillStyle = "#f59e0b";
      ctx.font = "600 28px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(
        "AUGUSTA LIGHTS · 2x2 INSPIRATION & COMPARISON SHEET",
        100,
        205
      );

      ctx.fillStyle = "#94a3b8";
      ctx.font = "500 24px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(`Property: ${preset.name} · ${preset.architectureType}`, 100, 240);

      // 4 Quadrants
      const quads = [
        { x: 60, y: 300, w: 1110, h: 950, p: panels[0] },
        { x: 1230, y: 300, w: 1110, h: 950, p: panels[1] },
        { x: 60, y: 1310, w: 1110, h: 950, p: panels[2] },
        { x: 1230, y: 1310, w: 1110, h: 950, p: panels[3] },
      ];

      quads.forEach((q) => {
        // Draw dusk sky
        const skyGrad = ctx.createLinearGradient(q.x, q.y, q.x, q.y + q.h);
        skyGrad.addColorStop(0, "#080d1f");
        skyGrad.addColorStop(0.65, "#152244");
        skyGrad.addColorStop(1, "#263558");
        ctx.fillStyle = skyGrad;
        ctx.fillRect(q.x, q.y, q.w, q.h);

        // Ground
        ctx.fillStyle = "#122019";
        ctx.fillRect(q.x, q.y + q.h * 0.65, q.w, q.h * 0.35);

        // House facade
        ctx.fillStyle = "#4a2420";
        ctx.fillRect(q.x + q.w * 0.18, q.y + q.h * 0.42, q.w * 0.64, q.h * 0.28);

        // Windows with warm glow
        preset.windows.forEach((win) => {
          const wx = q.x + (win.x / 100) * q.w;
          const wy = q.y + (win.y / 100) * q.h;
          const ww = (win.width / 100) * q.w;
          const wh = (win.height / 100) * q.h;
          ctx.fillStyle = "#fed7aa";
          ctx.fillRect(wx, wy, ww, wh);
          ctx.strokeStyle = "#1e293b";
          ctx.lineWidth = 2;
          ctx.strokeRect(wx, wy, ww, wh);
        });

        // Bulbs / Omni Wall Wash
        if (q.p.system === "christmas_c9") {
          activeSegments.forEach((seg) => {
            for (let i = 0; i < seg.points.length - 1; i++) {
              const p1 = seg.points[i];
              const p2 = seg.points[i + 1];
              const x1 = q.x + (p1[0] / 100) * q.w;
              const y1 = q.y + (p1[1] / 100) * q.h;
              const x2 = q.x + (p2[0] / 100) * q.w;
              const y2 = q.y + (p2[1] / 100) * q.h;

              for (let b = 0; b <= 12; b++) {
                const t = b / 12;
                const bx = x1 + (x2 - x1) * t;
                const by = y1 + (y2 - y1) * t;
                const color = q.p.palette[b % q.p.palette.length];
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(bx, by, 7, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          });
        } else {
          // Omni Wash
          activeSegments.forEach((seg) => {
            for (let i = 0; i < seg.points.length - 1; i++) {
              const p1 = seg.points[i];
              const p2 = seg.points[i + 1];
              const x1 = q.x + (p1[0] / 100) * q.w;
              const y1 = q.y + (p1[1] / 100) * q.h;
              const x2 = q.x + (p2[0] / 100) * q.w;
              const y2 = q.y + (p2[1] / 100) * q.h;

              const washGrad = ctx.createLinearGradient(x1, y1, x1, y1 + 220);
              washGrad.addColorStop(0, "rgba(254, 243, 199, 0.9)");
              washGrad.addColorStop(1, "rgba(0,0,0,0)");
              ctx.fillStyle = washGrad;

              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.lineTo(x2 + 25, y2 + 220);
              ctx.lineTo(x1 - 25, y1 + 220);
              ctx.closePath();
              ctx.fill();
            }
          });
        }

        // Panel Placard at bottom of quadrant
        ctx.fillStyle = "rgba(7, 11, 20, 0.88)";
        ctx.fillRect(q.x, q.y + q.h - 130, q.w, 130);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(q.x, q.y + q.h - 130, q.w, 130);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 30px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(q.p.title, q.x + 30, q.y + q.h - 78);

        ctx.fillStyle = "#f59e0b";
        ctx.font = "600 22px 'JetBrains Mono', monospace";
        ctx.fillText(q.p.specs, q.x + 30, q.y + q.h - 35);
      });

      // Trigger download
      const link = document.createElement("a");
      link.download = `Augusta_Lights_${customer.lastName}_Residence_2x2_Inspiration_Sheet.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 0.95);
      link.click();
    } catch (e) {
      console.error("2x2 Export error:", e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl rounded-2xl bg-[var(--color-panel)] border border-[var(--color-border)] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--color-border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                2x2 In-Home Inspiration & Comparison Sheet
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                Synchronized on the identical customer house: {customer.residenceTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSheet}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isExporting ? "Rendering 2x2..." : "Download 2x2 JPEG"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-panel-subtle)]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 2x2 Grid Viewport */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {panels.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-[var(--color-border)] bg-slate-950 overflow-hidden shadow-sm flex flex-col"
              >
                {/* Visual Simulation Thumbnail */}
                <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 400 250">
                    {/* Dusk Sky */}
                    <rect width="400" height="160" fill="#0c152e" />
                    {/* Stars */}
                    <circle cx="80" cy="30" r="1" fill="#fff" />
                    <circle cx="200" cy="45" r="1.2" fill="#fff" />
                    <circle cx="320" cy="25" r="1" fill="#fff" />
                    {/* Ground */}
                    <rect y="160" width="400" height="90" fill="#122019" />
                    {/* House Structure */}
                    <rect x="80" y="100" width="240" height="80" fill="#4a2420" />
                    <polygon points="80,100 150,45 220,100" fill="#3b1307" />
                    {/* Windows */}
                    <rect x="110" y="115" width="25" height="35" fill="#fde047" stroke="#1e293b" />
                    <rect x="170" y="115" width="25" height="35" fill="#fde047" stroke="#1e293b" />
                    <rect x="250" y="115" width="30" height="40" fill="#fde047" stroke="#1e293b" />

                    {/* Lighting Layer */}
                    {p.system === "christmas_c9" ? (
                      <g>
                        {[
                          [80, 100], [105, 80], [130, 60], [150, 45],
                          [175, 65], [200, 85], [220, 100], [250, 100],
                          [280, 100], [310, 100],
                        ].map(([bx, by], i) => (
                          <circle
                            key={i}
                            cx={bx}
                            cy={by + 2}
                            r="3.5"
                            fill={p.palette[i % p.palette.length]}
                          />
                        ))}
                      </g>
                    ) : (
                      <g>
                        <polygon
                          points="80,100 150,45 160,160 70,160"
                          fill="rgba(254, 243, 199, 0.45)"
                        />
                        <polygon
                          points="150,45 220,100 230,160 140,160"
                          fill="rgba(254, 243, 199, 0.45)"
                        />
                        <polygon
                          points="220,100 320,100 330,170 210,170"
                          fill="rgba(254, 243, 199, 0.45)"
                        />
                      </g>
                    )}
                  </svg>

                  {/* Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500 text-slate-950 font-mono">
                      {p.badge}
                    </span>
                  </div>
                </div>

                {/* Panel Footer Information */}
                <div className="p-3 bg-[var(--color-panel)] border-t border-[var(--color-border)] flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="text-xs font-bold text-[var(--color-text-primary)]">
                      {p.title}
                    </h4>
                    <p className="text-[11px] font-mono text-[var(--color-text-muted)] mt-0.5">
                      {p.specs}
                    </p>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-2 pt-2 border-t border-[var(--color-border-subtle)]">
                    {p.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="p-4 bg-[var(--color-panel-subtle)] border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-muted)]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>
              100% Identical Dusk Master used across all 4 panels (Camera angle, architecture, & landscaping locked)
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[var(--color-panel)] border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
