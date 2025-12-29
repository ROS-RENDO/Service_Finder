"use client"
import { motion } from "framer-motion";
import { Star, Clock, ArrowRight, Home, Building2, Sparkles, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const services = [
  {
    id: 1,
    name: "Residential Cleaning",
    description: "Professional home cleaning tailored to your needs",
    icon: Home,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=400",
    price: "From $80",
    duration: "2-4 hours",
    rating: 4.9,
    reviews: 2340,
    category: "residential",
  },
  {
    id: 2,
    name: "Commercial Cleaning",
    description: "Keep your workspace spotless and professional",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400",
    price: "From $150",
    duration: "3-6 hours",
    rating: 4.8,
    reviews: 1820,
    category: "commercial",
  },
  {
    id: 3,
    name: "Deep Cleaning",
    description: "Thorough cleaning for a fresh start",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=400",
    price: "From $200",
    duration: "4-8 hours",
    rating: 4.9,
    reviews: 1560,
    category: "deep",
  },
  {
    id: 4,
    name: "Move-In/Out Cleaning",
    description: "Start fresh in your new space",
    icon: Truck,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400",
    price: "From $250",
    duration: "5-8 hours",
    rating: 4.8,
    reviews: 980,
    category: "move",
  },
];

export function FeaturedServices() {
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
            Popular Cleaning Services
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from our wide range of professional cleaning services designed to meet your specific needs
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`company/services/${service.id}`}
                className="group block bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    width={200}
                    height={200}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-1 text-primary-foreground">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-semibold">{service.rating}</span>
                      <span className="text-sm opacity-80">({service.reviews})</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-card/90 backdrop-blur flex items-center justify-center">
                    <service.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-primary">{service.price}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {service.duration}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button size="lg" asChild>
            <Link href="/services">
              View All Services
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
