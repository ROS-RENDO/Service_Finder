"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, User, LogIn, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthContext } from "@/lib/contexts/AuthContext";
import { useTheme } from "next-themes";

const navLinks = [
  { name: "Services", href: "/services" },
  { name: "Explore Map", href: "/customer/map" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About", href: "/#about" },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-8 h-8" />;

  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-secondary/60 hover:bg-secondary border border-border/50 transition-colors"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="w-4 h-4 text-amber-400" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="w-4 h-4 text-primary" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = usePathname();
  const { isAuthenticated, user } = useAuthContext();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dashboardPath = user
    ? `/${user.role === "customer" ? "customer" : user.role === "company_admin" ? "company" : user.role === "staff" ? "staff" : "admin"}/dashboard`
    : "/";

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass shadow-lg shadow-black/10 dark:shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/30"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <span className="font-display font-bold text-xl text-foreground">
              Sparkle<span className="text-primary">Find</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors relative group ${
                  location === link.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary rounded-full transition-all duration-300 ${location === link.href ? "w-full" : "w-0 group-hover:w-full"}`} />
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <Button asChild size="sm" className="rounded-xl">
                <Link href={dashboardPath}>
                  <User className="w-4 h-4 mr-1" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild size="sm" className="rounded-xl">
                  <Link href="/auth/login">
                    <LogIn className="w-4 h-4 mr-1" />
                    Login
                  </Link>
                </Button>
                <Button asChild size="sm" className="rounded-xl bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25">
                  <Link href="/auth/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile buttons */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl hover:bg-secondary transition-colors"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass border-t border-border/30 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block py-2.5 px-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 font-medium transition-all"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-3 flex flex-col gap-2 border-t border-border/30 mt-2">
                {isAuthenticated ? (
                  <Button asChild className="w-full rounded-xl">
                    <Link href={dashboardPath} onClick={() => setIsOpen(false)}>
                      <User className="w-4 h-4 mr-1" />
                      Dashboard
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" asChild className="w-full rounded-xl">
                      <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                        <LogIn className="w-4 h-4 mr-1" />
                        Login
                      </Link>
                    </Button>
                    <Button asChild className="w-full rounded-xl bg-gradient-to-r from-primary to-primary/80">
                      <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
