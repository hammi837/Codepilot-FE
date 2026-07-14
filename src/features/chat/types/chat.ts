// ── Message & Conversation ─────────────────────────────────────────────────

export type MessageRole = "user" | "assistant";

export interface SourceReference {
  file: string;
  name: string | null;
  type: string | null;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  sources?: SourceReference[];
  isStreaming?: boolean;
  isError?: boolean;
  timestamp: number;
}

export interface Conversation {
  id: string;
  repository: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

// ── API shapes ─────────────────────────────────────────────────────────────

export interface ChatHistoryMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  question: string;
  history: ChatHistoryMessage[];
  top_k: number;
}

export interface ChatResponse {
  answer: string;
  sources: SourceReference[];
  query: string;
}

// ── Suggested questions ────────────────────────────────────────────────────

export const SUGGESTED_QUESTIONS = [
  "How does authentication work?",
  "Explain the database architecture.",
  "How is OAuth implemented?",
  "Where are embeddings generated?",
  "Show all API endpoints.",
  "How is the repository indexed?",
  "Explain the chunking strategy.",
  "Where is the main entry point?",
];
