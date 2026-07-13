import { Link } from "react-router-dom";
import { Code2, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <Code2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">CodePilot AI</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link to="/login" className="hover:text-foreground transition-colors">Login</Link>
            <Separator orientation="vertical" className="h-4" />
            <Link to="/register" className="hover:text-foreground transition-colors">Register</Link>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors" aria-label="GitHub">
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} CodePilot AI. Built with ❤️ for developers.
        </p>
      </div>
    </footer>
  );
}
