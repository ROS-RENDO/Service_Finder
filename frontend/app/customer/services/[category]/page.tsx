"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Home,
  ArrowRight,
  ArrowLeft,
  X,
  Car,
  Heart,
  Dumbbell,
  Scissors,
  Briefcase,

} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  useServiceTypesByCategory,
} from "@/lib/hooks/useServiceTypes";

import { serviceTypeVisual } from "@/lib/visuals/serviceTypeVisuals";
import { LoadingCard } from "@/components/common/LoadingCard";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { categoryVisual } from "@/lib/visuals/categoryVisuals";


export default function ServiceTypesPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.category as string;
  const { serviceTypes, category, loading, error, refetch } = useServiceTypesByCategory(categoryId);
  const [searchQuery, setSearchQuery] = useState("");

  if (loading) return <LoadingCard/>
  if (error) return <ErrorMessage message={error}/>

  const categoryData = categoryVisual.find(v => v.slug === categoryId);
   const CategoryIcon = categoryData?.icon || Home;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-2">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div
            className={`bg-gradient-to-r ${categoryData?.gradient} text-white py-12`}
          >
            <div className="container mx-auto px-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/customer/services")}
                className="mb-6 text-white hover:bg-white/20 hover:text-white -ml-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Categories
              </Button>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <CategoryIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <Badge className="bg-white/20 text-white border-white/30 mb-2">
                      Step 2 of 3 • Choose a Service Type
                    </Badge>
                    <h1 className="font-display text-2xl md:text-3xl font-bold">
                      {categoryData?.name}
                    </h1>
                  </div>
                </div>

                {/* Search */}
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search service types..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-12 h-12 rounded-xl bg-white text-foreground border-0"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Service Type Cards */}
          <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {serviceTypes.map((service, index) => {
                const visual = serviceTypeVisual.find(v => v.slug === service.slug)
                if (!visual) return null;
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={`/customer/services/${categoryId}/${service.slug}`}
                    >
                      <div className="group relative h-64 rounded-3xl overflow-hidden text-left shadow-card hover:shadow-elevated transition-all duration-500 cursor-pointer">
                        <div className="absolute inset-0">
                          <Image
                            width={400}
                            height={300}
                            src={visual.image}
                            alt={service.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div
                            className={`absolute inset-0 bg-gradient-to-t ${visual.gradient} via-transparent from-black/80 to-transparent`}
                          />
                        </div>

                        <div className="relative h-full flex flex-col justify-end p-5 text-white">
                          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                            <visual.icon className="w-5 h-5" />
                          </div>

                          <h3 className="font-display font-bold text-lg mb-1">
                            {service.name}
                          </h3>
                          <p className="text-white/80 text-sm mb-3 line-clamp-2">
                            {service.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-white/70">
                              {service.companiesCount} providers
                            </span>
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all duration-300">
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {serviceTypes.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  No service types match {searchQuery}
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try a different search term
                </p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear search
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
