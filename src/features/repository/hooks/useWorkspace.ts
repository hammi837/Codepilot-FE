import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceApi } from "../api/workspaceApi";

// ── File Tree ──────────────────────────────────────────────────────────────

export function useFileTree(repoName: string | null) {
  return useQuery({
    queryKey: ["workspace", "fileTree", repoName],
    queryFn: () => workspaceApi.getFileTree(repoName!),
    enabled: !!repoName,
    staleTime: 5 * 60 * 1000, // 5 min — file tree rarely changes
  });
}

// ── File Content ───────────────────────────────────────────────────────────

export function useFileContent(repoName: string | null, filePath: string | null) {
  return useQuery({
    queryKey: ["workspace", "fileContent", repoName, filePath],
    queryFn: () => workspaceApi.getFileContent(repoName!, filePath!),
    enabled: !!repoName && !!filePath,
    staleTime: 2 * 60 * 1000,
  });
}

// ── Chunks ─────────────────────────────────────────────────────────────────

export function useChunks(repoName: string | null) {
  return useQuery({
    queryKey: ["workspace", "chunks", repoName],
    queryFn: () => workspaceApi.getChunks(repoName!),
    enabled: !!repoName,
    staleTime: 5 * 60 * 1000,
  });
}

// ── Indexing ───────────────────────────────────────────────────────────────

export function useIndexRepository() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (repoName: string) => workspaceApi.indexRepository(repoName),
    onSuccess: (_data, repoName) => {
      queryClient.invalidateQueries({ queryKey: ["workspace", "chunks", repoName] });
    },
  });
}

// ── Search ─────────────────────────────────────────────────────────────────

export function useSearch(repoName: string | null, query: string) {
  return useQuery({
    queryKey: ["workspace", "search", repoName, query],
    queryFn: () => workspaceApi.searchRepository(repoName!, query),
    enabled: !!repoName && query.trim().length > 2,
    staleTime: 30 * 1000,
  });
}
