import { api } from "@/services/api";
import type { SearchResponse } from "../types/search";

export const searchApi = {
  /**
   * POST /api/v1/search/{repository}
   * Semantic search scoped to a single repository.
   */
  searchRepository: async (
    repository: string,
    query: string,
    topK = 10
  ): Promise<SearchResponse> => {
    const response = await api.post<SearchResponse>(`/search/${repository}`, {
      query,
      top_k: topK,
    });
    return response.data;
  },

  /**
   * POST /api/v1/search
   * Semantic search across all indexed repositories.
   */
  searchAll: async (query: string, topK = 10): Promise<SearchResponse> => {
    const response = await api.post<SearchResponse>("/search", {
      query,
      top_k: topK,
    });
    return response.data;
  },
};
