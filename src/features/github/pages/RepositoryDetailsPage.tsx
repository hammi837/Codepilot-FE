import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Database, FolderGit2, AlertCircle } from "lucide-react";
import { CloneProgress } from "../components/CloneProgress";

export function RepositoryDetailsPage() {
  const { id } = useParams<{ id: string }>();
  // Decode the repo name since it might be owner/repo
  const repoName = id ? decodeURIComponent(id) : "Unknown Repository";

  // In a real implementation, we would fetch the repository details and indexing status here via React Query
  // For now, we will mock the status for demonstration purposes
  const isAnalyzing = false; // Mock

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto space-y-8 p-4 md:p-8"
    >
      <div className="flex items-center gap-4">
        <Link 
          to="/repositories"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight">{repoName}</h1>
          <p className="text-sm text-muted-foreground">Repository Overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Main content area */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FolderGit2 className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Source Files</h2>
            </div>
            <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg">
              <AlertCircle className="h-8 w-8 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">Repository structure view is coming in a future phase.</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Status Sidebar */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Analysis Status</h2>
            </div>
            
            {isAnalyzing ? (
              <CloneProgress status="indexing" progress={45} message="Generating embeddings for source files..." />
            ) : (
              <CloneProgress status="completed" progress={100} message="Ready for AI Chat and Search." />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
