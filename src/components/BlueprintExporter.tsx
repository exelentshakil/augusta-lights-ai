"use client";

import React, { useState } from "react";
import {
  FileCode,
  Copy,
  Check,
  Download,
  X,
  Layers,
  Cpu,
  Workflow as WorkflowIcon,
  Server,
} from "lucide-react";

interface BlueprintExporterProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "inngest" | "n8n" | "make" | "docker";

export function BlueprintExporter({ isOpen, onClose }: BlueprintExporterProps) {
  const [activeTab, setActiveTab] = useState<TabType>("inngest");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const blueprints: Record<
    TabType,
    { title: string; filename: string; language: string; content: string }
  > = {
    inngest: {
      title: "Inngest Durable Workflow",
      filename: "augusta-lighting-pipeline.ts",
      language: "typescript",
      content: `import { inngest } from "./client";

/**
 * Augusta Lights Texas - Production Lighting Synthesis Durable Pipeline
 * Stage 1: Cleaned Dusk Master (SAM-2 + Vehicle Inpainting + 2700K Illumination)
 * Stage 2: Verified Roofline C9 / Omni LED Vector Compositing
 */
export const synthesizeLightingPlan = inngest.createFunction(
  { id: "augusta-lighting-synthesis", retries: 3 },
  { event: "augusta/lighting.requested" },
  async ({ event, step }) => {
    // Step 1: Ingest property photo and isolate architectural structure
    const mask = await step.run("sam2-architectural-preservation", async () => {
      return await isolateHouseStructure({
        imageUrl: event.data.daytimePhotoUrl,
        lockApertures: true, // Lock windows, doors, roof pitch
        excludeDrivewayVehicles: true,
      });
    });

    // Step 2: Convert daytime capture to Texas Blue-Hour Dusk Master
    const duskMaster = await step.run("dusk-master-cleanse", async () => {
      return await generateDuskMaster({
        sourceImage: event.data.daytimePhotoUrl,
        maskId: mask.id,
        windowColorTemp: "2700K",
        twilightGrade: "deep_navy_gold",
        inpaintVehicles: true,
      });
    });

    // Step 3: Run Dual-Provider AI Vision to segment rooflines and decor anchors
    const rooflines = await step.run("dual-ai-roofline-extraction", async () => {
      return await extractRooflines({
        duskImageUrl: duskMaster.url,
        preferredProvider: "openai-gpt4o-mini",
        failoverProvider: "gemini-2.0-flash",
      });
    });

    // Step 4: Render C9 / Omni hardware along verified roofline polylines
    const rendering = await step.run("composite-lighting-hardware", async () => {
      return await compositeHardwareDiodes({
        duskMasterUrl: duskMaster.url,
        segments: rooflines.segments.filter((s: any) => s.includedInDesign),
        systemType: event.data.systemType, // "christmas_c9" | "omni_permanent"
        spacingInches: event.data.systemType === "christmas_c9" ? 15 : 8,
        pattern: event.data.patternId,
        decor: event.data.decor,
      });
    });

    // Step 5: Synthesize 2x2 Inspiration Sheet (Warm White, Candy Cane, RGB, Lone Star)
    const inspirationSheet = await step.run("synthesize-2x2-inspiration", async () => {
      return await generate2x2ComparisonSheet({
        duskMasterUrl: duskMaster.url,
        renderings: rendering.variations,
        propertyTitle: event.data.customerResidenceTitle,
      });
    });

    // Step 6: Trigger SMS delivery to GM in-car vehicle console
    await step.run("notify-gm-console", async () => {
      return await sendVehicleNotification({
        gmPhone: event.data.gmPhone,
        heroImageUrl: rendering.hero2kUrl,
        inspirationSheetUrl: inspirationSheet.sheet2kUrl,
      });
    });

    return { success: true, heroUrl: rendering.hero2kUrl, sheetUrl: inspirationSheet.sheet2kUrl };
  }
);`,
    },
    n8n: {
      title: "n8n Workflow JSON",
      filename: "augusta-lights-n8n.json",
      language: "json",
      content: `{
  "name": "Augusta Lights - Mobile In-Car Lighting Engine",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "augusta-vision-trigger",
        "responseMode": "responseNode"
      },
      "name": "GM In-Car Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "url": "https://augusta-lights-ai.vercel.app/api/ai/visualize",
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\\n  \\"customer\\": {\\n    \\"residenceTitle\\": $json.body.residenceTitle,\\n    \\"lastName\\": $json.body.lastName\\n  },\\n  \\"systemType\\": $json.body.systemType,\\n  \\"christmasPatternId\\": $json.body.patternId,\\n  \\"presetId\\": $json.body.presetId\\n}"
      },
      "name": "Dual-Provider AI Synthesis",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "jsCode": "// HTML5 Canvas 2K Compositor\\nconst data = $input.first().json;\\nreturn {\\n  json: {\\n    status: 'COMPLETED',\\n    heroUrl: data.result.renderTelemetry.renderUrl,\\n    provider: data.result.provider,\\n    latencyMs: data.result.latencyMs,\\n    duskMasterLocked: true,\\n    linearFeet: data.result.totalLinearFeet\\n  }\\n};"
      },
      "name": "Vector Hardware Compositor",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [680, 300]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ JSON.stringify($json) }}"
      },
      "name": "Return to GM Tablet",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [900, 300]
    }
  ],
  "connections": {
    "GM In-Car Webhook": {
      "main": [[{ "node": "Dual-Provider AI Synthesis", "type": "main", "index": 0 }]]
    },
    "Dual-Provider AI Synthesis": {
      "main": [[{ "node": "Vector Hardware Compositor", "type": "main", "index": 0 }]]
    },
    "Vector Hardware Compositor": {
      "main": [[{ "node": "Return to GM Tablet", "type": "main", "index": 0 }]]
    }
  }
}`,
    },
    make: {
      title: "Make.com Scenario Blueprint",
      filename: "augusta-lights-make-scenario.json",
      language: "json",
      content: `{
  "name": "Augusta Lights - Texas Franchise In-Home Vision Pipeline",
  "flow": [
    {
      "id": 1,
      "module": "gateway:CustomWebHook",
      "version": 1,
      "parameters": {
        "hook": 849201,
        "maxResults": 1
      },
      "mapper": {
        "url": "https://hook.us1.make.com/augusta-texas-lighting"
      },
      "metadata": {
        "designer": { "x": 100, "y": 100 }
      }
    },
    {
      "id": 2,
      "module": "http:ActionMakeRequest",
      "version": 3,
      "parameters": {
        "url": "https://augusta-lights-ai.vercel.app/api/ai/visualize",
        "method": "POST",
        "headers": [
          { "name": "Content-Type", "value": "application/json" }
        ],
        "bodyType": "raw",
        "body": "{\\"customer\\":{\\"residenceTitle\\":\\"{{1.residenceTitle}}\\"},\\"systemType\\":\\"{{1.systemType}}\\",\\"christmasPatternId\\":\\"warm-white\\"}",
        "parseResponse": true
      },
      "metadata": {
        "designer": { "x": 350, "y": 100 }
      }
    },
    {
      "id": 3,
      "module": "twilio:ActionSendSMS",
      "version": 1,
      "parameters": {
        "to": "{{1.customerPhone}}",
        "message": "Hi {{1.customerLastName}}, here is your Augusta Lights Texas custom dusk lighting visualization: {{2.data.result.renderTelemetry.renderUrl}}"
      },
      "metadata": {
        "designer": { "x": 600, "y": 100 }
      }
    }
  ]
}`,
    },
    docker: {
      title: "Docker Compose Stack",
      filename: "docker-compose.yml",
      language: "yaml",
      content: `version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: augusta-lights-web
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - OPENAI_API_KEY=\${OPENAI_API_KEY}
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
      - INNGEST_EVENT_KEY=\${INNGEST_EVENT_KEY}
      - INNGEST_SIGNING_KEY=\${INNGEST_SIGNING_KEY}
    restart: unless-stopped
    depends_on:
      - inngest-runner
      - redis

  inngest-runner:
    image: inngest/inngest:latest
    container_name: augusta-lights-inngest
    ports:
      - "8288:8288"
    environment:
      - INNGEST_DEV=0
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: augusta-lights-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  redis_data:`,
    },
  };

  const currentBlueprint = blueprints[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentBlueprint.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentBlueprint.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = currentBlueprint.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[var(--color-panel)] rounded-2xl border border-[var(--color-border)] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-panel-subtle)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <FileCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)]">
                Production Blueprint Exporter
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                Export battle-tested orchestration templates for enterprise franchise operations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-[var(--color-border)] px-4 bg-[var(--color-panel)] overflow-x-auto">
          <button
            onClick={() => setActiveTab("inngest")}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "inngest"
                ? "border-amber-500 text-amber-600 dark:text-amber-400"
                : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Inngest Workflow</span>
          </button>
          <button
            onClick={() => setActiveTab("n8n")}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "n8n"
                ? "border-amber-500 text-amber-600 dark:text-amber-400"
                : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <WorkflowIcon className="h-4 w-4" />
            <span>n8n Pipeline</span>
          </button>
          <button
            onClick={() => setActiveTab("make")}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "make"
                ? "border-amber-500 text-amber-600 dark:text-amber-400"
                : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <Cpu className="h-4 w-4" />
            <span>Make.com Scenario</span>
          </button>
          <button
            onClick={() => setActiveTab("docker")}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "docker"
                ? "border-amber-500 text-amber-600 dark:text-amber-400"
                : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <Server className="h-4 w-4" />
            <span>Docker Compose</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-950 font-mono text-xs text-slate-300">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-[11px] text-slate-500">
            <span>File: <strong className="text-slate-300">{currentBlueprint.filename}</strong></span>
            <span>Language: <strong className="text-amber-400">{currentBlueprint.language}</strong></span>
          </div>
          <pre className="overflow-x-auto leading-relaxed whitespace-pre font-mono text-[12px]">
            {currentBlueprint.content}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-panel-subtle)] flex items-center justify-between">
          <span className="text-xs text-[var(--color-text-muted)] font-mono">
            Directly importable into local studio or cloud cluster
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--color-panel)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied" : "Copy Blueprint"}</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
