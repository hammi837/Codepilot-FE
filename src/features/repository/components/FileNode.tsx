import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  FileJson,
  File,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { FileNode as FileNodeType } from "../types/workspace";

interface FileNodeProps {
  node: FileNodeType;
  depth: number;
  selectedFile: string | null;
  expandedFolders: Set<string>;
  onFileSelect: (path: string) => void;
  onToggleFolder: (path: string) => void;
}

function getFileIcon(extension?: string) {
  switch (extension) {
    case ".py":
    case ".js":
    case ".ts":
    case ".tsx":
    case ".jsx":
    case ".go":
    case ".rs":
    case ".java":
    case ".cpp":
    case ".c":
      return <FileCode className="h-3.5 w-3.5 shrink-0 text-primary" />;
    case ".json":
    case ".yaml":
    case ".yml":
    case ".toml":
    case ".ini":
      return <FileJson className="h-3.5 w-3.5 shrink-0 text-yellow-500" />;
    case ".md":
    case ".txt":
      return <FileText className="h-3.5 w-3.5 shrink-0 text-blue-400" />;
    default:
      return <File className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />;
  }
}

export function FileNodeComponent({
  node,
  depth,
  selectedFile,
  expandedFolders,
  onFileSelect,
  onToggleFolder,
}: FileNodeProps) {
  const isExpanded = expandedFolders.has(node.path);
  const isSelected = selectedFile === node.path;
  const paddingLeft = depth * 12 + 8;

  if (node.type === "folder") {
    return (
      <div>
        <button
          onClick={() => onToggleFolder(node.path)}
          className={cn(
            "flex w-full items-center gap-1.5 rounded-sm py-1 pr-2 text-left text-sm transition-colors hover:bg-accent",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          )}
          style={{ paddingLeft }}
          aria-expanded={isExpanded}
        >
          <motion.span
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.15 }}
            className="shrink-0"
          >
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          </motion.span>
          {isExpanded ? (
            <FolderOpen className="h-3.5 w-3.5 shrink-0 text-yellow-400" />
          ) : (
            <Folder className="h-3.5 w-3.5 shrink-0 text-yellow-400" />
          )}
          <span className="truncate text-foreground">{node.name}</span>
        </button>

        <AnimatePresence initial={false}>
          {isExpanded && node.children && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              {node.children.map((child) => (
                <FileNodeComponent
                  key={child.path}
                  node={child}
                  depth={depth + 1}
                  selectedFile={selectedFile}
                  expandedFolders={expandedFolders}
                  onFileSelect={onFileSelect}
                  onToggleFolder={onToggleFolder}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <button
      onClick={() => onFileSelect(node.path)}
      className={cn(
        "flex w-full items-center gap-1.5 rounded-sm py-1 pr-2 text-left text-sm transition-colors",
        "hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        isSelected && "bg-primary/15 text-primary font-medium"
      )}
      style={{ paddingLeft }}
      title={node.path}
    >
      {getFileIcon(node.extension)}
      <span className="truncate">{node.name}</span>
    </button>
  );
}
