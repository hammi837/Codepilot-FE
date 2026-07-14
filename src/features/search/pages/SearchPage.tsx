import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, SlidersHorizontal, X, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { githubApi } from "@/features/github/api/githubApi";
import { useSemanticSearch } from "../hooks/useSemanticSearch";
import { SearchResultCard } from "../components/SearchResultCard";

// Use GitHub repos — their `name` matches the cloned workspace folder names
function useIndexedRepositories() {
  return useQuery({
    queryKey: ["github", "repositories"],
    queryFn: githubApi.getRepositories,
    staleTime: 60 * 1000,
  });
}

const CODE_TYPES = ["function", "class", "method", "global", "markdown_section"];

export function SearchPage() {
  const [inputValue, setInputValue] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const { data: repos = [] } = useIndexedRepositories();

  const {
    data,
    isFetching,
    isError,
  } = useSemanticSearch(submittedQuery, selectedRepo, !!submittedQuery);

  const filteredResults =
    selectedType && data?.results
      ? data.results.filter((r) => r.type === selectedType)
      : data?.results ?? [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim().length > 2) {
      setSubmittedQuery(inputValue.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Semantic Search</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search your codebase by meaning using AI embeddings — not just keywords.
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder='Try "authentication logic" or "database connection"...'
            className="pl-10 pr-4 h-11 text-sm"
            autoFocus
          />
        </div>
        <Button type="submit" disabled={inputValue.trim().length <= 2 || isFetching} className="h-11 px-6">
          {isFetching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Search
            </>
          )}
        </Button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Repository filter */}
        {repos.length > 0 && (
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Repository:</span>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setSelectedRepo(null)}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-xs transition-colors",
                  !selectedRepo
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
              >
                All
              </button>
              {repos.map((repo) => (
                <button
                  key={repo.name}
                  onClick={() => setSelectedRepo(repo.name === selectedRepo ? null : repo.name)}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-xs transition-colors",
                    selectedRepo === repo.name
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {repo.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Type filter */}
        {data && data.results.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Type:</span>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setSelectedType(null)}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-xs transition-colors",
                  !selectedType
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
              >
                All
              </button>
              {CODE_TYPES.filter((t) => data.results.some((r) => r.type === t)).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t === selectedType ? null : t)}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-xs transition-colors",
                    selectedType === t
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {!submittedQuery ? (
        <EmptyState />
      ) : isFetching ? (
        <SearchSkeleton />
      ) : isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center">
          <p className="text-sm text-destructive">
            Search failed. Make sure repositories are indexed.
          </p>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="rounded-xl border border-border bg-muted/30 p-8 text-center">
          <Search className="mx-auto h-8 w-8 text-muted-foreground/30 mb-3" />
          <p className="font-medium">No results found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different query or make sure the repository is indexed.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{filteredResults.length}</span>{" "}
              result{filteredResults.length !== 1 ? "s" : ""} for{" "}
              <span className="font-medium text-foreground">"{submittedQuery}"</span>
            </p>
            {(selectedRepo || selectedType) && (
              <button
                onClick={() => { setSelectedRepo(null); setSelectedType(null); }}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" /> Clear filters
              </button>
            )}
          </div>
          {filteredResults.map((result, i) => (
            <SearchResultCard key={`${result.file}-${result.name}-${i}`} result={result} index={i} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function EmptyState() {
  const examples = [
    "JWT authentication",
    "database connection pool",
    "error handling middleware",
    "user login function",
    "API rate limiting",
  ];
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-8 text-center space-y-4">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Sparkles className="h-6 w-6 text-primary" />
      </div>
      <div>
        <p className="font-medium">Search by meaning</p>
        <p className="mt-1 text-sm text-muted-foreground">
          AI-powered search understands concepts, not just keywords.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {examples.map((ex) => (
          <Badge key={ex} variant="secondary" className="cursor-default text-xs">
            {ex}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-4 animate-pulse">
          <div className="flex items-start gap-3">
            <div className="h-4 w-4 rounded bg-muted mt-0.5" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 rounded bg-muted" />
              <div className="flex gap-2">
                <div className="h-3 w-16 rounded bg-muted" />
                <div className="h-3 w-24 rounded bg-muted" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
