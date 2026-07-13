import { motion } from "framer-motion";
import { Code2, ShieldCheck, Sparkles } from "lucide-react";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export function RegisterPage() {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      {/* Left — Branding panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] translate-y-1/2 translate-x-1/2 rounded-full bg-purple-500/20 blur-[120px]" />
        <div className="pointer-events-none absolute left-0 top-0 h-[300px] w-[300px] -translate-y-1/2 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[100px]" />

        <motion.div
          className="relative z-10 flex items-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg">
            <Code2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-white">CodePilot AI</span>
        </motion.div>

        <motion.div
          className="relative z-10 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-tight text-white">
              Start for{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                free today
              </span>
            </h1>
            <p className="text-lg text-neutral-400">
              Join thousands of developers using AI to master their codebases.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: ShieldCheck, title: "Secure by default", desc: "Your code stays private and encrypted." },
              { icon: Sparkles, title: "Powered by AI", desc: "Built on state-of-the-art language models." },
              { icon: Code2, title: "Any language", desc: "Python, TypeScript, Go, Rust and more." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-neutral-400">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.p
          className="relative z-10 text-xs text-neutral-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          No credit card required. Get started in 30 seconds.
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
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">CodePilot AI</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Create your account</h2>
            <p className="text-sm text-muted-foreground">
              Free forever. No credit card required.
            </p>
          </div>

          <RegisterForm />
        </motion.div>
      </div>
    </div>
  );
}
