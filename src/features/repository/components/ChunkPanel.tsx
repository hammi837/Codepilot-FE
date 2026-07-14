import { useState, useMemo } from "react";
import { Layers, Search, X, ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "../store/workspaceStore";
import type { Chunk } from "../types/workspace";

interface ChunkPanelProps {
  chunks: Chunk[] | undefined;
  isLoading: boolean;
}

const TYPE_COLORS: Record<string, string> = {
  function: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  class: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  method: "bg-green-500/15 text-green-400 border-green-500/20",
  global: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  markdown_section: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
};

export function ChunkPanel({ chunks, isLoading }: ChunkPanelProps) {
  const [search, setSearch] = useState("");
  const [expandedChunk, setExpandedChunk] = useState<string | null>(null);
  const { selectFile } = useWorkspaceStore();

  const filtered = useMemo(() => {
    if (!chunks) return [];
    if (!search.trim()) return chunks;
    const q = search.toLowerCase();
    return chunks.filter(
      (c) =>
        c.metadata.file.toLowerCase().includes(q) ||
        c.metadata.name?.toLowerCase().includes(q) ||
        c.metadata.type.toLowerCase().includes(q)
    );
  }, [chunks, search]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <Layers className="h-4 w-4 text-primary" />
        <span className="flex-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Chunks
        </span>
        {chunks && (
          <span className="text-xs font-mono text-muted-foreground">{chunks.length}</span>
        )}
      </div>

      {/* Search */}
      <div className="border-b border-border px-2 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter chunks..."
            className="h-7 pl-8 pr-7 text-xs"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        {isLoading ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Layers className="h-8 w-8 text-muted-foreground/30 mb-2" />
            <p className="text-xs text-muted-foreground">
              {search ? "No chunks match your filter." : "No chunks available. Index the repository first."}
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filtered.map((chunk, idx) => {
              const key = `${chunk.metadata.hash}-${idx}`;
              const isExpanded = expandedChunk === key;
              const colorClass = TYPE_COLORS[chunk.metadata.type] ?? "bg-muted text-muted-foreground border-border";

              return (
                <div
                  key={key}
                  className="rounded-lg border border-border bg-card overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedChunk(isExpanded ? null : key)}
                    className="flex w-full items-start gap-2 p-2.5 text-left hover:bg-muted/50 transition-colors"
                  >
                    <span className="mt-0.5 shrink-0 text-muted-foreground">
                      {isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={cn(
                            "inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-medium",
                            colorClass
                          )}
                        >
                          {chunk.metadata.type}
                        </span>
                        {chunk.metadata.name && (
                          <span className="font-mono text-xs font-medium text-foreground truncate">
                            {chunk.metadata.name}
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            selectFile(chunk.metadata.file);
                          }}
                          className="truncate hover:text-primary hover:underline"
                        >
                          {chunk.metadata.file}
                        </button>
                        <span className="shrink-0">
                          L{chunk.metadata.start_line}–{chunk.metadata.end_line}
                        </span>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground font-mono">
                      #{chunk.metadata.chunk_index}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border bg-muted/30 p-2.5">
                      <pre className="overflow-x-auto text-xs text-foreground font-mono whitespace-pre-wrap max-h-48">
                        {chunk.content}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
