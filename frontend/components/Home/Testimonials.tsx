"use client"
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image from "next/image";
const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Homeowner",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
    content: "SparkleFind has completely changed how I book cleaning services. The professionals are thorough, punctual, and incredibly friendly. My home has never looked better!",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Business Owner",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100",
    content: "As a restaurant owner, cleanliness is crucial. SparkleFind connected me with an amazing commercial cleaning team that understands our unique needs. Highly recommend!",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Apartment Renter",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100",
    content: "I used SparkleFind for my move-out cleaning and got my entire deposit back! The team was professional and left the apartment spotless. Will definitely use again.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dont just take our word for it. Heres what our satisfied customers have to say about their experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-soft relative"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />
              
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              <p className="text-foreground mb-6 relative z-10">
                {testimonial.content}
              </p>

              <div className="flex items-center gap-3">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={200}
                  height={200}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
