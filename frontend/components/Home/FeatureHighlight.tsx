"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Zap, Shield, Star, Check, CheckCircle2, Search,
  Clock, Home, MapPin, Bell,
} from "lucide-react";

/* ─────── Inline visual mockups ─────── */
function BookingVisual() {
  return (
    <div className="relative p-5 rounded-2xl bg-card/80 backdrop-blur-xl neon-card space-y-3 max-w-xs mx-auto">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider">Quick Book</span>
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-emerald-400"
        />
      </div>
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
        <Search className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Deep cleaning...</span>
      </div>
      {[
        { label: "Residential", sub: "From $80", active: true },
        { label: "Commercial", sub: "From $150", active: false },
        { label: "Deep Clean", sub: "From $200", active: false },
      ].map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 + 0.5 }}
          className={`flex items-center justify-between p-2.5 rounded-xl ${s.active ? "bg-primary/20 border border-primary/40" : "bg-white/5 border border-white/5"}`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${s.active ? "bg-primary" : "bg-white/10"}`}>
              <Home className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">{s.label}</p>
              <p className="text-[10px] text-muted-foreground">{s.sub}</p>
            </div>
          </div>
          {s.active && (
            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </motion.div>
      ))}
      <motion.div
        animate={{ boxShadow: ["0 0 0 0 oklch(0.72 0.18 260 / 0.4)", "0 0 0 8px oklch(0.72 0.18 260 / 0)", "0 0 0 0 oklch(0.72 0.18 260 / 0.4)"] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white text-xs font-bold text-center"
      >
        ✓ Booked Instantly
      </motion.div>
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute -top-3 -right-3 px-2.5 py-1 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40 text-white text-[10px] font-bold"
      >
        ⚡ 45 sec
      </motion.div>
    </div>
  );
}

function TrackingVisual() {
  return (
    <div className="relative p-5 rounded-2xl bg-card/80 backdrop-blur-xl neon-card-cyan space-y-3 max-w-xs mx-auto overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "linear-gradient(oklch(0.6 0.118 184 / 0.8) 1px, transparent 1px), linear-gradient(90deg, oklch(0.6 0.118 184 / 0.8) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="flex items-center gap-2 relative z-10">
        <motion.div
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-3 h-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50"
        />
        <span className="text-xs font-bold text-emerald-400">Professional On the Way</span>
      </div>
      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 relative z-10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-white text-xs font-bold">JS</div>
        <div>
          <p className="text-xs font-semibold text-foreground">Jane Smith</p>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />)}
          </div>
        </div>
        <div className="ml-auto"><Bell className="w-4 h-4 text-muted-foreground" /></div>
      </div>
      <div className="text-center relative z-10">
        <motion.p
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="font-display text-4xl font-bold text-cyan-400"
        >12</motion.p>
        <p className="text-xs text-muted-foreground">minutes away</p>
      </div>
      <div className="flex items-center gap-1.5 justify-center relative z-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
            className={`rounded-full ${i === 0 ? "bg-cyan-400 w-3 h-3" : i === 4 ? "bg-primary w-2 h-2" : "bg-white/20 w-2 h-2"}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground relative z-10">
        <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-cyan-400" /> Current loc</div>
        <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-primary" /> Your address</div>
      </div>
    </div>
  );
}

function TrustVisual() {
  const badges = ["Background Check", "ID Verified", "Insured & Bonded", "5★ Rating"];
  return (
    <div className="relative p-5 rounded-2xl bg-card/80 backdrop-blur-xl neon-card-emerald space-y-4 max-w-xs mx-auto">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">A</div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-background flex items-center justify-center"
          >
            <Check className="w-2.5 h-2.5 text-white" />
          </motion.div>
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">Alex Johnson</p>
          <div className="flex items-center gap-0.5 mt-0.5">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
            <span className="text-xs text-muted-foreground ml-1">5.0</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">247 jobs completed</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {badges.map((badge, i) => (
          <motion.div
            key={badge}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.15 + 0.5 }}
            className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="text-[10px] text-emerald-400 font-semibold leading-tight">{badge}</span>
          </motion.div>
        ))}
      </div>
      <div>
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
          <span>Trust Score</span><span className="text-emerald-400 font-bold">98/100</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "98%" }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
          />
        </div>
      </div>
    </div>
  );
}

/* ─────── Feature rows — refs declared at top level ─────── */
type FeatureDef = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  visual: React.ReactNode;
  flip: boolean;
  color: "primary" | "cyan" | "emerald";
};

const features: FeatureDef[] = [
  {
    eyebrow: "Speed",
    title: "Book in Under 60 Seconds",
    description: "No calls, no waiting lists. Search verified professionals, compare prices, and confirm your booking instantly — all from your device in under a minute.",
    bullets: ["Real-time availability calendar", "Instant confirmation SMS", "No credit card required to browse"],
    visual: <BookingVisual />,
    flip: false,
    color: "primary",
  },
  {
    eyebrow: "Transparency",
    title: "Live Tracking & Smart Alerts",
    description: "Know exactly when your professional arrives. Get live status updates, ETA countdowns, and direct chat — no guesswork, no anxiety, no phone calls.",
    bullets: ["Live map tracking", "ETA push notifications", "In-app chat with your pro"],
    visual: <TrackingVisual />,
    flip: true,
    color: "cyan",
  },
  {
    eyebrow: "Trust",
    title: "Every Pro is Vetted & Insured",
    description: "We background-check, verify identity, and review every professional before they ever take a booking. Your home and family are in safe hands — guaranteed.",
    bullets: ["Criminal background check", "ID & insurance verified", "Backed by SparkleFind guarantee"],
    visual: <TrustVisual />,
    flip: false,
    color: "emerald",
  },
];

const colorMap = {
  primary: { badge: "bg-primary/10 text-primary border-primary/20", bullet: "bg-primary" },
  cyan:    { badge: "bg-cyan-400/10 text-cyan-400 border-cyan-400/20", bullet: "bg-cyan-400" },
  emerald: { badge: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20", bullet: "bg-emerald-400" },
};

/* Individual feature row — hooks called at top level of component */
function FeatureRow({ f, index }: { f: FeatureDef; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  const c = colorMap[f.color];

  return (
    <div ref={ref} className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center`}>
      {/* Text side */}
      <motion.div
        initial={{ opacity: 0, x: f.flip ? 60 : -60 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: f.flip ? 60 : -60 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={f.flip ? "lg:order-2" : ""}
      >
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${c.badge} mb-5`}>
          <Zap className="w-3 h-3" />
          {f.eyebrow}
        </span>
        <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-5 leading-tight">{f.title}</h3>
        <p className="text-muted-foreground leading-relaxed mb-8 font-light text-lg">{f.description}</p>
        <ul className="space-y-3">
          {f.bullets.map((b, bi) => (
            <motion.li
              key={b}
              initial={{ opacity: 0, x: -15 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
              transition={{ duration: 0.4, delay: bi * 0.1 + 0.3 }}
              className="flex items-center gap-3 text-foreground/90"
            >
              <div className={`w-5 h-5 rounded-full ${c.bullet} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium">{b}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Visual side */}
      <motion.div
        initial={{ opacity: 0, x: f.flip ? -60 : 60, scale: 0.9 }}
        animate={inView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: f.flip ? -60 : 60, scale: 0.9 }}
        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        className={`flex justify-center ${f.flip ? "lg:order-1" : ""}`}
      >
        <div className="relative">
          <div className={`absolute inset-0 -m-8 rounded-3xl blur-3xl opacity-20 ${
            f.color === "primary" ? "bg-primary" : f.color === "cyan" ? "bg-cyan-400" : "bg-emerald-400"
          }`} />
          <div className="relative">{f.visual}</div>
        </div>
      </motion.div>
    </div>
  );
}

export function FeatureHighlight() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, oklch(0.72 0.18 260 / 1), transparent)" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20 space-y-4"
        >
          <p className="text-muted-foreground/60 text-xs font-semibold uppercase tracking-[0.3em]">Why SparkleFind</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            Built Different,<br /><span className="text-gradient">Built for You</span>
          </h2>
        </motion.div>

        <div className="space-y-28">
          {features.map((f, i) => <FeatureRow key={f.eyebrow} f={f} index={i} />)}
        </div>
      </div>
    </section>
  );
}
