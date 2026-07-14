import { ChevronRight, FolderGit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "../store/workspaceStore";
import { getBreadcrumbs } from "../services/workspaceService";

interface BreadcrumbProps {
  repoName: string;
}

export function Breadcrumb({ repoName }: BreadcrumbProps) {
  const { selectedFile, selectFile, expandFolder } = useWorkspaceStore();

  const segments = selectedFile ? getBreadcrumbs(selectedFile) : [];

  const handleSegmentClick = (index: number) => {
    if (index === segments.length - 1) return; // last = file, not clickable as folder nav
    const folderPath = segments.slice(0, index + 1).join("/");
    expandFolder(folderPath);
  };

  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-border bg-muted/30 px-3 py-1.5 text-xs scrollbar-hide">
      <FolderGit2 className="h-3.5 w-3.5 shrink-0 text-primary" />
      <span className="shrink-0 font-medium text-foreground">{repoName}</span>

      {segments.map((seg, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
          <button
            onClick={() => handleSegmentClick(i)}
            className={cn(
              "shrink-0 transition-colors",
              i === segments.length - 1
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {seg}
          </button>
        </span>
      ))}

      {!selectedFile && (
        <span className="text-muted-foreground">Select a file to view</span>
      )}
    </div>
  );
}
