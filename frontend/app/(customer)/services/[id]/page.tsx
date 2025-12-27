"use client"
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Clock, MapPin, Shield, Check, ChevronLeft, Calendar, Phone, Mail, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

// Mock service data - in production, fetch from API
const serviceData = {
  id: 1,
  name: "Premium Home Cleaning",
  company: {
    name: "Sparkle Home Services",
    logo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100",
    verified: true,
    rating: 4.9,
    reviews: 324,
    phone: "+1 (555) 123-4567",
    email: "hello@sparklehome.com",
  },
  description: "Our Premium Home Cleaning service provides a thorough, top-to-bottom clean of your entire home. Using eco-friendly products and professional techniques, our trained staff will leave your space sparkling clean and fresh.",
  images: [
    "https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=800",
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400",
    "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=400",
  ],
  price: 85,
  duration: "2-3 hours",
  category: "Residential",
  location: "Serves Downtown & Surrounding Areas",
  features: [
    "All rooms dusted and vacuumed",
    "Kitchen deep cleaned",
    "Bathrooms sanitized",
    "Floors mopped",
    "Mirrors and glass cleaned",
    "Trash removal",
    "Eco-friendly products",
    "Satisfaction guaranteed",
  ],
  reviews: [
    {
      id: 1,
      user: "Sarah M.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
      rating: 5,
      date: "2 weeks ago",
      comment: "Absolutely amazing service! My apartment has never looked cleaner. The team was professional, punctual, and incredibly thorough.",
    },
    {
      id: 2,
      user: "James L.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100",
      rating: 5,
      date: "1 month ago",
      comment: "I've tried several cleaning services and this is by far the best. They pay attention to every detail. Highly recommend!",
    },
  ],
};

export default function ServiceDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Button variant="ghost" onClick={() => router.back} className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back to Services
            </Button>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl overflow-hidden"
              >
                <Image
                  src={serviceData.images[selectedImage]}
                  alt={serviceData.name}
                  width={200}
                  height={200}
                  className="w-full h-100 object-cover"
                />
              </motion.div>

              {/* Thumbnail Gallery */}
              <div className="flex gap-3">
                {serviceData.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={image} alt="" className="w-full h-full object-cover" width={200} height={200}/>
                  </button>
                ))}
              </div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-soft"
              >
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                  About This Service
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {serviceData.description}
                </p>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl p-6 shadow-soft"
              >
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                  Whats Included
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {serviceData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-accent" />
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Reviews */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card rounded-2xl p-6 shadow-soft"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Customer Reviews
                  </h2>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-primary text-primary" />
                    <span className="font-semibold text-foreground">{serviceData.company.rating}</span>
                    <span className="text-muted-foreground">({serviceData.company.reviews} reviews)</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {serviceData.reviews.map((review) => (
                    <div key={review.id} className="border-b border-border last:border-0 pb-6 last:pb-0">
                      <div className="flex items-start gap-4">
                        <Image
                          src={review.avatar}
                          alt={review.user}
                          width={200}
                          height={200}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-foreground">{review.user}</p>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                            ))}
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="sticky top-28 bg-card rounded-2xl p-6 shadow-card"
              >
                {/* Service Info */}
                <div className="mb-6">
                  <Badge variant="secondary" className="mb-3">{serviceData.category}</Badge>
                  <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                    {serviceData.name}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {serviceData.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {serviceData.location}
                    </div>
                  </div>
                </div>

                {/* Company Info */}
                <div className="border-y border-border py-4 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Image
                      src={serviceData.company.logo}
                      alt={serviceData.company.name}
                      width={200}
                      height={200}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{serviceData.company.name}</p>
                        {serviceData.company.verified && (
                          <Shield className="w-4 h-4 text-accent" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-3 h-3 fill-primary text-primary" />
                        <span className="text-foreground font-medium">{serviceData.company.rating}</span>
                        <span className="text-muted-foreground">({serviceData.company.reviews})</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Phone className="w-3 h-3" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Mail className="w-3 h-3" />
                      Message
                    </Button>
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-foreground">${serviceData.price}</span>
                    <span className="text-muted-foreground">/ session</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Price may vary based on property size
                  </p>
                </div>

                {/* Book Button */}
                <Button className="w-full mb-4" asChild>
                  <Link href={`/book/${serviceData.id}`}>
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Now
                  </Link>
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Free cancellation up to 24 hours before
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
