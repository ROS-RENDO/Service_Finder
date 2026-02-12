"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star,
  Clock,
  MapPin,
  Shield,
  ChevronLeft,
  Calendar,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
  Building2,
  Users,
  Award,
  Heart,
  UserCheck,
  ThumbsUp,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { ContactDialog } from "@/components/service/ContactDialog";
import { useServices } from "@/lib/hooks/useServices";
import { useReviews } from "@/lib/hooks/useReviews";
import { useCompanies } from "@/lib/hooks/useCompanies";
import { Service } from "@/types/service.types";
import { Company } from "@/types/company.types";

const companyData = {
  gallery: [
    "https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=600",
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600",
    "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=600",
    "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=600",
  ],
};
const highlightIconsMap = {
  Shield,
  Star,
  UserCheck,
  ThumbsUp,
} as const;

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  const serviceType = params.serviceType as string;
  const companyId = params.id as string;

  const [contactType, setContactType] = useState<"call" | "message" | null>(
    null,
  );
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const [company, setCompany] = useState<Company | null>(null);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [companyError, setCompanyError] = useState<string | null>(null);

  const { getCompanyById } = useCompanies({ autoFetch: false });
  const {
    services,
    fetchServicesByCompany,
    loading: servicesLoading,
    error: servicesError,
  } = useServices({
    autoFetch: false,
  });
  const {
    reviews,
    fetchReviewsByCompany,
    loading: reviewsLoading,
    error: reviewsError,
  } = useReviews({
    autoFetch: false,
  });

  // Fetch company details
  useEffect(() => {
    const loadCompany = async () => {
      setCompanyLoading(true);
      setCompanyError(null);

      const result = await getCompanyById(companyId);
      console.log(result);

      if (result.success && result.company) {
        setCompany(result.company);
      } else {
        setCompanyError(result.error || "Company not found");
      }

      setCompanyLoading(false);
    };

    if (companyId) {
      loadCompany();
    }
  }, [companyId]);

  // Fetch services and reviews when company is loaded
  useEffect(() => {
    if (company) {
      fetchServicesByCompany(companyId);
      fetchReviewsByCompany(companyId);
    }
  }, [company, companyId]);

  const handleBookService = (serviceId: string) => {
    router.push(
      `/customer/services/${category}/${serviceType}/company/${companyId}/booking?service=${serviceId}`,
    );
  };

  const handleBack = () => {
    router.push(`/customer/services/${category}/${serviceType}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="">
        {/* Cover Image Section */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <Image
            width={1200}
            height={400}
            src={company?.coverImageUrl || ""}
            alt={company?.name || ""}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Back Button */}
          <div className="absolute top-4 left-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleBack}
              className="gap-2 bg-white/90 hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Companies
            </Button>
          </div>
        </div>

        {/* Company Info Header */}
        <div className="container mx-auto px-4">
          <div className="relative -mt-20 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-6 shadow-card"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Logo */}
                <div className="flex-shrink-0">
                  <Image
                    width={128}
                    height={128}
                    src={company?.logoUrl || ""}
                    alt={company?.name || ""}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border-4 border-background shadow-lg"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      {company?.name}
                    </h1>
                    {company?.verificationStatus && (
                      <Badge variant="secondary" className="gap-1">
                        <Shield className="w-3 h-3" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="font-semibold text-foreground">
                        {company?.rating}
                      </span>
                      <span>({company?.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {company?.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {company?.yearsInBusiness} years in business
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {company?.employeeCount}+ employees
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 max-w-2xl">
                    {company?.description}
                  </p>

                  {/* Contact Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => setContactType("call")}
                    >
                      <Phone className="w-4 h-4" />
                      Call Now
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => setContactType("message")}
                    >
                      <Mail className="w-4 h-4" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
                {company?.Highlights &&
                  company.Highlights.length > 0 &&
                  company.Highlights.map((highlight, index) => {
                    const Icon = highlightIconsMap[highlight.icon];

                    if (!Icon) return null;

                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm font-medium">
                          {highlight.label}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </motion.div>
          </div>

          {/* Services Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  Our Services
                </h2>
                <p className="text-muted-foreground">
                  Choose a service to book with {company?.name}
                </p>
              </div>
              <Badge variant="secondary" className="text-sm">
                {services.length} services available
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Card
                    className={`group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-elevated ${
                      selectedService === service.id
                        ? "ring-2 ring-primary"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedService(
                        selectedService === service.id
                          ? null
                          : String(service.id),
                      )
                    }
                  >
                    {/* Service Image */}
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        width={400}
                        height={200}
                        src={service.image || ""}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {service.id && (
                        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                          Popular
                        </Badge>
                      )}
                      <div className="absolute bottom-3 left-3 right-3">
                        <Badge
                          variant="secondary"
                          className="bg-white/90 text-foreground"
                        >
                          {service.serviceType?.name}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                        {service.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {service.description}
                      </p>

                      {/* Features */}
                      <div className="space-y-1.5 mb-4">
                        {service.features?.map((feature: any, i: any) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>

                      {/* Price & Duration */}
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div>
                          <span className="text-2xl font-bold text-foreground">
                            ${service.basePrice}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            {" "}
                            / session
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {((service.durationMin ?? 0) / 60).toFixed(1)}
                          {service.durationMax && service.durationMax > 0
                            ? ` - ${((service.durationMax ?? 0) / 60).toFixed(1)}`
                            : ""}{" "}
                          hr
                        </div>
                      </div>

                      {/* Book Button */}
                      <Button
                        className="w-full mt-4 gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookService(service.id);
                        }}
                      >
                        <Calendar className="w-4 h-4" />
                        Book This Service
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Gallery Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              Our Work
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {companyData.gallery.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <Image
                    width={200}
                    height={200}
                    src={image}
                    alt={`Work sample ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Reviews Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  Customer Reviews
                </h2>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-primary text-primary" />
                  <span className="font-semibold text-foreground">
                    {company?.rating}
                  </span>
                  <span className="text-muted-foreground">
                    based on {company?.reviewCount} reviews
                  </span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <Image
                          width={48}
                          height={48}
                          src={review.customer.avatar}
                          alt={""}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">
                            {review.customer.fullName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {review.timeAgo}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-0.5">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-primary text-primary"
                            />
                          ))}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {review.booking.service.name}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {review.comment}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="bg-gradient-hero rounded-3xl p-8 md:p-12 text-white text-center">
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                Ready to get started?
              </h2>
              <p className="text-white/80 mb-6 max-w-xl mx-auto">
                Book any of our services today and experience the{" "}
                {company?.name} difference. Satisfaction guaranteed!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 gap-2"
                  onClick={() =>
                    window.scrollTo({ top: 400, behavior: "smooth" })
                  }
                >
                  <Calendar className="w-5 h-5" />
                  View Services
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/20 gap-2"
                  onClick={() => setContactType("message")}
                >
                  <Mail className="w-5 h-5" />
                  Contact Us
                </Button>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />

      {/* Contact Dialog */}
      <ContactDialog
        open={contactType !== null}
        onOpenChange={(open) => !open && setContactType(null)}
        type={contactType || "message"}
        company={{
          name: company?.name || "",
          logo: company?.logoUrl,
          phone: company?.phone,
          email: company?.email,
        }}
      />
    </div>
  );
}
