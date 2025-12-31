"use client"
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Edit, Star, Users, DollarSign } from "lucide-react";

import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const companyData = {
  id: "1",
  name: "SparkleClean Pro",
  email: "contact@sparkleclean.com",
  phone: "+1 234 567 8901",
  address: "456 Business Ave, New York, NY 10001",
  status: "active" as const,
  joinedAt: "October 15, 2025",
  rating: 4.9,
  totalBookings: 245,
  totalRevenue: "$34,500",
  staffCount: 12,
  services: ["Deep Cleaning", "Regular Cleaning", "Move-out Cleaning", "Office Cleaning"],
};

export default function CompanyDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/admin/companies")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1 shadow-elevated">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 rounded-xl">
                <AvatarFallback className="rounded-xl bg-primary/10 text-primary text-2xl font-semibold">
                  SC
                </AvatarFallback>
              </Avatar>
              <h3 className="mt-4 text-xl font-semibold">{companyData.name}</h3>
              <div className="mt-2 flex items-center gap-1">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-medium">{companyData.rating}</span>
                <span className="text-muted-foreground">rating</span>
              </div>
              <div className="mt-3">
                <StatusBadge status={companyData.status} />
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{companyData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{companyData.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{companyData.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {companyData.joinedAt}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats & Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="shadow-soft">
              <CardContent className="pt-6">
                <p className="text-3xl font-semibold text-primary">{companyData.totalBookings}</p>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardContent className="pt-6">
                <p className="text-3xl font-semibold text-success">{companyData.totalRevenue}</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardContent className="pt-6">
                <p className="text-3xl font-semibold text-info">{companyData.staffCount}</p>
                <p className="text-sm text-muted-foreground">Staff Members</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle>Services Offered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {companyData.services.map((service) => (
                  <span
                    key={service}
                    className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { customer: "Sarah J.", rating: 5, comment: "Excellent service! Very thorough and professional.", date: "Dec 28" },
                  { customer: "Mike C.", rating: 5, comment: "Always on time and does a great job.", date: "Dec 25" },
                  { customer: "Emma W.", rating: 4, comment: "Good cleaning, would recommend.", date: "Dec 22" },
                ].map((review, index) => (
                  <div
                    key={index}
                    className="border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{review.customer}</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-warning text-warning" />
                        ))}
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{review.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
