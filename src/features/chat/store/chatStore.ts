import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Conversation, ChatMessage, SourceReference } from "../types/chat";

const uid = () => crypto.randomUUID();

interface ChatStore {
  conversations: Conversation[];
  activeConversationId: string | null;

  // Conversation CRUD
  createConversation: (repository: string, firstMessage?: string) => string;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  setActiveConversation: (id: string | null) => void;

  // Message management
  addUserMessage: (conversationId: string, content: string) => string;
  addAssistantMessage: (conversationId: string) => string;
  appendToken: (conversationId: string, messageId: string, token: string) => void;
  finalizeAssistantMessage: (
    conversationId: string,
    messageId: string,
    sources: SourceReference[]
  ) => void;
  setAssistantContent: (conversationId: string, messageId: string, content: string) => void;
  setMessageError: (conversationId: string, messageId: string) => void;

  // Selectors
  getActiveConversation: () => Conversation | null;
  getConversationsByRepo: (repo: string) => Conversation[];
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,

      createConversation: (repository, firstMessage) => {
        const id = uid();
        const title = firstMessage
          ? firstMessage.slice(0, 50) + (firstMessage.length > 50 ? "…" : "")
          : "New conversation";
        const now = Date.now();
        const conversation: Conversation = {
          id,
          repository,
          title,
          messages: [],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          activeConversationId: id,
        }));
        return id;
      },

      deleteConversation: (id) =>
        set((state) => {
          const filtered = state.conversations.filter((c) => c.id !== id);
          const nextActive =
            state.activeConversationId === id
              ? (filtered[0]?.id ?? null)
              : state.activeConversationId;
          return { conversations: filtered, activeConversationId: nextActive };
        }),

      renameConversation: (id, title) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, title, updatedAt: Date.now() } : c
          ),
        })),

      setActiveConversation: (id) => set({ activeConversationId: id }),

      addUserMessage: (conversationId, content) => {
        const msgId = uid();
        const msg: ChatMessage = {
          id: msgId,
          role: "user",
          content,
          timestamp: Date.now(),
        };
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, messages: [...c.messages, msg], updatedAt: Date.now() }
              : c
          ),
        }));
        return msgId;
      },

      addAssistantMessage: (conversationId) => {
        const msgId = uid();
        const msg: ChatMessage = {
          id: msgId,
          role: "assistant",
          content: "",
          isStreaming: true,
          timestamp: Date.now(),
        };
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, messages: [...c.messages, msg], updatedAt: Date.now() }
              : c
          ),
        }));
        return msgId;
      },

      appendToken: (conversationId, messageId, token) =>
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId ? { ...m, content: m.content + token } : m
              ),
            };
          }),
        })),

      finalizeAssistantMessage: (conversationId, messageId, sources) =>
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId ? { ...m, isStreaming: false, sources } : m
              ),
            };
          }),
        })),

      setMessageError: (conversationId, messageId) =>
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId
                  ? {
                      ...m,
                      isStreaming: false,
                      isError: true,
                      content: "Failed to get a response. Please try again.",
                    }
                  : m
              ),
            };
          }),
        })),

      // Replace entire content of an assistant message (used when stream was empty)
      setAssistantContent: (conversationId, messageId, content) =>
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId ? { ...m, content } : m
              ),
            };
          }),
        })),

      getActiveConversation: () => {
        const { conversations, activeConversationId } = get();
        return conversations.find((c) => c.id === activeConversationId) ?? null;
      },

      getConversationsByRepo: (repo) =>
        get().conversations.filter((c) => c.repository === repo),
    }),
    {
      name: "codepilot-chat",
      // Only persist conversations, not transient streaming state
      partialize: (state) => ({
        conversations: state.conversations.map((c) => ({
          ...c,
          messages: c.messages.map((m) => ({
            ...m,
            isStreaming: false,
          })),
        })),
        activeConversationId: state.activeConversationId,
      }),
    }
  )
);
