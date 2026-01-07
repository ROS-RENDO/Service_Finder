"use client"
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, User, Building2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";
import Image from "next/image";
import { FlickerDots } from "@/components/common/FlickerDots";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { useAuthContext } from "@/lib/contexts/AuthContext";


const roles = [
  {
    id: "customer",
    name: "Customer",
    description: "Book cleaning services for your home or office",
    icon: User,
  },
  {
    id: "company_admin",
    name: "Company Admin",
    description: "Manage your cleaning business and staff",
    icon: Building2,
  },
  {
    id: "staff",
    name: "Staff Member",
    description: "Join a cleaning team and manage your schedule",
    icon: Users,
  },
];


export default function Register() {
  const [selectedRole, setSelectedRole] = useState("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { register } = useAuthContext();
  const [error, setError] = useState('');
  const searchParams= useSearchParams();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  })

  const redirectTo = searchParams.get('redirect')

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  setError("")

  if (!selectedRole) {
    setError("Please select a role")
    setIsLoading(false)
    return
  }

  try {
    const result = await register({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: selectedRole,
    })

    if (!result.success) {
      setError(result.error || "Registration failed")
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: result.error || "Please try again",
      })
      setIsLoading(false)
      return
    }

    toast({
      title: "Account created!",
      description: "Welcome to SparkleFind. Let's get started!",
    })

    // Small delay to ensure cookie is set
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Redirect based on role or optional redirect
    if (redirectTo) {
      router.push(redirectTo)
    } else {
      switch (result.user.role) {
        case "customer":
          router.push("/customer/dashboard")
          break
        case "company_admin":
          router.push("/company/dashboard")
          break
        case "staff":
          router.push("/staff/dashboard")
          break
        case "admin":
          router.push("/admin/dashboard")
          break
        default:
          router.push("/")
      }
    }

    // Force reload to trigger middleware
    router.refresh()
  } catch (err) {
    setError("Registration failed")
    toast({
      variant: "destructive",
      title: "Registration failed",
      description: "Please try again",
    })
  } finally {
    setIsLoading(false)
  }
}


  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Image */}
      <div className="hidden lg:block flex-1 relative">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <Image
          src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=800"
          alt="Clean space"
          className="w-full h-full object-cover"
          width={200}
          height={200}
        />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-primary-foreground">
            <h2 className="font-display text-4xl font-bold mb-4">
              Join Our Community
            </h2>
            <p className="text-primary-foreground/80 max-w-md">
              Whether youre looking for cleaning services or want to grow your cleaning business, weve got you covered.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md py-8"
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

          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Create your account
          </h1>
          <p className="text-muted-foreground mb-8">
            Get started with SparkleFind today
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label>I am a...</Label>
              <div className="grid gap-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      selectedRole === role.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      selectedRole === role.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                    }`}>
                      <role.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{role.name}</p>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="pl-10 pr-10 h-12"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
            </div>

            {error && <ErrorMessage message={error}/>}

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? <FlickerDots/> : "Create Account"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </p>
          </form>

          <p className="text-center text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
