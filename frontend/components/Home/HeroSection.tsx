"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Sparkles, Star, Shield, Clock, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Image from "next/image";

const stats = [
  { icon: Star, label: "4.9 Rating", value: "50K+ Reviews" },
  { icon: Shield, label: "Verified", value: "2,000+ Pros" },
  { icon: Clock, label: "Fast Booking", value: "Same Day" },
];

const benefits = ["Verified professionals", "Best price guarantee", "24/7 customer support"];

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Primary neon orb */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-[5%] w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.72 0.18 260 / 0.25), transparent 65%)" }}
        />
        {/* Cyan orb */}
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-20 left-[5%] w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.6 0.118 184 / 0.2), transparent 65%)" }}
        />
        {/* Subtle purple accent */}
        <motion.div
          animate={{ opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.55 0.22 300 / 0.12), transparent 60%)" }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.06]"
          style={{
            backgroundImage: "linear-gradient(oklch(0.72 0.18 260 / 1) 1px, transparent 1px), linear-gradient(90deg, oklch(0.72 0.18 260 / 1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
            >
              <motion.div animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}>
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span>Trusted by 50,000+ customers</span>
            </motion.div>

            {/* Headline */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
              className="space-y-2"
            >
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                Find the{" "}
                <span className="relative inline-block">
                  <span className="text-gradient">Perfect</span>
                  <motion.span
                    className="absolute -bottom-2 left-0 h-[3px] bg-gradient-to-r from-primary via-cyan-400 to-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1, duration: 0.8 }}
                  />
                </span>{" "}
                Service Near You
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="text-lg lg:text-xl text-muted-foreground max-w-lg leading-relaxed font-light"
            >
              Connect with verified cleaning professionals in your area. Book residential, commercial, or specialty cleaning services instantly.
            </motion.p>

            {/* Benefits */}
            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
              className="flex flex-col gap-2"
            >
              {benefits.map((benefit) => (
                <motion.div
                  key={benefit}
                  variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                  className="flex items-center gap-3 text-foreground"
                >
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 ring-1 ring-primary/30"
                  >
                    <Check className="w-3 h-3 text-primary" />
                  </motion.div>
                  <span className="text-sm">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Search Form */}
            <motion.form
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              onSubmit={handleSearch}
              className="space-y-3"
            >
              <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-card/60 backdrop-blur-xl border border-white/20 shadow-2xl">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  <Input
                    type="text"
                    placeholder="What service are you looking for?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 bg-transparent border-0 focus:ring-0 focus:outline-none text-foreground placeholder:text-muted-foreground/60"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSearching}
                  className="h-12 px-6 rounded-xl font-semibold group bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/30"
                >
                  <Search className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  {isSearching ? "Searching..." : "Search"}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground/60 pl-2">
                No credit card required · Instant booking · 100% safe &amp; secure
              </p>
            </motion.form>

            {/* Stats */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="grid grid-cols-3 gap-3"
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -5, boxShadow: "0 8px 30px oklch(0.72 0.18 260 / 0.2)" }}
                  className="p-4 rounded-2xl bg-card/50 backdrop-blur-xl border border-white/10 hover:border-primary/30 transition-all cursor-default"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mb-2">
                    <stat.icon className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                  <p className="font-bold text-foreground text-sm mt-0.5">{stat.value}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/30 via-cyan-400/20 to-primary/30 blur-xl scale-105 opacity-50" />

            <div className="relative group">
              <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&fit=crop"
                  width={600}
                  height={800}
                  alt="Professional cleaning service"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Floating Card 1 */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-8 top-16 glass-neon rounded-2xl p-4 shadow-2xl max-w-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">100% Verified</p>
                    <p className="text-xs text-muted-foreground">Background checked</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Card 2 */}
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -right-6 bottom-16 glass-neon rounded-2xl p-4 shadow-2xl max-w-xs"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 + i * 0.1 }}>
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-sm font-semibold text-foreground">Excellent service!</p>
                <p className="text-xs text-muted-foreground">Trusted by thousands</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
