"use client"
import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Mail, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/hooks/useAuth";
import { FlickerDots } from "@/components/common/FlickerDots";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { requestReset } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await requestReset(email);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleContinueToReset = () => {
    router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl">
            Sparkle<span className="text-primary">Find</span>
          </span>
        </Link>

        {!isSubmitted ? (
          <>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Reset your password
            </h1>
            <p className="text-muted-foreground mb-8">
              Enter your email and well send you a link to reset your password
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? <FlickerDots/> : "Send Reset Link"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-accent" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Check your email
            </h1>
            <p className="text-muted-foreground mb-8">
              Weve sent a password reset link to <strong className="text-foreground">{email}</strong>
            </p>
            <Button size="lg" className="w-full" onClick={handleContinueToReset}>
              Enter Verification Code
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" asChild className="w-full mt-3">
              <Link href="/auth/login">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </Button>
          </motion.div>
        )}

        {!isSubmitted && (
          <p className="text-center text-muted-foreground mt-8">
            Remember your password?{" "}
            <Link href="/auth/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}
