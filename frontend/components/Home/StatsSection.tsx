"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Shield, ThumbsUp, Star } from "lucide-react";

function CountUp({ end, decimals = 0, suffix = "" }: { end: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) { setValue(0); return; }
    const duration = 2000;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * end).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, end, decimals]);

  return (
    <span ref={ref}>
      {decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toLocaleString()}
      {suffix}
    </span>
  );
}

const stats = [
  { icon: Users, value: 50000, suffix: "+", label: "Happy Customers", sub: "Across 50+ cities", neon: "neon-card", iconGrad: "from-violet-500 to-primary", decimals: 0 },
  { icon: Shield, value: 2000, suffix: "+", label: "Verified Pros", sub: "Background checked", neon: "neon-card-cyan", iconGrad: "from-cyan-500 to-blue-600", decimals: 0 },
  { icon: ThumbsUp, value: 98, suffix: "%", label: "Satisfaction Rate", sub: "Industry-leading", neon: "neon-card-emerald", iconGrad: "from-emerald-500 to-teal-600", decimals: 0 },
  { icon: Star, value: 4.9, suffix: "★", label: "Average Rating", sub: "From 8,000+ reviews", neon: "neon-card-amber", iconGrad: "from-amber-400 to-orange-500", decimals: 1 },
];

export function StatsSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(ellipse, oklch(0.72 0.18 260 / 1), transparent 70%)" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-muted-foreground/60 text-xs font-semibold uppercase tracking-[0.3em] mb-3">By The Numbers</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Trusted by <span className="text-gradient">Tens of Thousands</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className={`${stat.neon} relative bg-card/70 backdrop-blur-xl rounded-2xl p-7 text-center overflow-hidden cursor-default transition-transform`}
            >
              {/* Inner ambient */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent" />

              {/* Icon */}
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, delay: i * 0.5 }}
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.iconGrad} flex items-center justify-center mx-auto mb-4 shadow-lg`}
              >
                <stat.icon className="w-7 h-7 text-white" />
              </motion.div>

              {/* Animated Number */}
              <div className="font-display text-4xl md:text-5xl font-bold text-foreground mb-1">
                <CountUp end={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
              </div>

              <p className="font-semibold text-foreground/90 mb-1">{stat.label}</p>
              <p className="text-xs text-muted-foreground">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
