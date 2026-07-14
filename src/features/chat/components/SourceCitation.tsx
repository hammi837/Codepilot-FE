import { FileCode, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { SourceReference } from "../types/chat";

interface SourceCitationProps {
  sources: SourceReference[];
  repository: string;
  onFileOpen?: (file: string) => void;
}

const TYPE_COLORS: Record<string, string> = {
  function: "text-blue-400",
  class: "text-purple-400",
  method: "text-green-400",
  global: "text-orange-400",
};

export function SourceCitation({ sources, repository, onFileOpen }: SourceCitationProps) {
  if (!sources.length) return null;

  return (
    <div className="mt-3 space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Sources
      </p>
      <div className="flex flex-wrap gap-1.5">
        {sources.map((src, i) => (
          <button
            key={i}
            onClick={() => onFileOpen?.(src.file)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/50",
              "px-2 py-1 text-xs transition-colors hover:bg-muted hover:border-primary/40",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            )}
            title={`Open ${src.file}`}
          >
            <FileCode className="h-3 w-3 text-muted-foreground" />
            <span className="font-mono text-foreground max-w-[160px] truncate">
              {src.file.split("/").pop()}
            </span>
            {src.name && (
              <span className={cn("font-mono", TYPE_COLORS[src.type ?? ""] ?? "text-muted-foreground")}>
                · {src.name}
              </span>
            )}
            <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
