import { useState } from "react";
import { Search, Loader2, FileCode, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "../store/workspaceStore";
import { useSearch } from "../hooks/useWorkspace";
import type { SearchResult } from "../types/workspace";

interface SearchPanelProps {
  repoName: string;
}

export function SearchPanel({ repoName }: SearchPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const { selectFile } = useWorkspaceStore();

  const { data, isFetching, isError } = useSearch(repoName, submittedQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim().length > 2) {
      setSubmittedQuery(inputValue.trim());
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <Search className="h-4 w-4 text-primary" />
        <span className="flex-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Semantic Search
        </span>
      </div>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="border-b border-border p-2 space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search code by meaning..."
            className="h-8 pl-8 pr-3 text-xs"
          />
        </div>
        <Button type="submit" size="sm" className="w-full h-7 text-xs" disabled={isFetching || inputValue.trim().length <= 2}>
          {isFetching ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Searching...
            </>
          ) : (
            "Search"
          )}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Uses AI embeddings — search by concept, not keywords
        </p>
      </form>

      {/* Results */}
      <ScrollArea className="flex-1 min-h-0">
        {!submittedQuery ? (
          <div className="flex flex-col items-center justify-center py-10 text-center px-4">
            <Search className="h-8 w-8 text-muted-foreground/30 mb-2" />
            <p className="text-xs text-muted-foreground">
              Enter a query to search code semantically.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Try: "authentication logic" or "database connection"
            </p>
          </div>
        ) : isError ? (
          <div className="p-4 text-center">
            <p className="text-xs text-destructive">Search failed. Make sure the repository is indexed.</p>
          </div>
        ) : data?.results.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-xs text-muted-foreground">No results found for "{submittedQuery}".</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {data?.results.map((result, idx) => (
              <SearchResultCard
                key={idx}
                result={result}
                onFileSelect={selectFile}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

function SearchResultCard({
  result,
  onFileSelect,
}: {
  result: SearchResult;
  onFileSelect: (path: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const score = Math.round(result.score * 100);

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start gap-2 p-2.5 text-left hover:bg-muted/50 transition-colors"
      >
        <FileCode className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileSelect(result.file);
              }}
              className="truncate text-xs font-medium hover:text-primary hover:underline"
            >
              {result.file}
            </button>
            {result.name && (
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                · {result.name}
              </span>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded border border-border px-1 py-0.5 text-xs">
              {result.type}
            </span>
            <div className="flex items-center gap-1">
              <Hash className="h-3 w-3" />
              <div
                className={cn(
                  "h-1.5 rounded-full",
                  score > 80 ? "bg-green-500" : score > 60 ? "bg-yellow-500" : "bg-muted-foreground"
                )}
                style={{ width: `${score * 0.4}px` }}
              />
              <span>{score}%</span>
            </div>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border bg-muted/30 p-2.5">
          <pre className="overflow-x-auto text-xs font-mono text-foreground whitespace-pre-wrap max-h-36">
            {result.content}
          </pre>
        </div>
      )}
    </div>
  );
}
