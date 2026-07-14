import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { ChatInput } from "./ChatInput";
import { useNavigate } from "react-router-dom";
import type { Conversation } from "../types/chat";

interface ChatWindowProps {
  conversation: Conversation | null;
  repository: string;
  isLoading: boolean;
  onSend: (message: string) => void;
  onStop: () => void;
}

export function ChatWindow({
  conversation,
  repository,
  isLoading,
  onSend,
  onStop,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const messages = conversation?.messages ?? [];

  // Auto-scroll on new messages / tokens
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, messages[messages.length - 1]?.content]);

  const handleFileOpen = (file: string) => {
    const encodedRepo = encodeURIComponent(repository);
    navigate(`/repositories/${encodedRepo}?file=${encodeURIComponent(file)}`);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {messages.length === 0 ? (
          <SuggestedQuestions repository={repository} onSelect={onSend} />
        ) : (
          <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                repository={repository}
                onFileOpen={handleFileOpen}
              />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput
        onSend={onSend}
        onStop={onStop}
        isLoading={isLoading}
      />
    </div>
  );
}
