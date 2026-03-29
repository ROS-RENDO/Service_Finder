"use client";
import { motion, useInView } from "framer-motion";
import { Star, Quote, Verified } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

const testimonials = [
  { id: 1, name: "Sarah Mitchell", role: "Homeowner, San Francisco", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&fit=crop", content: "Game-changer! I booked a deep cleaning service in minutes and the professional was punctual, thorough, and left my home absolutely spotless. Worth every penny!", rating: 5, verified: true, saved: "$250" },
  { id: 2, name: "Michael Chen", role: "Restaurant Owner, Los Angeles", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&fit=crop", content: "As a restaurant owner, finding consistent, reliable commercial cleaners was impossible—until now. The app connected me with a fantastic team that understands our standards.", rating: 5, verified: true, saved: "$1,500/month" },
  { id: 3, name: "Emily Rodriguez", role: "Apartment Renter, New York", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&fit=crop", content: "Used the app for move-out cleaning and got my entire security deposit back! The team was professional, efficient, and I got the service 24 hours before my deadline.", rating: 5, verified: true, saved: "$850" },
  { id: 4, name: "James Patel", role: "Property Manager, Austin", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&h=100&fit=crop", content: "Managing multiple properties was a nightmare until I found this platform. Now I can schedule cleaners for all units, track progress, and manage payments seamlessly.", rating: 5, verified: true, saved: "$3,000/month" },
  { id: 5, name: "Lisa Yang", role: "Busy Professional, Seattle", avatar: "https://images.unsplash.com/photo-1507495341328-5f962bb8d804?q=80&w=100&h=100&fit=crop", content: "No more calling around for cleaning services. I schedule everything through the app with my phone. The quality is consistent and the cleaners are always vetted and friendly.", rating: 5, verified: true, saved: "$400" },
  { id: 6, name: "David Thompson", role: "Executive, Boston", avatar: "https://images.unsplash.com/photo-1500307763869-36ab46eae359?q=80&w=100&h=100&fit=crop", content: "The professional quality of service combined with the convenience factor is unmatched. My home is always pristine, and I rarely had to reschedule. Absolutely brilliant!", rating: 5, verified: true, saved: "$600" },
];

export function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-80px" });

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-10 right-20 w-80 h-80 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.7 0.17 162 / 0.15), transparent 70%)" }}
        />
        <motion.div
          animate={{ opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, delay: 3 }}
          className="absolute bottom-20 left-10 w-72 h-72 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.72 0.18 260 / 0.12), transparent 70%)" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 space-y-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 font-medium text-sm"
          >
            <Star className="w-4 h-4 fill-current" />
            5.0 Rating from 8,000+ reviews
          </motion.div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            Loved by <span className="text-gradient">Thousands</span> of Happy Customers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
            See why thousands choose our platform for their professional services
          </p>
        </motion.div>

        {/* Grid */}
        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              whileHover={{ y: -8 }}
              className="group relative bg-card/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-primary/30 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-400"
            >
              {/* Subtle glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500" />

              {/* Quote decoration */}
              <Quote className="absolute top-5 right-5 w-8 h-8 text-primary/8 group-hover:text-primary/15 transition-colors" />

              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: index * 0.1 + 0.2 + i * 0.05 }}
                  >
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </motion.div>
                ))}
                <span className="ml-1.5 text-xs font-semibold text-foreground">{t.rating}.0</span>
              </div>

              {/* Content */}
              <p className="text-foreground/90 mb-5 relative z-10 leading-relaxed text-sm font-light">
                &ldquo;{t.content}&rdquo;
              </p>

              {/* Saved Badge */}
              {t.saved && (
                <div className="mb-4 inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">
                  💰 Saved {t.saved}
                </div>
              )}

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10 relative z-10">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={48}
                  height={48}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-foreground text-sm truncate">{t.name}</p>
                    {t.verified && <Verified className="w-3.5 h-3.5 fill-primary text-primary flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center pt-4"
        >
          <p className="text-muted-foreground mb-5 font-light">Ready to experience the same quality?</p>
          <motion.a
            href="/search"
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px oklch(0.72 0.18 260 / 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-3.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl font-semibold shadow-lg shadow-primary/25 transition-shadow"
          >
            Book Your Service Today →
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
