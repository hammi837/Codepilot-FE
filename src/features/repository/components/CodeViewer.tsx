import { motion } from "framer-motion";
import { FileCode, AlertCircle, MousePointerClick } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toMonacoLanguage, formatSize } from "../services/workspaceService";
import type { FileContent } from "../types/workspace";

interface CodeViewerProps {
  fileContent: FileContent | null | undefined;
  isLoading: boolean;
  isError: boolean;
  selectedFile: string | null;
}

export function CodeViewer({ fileContent, isLoading, isError, selectedFile }: CodeViewerProps) {
  if (!selectedFile) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
        <MousePointerClick className="h-10 w-10 opacity-30" />
        <p className="text-sm">Select a file from the explorer to view its contents.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full p-4 space-y-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-4 rounded"
            style={{ width: `${30 + Math.random() * 60}%` }}
          />
        ))}
      </div>
    );
  }

  if (isError || !fileContent) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
        <AlertCircle className="h-8 w-8 text-destructive opacity-60" />
        <p className="text-sm">Failed to load file content.</p>
      </div>
    );
  }

  return (
    <motion.div
      key={fileContent.path}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col"
    >
      {/* File info bar */}
      <div className="flex items-center gap-3 border-b border-border bg-muted/20 px-4 py-1.5 text-xs text-muted-foreground">
        <FileCode className="h-3.5 w-3.5 shrink-0" />
        <span className="font-mono">{fileContent.language}</span>
        <span className="text-border">|</span>
        <span>{fileContent.lines} lines</span>
        <span className="text-border">|</span>
        <span>{formatSize(fileContent.size)}</span>
      </div>

      {/* Code */}
      <div className="flex-1 min-h-0 overflow-auto">
        <CodeContent content={fileContent.content} language={fileContent.language} />
      </div>
    </motion.div>
  );
}

// Simple syntax-highlighted code display using <pre> with line numbers
function CodeContent({ content, language }: { content: string; language: string }) {
  const lines = content.split("\n");

  return (
    <div className="flex font-mono text-xs leading-5">
      {/* Line numbers */}
      <div
        className="select-none border-r border-border bg-muted/30 px-3 py-4 text-right text-muted-foreground"
        aria-hidden="true"
      >
        {lines.map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>

      {/* Code content */}
      <pre className="flex-1 overflow-x-auto px-4 py-4 text-foreground whitespace-pre">
        <code>{content}</code>
      </pre>
    </div>
  );
}
