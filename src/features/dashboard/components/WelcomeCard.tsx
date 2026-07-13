import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";

export function WelcomeCard() {
  const { user } = useAuthStore();
  
  // Get time-based greeting
  const hour = new Date().getHours();
  let greeting = "Good Evening";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-primary px-8 py-10 shadow-md"
    >
      <div className="relative z-10 flex flex-col gap-2 md:w-2/3">
        <h2 className="text-3xl font-bold tracking-tight text-primary-foreground flex items-center gap-2">
          {greeting}, {user?.username} <span className="inline-block animate-wave origin-bottom-right">👋</span>
        </h2>
        <p className="text-primary-foreground/80 text-lg">
          Welcome back to CodePilot AI. Let&apos;s build something incredible today.
        </p>
      </div>

      {/* Decorative background elements */}
      <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 hidden md:block">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white blur-3xl" />
        <Sparkles className="absolute right-12 top-1/2 h-32 w-32 -translate-y-1/2 text-white" />
      </div>
    </motion.div>
  );
}
