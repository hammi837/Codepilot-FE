import { GitBranch, FileCode, Layers } from "lucide-react";
import { formatSize } from "../services/workspaceService";
import type { FileContent } from "../types/workspace";

interface StatusBarProps {
  selectedFile: string | null;
  fileContent: FileContent | null | undefined;
  branch?: string;
  totalFiles: number;
}

export function StatusBar({ selectedFile, fileContent, branch = "main", totalFiles }: StatusBarProps) {
  return (
    <div className="flex items-center gap-4 border-t border-border bg-primary/5 px-4 py-1 text-xs text-muted-foreground select-none">
      <div className="flex items-center gap-1">
        <GitBranch className="h-3 w-3" />
        <span className="font-mono">{branch}</span>
      </div>

      <div className="flex items-center gap-1">
        <FileCode className="h-3 w-3" />
        <span>{totalFiles} files</span>
      </div>

      {selectedFile && (
        <>
          <div className="h-3 w-px bg-border" />
          <span className="font-mono truncate max-w-xs">{selectedFile}</span>
          {fileContent && (
            <>
              <div className="h-3 w-px bg-border" />
              <span>{fileContent.language}</span>
              <div className="h-3 w-px bg-border" />
              <span>{fileContent.lines} lines</span>
              <div className="h-3 w-px bg-border" />
              <span>{formatSize(fileContent.size)}</span>
            </>
          )}
        </>
      )}

      <div className="ml-auto flex items-center gap-1">
        <Layers className="h-3 w-3" />
        <span>CodePilot Workspace</span>
      </div>
    </div>
  );
}
