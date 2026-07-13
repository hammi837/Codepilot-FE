import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, UserPlus, CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { registerSchema, type RegisterFormValues } from "@/features/auth/schemas/authSchemas";
import { useAuthStore } from "@/features/auth/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function PasswordStrengthBar({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
  ];

  const passed = checks.filter((c) => c.pass).length;
  const colors = ["bg-destructive", "bg-orange-500", "bg-yellow-500", "bg-green-500"];

  if (!password) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < passed ? colors[passed] : "bg-muted"}`}
          />
        ))}
      </div>
      <div className="flex gap-3">
        {checks.map(({ label, pass }) => (
          <span
            key={label}
            className={`flex items-center gap-1 text-xs transition-colors ${pass ? "text-green-500" : "text-muted-foreground"}`}
          >
            <CheckCircle2 className="h-3 w-3" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function RegisterForm() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch("password", "");

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      await register({
        email: data.email,
        username: data.username,
        password: data.password,
      });
      toast.success("Account created! Please sign in.", { duration: 4000 });
      navigate("/login");
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldAnimation = (delay: number) => ({
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    transition: { delay },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Username */}
      <motion.div className="space-y-2" {...fieldAnimation(0.1)}>
        <Label htmlFor="reg-username">Username</Label>
        <Input
          id="reg-username"
          type="text"
          placeholder="your_username"
          autoComplete="username"
          className={`h-11 ${errors.username ? "border-destructive" : ""}`}
          {...registerField("username")}
        />
        {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
      </motion.div>

      {/* Email */}
      <motion.div className="space-y-2" {...fieldAnimation(0.15)}>
        <Label htmlFor="reg-email">Email address</Label>
        <Input
          id="reg-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          className={`h-11 ${errors.email ? "border-destructive" : ""}`}
          {...registerField("email")}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </motion.div>

      {/* Password */}
      <motion.div className="space-y-2" {...fieldAnimation(0.2)}>
        <Label htmlFor="reg-password">Password</Label>
        <div className="relative">
          <Input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="new-password"
            className={`h-11 pr-10 ${errors.password ? "border-destructive" : ""}`}
            {...registerField("password")}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <PasswordStrengthBar password={passwordValue} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </motion.div>

      {/* Confirm Password */}
      <motion.div className="space-y-2" {...fieldAnimation(0.25)}>
        <Label htmlFor="reg-confirm">Confirm Password</Label>
        <div className="relative">
          <Input
            id="reg-confirm"
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="new-password"
            className={`h-11 pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
            {...registerField("confirmPassword")}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowConfirm((v) => !v)}
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
        )}
      </motion.div>

      {/* Submit */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Button type="submit" className="w-full h-11 font-semibold gap-2" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Create Account
            </>
          )}
        </Button>
      </motion.div>

      {/* Login Link */}
      <motion.p
        className="text-center text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </motion.p>
    </form>
  );
}
