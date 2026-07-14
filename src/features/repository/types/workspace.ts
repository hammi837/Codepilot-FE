// ── File Tree ──────────────────────────────────────────────────────────────

export interface FileMetadata {
  path: string;
  extension: string;
  language: string;
  size: number;
}

export interface FileNode {
  name: string;
  path: string;
  type: "file" | "folder";
  extension?: string;
  language?: string;
  size?: number;
  children?: FileNode[];
}

// ── File Content ───────────────────────────────────────────────────────────

export interface FileContent {
  path: string;
  content: string;
  language: string;
  size: number;
  lines: number;
}

// ── Chunks ─────────────────────────────────────────────────────────────────

export interface ChunkMetadata {
  repository: string;
  file: string;
  language: string;
  type: "function" | "class" | "method" | "global" | "markdown_section" | string;
  name: string | null;
  parent: string | null;
  start_line: number;
  end_line: number;
  chunk_index: number;
  total_chunks: number;
  hash: string;
}

export interface Chunk {
  content: string;
  metadata: ChunkMetadata;
}

// ── Search ─────────────────────────────────────────────────────────────────

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

// ── Workspace State ────────────────────────────────────────────────────────

export interface WorkspaceState {
  repoName: string;
  selectedFile: string | null;
  expandedFolders: Set<string>;
  fileSearchQuery: string;
}
