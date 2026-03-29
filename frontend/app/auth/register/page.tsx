"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight,
  User, Building2, Users, CheckCircle2, Phone,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";
import Image from "next/image";
import { FlickerDots } from "@/components/common/FlickerDots";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { useAuthContext } from "@/lib/contexts/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const roles = [
  { id: "customer", name: "Customer", description: "Book cleaning services", icon: User, color: "from-violet-500 to-primary" },
  { id: "company_admin", name: "Business Owner", description: "Manage your team", icon: Building2, color: "from-cyan-500 to-blue-600" },
  { id: "staff", name: "Staff Member", description: "Manage your schedule", icon: Users, color: "from-emerald-500 to-teal-600" },
];

function RegisterInner() {
  const [selectedRole, setSelectedRole] = useState("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { register, googleLogin } = useAuthContext();
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", password: "" });

  const redirectTo = searchParams.get("redirect");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    if (!selectedRole) { setError("Please select a role"); setIsLoading(false); return; }
    try {
      const result = await register({ fullName: formData.fullName, email: formData.email, phone: formData.phone, password: formData.password, role: selectedRole });
      if (!result.success) { setError(result.error || "Registration failed"); toast({ variant: "destructive", title: "Registration failed", description: result.error || "Please try again" }); setIsLoading(false); return; }
      toast({ title: "Account created!", description: "Welcome to SparkleFind. Let's get started!" });
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (redirectTo) { router.push(redirectTo); } else {
        const paths: Record<string, string> = { customer: "/customer/dashboard", company_admin: "/company/dashboard", staff: "/staff/dashboard", admin: "/admin/dashboard" };
        router.push(paths[result.user.role] || "/");
      }
      router.refresh();
    } catch { setError("Registration failed"); toast({ variant: "destructive", title: "Registration failed", description: "Please try again" }); }
    finally { setIsLoading(false); }
  };

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    setIsLoading(true);
    setError("");
    if (!selectedRole) { setError("Please select a role before continuing with Google"); setIsLoading(false); return; }
    if (!credentialResponse.credential) { setError("Google login failed"); setIsLoading(false); return; }
    const result = await googleLogin(credentialResponse.credential, selectedRole);
    if (result.success) {
      toast({ title: "Success!", description: "You've successfully signed in with Google." });
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (redirectTo) { router.push(redirectTo); } else {
        const paths: Record<string, string> = { customer: "/customer/dashboard", company_admin: "/company/dashboard", staff: "/staff/dashboard", admin: "/admin/dashboard" };
        router.push(paths[result.user?.role] || "/");
      }
      router.refresh();
    } else {
      setError(result.error || "Google login failed");
      toast({ variant: "destructive", title: "Login failed", description: result.error || "Please check your account" });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-background">
      {/* Animated Background Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.72 0.18 260 / 0.35), transparent 70%)" }}
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], x: [0, 20, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/3 -left-40 w-[450px] h-[450px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.6 0.118 184 / 0.3), transparent 70%)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/2 right-1/3 w-[350px] h-[350px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.55 0.22 300 / 0.2), transparent 70%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{ backgroundImage: "linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />
      </div>

      {/* Left Panel - Image (desktop) */}
      <div className="hidden lg:block flex-1 relative overflow-hidden z-0">
        <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 0.8 }} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-l from-background via-background/50 to-transparent z-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-primary/10 z-10" />
          <Image src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=800" alt="Clean space" className="w-full h-full object-cover" width={800} height={1200} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute inset-0 flex items-center justify-center p-16 z-30"
        >
          <div className="text-center">
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="font-display text-5xl font-bold mb-4 text-foreground">
              Join Our<br /><span className="text-gradient">Community</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="text-muted-foreground max-w-md text-lg mb-10">
              Whether you&apos;re looking for services or building a business, we&apos;ve got you covered
            </motion.p>
            <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              {["Easy signup process", "Professional verification", "Secure payments"].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 + i * 0.1 }} className="flex items-center gap-3 justify-center">
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

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-start justify-center p-6 md:p-10 overflow-y-auto relative z-10">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md py-8">
          <div className="glass-neon rounded-2xl p-8 shadow-2xl shadow-primary/10">

              {/* Logo */}
              <motion.div variants={itemVariants}>
                <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/30">
                    <Sparkles className="w-5 h-5 text-white" />
                  </motion.div>
                  <span className="font-display font-bold text-xl">Sparkle<span className="text-primary">Find</span></span>
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-6">
                <h1 className="font-display text-3xl font-bold text-foreground mb-1">Create your account</h1>
                <p className="text-muted-foreground text-sm">Join SparkleFind and start your journey today</p>
              </motion.div>

              <motion.form onSubmit={handleSubmit} className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
                {/* Role Selection */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label className="text-foreground/80 text-xs font-semibold uppercase tracking-wider">I am a...</Label>
                  <div className="grid gap-2">
                    {roles.map((role) => (
                      <motion.button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                          selectedRole === role.id
                            ? "bg-primary/15 ring-1 ring-primary/60 shadow-lg shadow-primary/10"
                            : "bg-white/5 dark:bg-white/3 hover:bg-white/10 border border-white/10"
                        }`}
                      >
                        <motion.div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            selectedRole === role.id ? `bg-gradient-to-br ${role.color} shadow-lg` : "bg-white/10"
                          }`}
                          animate={{ scale: selectedRole === role.id ? 1.1 : 1 }}
                        >
                          <role.icon className={`w-5 h-5 ${selectedRole === role.id ? "text-white" : "text-muted-foreground"}`} />
                        </motion.div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-foreground">{role.name}</p>
                          <p className="text-xs text-muted-foreground">{role.description}</p>
                        </div>
                        {selectedRole === role.id && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-4 h-4 rounded-full bg-primary/30 flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-primary" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Full Name */}
                <motion.div variants={itemVariants} className="space-y-1">
                  <Label htmlFor="name" className="text-foreground/80 text-xs font-semibold uppercase tracking-wider">Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input id="name" type="text" placeholder="John Doe" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="pl-10 h-11 bg-white/5 border border-white/20 hover:border-primary/50 focus:border-primary focus:ring-0 rounded-xl text-foreground placeholder:text-muted-foreground/50 backdrop-blur-sm" required />
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div variants={itemVariants} className="space-y-1">
                  <Label htmlFor="email" className="text-foreground/80 text-xs font-semibold uppercase tracking-wider">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 h-11 bg-white/5 border border-white/20 hover:border-primary/50 focus:border-primary focus:ring-0 rounded-xl text-foreground placeholder:text-muted-foreground/50 backdrop-blur-sm" required />
                  </div>
                </motion.div>

                {/* Phone */}
                <motion.div variants={itemVariants} className="space-y-1">
                  <Label htmlFor="phone" className="text-foreground/80 text-xs font-semibold uppercase tracking-wider">Phone Number</Label>
                  <div className="relative group">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10 h-11 bg-white/5 border border-white/20 hover:border-primary/50 focus:border-primary focus:ring-0 rounded-xl text-foreground placeholder:text-muted-foreground/50 backdrop-blur-sm" />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div variants={itemVariants} className="space-y-1">
                  <Label htmlFor="password" className="text-foreground/80 text-xs font-semibold uppercase tracking-wider">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 pr-10 h-11 bg-white/5 border border-white/20 hover:border-primary/50 focus:border-primary focus:ring-0 rounded-xl text-foreground placeholder:text-muted-foreground/50 backdrop-blur-sm" required minLength={8} />
                    <motion.button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </motion.button>
                  </div>
                  <p className="text-xs text-muted-foreground/60">Must be at least 8 characters</p>
                </motion.div>

                {error && (
                  <motion.div variants={itemVariants} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <ErrorMessage message={error} />
                  </motion.div>
                )}

                {/* Submit */}
                <motion.div variants={itemVariants} className="pt-1">
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02, boxShadow: "0 0 30px oklch(0.72 0.18 260 / 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
                  >
                    {isLoading ? <FlickerDots /> : (<>Create Account<ArrowRight className="w-4 h-4" /></>)}
                  </motion.button>
                </motion.div>

                {/* Divider */}
                <motion.div variants={itemVariants} className="relative my-2">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="px-3 text-muted-foreground/60">Or continue with</span></div>
                </motion.div>

                {/* Google */}
                <motion.div variants={itemVariants} className="flex justify-center">
                  <GoogleLogin onSuccess={handleGoogleSuccess} use_fedcm_for_prompt={false}
                    onError={() => { setError("Google sign in was unsuccessful"); toast({ variant: "destructive", title: "Google Login Failed", description: "Please try again later." }); }} />
                </motion.div>

                {/* Terms */}
                <motion.p variants={itemVariants} className="text-xs text-center text-muted-foreground/70">
                  By creating an account, you agree to our{" "}
                  <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors">Terms of Service</Link>{" "}and{" "}
                  <Link href="/privacy" className="text-primary hover:text-primary/80 transition-colors">Privacy Policy</Link>
                </motion.p>
              </motion.form>

              <motion.p variants={itemVariants} className="text-center text-muted-foreground text-sm mt-6">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary font-semibold hover:text-primary/80 transition-colors">Sign in</Link>
              </motion.p>
            </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={null}>
      <RegisterInner />
    </Suspense>
  );
}
