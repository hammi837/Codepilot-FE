import { api } from "@/services/api";
import type { FileMetadata, FileContent, Chunk, SearchResponse } from "../types/workspace";

export const workspaceApi = {
  /**
   * Returns flat list of all files in a cloned repository.
   * GET /api/v1/repositories/index/{repoName}
   */
  getFileTree: async (repoName: string): Promise<FileMetadata[]> => {
    const response = await api.get<FileMetadata[]>(`/repositories/index/${repoName}`);
    return response.data;
  },

  /**
   * Returns raw content of a single file.
   * GET /api/v1/repositories/file/{repoName}?file_path=src/main.py
   */
  getFileContent: async (repoName: string, filePath: string): Promise<FileContent> => {
    const response = await api.get<FileContent>(`/repositories/file/${repoName}`, {
      params: { file_path: filePath },
    });
    return response.data;
  },

  /**
   * Runs the full indexing pipeline (chunk + embed + store in ChromaDB).
   * POST /api/v1/vector/repositories/store/{repoName}
   */
  indexRepository: async (repoName: string): Promise<{ repository: string; stored_chunks: number }> => {
    const response = await api.post<{ repository: string; stored_chunks: number }>(
      `/vector/repositories/store/${repoName}`
    );
    return response.data;
  },

  /**
   * Returns all chunks for a repository.
   * POST /api/v1/repositories/chunk/{repoName}
   */
  getChunks: async (repoName: string): Promise<Chunk[]> => {
    const response = await api.post<Chunk[]>(`/repositories/chunk/${repoName}`);
    return response.data;
  },

  /**
   * Semantic search within a repository.
   * POST /api/v1/search/{repoName}
   */
  searchRepository: async (repoName: string, query: string, topK = 10): Promise<SearchResponse> => {
    const response = await api.post<SearchResponse>(`/search/${repoName}`, {
      query,
      top_k: topK,
    });
    return response.data;
  },
};
