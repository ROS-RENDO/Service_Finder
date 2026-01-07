"use client"
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MapPin, Phone, Mail, Clock, ArrowLeft, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/common/PageHeader';
import { RatingStars } from '@/components/common/RatingStars';
import { companies, reviews } from '@/data/mockData';
import Image from 'next/image';

export default function CompanyDetailsPage() {
  const { id } = useParams();
  const company = companies.find((c) => c.id === id);
  const companyReviews = reviews.filter((r) => r.companyId === id);

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="font-display text-2xl font-semibold">Company not found</h2>
        <Button asChild className="mt-4">
          <Link href="/customer/companies">Back to Companies</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/customer/companies">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Companies
        </Link>
      </Button>

      {/* Company Header */}
      <Card className="glass-card mb-6 overflow-hidden">
        <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5">
          <div className="absolute -bottom-12 left-6">
            <div className="h-24 w-24 overflow-hidden rounded-xl border-4 border-card bg-card shadow-lg">
              <Image
                src={company.logo}
                alt={company.name}
                width={200}
                height={200}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
        <div className="px-6 pb-6 pt-16">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {company.category}
              </span>
              <h1 className="font-display text-3xl font-bold text-foreground">
                {company.name}
              </h1>
              <div className="mt-2 flex items-center gap-3">
                <RatingStars rating={company.rating} size="md" showValue />
                <span className="text-muted-foreground">
                  ({company.reviewCount} reviews)
                </span>
              </div>
              <p className="mt-4 max-w-2xl text-muted-foreground">
                {company.description}
              </p>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                {company.address}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                {company.phone}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                {company.email}
              </div>
              <div className="mt-2 flex items-center gap-2 font-medium text-foreground">
                <DollarSign className="h-4 w-4 text-primary" />
                {company.priceRange}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Services */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 font-display text-2xl font-semibold">Services Offered</h2>
          <div className="space-y-4">
            {company.services.map((service, index) => (
              <Card
                key={service.id}
                className="glass-card hover-lift p-5 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {service.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {service.description}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-primary font-semibold">
                        <DollarSign className="h-4 w-4" />
                        ${service.price}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {service.duration}
                      </span>
                    </div>
                  </div>
                  <Button asChild>
                    <Link href={`/customer/bookings/new?serviceId=${service.id}&companyId=${company.id}`}>
                      Book Now
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Reviews & Gallery */}
        <div className="space-y-6">
          {/* Gallery */}
          {company.gallery.length > 0 && (
            <Card className="glass-card p-5">
              <h3 className="mb-3 font-display text-lg font-semibold">Gallery</h3>
              <div className="grid grid-cols-2 gap-2">
                {company.gallery.map((image, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-lg">
                    <Image
                      src={image}
                      alt={`${company.name} gallery ${index + 1}`}
                      width={1000}
                      height={1000}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Reviews */}
          <Card className="glass-card p-5">
            <h3 className="mb-4 font-display text-lg font-semibold">Customer Reviews</h3>
            {companyReviews.length > 0 ? (
              <div className="space-y-4">
                {companyReviews.map((review) => (
                  <div key={review.id}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{review.customerName}</span>
                      <RatingStars rating={review.rating} size="sm" />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{review.text}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No reviews yet.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
