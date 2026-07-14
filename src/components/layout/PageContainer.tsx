import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main className={cn("flex-1 overflow-y-auto p-6", className)}>
      {children}
    </main>
  );
}

/**
 * Full-bleed container for workspace-style pages that manage
 * their own layout and scrolling internally (Chat, Workspace).
 */
export function FullBleedContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {children}
    </div>
  );
}
