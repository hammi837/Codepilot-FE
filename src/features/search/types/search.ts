export interface SearchResult {
  repository: string;
  file: string;
  type: string;
  name: string | null;
  score: number;
  content: string;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
}

export interface SearchFilters {
  repository: string | null;
  type: string | null;
}
