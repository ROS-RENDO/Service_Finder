/* eslint-disable react-hooks/static-components */
"use client"
import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search, ArrowRight, ArrowLeft, X,
  LayoutGrid, Map, Loader2, Star, Shield, MapPin, Clock, CheckCircle2
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useCompaniesByServiceType } from "@/lib/hooks/useCompanies";
import { getServiceTypeIcon, getServiceTypeGradient } from "@/lib/visuals/serviceTypeVisuals";
import CompanyMap from "@/components/service/CompanyMap";

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
  const [hoveredCompanyId, setHoveredCompanyId] = useState<string | null>(null);

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

  const ServiceTypeIcon = useMemo(() => getServiceTypeIcon(serviceTypeSlug, serviceType?.name || ""), [serviceTypeSlug, serviceType?.name]);
  const gradient = useMemo(() => getServiceTypeGradient(serviceTypeSlug), [serviceTypeSlug]);

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

  if (!category || !serviceType) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Service Not Found</h2>
            <p className="text-muted-foreground mb-4">The service you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/customer/services')}>Browse Services</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col">
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="flex flex-col flex-1">

          {/* Gradient Header */}
          <div className={`bg-gradient-to-r ${gradient} text-white py-8`}>
            <div className="container mx-auto px-4">
              <Button variant="ghost" onClick={() => router.push(`/customer/services/${categorySlug}`)}
                className="mb-4 text-white hover:bg-white/20 hover:text-white -ml-2">
                <ArrowLeft className="w-4 h-4 mr-2" />Back to Service Types
              </Button>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <ServiceTypeIcon className="w-7 h-7" />
                  </div>
                  <div>
                    <Badge className="bg-white/20 text-white border-white/30 mb-1.5 text-xs">Step 3 of 3 • Choose a Provider</Badge>
                    <h1 className="font-display text-2xl md:text-3xl font-bold">{serviceType.name}</h1>
                    <p className="text-white/80 text-sm mt-0.5">in {category.name} · {pagination.total} providers</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* View toggle */}
                  <div className="hidden md:flex bg-white/20 rounded-xl p-1 gap-0.5">
                    {(["list", "map"] as const).map((mode) => (
                      <Button key={mode} variant="ghost" size="sm" onClick={() => setViewMode(mode)}
                        className={`gap-1.5 text-xs capitalize px-3 ${viewMode === mode ? "bg-white text-primary font-semibold" : "text-white hover:bg-white/20 hover:text-white"}`}>
                        {mode === "list" && <><LayoutGrid className="w-3.5 h-3.5" />List</>}
                        {mode === "map" && <><Map className="w-3.5 h-3.5" />Map</>}
                      </Button>
                    ))}
                  </div>

                  {/* Search */}
                  <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="text" placeholder="Search companies..." value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-10 h-10 rounded-xl bg-white text-foreground border-0" />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter bar */}
          <div className="bg-card border-b">
            <div className="container mx-auto px-4 py-3">
              <div className="flex flex-wrap items-center gap-3">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 text-sm rounded-lg border bg-background">
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="price_low">Price: Low First</option>
                  <option value="price_high">Price: High First</option>
                </select>
                <select value={minRating || ''} onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : undefined)}
                  className="px-3 py-2 text-sm rounded-lg border bg-background">
                  <option value="">All Ratings</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                </select>
                {loading && <Loader2 className="w-4 h-4 animate-spin text-primary ml-auto" />}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 container mx-auto px-4 py-6">
            {/* ═══ LIST ONLY ═══ */}
            {viewMode === "list" && (
              <>
                <p className="text-sm text-muted-foreground mb-4">{pagination.total} {pagination.total === 1 ? 'company' : 'companies'} found</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {companies.map((company, index) => {
                    const isSelected = hoveredCompanyId === company.id;
                    return (
                      <motion.div
                        key={company.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        onMouseEnter={() => setHoveredCompanyId(company.id)}
                        onMouseLeave={() => setHoveredCompanyId(null)}
                      >
                        <Link href={`/customer/services/${categorySlug}/${serviceTypeSlug}/company/${company.id}`}>
                          <div className={`group bg-card rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer border-2 ${isSelected ? "border-primary shadow-elevated scale-[1.01]" : "border-transparent shadow-card hover:shadow-elevated"
                            }`}>
                            {/* Cover Image */}
                            <div className="relative h-36 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                              {company.coverImageUrl && (
                                <Image width={600} height={240} src={company.coverImageUrl} alt={company.name}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              {/* Number badge matching map pin */}
                              <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow">
                                {index + 1}
                              </div>
                              {company.logoUrl && (
                                <div className="absolute bottom-3 left-3">
                                  <Image width={44} height={44} src={company.logoUrl} alt={company.name}
                                    className="w-11 h-11 rounded-xl object-cover border-2 border-white shadow-lg"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                  />
                                </div>
                              )}
                              {company.verificationStatus && (
                                <div className="absolute top-3 right-3">
                                  <Badge className="bg-white/90 text-primary gap-1 text-xs">
                                    <Shield className="w-3 h-3" />Verified
                                  </Badge>
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-1">
                                <h3 className="font-display font-semibold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                  {company.name}
                                </h3>
                                {company.rating && (
                                  <div className="flex items-center gap-0.5 bg-primary/10 px-2 py-0.5 rounded-lg ml-2 shrink-0">
                                    <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                                    <span className="font-semibold text-xs text-primary">
                                      {typeof company.rating === 'number' ? company.rating.toFixed(1) : company.rating}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                                {company.description || 'Professional service provider'}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {company.location || company.city || 'Multiple locations'}
                                </div>
                                {company.yearsInBusiness && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {company.yearsInBusiness}y exp
                                  </div>
                                )}
                              </div>
                              {company.Highlights && company.Highlights.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {company.Highlights.slice(0, 2).map((h: any, i: number) => (
                                    <Badge key={i} variant="secondary" className="text-xs py-0">
                                      <CheckCircle2 className="w-2.5 h-2.5 mr-1" />{h.label}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              <div className="flex items-center justify-between pt-3 border-t border-border">
                                <div>
                                  {company.priceRange && (
                                    <>
                                      <span className="text-base font-bold text-foreground">${company.priceRange.min}</span>
                                      {company.priceRange.max > company.priceRange.min && (
                                        <span className="text-muted-foreground text-xs"> – ${company.priceRange.max}</span>
                                      )}
                                    </>
                                  )}
                                </div>
                                <Button size="sm" className="gap-1 h-7 text-xs">
                                  View <ArrowRight className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
                {companies.length === 0 && !loading && (
                  <div className="text-center py-16">
                    <Search className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">No companies found</h3>
                    <Button variant="outline" onClick={() => { setSearchQuery(""); setMinRating(undefined); }}>Clear filters</Button>
                  </div>
                )}
                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ArrowLeft className="w-4 h-4" /></Button>
                    <span className="text-sm text-muted-foreground">Page {currentPage} of {pagination.pages}</span>
                    <Button variant="outline" disabled={currentPage === pagination.pages} onClick={() => setCurrentPage(p => p + 1)}><ArrowRight className="w-4 h-4" /></Button>
                  </div>
                )}
              </>
            )}

            {/* ═══ MAP ONLY ═══ */}
            {viewMode === "map" && (
              <CompanyMap
                companies={companies}
                categorySlug={categorySlug}
                serviceTypeSlug={serviceTypeSlug}
                selectedCompanyId={hoveredCompanyId}
                onCompanySelect={setHoveredCompanyId}
                variant="full"
              />
            )}

          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}