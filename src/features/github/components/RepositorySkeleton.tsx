import { Skeleton } from "@/components/ui/skeleton";

export function RepositorySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="flex h-[200px] flex-col rounded-xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-4 w-4 shrink-0" />
          </div>
          <div className="mt-auto flex items-center gap-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="mt-4 border-t border-border pt-4">
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
