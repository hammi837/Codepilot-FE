import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import type { GitHubRepository } from "../types/github";
import { RepositoryCard } from "./RepositoryCard";
import { Input } from "@/components/ui/input";

interface RepositoryGridProps {
  repositories: GitHubRepository[];
}

export function RepositoryGrid({ repositories }: RepositoryGridProps) {
  const [search, setSearch] = useState("");

  const filteredRepositories = useMemo(() => {
    if (!search.trim()) return repositories;
    const lowerSearch = search.toLowerCase();
    return repositories.filter(
      (repo) =>
        repo.name.toLowerCase().includes(lowerSearch) ||
        (repo.description && repo.description.toLowerCase().includes(lowerSearch)) ||
        (repo.language && repo.language.toLowerCase().includes(lowerSearch))
    );
  }, [repositories, search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredRepositories.length} of {repositories.length}
        </div>
      </div>

      {filteredRepositories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border border-dashed py-20 text-center">
          <p className="text-muted-foreground">No repositories found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRepositories.map((repo, i) => (
            <RepositoryCard key={repo.id} repository={repo} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
