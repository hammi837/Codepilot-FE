import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, FolderGit2, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { githubApi } from "@/features/github/api/githubApi";
import { useQuery } from "@tanstack/react-query";
import { useChat } from "../hooks/useChat";
import { useChatStore } from "../store/chatStore";
import { ChatWindow } from "../components/ChatWindow";
import { ConversationSidebar } from "../components/ConversationSidebar";
import { RepositoryPicker } from "../components/RepositoryPicker";

// Use the GitHub repos the user has already connected — their names match workspace/ folder names
function useConnectedRepositories() {
  return useQuery({
    queryKey: ["github", "repositories"],
    queryFn: githubApi.getRepositories,
    staleTime: 60 * 1000,
  });
}

export function ChatPage() {
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { data: repos = [], isLoading, isError } = useConnectedRepositories();
  const { activeConversationId, getActiveConversation, setActiveConversation, createConversation } =
    useChatStore();
  const { sendMessage, stopGeneration, isLoading: isChatLoading } = useChat(selectedRepo ?? "");

  const activeConversation = getActiveConversation();

  const handleRepoSelect = useCallback(
    (repoName: string) => {
      setSelectedRepo(repoName);
      // If there's an existing conversation for this repo, activate it; otherwise null
      const store = useChatStore.getState();
      const existing = store.conversations.find((c) => c.repository === repoName);
      if (existing) {
        setActiveConversation(existing.id);
      } else {
        setActiveConversation(null);
      }
    },
    [setActiveConversation]
  );

  const handleNewConversation = useCallback(() => {
    if (!selectedRepo) return;
    setActiveConversation(null);
  }, [selectedRepo, setActiveConversation]);

  const handleSend = useCallback(
    (message: string) => {
      sendMessage(message);
    },
    [sendMessage]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="flex h-full flex-col overflow-hidden"
    >
      {/* Top bar */}
      <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-2 shrink-0">
        {selectedRepo ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setSelectedRepo(null)}
              title="Back to repository picker"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <FolderGit2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">{selectedRepo}</span>
            </div>
            <div className="ml-auto">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setSidebarOpen((v) => !v)}
                title={sidebarOpen ? "Hide conversations" : "Show conversations"}
              >
                {sidebarOpen ? (
                  <PanelLeftClose className="h-4 w-4" />
                ) : (
                  <PanelLeftOpen className="h-4 w-4" />
                )}
              </Button>
            </div>
          </>
        ) : (
          <div>
            <h1 className="text-sm font-semibold">AI Chat</h1>
            <p className="text-xs text-muted-foreground">
              Chat with your code using AI
            </p>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {!selectedRepo ? (
          <RepositoryPicker
            repositories={repos}
            isLoading={isLoading}
            isError={isError}
            onSelect={handleRepoSelect}
          />
        ) : (
          <>
            {/* Conversation sidebar */}
            {sidebarOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0 overflow-hidden"
                style={{ width: 240 }}
              >
                <ConversationSidebar
                  repository={selectedRepo}
                  onNewConversation={handleNewConversation}
                />
              </motion.aside>
            )}

            {/* Chat area */}
            <main className="flex flex-1 flex-col overflow-hidden">
              <ChatWindow
                conversation={activeConversation}
                repository={selectedRepo}
                isLoading={isChatLoading}
                onSend={handleSend}
                onStop={stopGeneration}
              />
            </main>
          </>
        )}
      </div>
    </motion.div>
  );
}
