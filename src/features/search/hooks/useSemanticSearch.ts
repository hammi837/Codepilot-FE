import { useQuery } from "@tanstack/react-query";
import { searchApi } from "../api/searchApi";

export function useSemanticSearch(
  query: string,
  repository: string | null,
  enabled: boolean
) {
  return useQuery({
    queryKey: ["search", "semantic", repository, query],
    queryFn: () =>
      repository
        ? searchApi.searchRepository(repository, query)
        : searchApi.searchAll(query),
    enabled: enabled && query.trim().length > 2,
    staleTime: 30 * 1000,
    retry: 1,
  });
}
