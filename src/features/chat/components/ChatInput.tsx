import { useState, useRef, useCallback } from "react";
import { Send, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  isLoading: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  onStop,
  isLoading,
  disabled,
  placeholder = "Ask about this repository...",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, isLoading, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    // Auto-resize
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    }
  };

  return (
    <div className="border-t border-border bg-card p-4">
      <div
        className={cn(
          "flex items-end gap-2 rounded-xl border border-border bg-background px-3 py-2",
          "focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20",
          "transition-all"
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={disabled}
          className={cn(
            "flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground",
            "focus:outline-none disabled:opacity-50 min-h-[36px] py-1.5"
          )}
          style={{ height: "auto" }}
        />

        {isLoading ? (
          <Button
            onClick={onStop}
            size="icon"
            variant="ghost"
            className="h-9 w-9 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            title="Stop generation"
          >
            <Square className="h-4 w-4 fill-current" />
          </Button>
        ) : (
          <Button
            onClick={handleSend}
            size="icon"
            disabled={!value.trim() || disabled}
            className="h-9 w-9 shrink-0"
            title="Send message (Enter)"
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>
      <p className="mt-1.5 text-center text-xs text-muted-foreground">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
