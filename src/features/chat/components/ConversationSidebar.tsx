import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "../store/chatStore";
import type { Conversation } from "../types/chat";

interface ConversationSidebarProps {
  repository: string;
  onNewConversation: () => void;
}

function groupByDate(conversations: Conversation[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups: Record<string, Conversation[]> = {
    Today: [],
    Yesterday: [],
    Earlier: [],
  };

  for (const conv of conversations) {
    const date = new Date(conv.updatedAt);
    date.setHours(0, 0, 0, 0);
    if (date >= today) groups.Today.push(conv);
    else if (date >= yesterday) groups.Yesterday.push(conv);
    else groups.Earlier.push(conv);
  }

  return groups;
}

export function ConversationSidebar({ repository, onNewConversation }: ConversationSidebarProps) {
  const { conversations, activeConversationId, setActiveConversation, deleteConversation, renameConversation } =
    useChatStore();

  const repoConvos = conversations
    .filter((c) => c.repository === repository)
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const groups = groupByDate(repoConvos);

  return (
    <div className="flex h-full flex-col border-r border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-3 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Conversations
        </span>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={onNewConversation}
          title="New conversation"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="py-2">
          {repoConvos.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <MessageSquare className="mx-auto h-6 w-6 text-muted-foreground/40 mb-2" />
              <p className="text-xs text-muted-foreground">No conversations yet.</p>
              <p className="text-xs text-muted-foreground">Start by asking a question.</p>
            </div>
          ) : (
            Object.entries(groups).map(([label, convos]) => {
              if (!convos.length) return null;
              return (
                <div key={label} className="mb-2">
                  <p className="px-3 py-1 text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
                    {label}
                  </p>
                  {convos.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      isActive={conv.id === activeConversationId}
                      onSelect={() => setActiveConversation(conv.id)}
                      onDelete={() => deleteConversation(conv.id)}
                      onRename={(title) => renameConversation(conv.id, title)}
                    />
                  ))}
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
}

function ConversationItem({ conversation, isActive, onSelect, onDelete, onRename }: ConversationItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(conversation.title);

  const handleRenameSubmit = () => {
    if (editValue.trim()) onRename(editValue.trim());
    setIsEditing(false);
  };

  const msgCount = conversation.messages.length;

  return (
    <div
      className={cn(
        "group relative flex items-start gap-2 rounded-lg mx-1 px-2 py-2 cursor-pointer transition-colors",
        isActive ? "bg-primary/10 text-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground"
      )}
      onClick={!isEditing ? onSelect : undefined}
    >
      <MessageSquare className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", isActive ? "text-primary" : "")} />

      <div className="min-w-0 flex-1">
        {isEditing ? (
          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRenameSubmit();
                if (e.key === "Escape") setIsEditing(false);
              }}
              className="h-5 text-xs px-1 py-0"
              autoFocus
            />
            <button onClick={handleRenameSubmit} className="text-green-500 hover:text-green-400">
              <Check className="h-3 w-3" />
            </button>
            <button onClick={() => setIsEditing(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <p className="truncate text-xs font-medium leading-snug">{conversation.title}</p>
        )}
        <p className="mt-0.5 text-xs text-muted-foreground/60">
          {msgCount} message{msgCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Actions */}
      {!isEditing && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
              setEditValue(conversation.title);
            }}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Rename"
          >
            <Pencil className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="rounded p-1 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
            title="Delete"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
