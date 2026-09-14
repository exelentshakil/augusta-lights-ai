"use client";

import React, { useState } from "react";
import {
  Terminal,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Filter,
  Flame,
  Activity,
} from "lucide-react";

export interface LogEntry {
  id: string;
  timestamp: string;
  type: "INGEST" | "MASK" | "DUSK" | "AI" | "RENDER" | "REVISE" | "CHAOS";
  message: string;
  payload?: any;
}

interface ExecutionLogDrawerProps {
  logs: LogEntry[];
  activeProvider: string;
  chaosMode: boolean;
}

export function ExecutionLogDrawer({
  logs,
  activeProvider,
  chaosMode,
}: ExecutionLogDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [copiedCurl, setCopiedCurl] = useState(false);

  const filteredLogs = logs.filter((log) => {
    if (filterType === "ALL") return true;
    return log.type === filterType;
  });

  const curlCommand = `curl -X POST https://augusta-lights-ai.vercel.app/api/ai/visualize \\
  -H "Content-Type: application/json" \\
  -d '{
    "customer": { "lastName": "Payne", "residenceTitle": "THE PAYNE RESIDENCE" },
    "systemType": "christmas_c9",
    "christmasPatternId": "warm-white",
    "presetId": "texas-brick-two-story"
  }'`;

  const copyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] overflow-hidden shadow-sm">
      {/* Header bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-[var(--color-panel-subtle)] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-slate-900 dark:bg-slate-800 text-amber-400 flex items-center justify-center font-mono">
            <Terminal className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                Live Execution Telemetry & Vision Pipeline Log
              </h4>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Activity className="h-3 w-3" />
                {logs.length} events
              </span>
              {chaosMode && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-red-500/15 text-red-600 border border-red-500/30">
                  <Flame className="h-3 w-3" />
                  FAILOVER ARMED
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Dual-provider latency, SAM-2 structural preservation audits, and inpainting coordinates
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              copyCurl();
            }}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-[var(--color-panel-subtle)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] transition-colors"
          >
            {copiedCurl ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            <span>cURL Endpoint</span>
          </button>
          {isOpen ? <ChevronUp className="h-4 w-4 text-[var(--color-text-muted)]" /> : <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />}
        </div>
      </div>

      {/* Expanded drawer */}
      {isOpen && (
        <div className="border-t border-[var(--color-border)] p-4 bg-slate-950 font-mono text-xs text-slate-300">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-1">
              <Filter className="h-3 w-3 text-slate-500 mr-1" />
              {["ALL", "INGEST", "MASK", "DUSK", "AI", "RENDER", "REVISE"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                    filterType === f
                      ? "bg-amber-500 text-slate-950"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-slate-500">
              Active Provider: <strong className="text-amber-400">{activeProvider}</strong>
            </span>
          </div>

          {/* Log Lines */}
          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {filteredLogs.map((log) => {
              let badgeColor = "text-slate-400 bg-slate-800";
              if (log.type === "AI") badgeColor = "text-amber-400 bg-amber-950/60 border border-amber-800/60";
              if (log.type === "MASK") badgeColor = "text-emerald-400 bg-emerald-950/60 border border-emerald-800/60";
              if (log.type === "DUSK") badgeColor = "text-blue-400 bg-blue-950/60 border border-blue-800/60";
              if (log.type === "CHAOS") badgeColor = "text-red-400 bg-red-950/60 border border-red-800/60";
              if (log.type === "RENDER") badgeColor = "text-purple-400 bg-purple-950/60 border border-purple-800/60";

              return (
                <div
                  key={log.id}
                  className="flex items-start gap-2 py-1 px-2 rounded hover:bg-slate-900/80 transition-colors"
                >
                  <span className="text-slate-500 shrink-0 text-[11px]">{log.timestamp}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${badgeColor}`}>
                    {log.type}
                  </span>
                  <span className="text-slate-300 break-all">{log.message}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
