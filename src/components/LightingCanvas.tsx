"use client";

import React, { useState, useRef } from "react";
import {
  CustomerResidence,
  PropertyImagePreset,
  LightingSystemType,
  ChristmasPattern,
  OmniPattern,
  DecorOptions,
  RooflineSegment,
} from "@/types/lighting";
import {
  Download,
  Eye,
  Sliders,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Maximize2,
  Moon,
  Sun,
  Camera,
  Layers,
} from "lucide-react";

interface LightingCanvasProps {
  customer: CustomerResidence;
  preset: PropertyImagePreset;
  systemType: LightingSystemType;
  christmasPattern: ChristmasPattern;
  omniPattern: OmniPattern;
  decor: DecorOptions;
  segments: RooflineSegment[];
  stage: "day" | "dusk_master" | "rendered_hero" | "comparison_2x2";
  onStageChange: (stage: "day" | "dusk_master" | "rendered_hero") => void;
  onOpenRevision: () => void;
  onOpenInspiration: () => void;
  onOpenRooflineAudit: () => void;
}

export function LightingCanvas({
  customer,
  preset,
  systemType,
  christmasPattern,
  omniPattern,
  decor,
  segments,
  stage,
  onStageChange,
  onOpenRevision,
  onOpenInspiration,
  onOpenRooflineAudit,
}: LightingCanvasProps) {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeSegments = segments.filter((s) => s.enabled);
  const totalBulbs = activeSegments.reduce((acc, s) => acc + s.bulbCount, 0);

  // Download 2K Hero Rendering via Canvas
  const handleDownloadHero = () => {
    setIsExporting(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 2560;
      canvas.height = 1440;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw dusk sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 900);
      skyGrad.addColorStop(0, "#080d1f");
      skyGrad.addColorStop(0.65, "#152244");
      skyGrad.addColorStop(1, "#263558");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, 2560, 1440);

      // Draw stars
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 90; i++) {
        const sx = (Math.sin(i * 99) * 0.5 + 0.5) * 2560;
        const sy = (Math.cos(i * 33) * 0.5 + 0.5) * 600;
        const r = (i % 3) * 0.8 + 0.8;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw ground and lawn
      const groundGrad = ctx.createLinearGradient(0, 900, 0, 1440);
      groundGrad.addColorStop(0, "#122019");
      groundGrad.addColorStop(1, "#0a130e");
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, 900, 2560, 540);

      // Draw Driveway
      ctx.fillStyle = "#1e2430";
      ctx.beginPath();
      ctx.moveTo(250, 1440);
      ctx.lineTo(850, 1440);
      ctx.lineTo(800, 950);
      ctx.lineTo(400, 950);
      ctx.closePath();
      ctx.fill();

      // House main brick facade
      ctx.fillStyle = "#5c2e28";
      ctx.fillRect(450, 520, 1650, 460);

      // House Upper gables
      ctx.fillStyle = "#4a2420";
      ctx.beginPath();
      ctx.moveTo(450, 520);
      ctx.lineTo(950, 240);
      ctx.lineTo(1450, 520);
      ctx.closePath();
      ctx.fill();

      // Right Upper Gable
      ctx.beginPath();
      ctx.moveTo(1350, 520);
      ctx.lineTo(1750, 310);
      ctx.lineTo(2100, 520);
      ctx.closePath();
      ctx.fill();

      // Roof tiles dark shingles
      ctx.fillStyle = "#171c26";
      ctx.beginPath();
      ctx.moveTo(950, 230);
      ctx.lineTo(420, 530);
      ctx.lineTo(450, 535);
      ctx.lineTo(950, 250);
      ctx.lineTo(1450, 535);
      ctx.lineTo(1480, 530);
      ctx.closePath();
      ctx.fill();

      // Windows with 2700K warm interior illumination
      preset.windows.forEach((win) => {
        const wx = (win.x / 100) * 2560;
        const wy = (win.y / 100) * 1440;
        const ww = (win.width / 100) * 2560;
        const wh = (win.height / 100) * 1440;

        // Window warm glow halo
        const winGlow = ctx.createRadialGradient(
          wx + ww / 2,
          wy + wh / 2,
          5,
          wx + ww / 2,
          wy + wh / 2,
          ww * 1.5
        );
        winGlow.addColorStop(0, "rgba(254, 215, 137, 0.9)");
        winGlow.addColorStop(0.7, "rgba(245, 158, 11, 0.45)");
        winGlow.addColorStop(1, "rgba(245, 158, 11, 0)");
        ctx.fillStyle = winGlow;
        ctx.fillRect(wx - 20, wy - 20, ww + 40, wh + 40);

        // Window glass
        ctx.fillStyle = "#fed7aa";
        ctx.fillRect(wx, wy, ww, wh);

        // Window mullions (preservation)
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 4;
        ctx.strokeRect(wx, wy, ww, wh);
        ctx.beginPath();
        ctx.moveTo(wx + ww / 2, wy);
        ctx.lineTo(wx + ww / 2, wy + wh);
        ctx.moveTo(wx, wy + wh / 2);
        ctx.lineTo(wx + ww, wy + wh / 2);
        ctx.stroke();
      });

      // Front Door
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(1150, 720, 160, 260);

      // Garage Doors
      ctx.fillStyle = "#2d3748";
      ctx.fillRect(520, 700, 480, 260);

      // RENDER LIGHTING LAYER (Stage 2)
      if (stage !== "day") {
        if (systemType === "christmas_c9") {
          // Render C9 bulbs along active roofline segments
          activeSegments.forEach((seg) => {
            for (let i = 0; i < seg.points.length - 1; i++) {
              const p1 = seg.points[i];
              const p2 = seg.points[i + 1];
              const x1 = (p1[0] / 100) * 2560;
              const y1 = (p1[1] / 100) * 1440;
              const x2 = (p2[0] / 100) * 2560;
              const y2 = (p2[1] / 100) * 1440;

              const count = Math.max(6, Math.round(seg.bulbCount / (seg.points.length - 1)));
              for (let b = 0; b <= count; b++) {
                const t = b / count;
                const bx = x1 + (x2 - x1) * t;
                const by = y1 + (y2 - y1) * t;

                const colorIdx = b % christmasPattern.palette.length;
                const bulbColor = christmasPattern.palette[colorIdx];

                // Bulb radial bloom
                const bulbGlow = ctx.createRadialGradient(bx, by, 2, bx, by, 32);
                bulbGlow.addColorStop(0, bulbColor);
                bulbGlow.addColorStop(0.3, bulbColor);
                bulbGlow.addColorStop(1, "rgba(0,0,0,0)");
                ctx.fillStyle = bulbGlow;
                ctx.beginPath();
                ctx.arc(bx, by, 32, 0, Math.PI * 2);
                ctx.fill();

                // Bulb diode center
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.arc(bx, by, 4.5, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          });
        } else {
          // Render Omni Wall Wash
          activeSegments.forEach((seg) => {
            for (let i = 0; i < seg.points.length - 1; i++) {
              const p1 = seg.points[i];
              const p2 = seg.points[i + 1];
              const x1 = (p1[0] / 100) * 2560;
              const y1 = (p1[1] / 100) * 1440;
              const x2 = (p2[0] / 100) * 2560;
              const y2 = (p2[1] / 100) * 1440;

              const washGrad = ctx.createLinearGradient(x1, y1, x1, y1 + 380);
              washGrad.addColorStop(0, omniPattern.beamColor);
              washGrad.addColorStop(0.2, omniPattern.ambientColor);
              washGrad.addColorStop(1, "rgba(0,0,0,0)");
              ctx.fillStyle = washGrad;

              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.lineTo(x2 + 50, y2 + 380);
              ctx.lineTo(x1 - 50, y1 + 380);
              ctx.closePath();
              ctx.fill();
            }
          });
        }

        // Render Wreath if enabled
        if (decor.wreaths.enabled) {
          const wx = (preset.wreathAnchor.x / 100) * 2560;
          const wy = (preset.wreathAnchor.y / 100) * 1440;
          ctx.strokeStyle = "#14532d";
          ctx.lineWidth = 28;
          ctx.beginPath();
          ctx.arc(wx, wy, 55, 0, Math.PI * 2);
          ctx.stroke();

          // Wreath mini-lights
          ctx.fillStyle = "#ffdf9e";
          for (let a = 0; a < 24; a++) {
            const angle = (a / 24) * Math.PI * 2;
            const lx = wx + Math.cos(angle) * 55;
            const ly = wy + Math.sin(angle) * 55;
            ctx.beginPath();
            ctx.arc(lx, ly, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Professional Architectural Watermark & Client Residence Header
      ctx.fillStyle = "rgba(7, 11, 20, 0.78)";
      ctx.fillRect(80, 70, 880, 160);
      ctx.strokeStyle = "rgba(245, 158, 11, 0.6)";
      ctx.lineWidth = 3;
      ctx.strokeRect(80, 70, 880, 160);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 44px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(customer.residenceTitle, 115, 135);

      ctx.fillStyle = "#f59e0b";
      ctx.font = "600 24px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(
        `AUGUSTA LIGHTS · ${systemType === "christmas_c9" ? "SMD C9 COMMERCIAL LED (15\" SPACING)" : "OMNI ARCHITECTURAL WALL WASH"}`,
        115,
        185
      );

      // Preservation stamp bottom right
      ctx.fillStyle = "rgba(7, 11, 20, 0.78)";
      ctx.fillRect(1740, 1310, 740, 80);
      ctx.strokeStyle = "rgba(16, 185, 129, 0.6)";
      ctx.lineWidth = 2;
      ctx.strokeRect(1740, 1310, 740, 80);

      ctx.fillStyle = "#10b981";
      ctx.font = "bold 22px 'JetBrains Mono', monospace";
      ctx.fillText("✓ 100% ARCHITECTURAL GEOMETRY PRESERVED", 1770, 1360);

      // Trigger download
      const link = document.createElement("a");
      link.download = `Augusta_Lights_${customer.lastName}_Residence_2K_Hero.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 0.95);
      link.click();
    } catch (e) {
      console.error("Export error:", e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Viewport Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-[var(--color-panel)] border border-[var(--color-border)]">
        {/* Stage Tabs (Day ➔ Dusk Master ➔ 2K Hero) */}
        <div className="flex items-center gap-1 bg-[var(--color-panel-subtle)] p-1 rounded-lg border border-[var(--color-border)]">
          <button
            onClick={() => onStageChange("day")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
              stage === "day"
                ? "bg-[var(--color-panel)] text-[var(--color-text-primary)] shadow-sm"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <Sun className="h-3.5 w-3.5 text-amber-500" />
            <span>1. Original Daytime</span>
          </button>

          <button
            onClick={() => onStageChange("dusk_master")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
              stage === "dusk_master"
                ? "bg-[var(--color-panel)] text-[var(--color-text-primary)] shadow-sm"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <Moon className="h-3.5 w-3.5 text-indigo-500" />
            <span>2. Dusk Master (Cleaned)</span>
          </button>

          <button
            onClick={() => onStageChange("rendered_hero")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
              stage === "rendered_hero" || stage === "comparison_2x2"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>3. 2K Hero Visualization</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Quick 10-20s Roofline Audit button */}
          <button
            onClick={onOpenRooflineAudit}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] transition-colors whitespace-nowrap"
          >
            <Sliders className="h-3.5 w-3.5 text-blue-500" />
            <span className="hidden sm:inline">15s Roofline Audit</span>
            <span className="sm:hidden">Rooflines</span>
          </button>

          {/* 2x2 Inspiration Sheet Modal Button */}
          <button
            onClick={onOpenInspiration}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors whitespace-nowrap"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>2x2 Sheet</span>
          </button>

          {/* Download 2K Hero JPEG */}
          <button
            onClick={handleDownloadHero}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition-all whitespace-nowrap"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{isExporting ? "Exporting 2K..." : "Download 2K"}</span>
          </button>
        </div>
      </div>

      {/* Main Photographic Canvas Container */}
      <div
        ref={containerRef}
        className="relative rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-md bg-slate-950 aspect-[16/9] w-full select-none"
      >
        {/* SVG RENDERER */}
        <svg
          className="w-full h-full"
          viewBox="0 0 1000 562.5"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Daytime Sky Gradient */}
            <linearGradient id="daySky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="60%" stopColor="#93c5fd" />
              <stop offset="100%" stopColor="#dbeafe" />
            </linearGradient>

            {/* Dusk Blue-Hour Sky Gradient */}
            <linearGradient id="duskSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#080d21" />
              <stop offset="50%" stopColor="#142247" />
              <stop offset="100%" stopColor="#25355e" />
            </linearGradient>

            {/* Omni Downward Wall Wash Beams */}
            <linearGradient id="omniWashGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={omniPattern.beamColor} stopOpacity="0.9" />
              <stop offset="35%" stopColor={omniPattern.ambientColor} stopOpacity="0.55" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>

            {/* Window Glow Filter */}
            <radialGradient id="winGlowGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fffbeb" stopOpacity="1" />
              <stop offset="45%" stopColor="#fde047" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>

            {/* Glow Filter for C9 Bulbs */}
            <filter id="c9Glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. SKY */}
          <rect
            width="1000"
            height="350"
            fill={stage === "day" ? "url(#daySky)" : "url(#duskSky)"}
          />

          {/* Stars (Visible in Dusk and Hero stages) */}
          {stage !== "day" && (
            <g opacity="0.85">
              {[
                [80, 40], [150, 80], [220, 35], [290, 70], [360, 45],
                [420, 90], [510, 40], [580, 85], [660, 30], [740, 75],
                [820, 40], [910, 85], [960, 35], [130, 120], [310, 110],
                [490, 125], [680, 115], [870, 120],
              ].map(([x, y], i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={(i % 3) * 0.4 + 0.8}
                  fill="#ffffff"
                  opacity={(i % 2 === 0 ? 0.9 : 0.6)}
                />
              ))}
            </g>
          )}

          {/* 2. LAWN & LANDSCAPING BASE */}
          <rect
            y="350"
            width="1000"
            height="212.5"
            fill={stage === "day" ? "#3b7a32" : "#122316"}
          />

          {/* 3. DRIVEWAY APRON */}
          <polygon
            points={`${(preset.drivewayBounds.startX / 100) * 1000},562.5 ${(preset.drivewayBounds.endX / 100) * 1000},562.5 ${(preset.drivewayBounds.endX / 100) * 880},370 ${(preset.drivewayBounds.startX / 100) * 1150},370`}
            fill={stage === "day" ? "#64748b" : "#1e293b"}
          />

          {/* Vehicle Inpainting: Shown in Day mode, Inpainted/Removed in Dusk & Hero */}
          {preset.hasVehicle && stage === "day" && (
            <g id="driveway-vehicle">
              {/* Car Body */}
              <rect x="180" y="420" width="160" height="70" rx="14" fill="#94a3b8" />
              <rect x="210" y="380" width="100" height="50" rx="10" fill="#cbd5e1" />
              {/* Windows */}
              <rect x="220" y="390" width="38" height="30" rx="4" fill="#334155" />
              <rect x="264" y="390" width="38" height="30" rx="4" fill="#334155" />
              {/* Wheels */}
              <circle cx="215" cy="490" r="16" fill="#1e293b" />
              <circle cx="305" cy="490" r="16" fill="#1e293b" />
              <text x="210" y="455" fontSize="10" fill="#475569" fontWeight="bold">
                SUV (Daytime)
              </text>
            </g>
          )}

          {/* 4. HOUSE STRUCTURE (Preserved 100% Geometry) */}
          {/* Main Texas Brick Walls */}
          <rect
            x="200"
            y="230"
            width="620"
            height="170"
            fill={stage === "day" ? "#9a3412" : "#4a190b"}
          />

          {/* Left Gable Peak */}
          <polygon
            points="200,230 350,110 500,230"
            fill={stage === "day" ? "#7c2d12" : "#3b1307"}
          />

          {/* Center Dormer Peak */}
          <polygon
            points="500,220 580,140 660,220"
            fill={stage === "day" ? "#7c2d12" : "#3b1307"}
          />

          {/* Roof Shingles & Fascia Board */}
          <line
            x1="195"
            y1="230"
            x2="350"
            y2="105"
            stroke={stage === "day" ? "#334155" : "#0f172a"}
            strokeWidth="8"
          />
          <line
            x1="350"
            y1="105"
            x2="505"
            y2="230"
            stroke={stage === "day" ? "#334155" : "#0f172a"}
            strokeWidth="8"
          />
          <line
            x1="495"
            y1="220"
            x2="580"
            y2="135"
            stroke={stage === "day" ? "#334155" : "#0f172a"}
            strokeWidth="8"
          />
          <line
            x1="580"
            y1="135"
            x2="665"
            y2="220"
            stroke={stage === "day" ? "#334155" : "#0f172a"}
            strokeWidth="8"
          />
          <line
            x1="660"
            y1="220"
            x2="825"
            y2="220"
            stroke={stage === "day" ? "#334155" : "#0f172a"}
            strokeWidth="8"
          />

          {/* Front Entry Door */}
          <rect
            x="480"
            y="310"
            width="55"
            height="90"
            fill={stage === "day" ? "#451a03" : "#1f0d02"}
            stroke="#1e293b"
            strokeWidth="2"
          />

          {/* Garage Doors */}
          <rect
            x="230"
            y="320"
            width="140"
            height="80"
            fill={stage === "day" ? "#f1f5f9" : "#334155"}
            stroke="#0f172a"
            strokeWidth="2"
          />
          <line x1="230" y1="345" x2="370" y2="345" stroke="#94a3b8" strokeWidth="1" />
          <line x1="230" y1="370" x2="370" y2="370" stroke="#94a3b8" strokeWidth="1" />

          {/* 5. WINDOWS (Preserving exact apertures, illuminating in dusk) */}
          {preset.windows.map((win) => {
            const wx = (win.x / 100) * 1000;
            const wy = (win.y / 100) * 562.5;
            const ww = (win.width / 100) * 1000;
            const wh = (win.height / 100) * 562.5;

            return (
              <g key={win.id}>
                {/* Warm glow behind glass during Dusk & Hero */}
                {stage !== "day" && (
                  <rect
                    x={wx - 6}
                    y={wy - 6}
                    width={ww + 12}
                    height={wh + 12}
                    fill="url(#winGlowGrad)"
                    opacity="0.75"
                  />
                )}

                {/* Window Pane Fill */}
                <rect
                  x={wx}
                  y={wy}
                  width={ww}
                  height={wh}
                  fill={stage === "day" ? "#93c5fd" : "#fef08a"}
                  stroke="#1e293b"
                  strokeWidth="2.5"
                />

                {/* Architectural Mullions */}
                <line
                  x1={wx + ww / 2}
                  y1={wy}
                  x2={wx + ww / 2}
                  y2={wy + wh}
                  stroke="#1e293b"
                  strokeWidth="1.5"
                />
                <line
                  x1={wx}
                  y1={wy + wh / 2}
                  x2={wx + ww}
                  y2={wy + wh / 2}
                  stroke="#1e293b"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}

          {/* Mature Oak Tree */}
          {preset.trees.map((tr) => (
            <g key={tr.id}>
              {/* Trunk */}
              <rect
                x={(tr.trunkX / 100) * 1000 - 8}
                y={(tr.canopyY / 100) * 562.5}
                width="16"
                height={(tr.baseY / 100) * 562.5 - (tr.canopyY / 100) * 562.5}
                fill={stage === "day" ? "#451a03" : "#1f0d02"}
              />
              {/* Canopy */}
              <circle
                cx={(tr.canopyX / 100) * 1000}
                cy={(tr.canopyY / 100) * 562.5}
                r={(tr.radius / 100) * 562.5}
                fill={stage === "day" ? "#166534" : "#052e16"}
              />

              {/* Tree wrap mini-lights if active */}
              {decor.treeWraps.enabled && stage === "rendered_hero" && (
                <g filter="url(#c9Glow)">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <ellipse
                      key={i}
                      cx={(tr.trunkX / 100) * 1000}
                      cy={(tr.canopyY / 100) * 562.5 + 20 + i * 16}
                      rx="12"
                      ry="4"
                      fill="none"
                      stroke="#ffdf9e"
                      strokeWidth="2"
                      opacity="0.85"
                    />
                  ))}
                </g>
              )}
            </g>
          ))}

          {/* 6. LIGHTING STAGE 2 COMPOSITE */}
          {stage === "rendered_hero" && (
            <g id="lighting-composite">
              {/* OMNI PERMANENT WALL WASH BEAMS */}
              {systemType === "omni_permanent" && (
                <g opacity="0.95">
                  {activeSegments.map((seg) => {
                    return (
                      <g key={seg.id}>
                        {seg.points.slice(0, -1).map((p1, idx) => {
                          const p2 = seg.points[idx + 1];
                          const x1 = (p1[0] / 100) * 1000;
                          const y1 = (p1[1] / 100) * 562.5;
                          const x2 = (p2[0] / 100) * 1000;
                          const y2 = (p2[1] / 100) * 562.5;

                          return (
                            <polygon
                              key={idx}
                              points={`${x1},${y1} ${x2},${y2} ${x2 + 20},${y2 + 130} ${x1 - 20},${y1 + 130}`}
                              fill="url(#omniWashGrad)"
                            />
                          );
                        })}
                      </g>
                    );
                  })}
                </g>
              )}

              {/* CHRISTMAS C9 BULBS (15-INCH SPACING) */}
              {systemType === "christmas_c9" && (
                <g filter="url(#c9Glow)">
                  {activeSegments.map((seg) => (
                    <g key={seg.id}>
                      {seg.points.slice(0, -1).map((p1, pIdx) => {
                        const p2 = seg.points[pIdx + 1];
                        const x1 = (p1[0] / 100) * 1000;
                        const y1 = (p1[1] / 100) * 562.5;
                        const x2 = (p2[0] / 100) * 1000;
                        const y2 = (p2[1] / 100) * 562.5;

                        const bulbCount = Math.max(6, Math.round(seg.bulbCount / (seg.points.length - 1)));
                        const bulbs = [];

                        for (let b = 0; b <= bulbCount; b++) {
                          const t = b / bulbCount;
                          const bx = x1 + (x2 - x1) * t;
                          const by = y1 + (y2 - y1) * t;

                          // Color cycling supporting 2 red / 2 white repeating groups
                          const colorIdx = b % christmasPattern.palette.length;
                          const color = christmasPattern.palette[colorIdx];

                          bulbs.push(
                            <g key={b}>
                              {/* Radial Halo */}
                              <circle cx={bx} cy={by + 3} r="7" fill={color} opacity="0.45" />
                              {/* C9 Teardrop bulb */}
                              <path
                                d={`M ${bx - 2.5} ${by} Q ${bx} ${by + 6} ${bx + 2.5} ${by} Z`}
                                fill={color}
                              />
                              {/* Glowing Diode Center */}
                              <circle cx={bx} cy={by + 2} r="1.5" fill="#ffffff" />
                            </g>
                          );
                        }
                        return <g key={pIdx}>{bulbs}</g>;
                      })}
                    </g>
                  ))}
                </g>
              )}

              {/* Commercial Pre-Lit Wreath */}
              {decor.wreaths.enabled && (
                <g
                  transform={`translate(${(preset.wreathAnchor.x / 100) * 1000}, ${(preset.wreathAnchor.y / 100) * 562.5})`}
                  filter="url(#c9Glow)"
                >
                  <circle cx="0" cy="0" r={decor.wreaths.sizeInches / 2} fill="none" stroke="#15803d" strokeWidth="8" />
                  <circle cx="0" cy="0" r={decor.wreaths.sizeInches / 2 + 1} fill="none" stroke="#166534" strokeWidth="4" />
                  {/* Wreath mini-lights */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => {
                    const rad = (ang * Math.PI) / 180;
                    const r = decor.wreaths.sizeInches / 2;
                    return (
                      <circle
                        key={i}
                        cx={Math.cos(rad) * r}
                        cy={Math.sin(rad) * r}
                        r="2"
                        fill="#fef08a"
                      />
                    );
                  })}
                </g>
              )}

              {/* Ground Stakes if active */}
              {decor.groundStakes.enabled && (
                <g filter="url(#c9Glow)">
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                    const t = i / 6;
                    const sx = 180 + t * 40;
                    const sy = 420 + t * 140;
                    return (
                      <g key={i}>
                        <circle cx={sx} cy={sy} r="4" fill="#ffdf9e" opacity="0.8" />
                        <line x1={sx} y1={sy} x2={sx} y2={sy + 8} stroke="#1e293b" strokeWidth="1.5" />
                      </g>
                    );
                  })}
                </g>
              )}
            </g>
          )}

          {/* 7. ARCHITECTURAL BRANDING & WATERMARK OVERLAY */}
          <g>
            {/* Top-left residence placard */}
            <rect
              x="25"
              y="25"
              width="340"
              height="60"
              rx="8"
              fill="#070b14"
              fillOpacity="0.82"
              stroke="#f59e0b"
              strokeWidth="1.5"
            />
            <text x="40" y="50" fill="#ffffff" fontSize="16" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1">
              {customer.residenceTitle}
            </text>
            <text x="40" y="70" fill="#f59e0b" fontSize="10" fontWeight="600" fontFamily="sans-serif">
              AUGUSTA LIGHTS · {systemType === "christmas_c9" ? `SMD C9 LED (15" SPACING) · ${christmasPattern.name.toUpperCase()}` : `OMNI PERMANENT · ${omniPattern.name.toUpperCase()}`}
            </text>

            {/* Bottom-right preservation verification stamp */}
            <rect
              x="690"
              y="515"
              width="285"
              height="32"
              rx="6"
              fill="#070b14"
              fillOpacity="0.85"
              stroke="#10b981"
              strokeWidth="1.2"
            />
            <text x="705" y="536" fill="#10b981" fontSize="10" fontWeight="bold" fontFamily="monospace">
              ✓ 100% ARCHITECTURAL PRESERVATION
            </text>
          </g>
        </svg>

        {/* Floating GM Telemetry Pill */}
        <div className="absolute top-3 right-3 hidden sm:flex items-center gap-2">
          <div className="rounded-lg bg-slate-950/80 backdrop-blur-md px-3 py-1.5 border border-slate-700/60 text-xs font-mono text-slate-200">
            <span className="text-emerald-400 font-semibold">● 2K RENDER</span> · {systemType === "christmas_c9" ? `${totalBulbs} C9 BULBS` : "8\" OMNI WALL WASH"}
          </div>
        </div>

        {/* Bottom Inpainting Status Notice */}
        {stage !== "day" && preset.hasVehicle && (
          <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/50 text-xs text-slate-300 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Driveway Vehicle Inpainted · Clean Asphalt Surface Active</span>
          </div>
        )}
      </div>

      {/* Under-Canvas Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[var(--color-panel)] border border-[var(--color-border)]">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-xs font-semibold text-[var(--color-text-secondary)] truncate">
            Current Pattern:{" "}
            <span className="text-[var(--color-text-primary)] font-bold">
              {systemType === "christmas_c9" ? christmasPattern.name : omniPattern.name}
            </span>{" "}
            ({systemType === "christmas_c9" ? '15" bulb spacing' : '8" diode spacing'})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Natural Language Revise Button */}
          <button
            onClick={onOpenRevision}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/20 transition-colors whitespace-nowrap"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Revise Rendering</span>
          </button>
        </div>
      </div>
    </div>
  );
}
