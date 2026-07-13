import { motion } from "framer-motion";
import { FolderGit2, FileText, Database, MessageSquare, AlertCircle } from "lucide-react";
import { useDashboardOverview } from "../hooks/useDashboard";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { WelcomeCard } from "../components/WelcomeCard";
import { StatCard } from "../components/StatCard";
import { QuickActions } from "../components/QuickActions";
import { RecentRepositories } from "../components/RecentRepositories";
import { ActivityFeed } from "../components/ActivityFeed";
import { Button } from "@/components/ui/button";

export function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboardOverview();

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <DashboardSkeleton />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
        <h2 className="mb-2 text-2xl font-bold tracking-tight">Failed to load dashboard</h2>
        <p className="mb-6 max-w-md text-muted-foreground">
          We couldn&apos;t load your dashboard data. This might be due to a network issue or the server being temporarily unavailable.
        </p>
        <Button onClick={() => refetch()} variant="outline">
          Try again
        </Button>
      </div>
    );
  }

  const { stats, recent_repositories, recent_activity } = data;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto space-y-8 p-4 md:p-8"
    >
      <WelcomeCard />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Repositories"
          value={stats.repositories_count}
          icon={FolderGit2}
          color="primary"
          index={0}
        />
        <StatCard
          title="Files Indexed"
          value={stats.files_indexed.toLocaleString()}
          icon={FileText}
          color="blue"
          index={1}
        />
        <StatCard
          title="Embeddings"
          value={stats.total_embeddings.toLocaleString()}
          icon={Database}
          color="green"
          index={2}
        />
        <StatCard
          title="Questions Asked"
          value={stats.questions_asked}
          icon={MessageSquare}
          color="purple"
          index={3}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Column */}
        <div className="space-y-8 lg:col-span-2">
          <QuickActions />
          <RecentRepositories repositories={recent_repositories} />
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          <ActivityFeed activities={recent_activity} />
        </div>
      </div>
    </motion.div>
  );
}
