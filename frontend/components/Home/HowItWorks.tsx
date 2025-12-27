"use client"
import { motion } from "framer-motion";
import { Search, Calendar, Sparkles, ThumbsUp } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search",
    description: "Enter your location and find available cleaning services near you",
    color: "bg-primary",
  },
  {
    icon: Calendar,
    title: "Book",
    description: "Choose your preferred date, time, and customize your service",
    color: "bg-accent",
  },
  {
    icon: Sparkles,
    title: "Get Cleaned",
    description: "Our verified professionals arrive and make your space sparkle",
    color: "bg-primary",
  },
  {
    icon: ThumbsUp,
    title: "Review",
    description: "Rate your experience and help others find great service",
    color: "bg-accent",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Booking a cleaning service has never been easier. Just follow these simple steps.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative text-center"
              >
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center mb-6 shadow-card`}>
                    <step.icon className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-card border-2 border-border flex items-center justify-center font-display font-bold text-foreground">
                    {index + 1}
                  </div>
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm max-w-50 mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
