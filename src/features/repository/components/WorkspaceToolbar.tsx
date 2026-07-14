import { Zap, Loader2, FolderTree, Layers, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "../store/workspaceStore";

interface WorkspaceToolbarProps {
  onIndex: () => void;
  isIndexing: boolean;
  storedChunks?: number;
}

export function WorkspaceToolbar({
  onIndex,
  isIndexing,
  storedChunks,
}: WorkspaceToolbarProps) {
  const { activePanel, setActivePanel } = useWorkspaceStore();

  const panels = [
    { id: "explorer" as const, label: "Explorer", icon: FolderTree },
    { id: "chunks" as const, label: "Chunks", icon: Layers },
    { id: "search" as const, label: "Search", icon: Search },
  ];

  return (
    <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2 gap-3">
      {/* Panel tabs */}
      <div className="flex items-center gap-1">
        {panels.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActivePanel(id)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              activePanel === id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Right side — index action */}
      <div className="flex items-center gap-2">
        {storedChunks !== undefined && storedChunks > 0 && (
          <Badge variant="secondary" className="text-xs gap-1 font-mono">
            <Layers className="h-3 w-3" />
            {storedChunks} chunks
          </Badge>
        )}
        <Button
          size="sm"
          variant={storedChunks ? "outline" : "default"}
          onClick={onIndex}
          disabled={isIndexing}
          className="h-7 text-xs"
        >
          {isIndexing ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Indexing...
            </>
          ) : (
            <>
              <Zap className="mr-1.5 h-3.5 w-3.5" />
              {storedChunks ? "Re-index" : "Index Repository"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
