"use client";
import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, Star, Shield, MapPin, Clock, ChevronDown,
  ArrowRight, SlidersHorizontal, LayoutGrid, Map as MapIcon,
  Loader2, CheckCircle2, XCircle, Filter, ChevronRight
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import CompanyFullMap from "@/components/service/CompanyFullMap";
import { useCategories } from "@/lib/hooks/useCategories";
import { useServiceTypesByCategory } from "@/lib/hooks/useServiceTypes";
import { useCompaniesByServiceType, useCompaniesByCategory } from "@/lib/hooks/useCompanies";
import { getCategoryIcon, getCategoryGradient } from "@/lib/visuals/categoryVisuals";
import { getServiceTypeIcon } from "@/lib/visuals/serviceTypeVisuals";

// ──────────────────────────────────────────────────────────────────────────────
// COMPANY CARD
// ──────────────────────────────────────────────────────────────────────────────
function CompanyCard({
  company,
  index,
  isSelected,
  onHover,
  categorySlug,
  serviceTypeSlug,
}: {
  company: any;
  index: number;
  isSelected: boolean;
  onHover: (id: string | null) => void;
  categorySlug: string;
  serviceTypeSlug: string;
}) {
  const href =
    categorySlug && serviceTypeSlug
      ? `/customer/services/${categorySlug}/${serviceTypeSlug}/company/${company.id}`
      : `/customer/services`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay: index * 0.03 }}
      onMouseEnter={() => onHover(company.id)}
      onMouseLeave={() => onHover(null)}
    >
      <Link href={href}>
        <div
          className={`group relative bg-card rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 border-2 ${
            isSelected
              ? "border-primary shadow-xl scale-[1.01]"
              : "border-transparent shadow-card hover:shadow-elevated hover:border-primary/30"
          }`}
        >
          {/* Cover */}
          <div className="relative h-28 bg-gradient-to-br from-primary/10 to-indigo-50 overflow-hidden">
            {company.coverImageUrl && (
              <Image
                src={company.coverImageUrl}
                alt={company.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
            {/* Index badge */}
            <div
              className={`absolute top-2.5 left-2.5 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-lg transition-colors ${
                isSelected ? "bg-primary scale-110" : "bg-primary/80"
              }`}
            >
              {index + 1}
            </div>
            {(company.verified || company.verificationStatus === "verified") && (
              <div className="absolute top-2.5 right-2.5">
                <Badge className="bg-white/95 text-primary gap-1 text-[10px] py-0 px-1.5">
                  <Shield className="w-2.5 h-2.5" /> Verified
                </Badge>
              </div>
            )}
            {company.logoUrl && (
              <div className="absolute bottom-2 left-2">
                <Image
                  src={company.logoUrl}
                  alt={company.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-lg object-cover border-2 border-white shadow"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-3">
            <div className="flex items-start justify-between mb-1 gap-1">
              <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {company.name}
              </h3>
              {company.rating != null && (
                <div className="flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded-md shrink-0">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-amber-700">
                    {typeof company.rating === "number"
                      ? company.rating.toFixed(1)
                      : company.rating}
                  </span>
                </div>
              )}
            </div>

            {company.description && (
              <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                {company.description}
              </p>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2.5">
              {(company.city || company.location) && (
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 shrink-0" />
                  {company.city || company.location}
                </span>
              )}
              {company.reviewCount > 0 && (
                <span className="shrink-0">{company.reviewCount} reviews</span>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              {company.priceRange?.min > 0 ? (
                <div>
                  <span className="font-bold text-sm text-foreground">
                    ${company.priceRange.min}
                  </span>
                  {company.priceRange.max > company.priceRange.min && (
                    <span className="text-xs text-muted-foreground">
                      {" "}– ${company.priceRange.max}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">Price on request</span>
              )}
              <Button size="sm" variant="ghost" className="gap-1 h-6 text-xs text-primary px-1">
                View <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// MAIN PAGE INNER
// ──────────────────────────────────────────────────────────────────────────────
function MapExplorerInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── URL-synced filters ──
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [selectedServiceType, setSelectedServiceType] = useState(
    searchParams.get("serviceType") || ""
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState<"rating" | "reviews" | "price_low" | "price_high">(
    (searchParams.get("sort") as any) || "rating"
  );
  const [minRating, setMinRating] = useState<number | undefined>(
    searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined
  );

  // ── UI state ──
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const [page, setPage] = useState(1);

  // ── Data hooks ──
  const { categories, loading: categoriesLoading } = useCategories();
  const { serviceTypes, loading: serviceTypesLoading } = useServiceTypesByCategory(
    selectedCategory || ""
  );

  // Use the right hook depending on whether a service type is selected
  const byServiceType = useCompaniesByServiceType({
    categorySlug: selectedCategory,
    serviceTypeSlug: selectedServiceType,
    autoFetch: !!(selectedCategory && selectedServiceType),
    search: searchQuery,
    sortBy,
    minRating,
    page,
    limit: 30,
  });

  const byCategory = useCompaniesByCategory({
    categorySlug: selectedCategory,
    autoFetch: !!(selectedCategory && !selectedServiceType),
    search: searchQuery,
    sortBy,
    minRating,
    page,
    limit: 30,
  });

  const companies =
    selectedServiceType ? byServiceType.companies : byCategory.companies;
  const loading =
    selectedServiceType ? byServiceType.loading : byCategory.loading;
  const pagination =
    selectedServiceType ? byServiceType.pagination : byCategory.pagination;

  // ── Sync URL ──
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedServiceType) params.set("serviceType", selectedServiceType);
    if (searchQuery) params.set("q", searchQuery);
    if (sortBy !== "rating") params.set("sort", sortBy);
    if (minRating) params.set("minRating", minRating.toString());
    router.replace(`/customer/map?${params.toString()}`, { scroll: false });
  }, [selectedCategory, selectedServiceType, searchQuery, sortBy, minRating]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [selectedCategory, selectedServiceType, searchQuery, sortBy, minRating]);

  // Reset service type when category changes
  const handleCategoryChange = useCallback((slug: string) => {
    setSelectedCategory(slug === selectedCategory ? "" : slug);
    setSelectedServiceType("");
    setSelectedCompanyId(null);
  }, [selectedCategory]);

  const handleServiceTypeChange = useCallback((slug: string) => {
    setSelectedServiceType(slug === selectedServiceType ? "" : slug);
    setSelectedCompanyId(null);
  }, [selectedServiceType]);

  // Active category object
  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === selectedCategory),
    [categories, selectedCategory]
  );
  const activeServiceType = useMemo(
    () => serviceTypes.find((s) => s.slug === selectedServiceType),
    [serviceTypes, selectedServiceType]
  );

  const companiesWithCoords = useMemo(
    () =>
      companies.filter(
        (c: any) => c.coordinates?.latitude != null && c.coordinates?.longitude != null
      ),
    [companies]
  );

  const activeFiltersCount = [
    selectedCategory, selectedServiceType, searchQuery,
    minRating ? String(minRating) : null,
  ].filter(Boolean).length;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar />

      {/* ── TOP FILTER BAR ── */}
      <div className="shrink-0 border-b bg-card shadow-sm z-20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search companies by name…"
                className="pl-9 pr-9 h-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pl-3 pr-8 py-2 text-sm rounded-lg border bg-background appearance-none cursor-pointer h-10 focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="rating">⭐ Highest Rated</option>
                <option value="reviews">💬 Most Reviews</option>
                <option value="price_low">💰 Price: Low First</option>
                <option value="price_high">💎 Price: High First</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>

            {/* Filters toggle */}
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2 shrink-0 h-10"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-0.5 w-5 h-5 rounded-full bg-white/20 text-white text-xs flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            {/* Mobile view toggle */}
            <div className="flex md:hidden bg-muted rounded-lg p-1 gap-0.5 shrink-0">
              {(["list", "map"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setMobileView(v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                    mobileView === v
                      ? "bg-white text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {v === "list" ? <LayoutGrid className="w-3.5 h-3.5" /> : <MapIcon className="w-3.5 h-3.5" />}
                  {v}
                </button>
              ))}
            </div>

            {/* Results count */}
            {!loading && (
              <span className="text-xs text-muted-foreground shrink-0 hidden md:block">
                {pagination.total.toLocaleString()} found ·{" "}
                {companiesWithCoords.length} on map
              </span>
            )}
          </div>

          {/* ── FILTERS PANEL ── */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-3 pb-1 flex flex-col gap-4">
                  {/* Rating filter */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-semibold text-foreground">Min Rating:</span>
                    {[undefined, 3.5, 4.0, 4.5].map((r) => (
                      <button
                        key={r ?? "any"}
                        onClick={() => setMinRating(r)}
                        className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                          minRating === r
                            ? "bg-primary text-primary-foreground border-primary shadow"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {r ? (
                          <>
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {r}+
                          </>
                        ) : (
                          "Any"
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Active filters summary */}
                  {activeFiltersCount > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {selectedCategory && activeCategory && (
                        <Badge variant="secondary" className="gap-1 text-xs">
                          {activeCategory.name}
                          <button onClick={() => handleCategoryChange(selectedCategory)}>
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      )}
                      {selectedServiceType && activeServiceType && (
                        <Badge variant="secondary" className="gap-1 text-xs">
                          {activeServiceType.name}
                          <button onClick={() => handleServiceTypeChange(selectedServiceType)}>
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      )}
                      {minRating && (
                        <Badge variant="secondary" className="gap-1 text-xs">
                          ⭐ {minRating}+
                          <button onClick={() => setMinRating(undefined)}>
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      )}
                      <button
                        onClick={() => {
                          setSelectedCategory("");
                          setSelectedServiceType("");
                          setSearchQuery("");
                          setMinRating(undefined);
                          setSortBy("rating");
                        }}
                        className="text-xs text-destructive hover:underline"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── MAIN SPLIT LAYOUT ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT: Sidebar (categories → service types → company list) ── */}
        <div
          className={`w-full md:w-[420px] shrink-0 flex flex-col overflow-hidden border-r bg-background ${
            mobileView === "map" ? "hidden md:flex" : "flex"
          }`}
        >
          {/* ── Category Tabs ── */}
          <div className="shrink-0 px-3 pt-3 pb-2 border-b">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Category
            </p>
            {categoriesLoading ? (
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 w-24 bg-muted animate-pulse rounded-full" />
                ))}
              </div>
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <button
                  onClick={() => handleCategoryChange(selectedCategory)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    !selectedCategory
                      ? "bg-primary text-primary-foreground border-primary shadow"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => {
                  const CatIcon = getCategoryIcon(cat.slug, cat.name);
                  const isActive = selectedCategory === cat.slug;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary shadow"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <CatIcon className="w-3.5 h-3.5" />
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Service Type Filters (shown when category selected) ── */}
          <AnimatePresence>
            {selectedCategory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="shrink-0 overflow-hidden border-b"
              >
                <div className="px-3 pt-2 pb-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Service Type — {activeCategory?.name}
                  </p>
                  {serviceTypesLoading ? (
                    <div className="flex gap-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-7 w-20 bg-muted animate-pulse rounded-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      <button
                        onClick={() => handleServiceTypeChange(selectedServiceType)}
                        className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                          !selectedServiceType
                            ? "bg-indigo-600 text-white border-indigo-600 shadow"
                            : "border-border hover:border-indigo-400"
                        }`}
                      >
                        All types
                      </button>
                      {serviceTypes.map((st) => {
                        const STIcon = getServiceTypeIcon(st.slug, st.name);
                        const isActive = selectedServiceType === st.slug;
                        return (
                          <button
                            key={st.id}
                            onClick={() => handleServiceTypeChange(st.slug)}
                            className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                              isActive
                                ? "bg-indigo-600 text-white border-indigo-600 shadow"
                                : "border-border hover:border-indigo-400"
                            }`}
                          >
                            <STIcon className="w-3 h-3" />
                            {st.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Breadcrumb ── */}
          {(selectedCategory || selectedServiceType) && (
            <div className="shrink-0 px-3 py-2 flex items-center gap-1 text-xs text-muted-foreground border-b">
              <span
                className="hover:text-foreground cursor-pointer transition-colors"
                onClick={() => { setSelectedCategory(""); setSelectedServiceType(""); }}
              >
                All
              </span>
              {activeCategory && (
                <>
                  <ChevronRight className="w-3 h-3" />
                  <span
                    className="hover:text-foreground cursor-pointer transition-colors"
                    onClick={() => setSelectedServiceType("")}
                  >
                    {activeCategory.name}
                  </span>
                </>
              )}
              {activeServiceType && (
                <>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-foreground font-medium">{activeServiceType.name}</span>
                </>
              )}
            </div>
          )}

          {/* ── Company Cards ── */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {loading && companies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading companies…</p>
              </div>
            ) : !selectedCategory ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Filter className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Select a category to browse</p>
                  <p className="text-sm text-muted-foreground">
                    Choose a category above to discover companies near you on the map.
                  </p>
                </div>
              </div>
            ) : companies.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-4">
                <XCircle className="w-12 h-12 text-muted-foreground opacity-40" />
                <div>
                  <p className="font-semibold text-foreground mb-1">No companies found</p>
                  <p className="text-sm text-muted-foreground">
                    Try changing your filters or search terms.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setMinRating(undefined);
                    setSelectedServiceType("");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <>
                <p className="text-xs text-muted-foreground">
                  {pagination.total.toLocaleString()} companies ·{" "}
                  {companiesWithCoords.length} with locations
                </p>
                <AnimatePresence mode="popLayout">
                  {companies.map((company: any, i: number) => (
                    <CompanyCard
                      key={company.id}
                      company={company}
                      index={i}
                      isSelected={selectedCompanyId === company.id}
                      onHover={setSelectedCompanyId}
                      categorySlug={selectedCategory}
                      serviceTypeSlug={selectedServiceType}
                    />
                  ))}
                </AnimatePresence>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 pt-2 pb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1 || loading}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center text-xs text-muted-foreground px-2">
                      {page} / {pagination.pages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === pagination.pages || loading}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── RIGHT: Map ── */}
        <div
          className={`flex-1 relative ${
            mobileView === "list" ? "hidden md:block" : "block"
          }`}
        >
          <CompanyFullMap
            companies={companies}
            selectedCompanyId={selectedCompanyId}
            onCompanySelect={setSelectedCompanyId}
            categorySlug={selectedCategory}
            serviceTypeSlug={selectedServiceType}
          />

          {/* Mobile: Back to list button */}
          <button
            onClick={() => setMobileView("list")}
            className="md:hidden absolute top-4 left-4 z-[500] flex items-center gap-2 bg-white shadow-lg text-gray-700 text-sm font-semibold px-4 py-2 rounded-full border"
          >
            <LayoutGrid className="w-4 h-4" />
            Show List ({companies.length})
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// PAGE EXPORT (wrapped in Suspense for useSearchParams)
// ──────────────────────────────────────────────────────────────────────────────
export default function MapExplorerPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <MapExplorerInner />
    </Suspense>
  );
}
