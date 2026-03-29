"use client";
import { CheckCircle2, Zap, Shield, Star, Clock, Lock, Award, Sparkles, ThumbsUp, Globe } from "lucide-react";

const items = [
  { icon: CheckCircle2, text: "50,000+ Customers Served" },
  { icon: Zap, text: "Instant Booking Available" },
  { icon: Shield, text: "All Professionals Verified" },
  { icon: Star, text: "4.9 / 5 Average Rating" },
  { icon: Clock, text: "Same-Day Service Available" },
  { icon: Lock, text: "Secure Payment Processing" },
  { icon: Award, text: "Award-Winning Platform" },
  { icon: Globe, text: "Available in 50+ Cities" },
  { icon: Sparkles, text: "Premium Service Quality" },
  { icon: ThumbsUp, text: "98% Satisfaction Rate" },
];

// Duplicate for seamless infinite loop
const doubled = [...items, ...items];

export function TrustBar() {
  return (
    <div className="relative py-5 overflow-hidden border-y border-white/8">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

      {/* Scrolling track */}
      <div className="flex animate-marquee gap-0">
        {doubled.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 px-6 shrink-0 text-muted-foreground/70 hover:text-foreground transition-colors"
          >
            <item.icon className="w-3.5 h-3.5 text-primary/70 shrink-0" />
            <span className="text-sm font-medium whitespace-nowrap">{item.text}</span>
            {/* Separator dot */}
            <span className="ml-3 w-1 h-1 rounded-full bg-primary/30 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
