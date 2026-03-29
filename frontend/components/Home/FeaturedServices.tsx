"use client";
import { motion, useInView } from "framer-motion";
import { Star, Clock, ArrowRight, Home, Building2, Sparkles, Truck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";

const services = [
  { id: 1, name: "Residential Cleaning", description: "Professional home cleaning tailored to your lifestyle and schedule", icon: Home, image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=400", price: "From $80", duration: "2-4 hours", rating: 4.9, reviews: 2340, badge: "Popular", color: "from-violet-500 to-primary" },
  { id: 2, name: "Commercial Cleaning", description: "Keep your workspace spotless, professional, and welcoming", icon: Building2, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400", price: "From $150", duration: "3-6 hours", rating: 4.8, reviews: 1820, badge: "For Teams", color: "from-cyan-500 to-blue-600" },
  { id: 3, name: "Deep Cleaning", description: "Thorough, intensive cleaning for a complete refresh", icon: Sparkles, image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=400", price: "From $200", duration: "4-8 hours", rating: 4.9, reviews: 1560, badge: "Deep Clean", color: "from-emerald-500 to-teal-600" },
  { id: 4, name: "Move-In/Out Cleaning", description: "Professional cleanings perfectly timed for your move", icon: Truck, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400", price: "From $250", duration: "5-8 hours", rating: 4.8, reviews: 980, badge: "Moving", color: "from-amber-500 to-orange-600" },
];

export function FeaturedServices() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.72 0.18 260 / 0.12), transparent 70%)" }}
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-10 left-1/4 w-80 h-80 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.6 0.118 184 / 0.1), transparent 70%)" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 space-y-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm"
          >
            <Zap className="w-4 h-4" />
            Wide Range of Services
          </motion.div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            Popular <span className="text-gradient">Cleaning Services</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
            Choose from our professionally curated services designed for every situation
          </p>
        </motion.div>

        {/* Services Grid */}
        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
              whileHover={{ y: -12 }}
              className="group"
            >
              <Link href={`/search?service=${service.name}`} className="block h-full">
                <div className={`relative bg-card/60 backdrop-blur-xl rounded-2xl overflow-hidden border shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-400 h-full flex flex-col ${
                  service.badge === 'Popular' ? 'neon-card hover:border-primary/60' : 'border-white/10 hover:border-primary/40'
                }`}>
                  {/* Inner glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-cyan-500/5 transition-all duration-500 z-0 rounded-2xl" />

                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-600"
                      width={300}
                      height={200}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Badge */}
                    {service.badge && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-primary/90 backdrop-blur-md text-white text-xs font-bold rounded-full shadow-lg">
                        {service.badge}
                      </div>
                    )}

                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`absolute top-3 right-3 w-10 h-10 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg`}
                    >
                      <service.icon className="w-5 h-5 text-white" />
                    </motion.div>

                    {/* Rating */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 glass-neon px-2.5 py-1 rounded-full">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-foreground text-xs">{service.rating}</span>
                      <span className="text-xs text-muted-foreground">({service.reviews})</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col relative z-10">
                    <h3 className="font-display font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-1 font-light">{service.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div>
                        <p className="font-bold text-primary">{service.price}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <Clock className="w-3 h-3" />{service.duration}
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 45 }}
                        className="w-9 h-9 rounded-full bg-primary/10 group-hover:bg-primary flex items-center justify-center transition-all duration-300"
                      >
                        <ArrowRight className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" className="rounded-xl font-semibold group bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25" asChild>
              <Link href="/search">
                View All Services
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
