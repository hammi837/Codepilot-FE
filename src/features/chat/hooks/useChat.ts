import { useCallback, useRef, useState } from "react";
import { chatApi } from "../api/chatApi";
import { useChatStore } from "../store/chatStore";
import type { ChatHistoryMessage } from "../types/chat";

export function useChat(repository: string) {
  const store = useChatStore();
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<boolean>(false);

  const sendMessage = useCallback(
    async (question: string) => {
      if (!question.trim() || isLoading) return;

      // Ensure we have an active conversation for this repo
      let conversationId = store.activeConversationId;
      const existing = conversationId
        ? store.conversations.find((c) => c.id === conversationId && c.repository === repository)
        : null;

      if (!existing) {
        conversationId = store.createConversation(repository, question);
      }

      // Build history from existing messages before adding the new one
      const conversation = store.conversations.find((c) => c.id === conversationId);
      const history: ChatHistoryMessage[] =
        conversation?.messages
          .filter((m) => !m.isStreaming && !m.isError)
          .map((m) => ({ role: m.role, content: m.content })) ?? [];

      // Add user message to store
      store.addUserMessage(conversationId!, question);

      // Add assistant placeholder (streaming = true, content = "")
      const assistantMsgId = store.addAssistantMessage(conversationId!);

      setIsLoading(true);
      abortRef.current = false;

      try {
        // Use streaming for token-by-token display
        let streamedContent = "";

        await chatApi.streamMessage(
          repository,
          { question, history, top_k: 5 },
          (token) => {
            if (abortRef.current) return;
            streamedContent += token;
            store.appendToken(conversationId!, assistantMsgId, token);
          },
          async () => {
            // Stream done — now fetch sources from sync endpoint
            if (abortRef.current) return;
            try {
              const resp = await chatApi.sendMessage(repository, { question, history, top_k: 5 });
              if (!abortRef.current) {
                // If stream gave us content, keep it; otherwise use sync answer
                if (!streamedContent.trim() && resp.answer) {
                  // Stream was empty — update content with sync answer
                  store.setAssistantContent(conversationId!, assistantMsgId, resp.answer);
                }
                store.finalizeAssistantMessage(conversationId!, assistantMsgId, resp.sources);
              }
            } catch {
              if (!abortRef.current) {
                store.finalizeAssistantMessage(conversationId!, assistantMsgId, []);
              }
            }
          },
          (err) => {
            if (!abortRef.current) {
              // Stream failed — fall back to sync endpoint
              chatApi
                .sendMessage(repository, { question, history, top_k: 5 })
                .then((resp) => {
                  if (!abortRef.current) {
                    store.setAssistantContent(conversationId!, assistantMsgId, resp.answer);
                    store.finalizeAssistantMessage(conversationId!, assistantMsgId, resp.sources);
                  }
                })
                .catch(() => {
                  store.setMessageError(conversationId!, assistantMsgId);
                });
              console.error("Stream error, fell back to sync:", err);
            }
          }
        );
      } catch {
        if (!abortRef.current) {
          // Network error — try sync fallback
          try {
            const history2: ChatHistoryMessage[] =
              store.conversations
                .find((c) => c.id === conversationId)
                ?.messages.filter((m) => m.role === "user" && m.id !== assistantMsgId)
                .map((m) => ({ role: m.role as "user", content: m.content })) ?? [];
            const resp = await chatApi.sendMessage(repository, { question, history: history2, top_k: 5 });
            store.setAssistantContent(conversationId!, assistantMsgId, resp.answer);
            store.finalizeAssistantMessage(conversationId!, assistantMsgId, resp.sources);
          } catch {
            store.setMessageError(conversationId!, assistantMsgId);
          }
        }
      } finally {
        setIsLoading(false);
      }
    },
    [repository, isLoading, store]
  );

  const stopGeneration = useCallback(() => {
    abortRef.current = true;
    setIsLoading(false);
  }, []);

  return { sendMessage, stopGeneration, isLoading };
}
