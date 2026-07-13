import { motion } from "framer-motion";
import { Code2, Zap, GitBranch, MessageSquare } from "lucide-react";
import { LoginForm } from "@/features/auth/components/LoginForm";

const features = [
  { icon: Code2, text: "AI-powered code understanding" },
  { icon: GitBranch, text: "Repository analysis at scale" },
  { icon: MessageSquare, text: "Chat with your codebase" },
  { icon: Zap, text: "Instant semantic search" },
];

export function LoginPage() {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      {/* Left — Branding panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
        {/* Animated grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glowing orb */}
        <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] translate-y-1/2 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[100px]" />

        {/* Logo */}
        <motion.div
          className="relative z-10 flex items-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg">
            <Code2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-white">CodePilot AI</span>
        </motion.div>

        {/* Headline */}
        <motion.div
          className="relative z-10 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-tight text-white">
              Your AI‑powered{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                code companion
              </span>
            </h1>
            <p className="text-lg text-neutral-400">
              Understand, navigate, and chat with any codebase — instantly.
            </p>
          </div>

          <ul className="space-y-3">
            {features.map(({ icon: Icon, text }, i) => (
              <motion.li
                key={text}
                className="flex items-center gap-3 text-neutral-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm">{text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Footer quote */}
        <motion.p
          className="relative z-10 text-xs text-neutral-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Trusted by engineers who ship great software.
        </motion.p>
      </div>

      {/* Right — Form panel */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <motion.div
          className="w-full max-w-md space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">CodePilot AI</span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h2>
            <p className="text-sm text-muted-foreground">
              Sign in to continue to your workspace
            </p>
          </div>

          {/* Form */}
          <LoginForm />
        </motion.div>
      </div>
    </div>
  );
}
