import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { SUGGESTED_QUESTIONS } from "../types/chat";

interface SuggestedQuestionsProps {
  repository: string;
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({ repository, onSelect }: SuggestedQuestionsProps) {
  // Show 4 random questions
  const questions = SUGGESTED_QUESTIONS.slice(0, 4);

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-10 text-center max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Ask about {repository}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Ask anything about this codebase. I'll search the indexed code and give you a grounded answer.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {questions.map((q, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.07 }}
              onClick={() => onSelect(q)}
              className="rounded-xl border border-border bg-card px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted hover:text-foreground"
            >
              {q}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
