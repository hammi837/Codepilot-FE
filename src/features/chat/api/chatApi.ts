import { api } from "@/services/api";
import { getStoredToken } from "@/services/api";
import type { ChatRequest, ChatResponse } from "../types/chat";

export const chatApi = {
  /**
   * Sync chat — returns full answer at once.
   * POST /api/v1/chat/{repository}
   */
  sendMessage: async (repository: string, request: ChatRequest): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>(`/chat/${repository}`, request);
    return response.data;
  },

  /**
   * Streaming chat — returns an EventSource-compatible ReadableStream.
   * POST /api/v1/chat/stream/{repository}
   *
   * Yields tokens via SSE: data: {"token": "..."}\n\n
   * Terminates with: data: [DONE]\n\n
   */
  streamMessage: async (
    repository: string,
    request: ChatRequest,
    onToken: (token: string) => void,
    onDone: () => void,
    onError: (err: string) => void
  ): Promise<void> => {
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
    const token = getStoredToken();

    const response = await fetch(`${baseURL}/chat/stream/${repository}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(request),
    });

    if (!response.ok || !response.body) {
      onError(`Request failed with status ${response.status}`);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const data = trimmed.slice(5).trim();

        if (data === "[DONE]") {
          onDone();
          return;
        }

        try {
          const parsed = JSON.parse(data);
          if (parsed.token) {
            onToken(parsed.token);
          } else if (parsed.error) {
            onError(parsed.error);
            return;
          }
        } catch {
          // skip malformed lines
        }
      }
    }
    onDone();
  },
};
