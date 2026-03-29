"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Star, label: "Verified Professionals" },
  { icon: Shield, label: "Secure Booking" },
  { icon: Clock, label: "Instant Confirmation" },
];

export function CTASection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Ambient outer glow */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.72 0.18 260 / 0.15), transparent 60%)" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 60 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl p-px"
          style={{
            background: "conic-gradient(from 180deg at 50% 50%, oklch(0.72 0.18 260), oklch(0.6 0.118 184), oklch(0.55 0.22 300), oklch(0.72 0.18 260))",
          }}
        >
          {/* Inner card */}
          <div className="relative rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-violet-700 p-8 md:p-12 lg:p-16 overflow-hidden">
            {/* Animated grid */}
            <motion.div
              animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: "linear-gradient(45deg, white 1px, transparent 1px), linear-gradient(-45deg, white 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Glow blobs inside the CTA */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/2 pointer-events-none" />
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute top-1/2 right-1/4 w-64 h-64 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none"
            />

            <div className="relative z-10 max-w-4xl mx-auto">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-xl text-white/90 text-sm font-semibold mb-8 border border-white/25 hover:bg-white/25 transition-colors cursor-pointer"
              >
                <motion.div animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}>
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                Join 50,000+ Happy Customers
              </motion.div>

              {/* Headline */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight"
              >
                Your Perfect Cleaning Service is{" "}
                <motion.span
                  animate={{ backgroundPosition: ["200% center", "-200% center"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="bg-gradient-to-r from-white via-cyan-200 to-white bg-[length:200%_100%] bg-clip-text text-transparent"
                >
                  Just a Tap Away
                </motion.span>
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 }}
                className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed max-w-2xl font-light"
              >
                Stop searching. Stop worrying. Book verified, professional cleaning services in seconds.
                No credit card required. Instantly confirmed. Completely hassle-free.
              </motion.p>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-5 mb-10 justify-center lg:justify-start"
              >
                {features.map((feature, i) => (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.07 }}
                    className="flex items-center gap-2.5 text-white/90 font-semibold"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
                      <feature.icon className="w-4 h-4 text-white" />
                    </div>
                    {feature.label}
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <motion.div whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 font-bold shadow-xl hover:shadow-2xl transition-shadow rounded-xl px-8 text-base"
                    asChild
                  >
                    <Link href="/auth/register">
                      Get Started Free
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="border-2 border-white/40 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/60 font-semibold rounded-xl px-8 transition-all text-base"
                    asChild
                  >
                    <Link href="/search">
                      Browse Services
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-12 pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-6 text-white/80 text-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-xs font-bold text-white backdrop-blur-sm">
                        {i}
                      </div>
                    ))}
                  </div>
                  <span>50K+ Customers Served</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-300 text-amber-300" />
                  ))}
                  <span className="ml-1">4.9 Rating</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
