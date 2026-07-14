import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, AlertCircle, Bot, User } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TypingIndicator } from "./TypingIndicator";
import { SourceCitation } from "./SourceCitation";
import type { ChatMessage } from "../types/chat";

interface MessageBubbleProps {
  message: ChatMessage;
  repository: string;
  onFileOpen?: (file: string) => void;
}

export function MessageBubble({ message, repository, onFileOpen }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted border border-border"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
      </div>

      {/* Bubble */}
      <div className={cn("group max-w-[80%] space-y-1", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted text-foreground border border-border rounded-tl-sm",
            message.isError && "border-destructive/50 bg-destructive/10 text-destructive"
          )}
        >
          {/* Typing indicator */}
          {message.isStreaming && !message.content && <TypingIndicator />}

          {/* Error icon */}
          {message.isError && (
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs font-medium">Error</span>
            </div>
          )}

          {/* Content — render markdown-like code blocks */}
          {message.content && <FormattedContent content={message.content} isUser={isUser} />}

          {/* Streaming cursor */}
          {message.isStreaming && message.content && (
            <span className="ml-0.5 inline-block h-4 w-0.5 bg-current animate-pulse" />
          )}
        </div>

        {/* Sources */}
        {!isUser && message.sources && message.sources.length > 0 && !message.isStreaming && (
          <SourceCitation
            sources={message.sources}
            repository={repository}
            onFileOpen={onFileOpen}
          />
        )}

        {/* Actions */}
        {!isUser && !message.isStreaming && !message.isError && message.content && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Lightweight markdown renderer — handles code blocks and inline code
function FormattedContent({ content, isUser }: { content: string; isUser: boolean }) {
  const parts = content.split(/(```[\s\S]*?```|`[^`]+`)/g);

  return (
    <div className="space-y-2">
      {parts.map((part, i) => {
        // Fenced code block
        if (part.startsWith("```") && part.endsWith("```")) {
          const inner = part.slice(3, -3);
          const newlineIdx = inner.indexOf("\n");
          const lang = newlineIdx > -1 ? inner.slice(0, newlineIdx).trim() : "";
          const code = newlineIdx > -1 ? inner.slice(newlineIdx + 1) : inner;
          return (
            <div key={i} className="rounded-lg overflow-hidden border border-border/60">
              {lang && (
                <div className="bg-muted/80 px-3 py-1 text-xs font-mono text-muted-foreground border-b border-border/60">
                  {lang}
                </div>
              )}
              <pre className="bg-muted/40 p-3 text-xs overflow-x-auto font-mono">
                <code>{code.trimEnd()}</code>
              </pre>
            </div>
          );
        }

        // Inline code
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className={cn(
                "rounded px-1.5 py-0.5 font-mono text-xs",
                isUser ? "bg-primary-foreground/20" : "bg-muted border border-border/60"
              )}
            >
              {part.slice(1, -1)}
            </code>
          );
        }

        // Plain text — preserve line breaks
        if (!part) return null;
        return (
          <span key={i} className="whitespace-pre-wrap">
            {part}
          </span>
        );
      })}
    </div>
  );
}
