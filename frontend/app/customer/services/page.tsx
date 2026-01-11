"use client"
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Star, Clock, MapPin, ArrowRight, ArrowLeft, Home, Building2, 
  Sparkles, Truck, Waves, ChefHat, Leaf, CheckCircle2, Shield, X, Filter,
  LayoutGrid, Map
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CompanyMap from "@/components/service/CompanyMap";


// Service types with visual appeal
const serviceTypes = [
  { 
    id: "residential", 
    name: "Residential Cleaning", 
    description: "Regular home cleaning for bedrooms, living areas & more",
    icon: Home,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600",
    gradient: "from-sky-500/90 to-blue-600/90",
    companiesCount: 12
  },
  { 
    id: "commercial", 
    name: "Commercial Cleaning", 
    description: "Professional cleaning for offices & business facilities",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600",
    gradient: "from-violet-500/90 to-purple-600/90",
    companiesCount: 8
  },
  { 
    id: "deep", 
    name: "Deep Cleaning", 
    description: "Thorough cleaning that reaches every corner",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=600",
    gradient: "from-amber-500/90 to-orange-600/90",
    companiesCount: 15
  },
  { 
    id: "move", 
    name: "Move-In/Out", 
    description: "Perfect for relocations and getting deposits back",
    icon: Truck,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600",
    gradient: "from-emerald-500/90 to-green-600/90",
    companiesCount: 10
  },
  { 
    id: "carpet", 
    name: "Carpet & Upholstery", 
    description: "Deep clean carpets, sofas, and fabric furniture",
    icon: Waves,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600",
    gradient: "from-pink-500/90 to-rose-600/90",
    companiesCount: 7
  },
  { 
    id: "kitchen", 
    name: "Kitchen Deep Clean", 
    description: "Appliances, grease removal & full sanitization",
    icon: ChefHat,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600",
    gradient: "from-red-500/90 to-orange-600/90",
    companiesCount: 9
  },
  { 
    id: "post-construction", 
    name: "Post-Construction", 
    description: "Remove dust and debris after renovation work",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600",
    gradient: "from-slate-500/90 to-gray-600/90",
    companiesCount: 5
  },
  { 
    id: "eco", 
    name: "Eco-Friendly", 
    description: "Green products and sustainable methods",
    icon: Leaf,
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=600",
    gradient: "from-green-500/90 to-teal-600/90",
    companiesCount: 11
  },
];

// Companies with their services
const companies = [
  {
    id: 1,
    name: "Sparkle Home Services",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=100",
    coverImage: "https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=600",
    rating: 4.9,
    reviews: 324,
    location: "Downtown",
    verified: true,
    yearsInBusiness: 8,
    services: ["residential", "deep", "eco"],
    priceRange: { min: 65, max: 220 },
    description: "Premium eco-friendly cleaning with attention to every detail",
    highlights: ["Eco-friendly", "Same-day booking", "Satisfaction guarantee"],
    responseTime: "Usually responds in 1 hour",
  },
  {
    id: 2,
    name: "CleanCo Pro",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=100",
    coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600",
    rating: 4.8,
    reviews: 189,
    location: "Business District",
    verified: true,
    yearsInBusiness: 12,
    services: ["commercial", "post-construction", "carpet"],
    priceRange: { min: 150, max: 450 },
    description: "Professional commercial cleaning for businesses of all sizes",
    highlights: ["24/7 availability", "Insured & bonded", "Corporate contracts"],
    responseTime: "Usually responds in 2 hours",
  },
  {
    id: 3,
    name: "Fresh Start Cleaning",
    logo: "https://images.unsplash.com/photo-1572021335469-31706a17ber5?q=80&w=100",
    coverImage: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=600",
    rating: 4.9,
    reviews: 256,
    location: "Citywide",
    verified: true,
    yearsInBusiness: 5,
    services: ["deep", "move", "residential"],
    priceRange: { min: 120, max: 380 },
    description: "Thorough deep cleaning specialists for homes and offices",
    highlights: ["Deep cleaning experts", "Move-out specialists", "Free estimates"],
    responseTime: "Usually responds in 30 mins",
  },
  {
    id: 4,
    name: "Quick Move Cleaners",
    logo: "https://images.unsplash.com/photo-1516876437184-593fda40c7ce?q=80&w=100",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600",
    rating: 4.8,
    reviews: 178,
    location: "All Areas",
    verified: true,
    yearsInBusiness: 6,
    services: ["move", "deep", "carpet"],
    priceRange: { min: 180, max: 450 },
    description: "Specialized in move-in/out cleaning with deposit guarantee",
    highlights: ["Deposit guarantee", "Express service", "Flexible scheduling"],
    responseTime: "Usually responds in 1 hour",
  },
  {
    id: 5,
    name: "Tidy Home Team",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=100",
    coverImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600",
    rating: 4.7,
    reviews: 412,
    location: "Suburbs",
    verified: true,
    yearsInBusiness: 10,
    services: ["residential", "eco", "kitchen"],
    priceRange: { min: 55, max: 180 },
    description: "Reliable weekly maintenance and regular home cleaning",
    highlights: ["Weekly packages", "Family-owned", "Pet-friendly"],
    responseTime: "Usually responds in 45 mins",
  },
  {
    id: 6,
    name: "Hygiene Plus",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=100",
    coverImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=600",
    rating: 4.9,
    reviews: 145,
    location: "Restaurant Row",
    verified: true,
    yearsInBusiness: 15,
    services: ["commercial", "kitchen", "deep"],
    priceRange: { min: 200, max: 550 },
    description: "Food-safe cleaning for restaurants and commercial kitchens",
    highlights: ["Health code compliant", "Night service", "Food industry experts"],
    responseTime: "Usually responds in 2 hours",
  },
  {
    id: 7,
    name: "GreenClean Co",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=100",
    coverImage: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=600",
    rating: 4.8,
    reviews: 203,
    location: "Eco District",
    verified: true,
    yearsInBusiness: 4,
    services: ["eco", "residential", "carpet"],
    priceRange: { min: 75, max: 250 },
    description: "100% eco-friendly cleaning with certified green products",
    highlights: ["Carbon neutral", "Vegan products", "Recyclable supplies"],
    responseTime: "Usually responds in 1 hour",
  },
  {
    id: 8,
    name: "Elite Cleaning Services",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=100",
    coverImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=600",
    rating: 4.9,
    reviews: 89,
    location: "Premium Areas",
    verified: true,
    yearsInBusiness: 7,
    services: ["deep", "post-construction", "commercial"],
    priceRange: { min: 250, max: 800 },
    description: "Luxury cleaning services for high-end properties",
    highlights: ["White-glove service", "Trained professionals", "Luxury specialists"],
    responseTime: "Usually responds in 30 mins",
  },
];

export default function Services() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  // Filter services based on search
  const filteredServiceTypes = useMemo(() => {
    if (!searchQuery) return serviceTypes;
    const query = searchQuery.toLowerCase();
    return serviceTypes.filter(
      (service) =>
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Filter companies based on selected service and search
  const filteredCompanies = useMemo(() => {
    let results = companies;
    
    if (selectedService) {
      results = results.filter((company) => 
        company.services.includes(selectedService)
      );
    }
    
    if (searchQuery && selectedService) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (company) =>
          company.name.toLowerCase().includes(query) ||
          company.description.toLowerCase().includes(query) ||
          company.location.toLowerCase().includes(query)
      );
    }
    
    return results;
  }, [selectedService, searchQuery]);

  const selectedServiceData = serviceTypes.find((s) => s.id === selectedService);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className=" pb-16">
        <AnimatePresence mode="wait">
          {!selectedService ? (
            /* Step 1: Select a Service */
            <motion.div
              key="services"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -50 }}
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
                      Step 1 of 3 • Choose Your Service
                    </Badge>
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                      What do you need cleaned?
                    </h1>
                    <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-8">
                      Select a service type to find the best cleaning companies in your area
                    </p>
                    
                    {/* Search Bar */}
                    <div className="relative max-w-xl mx-auto">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search services..."
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

              {/* Service Cards Grid */}
              <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredServiceTypes.map((service, index) => (
                    <motion.button
                      key={service.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        setSelectedService(service.id);
                        setSearchQuery("");
                      }}
                      className="group relative h-72 rounded-3xl overflow-hidden text-left shadow-card hover:shadow-elevated transition-all duration-500"
                    >
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <Image
                          src={service.image}
                          alt={service.name}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} via-transparent from-black/80 to-transparent`} />
                      </div>
                      
                      {/* Content */}
                      <div className="relative h-full flex flex-col justify-end p-6 text-white">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                          <service.icon className="w-6 h-6" />
                        </div>
                        
                        <h3 className="font-display font-bold text-xl mb-2">
                          {service.name}
                        </h3>
                        <p className="text-white/80 text-sm mb-4 line-clamp-2">
                          {service.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/70">
                            {service.companiesCount} providers
                          </span>
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all duration-300">
                            <ArrowRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {filteredServiceTypes.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      No services match {searchQuery}
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
          ) : (
            /* Step 2: Select a Company */
            <motion.div
              key="companies"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header with Selected Service */}
              <div className={`bg-gradient-to-r ${selectedServiceData?.gradient || 'from-primary to-accent'} text-white py-12`}>
                <div className="container mx-auto px-4">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectedService(null);
                      setSearchQuery("");
                    }}
                    className="mb-6 text-white hover:bg-white/20 hover:text-white -ml-2"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Services
                  </Button>
                  
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        {selectedServiceData && <selectedServiceData.icon className="w-8 h-8" />}
                      </div>
                      <div>
                        <Badge className="bg-white/20 text-white border-white/30 mb-2">
                          Step 2 of 3 • Choose Your Provider
                        </Badge>
                        <h1 className="font-display text-2xl md:text-3xl font-bold">
                          {selectedServiceData?.name}
                        </h1>
                      </div>
                    </div>
                    
                    <div className="text-white/80">
                      <span className="font-semibold text-white">{filteredCompanies.length}</span> companies available
                    </div>
                  </div>
                </div>
              </div>

              {/* Search & Filter */}
              <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search by company name or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-12 rounded-xl border-2 focus:border-primary"
                    />
                  </div>
                  <Button variant="outline" className="h-12 rounded-xl gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                  </Button>
                  
                  {/* View Toggle */}
                  <div className="flex rounded-xl border-2 border-border overflow-hidden">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`flex items-center gap-2 px-4 h-12 text-sm font-medium transition-colors ${
                        viewMode === "list"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                      List
                    </button>
                    <button
                      onClick={() => setViewMode("map")}
                      className={`flex items-center gap-2 px-4 h-12 text-sm font-medium transition-colors ${
                        viewMode === "map"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <Map className="w-4 h-4" />
                      Map
                    </button>
                  </div>
                </div>
              </div>

              {/* Company Cards or Map */}
              <div className="container mx-auto px-4 pb-12">
                <AnimatePresence mode="wait">
                  {viewMode === "list" ? (
                    <motion.div
                      key="list-view"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCompanies.map((company, index) => (
                          <motion.div
                            key={company.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Link
                              href={`/customer/services/${company.id}`}
                              className="group block bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 border border-transparent hover:border-primary/20"
                            >
                              {/* Cover Image */}
                              <div className="relative h-48 overflow-hidden">
                                <Image
                                width={200}
                                height={200}
                                  src={company.coverImage}
                                  alt={company.name}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                
                                {/* Price Badge */}
                                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5">
                                  <span className="text-sm font-semibold text-foreground">
                                    ${company.priceRange.min}+
                                  </span>
                                </div>
                                
                                {/* Company Logo */}
                                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                                  <Image
                                  width={200}
                                  height={200}
                                    src={company.logo}
                                    alt={company.name}
                                    className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-lg"
                                    onError={(e) => {
                                      e.currentTarget.src = "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=100";
                                    }}
                                  />
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <h3 className="font-display font-semibold text-white">
                                        {company.name}
                                      </h3>
                                      {company.verified && (
                                        <Shield className="w-4 h-4 text-accent" />
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1 text-white/80 text-sm">
                                      <MapPin className="w-3 h-3" />
                                      {company.location}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Content */}
                              <div className="p-5">
                                {/* Rating & Reviews */}
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-lg">
                                      <Star className="w-4 h-4 fill-current" />
                                      <span className="font-semibold text-sm">{company.rating}</span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                      ({company.reviews} reviews)
                                    </span>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {company.yearsInBusiness}+ years
                                  </span>
                                </div>
                                
                                {/* Description */}
                                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                  {company.description}
                                </p>
                                
                                {/* Highlights */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {company.highlights.slice(0, 2).map((highlight, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      <CheckCircle2 className="w-3 h-3 mr-1" />
                                      {highlight}
                                    </Badge>
                                  ))}
                                </div>
                                
                                {/* Response Time & CTA */}
                                <div className="flex items-center justify-between pt-3 border-t border-border">
                                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Clock className="w-3.5 h-3.5" />
                                    {company.responseTime}
                                  </div>
                                  <span className="text-primary font-medium text-sm group-hover:underline flex items-center gap-1">
                                    View Details
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>

                      {filteredCompanies.length === 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-16"
                        >
                          <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                            No companies found
                          </h3>
                          <p className="text-muted-foreground mb-6">
                            Try adjusting your search or go back to browse other services
                          </p>
                          <Button variant="outline" onClick={() => setSearchQuery("")}>
                            Clear search
                          </Button>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="map-view"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CompanyMap companies={filteredCompanies} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
