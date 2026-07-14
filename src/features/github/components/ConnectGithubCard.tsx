import { useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, Code2, Search, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { githubApi } from "../api/githubApi";

export function ConnectGithubCard() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      const url = await githubApi.getLoginUrl();
      // Redirect to GitHub OAuth flow
      window.location.href = url;
    } catch (error) {
      console.error("Failed to get GitHub login URL", error);
      setIsConnecting(false);
    }
  };

  const benefits = [
    { icon: Code2, text: "Import and index repositories for AI analysis" },
    { icon: Search, text: "Semantic code search across your entire codebase" },
    { icon: Zap, text: "Instant context-aware chat about your architecture" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
    >
      <div className="bg-muted/50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-sm">
          <GitBranch className="h-8 w-8 text-foreground" />
        </div>
        <h2 className="mb-2 text-2xl font-bold tracking-tight">Connect GitHub</h2>
        <p className="text-muted-foreground">
          Link your account to unlock the full power of CodePilot AI.
        </p>
      </div>

      <div className="p-8">
        <div className="mb-8 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Benefits
          </h3>
          <ul className="space-y-4">
            {benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-3 text-sm font-medium">
                <div className="mt-0.5 rounded-full bg-primary/10 p-1 text-primary">
                  <benefit.icon className="h-4 w-4" />
                </div>
                <span className="text-foreground">{benefit.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full h-11 text-base font-semibold"
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <GitBranch className="mr-2 h-5 w-5" />
              Connect GitHub Account
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
