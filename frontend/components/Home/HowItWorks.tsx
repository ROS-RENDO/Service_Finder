"use client";
import { motion, useInView } from "framer-motion";
import { Search, Calendar, Sparkles, ThumbsUp, ArrowRight } from "lucide-react";
import { useRef } from "react";

const steps = [
  { icon: Search, title: "Search", description: "Enter your location and browse verified professionals near you", color: "from-violet-500 to-primary", glow: "oklch(0.72 0.18 260 / 0.4)" },
  { icon: Calendar, title: "Book", description: "Choose your date, time, and customize your service requirements", color: "from-cyan-500 to-blue-600", glow: "oklch(0.6 0.118 184 / 0.4)" },
  { icon: Sparkles, title: "Connect", description: "Get notifications and chat directly with your service professional", color: "from-violet-500 to-indigo-600", glow: "oklch(0.55 0.22 280 / 0.4)" },
  { icon: ThumbsUp, title: "Review", description: "Rate your experience and help others find excellent services", color: "from-emerald-500 to-teal-600", glow: "oklch(0.7 0.17 162 / 0.4)" },
];

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <section id="how-it-works" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{ x: [0, 15, 0], y: [0, -15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-[-5%] w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.72 0.18 260 / 0.08), transparent 70%)" }}
        />
        <motion.div
          animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-[-5%] w-96 h-96 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.6 0.118 184 / 0.08), transparent 70%)" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20 space-y-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm"
          >
            <Sparkles className="w-4 h-4" />
            Getting Started is Simple
          </motion.div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            How It Works in{" "}
            <span className="text-gradient">4 Simple Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
            Book a service in minutes. Our intuitive process makes finding and booking the perfect professional easier than ever.
          </p>
        </motion.div>

        {/* Steps */}
        <div ref={ref} className="relative">
          {/* Connection line (desktop) */}
          <div className="hidden lg:block absolute top-[56px] left-[12.5%] right-[12.5%] h-px">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
              className="origin-left h-full bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-500 opacity-30 rounded-full"
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="relative bg-card/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center text-center overflow-hidden">
                  {/* Background glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${step.glow}, transparent 70%)` }}
                  />

                  {/* Step Icon circle */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ delay: index * 0.15 + 0.3, type: "spring", stiffness: 200 }}
                    className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-lg z-10`}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                  >
                    <step.icon className="w-7 h-7 text-white" />
                    {/* Step number badge */}
                    <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center text-[10px] font-bold text-primary">
                      {index + 1}
                    </div>
                  </motion.div>

                  <h3 className="font-display font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors relative z-10">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-light relative z-10">{step.description}</p>

                  {/* Arrow connector */}
                  {index < steps.length - 1 && (
                    <motion.div
                      animate={{ x: [0, 8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      className="hidden lg:flex absolute -right-5 top-[56px] z-20 w-10 h-10 items-center justify-center"
                    >
                      <div className="w-6 h-6 rounded-full bg-card border border-primary/30 flex items-center justify-center shadow-lg">
                        <ArrowRight className="w-3 h-3 text-primary" />
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16 pt-10 border-t border-white/10"
        >
          <p className="text-muted-foreground mb-6 font-light">Ready to get started? Join thousands of satisfied customers today.</p>
          <motion.a
            href="/search"
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px oklch(0.72 0.18 260 / 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl font-semibold shadow-lg shadow-primary/30 transition-shadow"
          >
            Get Started Now
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
