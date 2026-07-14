import { useCallback, useRef, useState } from "react";
import { chatApi } from "../api/chatApi";
import { useChatStore } from "../store/chatStore";
import type { ChatHistoryMessage } from "../types/chat";

export function useChat(repository: string) {
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<boolean>(false);

  const sendMessage = useCallback(
    async (question: string) => {
      if (!question.trim() || isLoading) return;

      // Use getState() everywhere to avoid stale closure issues
      const getStore = () => useChatStore.getState();

      // Get or create conversation for this repo
      let conversationId = getStore().activeConversationId;
      const existing = conversationId
        ? getStore().conversations.find(
            (c) => c.id === conversationId && c.repository === repository
          )
        : null;

      if (!existing) {
        conversationId = getStore().createConversation(repository, question);
      }

      // Snapshot history BEFORE adding the new user message
      const conv = getStore().conversations.find((c) => c.id === conversationId);
      const history: ChatHistoryMessage[] =
        conv?.messages
          .filter((m) => !m.isStreaming && !m.isError)
          .map((m) => ({ role: m.role, content: m.content })) ?? [];

      // Add messages to store
      getStore().addUserMessage(conversationId!, question);
      const assistantMsgId = getStore().addAssistantMessage(conversationId!);

      const cid = conversationId!;
      const mid = assistantMsgId;

      setIsLoading(true);
      abortRef.current = false;

      try {
        let streamedTokens = "";

        await chatApi.streamMessage(
          repository,
          { question, history, top_k: 5 },

          // onToken — append each token to the message
          (token) => {
            if (abortRef.current) return;
            streamedTokens += token;
            getStore().appendToken(cid, mid, token);
          },

          // onDone — streaming finished, now get sources from sync endpoint
          async () => {
            if (abortRef.current) return;
            try {
              const resp = await chatApi.sendMessage(repository, {
                question,
                history,
                top_k: 5,
              });
              if (abortRef.current) return;
              // If stream produced no content, use the sync answer as fallback
              if (!streamedTokens.trim() && resp.answer) {
                getStore().setAssistantContent(cid, mid, resp.answer);
              }
              getStore().finalizeAssistantMessage(cid, mid, resp.sources);
            } catch {
              getStore().finalizeAssistantMessage(cid, mid, []);
            }
            setIsLoading(false);
          },

          // onError — stream failed, fall back entirely to sync endpoint
          async (err) => {
            if (abortRef.current) return;
            console.error("SSE stream error, falling back to sync:", err);
            try {
              const resp = await chatApi.sendMessage(repository, {
                question,
                history,
                top_k: 5,
              });
              if (abortRef.current) return;
              getStore().setAssistantContent(cid, mid, resp.answer);
              getStore().finalizeAssistantMessage(cid, mid, resp.sources);
            } catch {
              getStore().setMessageError(cid, mid);
            }
            setIsLoading(false);
          }
        );
      } catch {
        if (!abortRef.current) {
          // Total network failure — try sync one last time
          try {
            const resp = await chatApi.sendMessage(repository, {
              question,
              history,
              top_k: 5,
            });
            getStore().setAssistantContent(cid, mid, resp.answer);
            getStore().finalizeAssistantMessage(cid, mid, resp.sources);
          } catch {
            getStore().setMessageError(cid, mid);
          }
        }
        setIsLoading(false);
      }
    },
    [repository, isLoading]
  );

  const stopGeneration = useCallback(() => {
    abortRef.current = true;
    setIsLoading(false);
  }, []);

  return { sendMessage, stopGeneration, isLoading };
}
