import { useMemo, useEffect, useCallback } from "react";
import { Search, X, FolderGit2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { FileNodeComponent } from "./FileNode";
import { buildFileTree, filterFiles } from "../services/workspaceService";
import { useWorkspaceStore } from "../store/workspaceStore";
import type { FileMetadata } from "../types/workspace";

interface FileExplorerProps {
  repoName: string;
  files: FileMetadata[];
  isLoading: boolean;
}

export function FileExplorer({ repoName, files, isLoading }: FileExplorerProps) {
  const {
    selectedFile,
    expandedFolders,
    fileSearchQuery,
    selectFile,
    toggleFolder,
    expandFolder,
    setFileSearchQuery,
  } = useWorkspaceStore();

  // Auto-expand first level on load
  useEffect(() => {
    if (!files.length) return;
    const topLevel = new Set<string>();
    for (const file of files) {
      const parts = file.path.split("/");
      if (parts.length > 1) topLevel.add(parts[0]);
    }
    topLevel.forEach(expandFolder);
  }, [files, expandFolder]);

  const filteredFiles = useMemo(
    () => filterFiles(files, fileSearchQuery),
    [files, fileSearchQuery]
  );

  const tree = useMemo(() => buildFileTree(filteredFiles), [filteredFiles]);

  const handleFileSelect = useCallback(
    (path: string) => selectFile(path),
    [selectFile]
  );

  const handleToggleFolder = useCallback(
    (path: string) => toggleFolder(path),
    [toggleFolder]
  );

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <FolderGit2 className="h-4 w-4 shrink-0 text-primary" />
        <span className="flex-1 truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {repoName}
        </span>
      </div>

      {/* Search */}
      <div className="border-b border-border px-2 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={fileSearchQuery}
            onChange={(e) => setFileSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="h-7 pl-8 pr-7 text-xs"
          />
          {fileSearchQuery && (
            <button
              onClick={() => setFileSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tree */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="py-1">
          {isLoading ? (
            <FileTreeSkeleton />
          ) : tree.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-xs text-muted-foreground">
                {fileSearchQuery ? "No files match your search." : "No files available."}
              </p>
            </div>
          ) : (
            tree.map((node) => (
              <FileNodeComponent
                key={node.path}
                node={node}
                depth={0}
                selectedFile={selectedFile}
                expandedFolders={expandedFolders}
                onFileSelect={handleFileSelect}
                onToggleFolder={handleToggleFolder}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer stats */}
      {!isLoading && files.length > 0 && (
        <div className={cn("border-t border-border px-3 py-1.5")}>
          <span className="text-xs text-muted-foreground">
            {filteredFiles.length} file{filteredFiles.length !== 1 ? "s" : ""}
            {fileSearchQuery && ` of ${files.length}`}
          </span>
        </div>
      )}
    </div>
  );
}

function FileTreeSkeleton() {
  return (
    <div className="space-y-1 px-2 py-1">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-6 rounded-sm"
          style={{ width: `${55 + Math.random() * 35}%`, marginLeft: i % 3 === 0 ? 0 : 16 }}
        />
      ))}
    </div>
  );
}
