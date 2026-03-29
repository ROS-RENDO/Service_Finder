"use client";
import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { FlickerDots } from "@/components/common/FlickerDots";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { useAuthContext } from "@/lib/contexts/AuthContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function LoginInner() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { login, googleLogin } = useAuthContext();
  const { toast } = useToast();

  const redirectTo = searchParams.get("redirect");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await login(email, password);

    if (result.success) {
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push("/");
      }

      router.refresh();
    } else {
      setError(result.error || "Login failed");
      toast({
        variant: "destructive",
        title: "Login failed",
        description: result.error || "Please check your credentials",
      });
    }

    setIsLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setError("");

    if (!credentialResponse.credential) {
      setError("Google login failed");
      setIsLoading(false);
      return;
    }

    const result = await googleLogin(credentialResponse.credential);

    if (result.success) {
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in with Google.",
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push("/");
      }
      router.refresh();
    } else {
      setError(result.error || "Google login failed");
      toast({
        variant: "destructive",
        title: "Login failed",
        description: result.error || "Please check your account",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-background overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.72 0.18 260 / 0.35), transparent 70%)" }}
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute top-1/3 -right-40 w-[450px] h-[450px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.6 0.118 184 / 0.3), transparent 70%)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], y: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute -bottom-20 left-1/3 w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.6 0.25 300 / 0.2), transparent 70%)" }}
        />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage: "linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Clean glass card — no spinning border */}
          <div className="glass-neon rounded-2xl p-8 shadow-2xl shadow-primary/10">

              {/* Logo */}
              <motion.div variants={itemVariants}>
                <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/30"
                  >
                    <Sparkles className="w-5 h-5 text-white" />
                  </motion.div>
                  <span className="font-display font-bold text-xl">
                    Sparkle<span className="text-primary">Find</span>
                  </span>
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-8">
                <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                  Welcome back
                </h1>
                <p className="text-muted-foreground text-sm">
                  Sign in to your account to continue your journey
                </p>
              </motion.div>

              <motion.form
                onSubmit={handleSubmit}
                className="space-y-5"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Email Field */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="email" className="text-foreground/80 text-xs font-semibold uppercase tracking-wider">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 bg-white/5 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:border-primary/50 focus:border-primary focus:ring-0 focus:bg-white/10 transition-all rounded-xl text-foreground placeholder:text-muted-foreground/50 backdrop-blur-sm"
                      required
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-foreground/80 text-xs font-semibold uppercase tracking-wider">Password</Label>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Link
                        href="/auth/forgot-password"
                        className="text-xs text-primary hover:text-primary/80 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </motion.div>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 bg-white/5 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:border-primary/50 focus:border-primary focus:ring-0 focus:bg-white/10 transition-all rounded-xl text-foreground placeholder:text-muted-foreground/50 backdrop-blur-sm"
                      required
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </motion.button>
                  </div>
                </motion.div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    variants={itemVariants}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <ErrorMessage message={error} />
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.div variants={itemVariants} className="pt-1">
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02, boxShadow: "0 0 30px oklch(0.72 0.18 260 / 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
                  >
                    {isLoading ? (
                      <FlickerDots />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </motion.div>

                {/* Divider */}
                <motion.div variants={itemVariants} className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-3 text-muted-foreground/60 bg-transparent">
                      Or continue with
                    </span>
                  </div>
                </motion.div>

                {/* Google Login */}
                <motion.div variants={itemVariants} className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    use_fedcm_for_prompt={false}
                    ux_mode="popup"
                    onError={() => {
                      setError("Google sign in was unsuccessful");
                      toast({
                        variant: "destructive",
                        title: "Google Login Failed",
                        description: "Please try again later.",
                      });
                    }}
                  />
                </motion.div>
              </motion.form>

              {/* Sign Up Link */}
              <motion.p
                variants={itemVariants}
                className="text-center text-muted-foreground text-sm mt-8"
              >
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/register"
                  className="text-primary font-semibold hover:text-primary/80 transition-colors"
                >
                  Create one
                </Link>
              </motion.p>
            </div>
        </motion.div>
      </div>

      {/* Right Panel - Image */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent z-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-primary/10 z-10" />
          <Image
            src="https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?q=80&w=800"
            alt="Clean home"
            className="w-full h-full object-cover"
            width={800}
            height={1200}
          />
        </motion.div>

        {/* Content Overlay */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute inset-0 flex items-center justify-center p-16 z-30"
        >
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="font-display text-5xl font-bold mb-4 text-foreground"
            >
              Your Space,<br />
              <span className="text-gradient">Sparkling Clean</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="text-muted-foreground max-w-md text-lg mb-10"
            >
              Access your bookings, manage preferences, and connect with top-rated professionals
            </motion.p>

            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.7 }}
            >
              {["Quick and easy booking", "Secure payment methods", "Professional cleaners"].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  className="flex items-center gap-3 justify-center"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-muted-foreground text-sm">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
