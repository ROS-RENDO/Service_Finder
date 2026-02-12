"use client"
import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Search, Home, Car, Heart, Briefcase, Scissors, Dumbbell,
  ArrowRight, X
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCategories } from "@/lib/hooks/useCategories";
import Image from "next/image";
import { LoadingCard } from "@/components/common/LoadingCard";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { categoryVisual } from "@/lib/visuals/categoryVisuals";

// Categories (Level 1)


export default function ServicesPage() {
  const searchParams = useSearchParams();

  const { categories, loading, error, refetch }= useCategories();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  
  
  if (loading) return <LoadingCard/>
if (error) return <ErrorMessage message={error}/>

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          >
          {/* Hero Section */}
          <div className="bg-gradient-hero text-white py-16 md:py-24 mb-12">
            <div className="container mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Badge className="bg-white/20 text-white border-white/30 mb-4">
                  Step 1 of 3 • Choose a Category
                </Badge>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  What service do you need?
                </h1>
                <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-8">
                  Browse our categories to find the perfect service for your needs
                </p>
                
                {/* Search Bar */}
                <div className="relative max-w-xl mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-12 h-14 text-base rounded-2xl bg-white text-foreground border-0 shadow-elevated"
                    />
                  {searchQuery && (
                    <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Category Cards Grid */}
          <div className="container mx-auto px-4 pb-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) =>  {
                  const visual = categoryVisual.find(v => v.id === category.id);
                  if (!visual) return null;

                  return(
                    <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    >
                  <Link href={`/customer/services/${category.slug}`}>
                    <div className="group relative h-72 rounded-3xl overflow-hidden text-left shadow-card hover:shadow-elevated transition-all duration-500 cursor-pointer">
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <Image
                          width={600}
                          height={400}
                          src={visual.image}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        <div className={`absolute inset-0 bg-gradient-to-t ${visual.gradient} via-transparent from-black/80 to-transparent`} />
                      </div>
                      
                      {/* Content */}
                      <div className="relative h-full flex flex-col justify-end p-6 text-white">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                          <visual.icon className="w-6 h-6" />
                        </div>
                        
                        <h3 className="font-display font-bold text-xl mb-2">
                          {category.name}
                        </h3>
                        <p className="text-white/80 text-sm mb-4 line-clamp-2">
                          {category.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/70">
                            {category.serviceTypesCount} service types
                          </span>
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all duration-300">
                            <ArrowRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ) 
              })}
            </div>

            {categories.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  No categories match {searchQuery}
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