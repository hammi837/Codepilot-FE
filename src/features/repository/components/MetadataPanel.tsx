import { Database, GitBranch, FileText, Code2, Layers, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatSize } from "../services/workspaceService";
import type { FileMetadata, Chunk } from "../types/workspace";

interface MetadataPanelProps {
  repoName: string;
  branch?: string;
  language?: string;
  files: FileMetadata[];
  chunks: Chunk[] | null | undefined;
  isLoadingChunks: boolean;
  storedChunks?: number;
}

export function MetadataPanel({
  repoName,
  branch = "main",
  language,
  files,
  chunks,
  isLoadingChunks,
  storedChunks,
}: MetadataPanelProps) {
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const languageCounts = files.reduce<Record<string, number>>((acc, f) => {
    acc[f.language] = (acc[f.language] ?? 0) + 1;
    return acc;
  }, {});
  const topLanguages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const functionChunks = chunks?.filter((c) => c.metadata.type === "function").length ?? 0;
  const classChunks = chunks?.filter((c) => c.metadata.type === "class").length ?? 0;

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2">
        <Database className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Repository Info</h3>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        <StatItem icon={<FileText className="h-3.5 w-3.5" />} label="Files" value={files.length} />
        <StatItem icon={<Code2 className="h-3.5 w-3.5" />} label="Size" value={formatSize(totalSize)} />
        <StatItem
          icon={<Layers className="h-3.5 w-3.5" />}
          label="Chunks"
          value={isLoadingChunks ? "..." : (chunks?.length ?? "—")}
        />
        <StatItem
          icon={<Cpu className="h-3.5 w-3.5" />}
          label="Indexed"
          value={storedChunks !== undefined ? storedChunks : "—"}
        />
      </div>

      {/* Branch */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <GitBranch className="h-3.5 w-3.5" />
        <span className="font-mono">{branch}</span>
      </div>

      {/* Code breakdown */}
      {!isLoadingChunks && chunks && chunks.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Code Structure
          </p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Classes</span>
              <span className="font-mono font-medium">{classChunks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Functions</span>
              <span className="font-mono font-medium">{functionChunks}</span>
            </div>
          </div>
        </div>
      )}

      {isLoadingChunks && (
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      )}

      {/* Languages */}
      {topLanguages.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Languages
          </p>
          <div className="flex flex-wrap gap-1.5">
            {topLanguages.map(([lang, count]) => (
              <Badge key={lang} variant="secondary" className="text-xs gap-1">
                {lang}
                <span className="text-muted-foreground">{count}</span>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
      <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-sm font-semibold font-mono">{value}</p>
    </div>
  );
}
