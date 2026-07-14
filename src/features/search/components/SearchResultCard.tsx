import { useState } from "react";
import { motion } from "framer-motion";
import { FileCode, ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { SearchResult } from "../types/search";

interface SearchResultCardProps {
  result: SearchResult;
  index: number;
}

const TYPE_COLORS: Record<string, string> = {
  function: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  class: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  method: "bg-green-500/15 text-green-400 border-green-500/20",
  global: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  markdown_section: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
};

export function SearchResultCard({ result, index }: SearchResultCardProps) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const score = Math.round(result.score * 100);

  const scoreColor =
    score >= 80 ? "text-green-400" : score >= 60 ? "text-yellow-400" : "text-muted-foreground";

  const typeColor = TYPE_COLORS[result.type] ?? "bg-muted/50 text-muted-foreground border-border";

  const handleOpenInWorkspace = () => {
    const encoded = encodeURIComponent(result.repository);
    navigate(`/repositories/${encoded}?file=${encodeURIComponent(result.file)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <FileCode className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

          <div className="flex-1 min-w-0">
            {/* File + name */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleOpenInWorkspace}
                className="font-mono text-sm font-medium hover:text-primary hover:underline transition-colors"
              >
                {result.file}
              </button>
              {result.name && (
                <span className="font-mono text-sm text-muted-foreground">· {result.name}()</span>
              )}
            </div>

            {/* Meta row */}
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-medium",
                  typeColor
                )}
              >
                {result.type}
              </span>

              <span className="text-xs text-muted-foreground">
                {result.repository}
              </span>

              {/* Score bar */}
              <div className="flex items-center gap-1.5 ml-auto">
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      score >= 80
                        ? "bg-green-500"
                        : score >= 60
                        ? "bg-yellow-500"
                        : "bg-muted-foreground"
                    )}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <span className={cn("text-xs font-mono font-medium", scoreColor)}>
                  {score}%
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleOpenInWorkspace}
              className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Open in workspace"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Toggle preview"
            >
              {expanded ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Code preview */}
      {expanded && (
        <div className="border-t border-border bg-muted/30">
          <pre className="overflow-x-auto p-4 text-xs font-mono text-foreground whitespace-pre max-h-48">
            <code>{result.content}</code>
          </pre>
        </div>
      )}
    </motion.div>
  );
}
