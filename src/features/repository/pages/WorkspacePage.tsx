import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { useFileTree, useFileContent, useChunks, useIndexRepository } from "../hooks/useWorkspace";
import { useWorkspaceStore } from "../store/workspaceStore";
import { FileExplorer } from "../components/FileExplorer";
import { CodeViewer } from "../components/CodeViewer";
import { ChunkPanel } from "../components/ChunkPanel";
import { SearchPanel } from "../components/SearchPanel";
import { MetadataPanel } from "../components/MetadataPanel";
import { Breadcrumb } from "../components/Breadcrumb";
import { WorkspaceToolbar } from "../components/WorkspaceToolbar";
import { StatusBar } from "../components/StatusBar";
import { Button } from "@/components/ui/button";

export function WorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const repoName = id ? decodeURIComponent(id).split("/").pop()! : "";
  const repoFullName = id ? decodeURIComponent(id) : "";

  const { selectedFile, activePanel, reset, selectFile, expandFolder } = useWorkspaceStore();
  const [storedChunks, setStoredChunks] = useState<number | undefined>(undefined);

  // Auto-select file if passed via ?file= query param (e.g. from source citations)
  const fileFromQuery = searchParams.get("file");
  useEffect(() => {
    if (!fileFromQuery) return;
    // Expand all parent folders of the target file
    const parts = fileFromQuery.split("/");
    for (let i = 1; i < parts.length; i++) {
      expandFolder(parts.slice(0, i).join("/"));
    }
    selectFile(fileFromQuery);
  }, [fileFromQuery, selectFile, expandFolder]);

  // Reset workspace state when repo changes
  useEffect(() => {
    reset();
  }, [repoName, reset]);

  // Data queries
  const {
    data: files = [],
    isLoading: isLoadingFiles,
    isError: isFilesError,
  } = useFileTree(repoName || null);

  const {
    data: fileContent,
    isLoading: isLoadingFile,
    isError: isFileError,
  } = useFileContent(repoName || null, selectedFile);

  const {
    data: chunks,
    isLoading: isLoadingChunks,
  } = useChunks(repoName || null);

  // Indexing mutation
  const { mutateAsync: indexRepo, isPending: isIndexing } = useIndexRepository();

  const handleIndex = useCallback(async () => {
    if (!repoName) return;
    const toastId = toast.loading(`Indexing ${repoName}...`);
    try {
      const result = await indexRepo(repoName);
      setStoredChunks(result.stored_chunks);
      toast.success(`Indexed ${result.stored_chunks} chunks`, { id: toastId });
    } catch {
      toast.error("Indexing failed. Make sure the repository is cloned.", { id: toastId });
    }
  }, [repoName, indexRepo]);

  if (!repoName) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Repository not found.</p>
      </div>
    );
  }

  if (isFilesError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
        <AlertCircle className="h-10 w-10 text-destructive opacity-60" />
        <div className="text-center">
          <p className="font-medium">Could not load repository files.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Make sure the repository is cloned on the server.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/repositories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Repositories
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="flex h-full flex-col overflow-hidden"
    >
      {/* Top bar */}
      <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-2">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8 shrink-0">
          <Link to="/repositories" aria-label="Back to repositories">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-sm font-semibold leading-none">{repoFullName}</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">Code Workspace</p>
        </div>
      </div>

      {/* Toolbar */}
      <WorkspaceToolbar
        onIndex={handleIndex}
        isIndexing={isIndexing}
        storedChunks={storedChunks}
      />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <aside className="flex w-64 flex-col overflow-hidden border-r border-border bg-card shrink-0">
          {activePanel === "explorer" && (
            <FileExplorer
              repoName={repoName}
              files={files}
              isLoading={isLoadingFiles}
            />
          )}
          {activePanel === "chunks" && (
            <ChunkPanel chunks={chunks} isLoading={isLoadingChunks} />
          )}
          {activePanel === "search" && (
            <SearchPanel repoName={repoName} />
          )}
        </aside>

        {/* Center: Breadcrumb + Code Viewer */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <Breadcrumb repoName={repoName} />
          <div className="flex-1 overflow-hidden bg-background">
            <CodeViewer
              fileContent={fileContent}
              isLoading={isLoadingFile}
              isError={isFileError}
              selectedFile={selectedFile}
            />
          </div>
        </main>

        {/* Right sidebar: Metadata */}
        <aside className="flex w-56 flex-col overflow-hidden border-l border-border bg-card shrink-0">
          <MetadataPanel
            repoName={repoName}
            files={files}
            chunks={chunks}
            isLoadingChunks={isLoadingChunks}
            storedChunks={storedChunks}
          />
        </aside>
      </div>

      {/* Status bar */}
      <StatusBar
        selectedFile={selectedFile}
        fileContent={fileContent}
        totalFiles={files.length}
      />
    </motion.div>
  );
}
