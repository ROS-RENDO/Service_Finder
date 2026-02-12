"use client"
import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Search, Star, Clock, MapPin, ArrowRight, ArrowLeft, Shield, X,
  LayoutGrid, Map, CheckCircle2, Loader2
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CompanyMap from "@/components/service/CompanyMap";
import Image from "next/image";
import { useCompaniesByServiceType } from "@/lib/hooks/useCompanies";
import { categoryVisual } from "@/lib/visuals/categoryVisuals";
import { serviceTypeVisual } from "@/lib/visuals/serviceTypeVisuals";

export default function CompaniesPage() {
  const params = useParams();
  const router = useRouter();
  const categorySlug = params.category as string;
  const serviceTypeSlug = params.serviceType as string;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [selectedCity, setSelectedCity] = useState("");
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'price_low' | 'price_high'>('rating');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch companies using the hook
  const { 
    companies, 
    category, 
    serviceType, 
    pagination, 
    loading, 
    error,
    refetch 
  } = useCompaniesByServiceType({ 
    categorySlug,
    serviceTypeSlug,
    search: searchQuery,
    city: selectedCity,
    minRating,
    sortBy,
    page: currentPage,
    limit: 9
  });

  // Find visual data
  const categoryData = categoryVisual.find(v => v.slug === categorySlug);
  const serviceTypeData = serviceTypeVisual.find(v => v.slug === serviceTypeSlug);

  // Loading state
  if (loading && companies.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading companies...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Not found state
  if (!category || !serviceType) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Service Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The service youre looking for doesnt exist.
            </p>
            <Button onClick={() => router.push('/customer/services')}>
              Browse Services
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Get visual data with fallbacks
  const ServiceTypeIcon = serviceTypeData?.icon;
  const gradient = serviceTypeData?.gradient || 'from-blue-500/90 to-sky-600/90';

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
          <div className={`bg-gradient-to-r ${gradient} text-white py-12`}>
            <div className="container mx-auto px-4">
              <Button
                variant="ghost"
                onClick={() => router.push(`/customer/services/${categorySlug}`)}
                className="mb-6 text-white hover:bg-white/20 hover:text-white -ml-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Service Types
              </Button>
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    {ServiceTypeIcon && <ServiceTypeIcon className="w-8 h-8" />}
                  </div>
                  <div>
                    <Badge className="bg-white/20 text-white border-white/30 mb-2">
                      Step 3 of 3 • Choose a Provider
                    </Badge>
                    <h1 className="font-display text-2xl md:text-3xl font-bold">
                      {serviceType.name}
                    </h1>
                    <p className="text-white/80 text-sm mt-1">
                      in {category.name}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* View Toggle */}
                  <div className="flex bg-white/20 rounded-xl p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={`gap-2 ${viewMode === "list" ? "bg-white text-primary" : "text-white hover:bg-white/20 hover:text-white"}`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                      List
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("map")}
                      className={`gap-2 ${viewMode === "map" ? "bg-white text-primary" : "text-white hover:bg-white/20 hover:text-white"}`}
                    >
                      <Map className="w-4 h-4" />
                      Map
                    </Button>
                  </div>
                  
                  {/* Search */}
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search companies..."
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
          </div>

          {/* Filters */}
          <div className="bg-card border-b">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 rounded-lg border bg-background"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>

                <select
                  value={minRating || ''}
                  onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : undefined)}
                  className="px-4 py-2 rounded-lg border bg-background"
                >
                  <option value="">All Ratings</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                </select>
              </div>
            </div>
          </div>

          {/* Companies */}
          <div className="container mx-auto px-4 py-8">
            {viewMode === "list" ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    {pagination.total} {pagination.total === 1 ? 'company' : 'companies'} found
                  </p>
                </div>

                {loading && (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {companies.map((company, index) => (
                    <motion.div
                      key={company.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link href={`/customer/services/${categorySlug}/${serviceTypeSlug}/company/${company.id}`}>
                        <div className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer">
                          {/* Cover Image */}
                          <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                            {company.coverImageUrl && (
                              <Image
                                width={600}
                                height={300}
                                src={company.coverImageUrl}
                                alt={company.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            
                            {/* Logo */}
                            {company.logoUrl && (
                              <div className="absolute bottom-3 left-3">
                                <Image
                                  width={56}
                                  height={56}
                                  src={company.logoUrl}
                                  alt={company.name}
                                  className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-lg"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                            
                            {/* Verified Badge */}
                            {company.verificationStatus && (
                              <div className="absolute top-3 right-3">
                                <Badge className="bg-white/90 text-primary gap-1">
                                  <Shield className="w-3 h-3" />
                                  Verified
                                </Badge>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-5">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                                {company.name}
                              </h3>
                              {company.rating && (
                                <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg">
                                  <Star className="w-4 h-4 fill-primary text-primary" />
                                  <span className="font-semibold text-sm text-primary">
                                    {typeof company.rating === 'number' ? company.rating.toFixed(1) : company.rating}
                                  </span>
                                </div>
                              )}
                            </div>

                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {company.description || 'Professional service provider'}
                            </p>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {company.location || company.city || 'Multiple locations'}
                              </div>
                              {company.yearsInBusiness && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {company.yearsInBusiness}y exp
                                </div>
                              )}
                            </div>

                            {/* Highlights */}
                            {company.Highlights && company.Highlights.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {company.Highlights.slice(0, 2).map((highlight, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    {highlight.label}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {/* Price & CTA */}
                            <div className="flex items-center justify-between pt-4 border-t border-border">
                              <div>
                                {company.priceRange && (
                                  <>
                                    <span className="text-lg font-bold text-foreground">
                                      ${company.priceRange.min}
                                    </span>
                                    {company.priceRange.max > company.priceRange.min && (
                                      <span className="text-muted-foreground text-sm">
                                        {' '}- ${company.priceRange.max}
                                      </span>
                                    )}
                                  </>
                                )}
                              </div>
                              <Button size="sm" className="gap-2">
                                View Services
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {companies.length === 0 && !loading && (
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
                      Try a different search or adjust your filters
                    </p>
                    <Button variant="outline" onClick={() => {
                      setSearchQuery("");
                      setMinRating(undefined);
                    }}>
                      Clear filters
                    </Button>
                  </motion.div>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {pagination.pages}
                    </span>
                    
                    <Button
                      variant="outline"
                      disabled={currentPage === pagination.pages}
                      onClick={() => setCurrentPage(p => p + 1)}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <CompanyMap companies={companies} />
            )}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}