"use client"

import { useEffect, useState } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/lib/contexts/AuthContext";
import { useBookings } from "@/lib/hooks/useBookings";
import { useReviews } from "@/lib/hooks/useReviews";
import { usePayments } from "@/lib/hooks/usePayments";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Star,
  CalendarCheck,
  Clock,
  CheckCircle2,
  Plus,
  ArrowRight,
  Sparkles,
  MapPin,
  Home,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

export default function CustomerDashboard() {
  const { user } = useAuthContext();
  const router = useRouter();

  // Fetch upcoming bookings
  const { bookings: upcomingBookings, loading: bookingsLoading } = useBookings({
    status: "confirmed,pending",
    limit: 3,
  });

  // Fetch completed bookings for stats
  const { bookings: completedBookings, loading: completedLoading } = useBookings({
    status: "completed",
    limit: 100,
    autoFetch: false,
  });

  // Fetch reviews
  const { reviews, loading: reviewsLoading } = useReviews({ limit: 3 });

  // Fetch payments for stats
  const { payments, loading: paymentsLoading } = usePayments({ limit: 10, autoFetch: false });

  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingCount: 0,
    completedCount: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    // Calculate stats when bookings load
    if (!bookingsLoading && upcomingBookings) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStats(prev => ({
        ...prev,
        upcomingCount: upcomingBookings.length,
        totalBookings: upcomingBookings.length + prev.completedCount,
      }));
    }
  }, [upcomingBookings, bookingsLoading]);

  const formatBookingDate = (date: any) => {
    try {
      return format(new Date(date), "MMM dd, yyyy");
    } catch {
      return "Date TBD";
    }
  };

  const formatBookingTime = (time: any) => {
    try {
      return format(new Date(time), "h:mm a");
    } catch {
      return "Time TBD";
    }
  };

  if (bookingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold">Welcome back, {user?.fullName}! 👋</h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s what&apos;s happening with your cleaning services
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 flex flex-wrap gap-3 animate-slide-up" style={{ animationDelay: "50ms" }}>
        <Button
          onClick={() => router.push('/customer/services')}
          className="gap-2 gradient-customer text-white border-0 shadow-lg hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Book a Service
        </Button>
        <Button
          onClick={() => router.push('/customer/bookings')}
          variant="outline"
          className="gap-2"
        >
          <Calendar className="h-4 w-4" />
          View Schedule
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          change={`+${stats.upcomingCount} upcoming`}
          changeType="positive"
          icon={CalendarCheck}
          iconClassName="bg-customer/10 text-customer"
          delay={100}
        />
        <StatCard
          title="Upcoming"
          value={stats.upcomingCount}
          change={upcomingBookings[0] ? `Next: ${formatBookingDate(upcomingBookings[0].bookingDate)}` : "No upcoming"}
          changeType="neutral"
          icon={Clock}
          iconClassName="bg-warning/10 text-warning"
          delay={150}
        />
        <StatCard
          title="Completed"
          value={stats.completedCount}
          change="Great service history"
          changeType="positive"
          icon={CheckCircle2}
          iconClassName="bg-success/10 text-success"
          delay={200}
        />
        <StatCard
          title="Reviews Given"
          value={reviews.length}
          change="Thank you!"
          changeType="positive"
          icon={Sparkles}
          iconClassName="bg-warning/10 text-warning"
          delay={250}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Bookings */}
        <DashboardCard
          title="Upcoming Bookings"
          description="Your scheduled services"
          action={
            <Button
              onClick={() => router.push('/customer/bookings')}
              variant="ghost"
              size="sm"
              className="text-customer gap-1"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          }
          className="lg:col-span-2"
          delay={300}
        >
          <div className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming bookings</p>
                <Button
                  onClick={() => router.push('/customer/services')}
                  variant="outline"
                  size="sm"
                  className="mt-3"
                >
                  Book a Service
                </Button>
              </div>
            ) : (
              upcomingBookings.map((booking: any) => (
                <div
                  key={booking.id}
                  onClick={() => router.push(`/customer/bookings/${booking.id}`)}
                  className="flex items-center gap-4 rounded-lg border border-border/50 p-4 transition-all hover:border-customer/30 hover:bg-customer/5 cursor-pointer"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={booking.company?.logoUrl} />
                    <AvatarFallback className="bg-customer/10 text-customer font-medium">
                      {booking.company?.name?.charAt(0) || booking.service?.name?.charAt(0) || "S"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{booking.service?.name || "Service"}</p>
                      <Badge
                        variant={booking.status === "confirmed" ? "default" : "secondary"}
                        className={
                          booking.status === "confirmed"
                            ? "bg-success/10 text-success hover:bg-success/20"
                            : ""
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {booking.company?.name || "Service Provider"}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatBookingDate(booking.bookingDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatBookingTime(booking.startTime)}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
              ))
            )}
          </div>
        </DashboardCard>

        {/* Recent Activity */}
        <DashboardCard title="Recent Reviews" delay={350}>
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No reviews yet</p>
              </div>
            ) : (
              reviews.map((review: any) => (
                <div
                  key={review.id}
                  className="flex items-start gap-3 border-b border-border/50 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-customer/10">
                    <Star className="h-4 w-4 text-customer fill-customer" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">
                        {review.booking?.service?.name || "Service"}
                      </p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < review.rating
                                ? "fill-warning text-warning"
                                : "text-muted-foreground"
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {review.comment || "No comment"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {review.createdAt ? format(new Date(review.createdAt), "MMM dd, yyyy") : ""}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </DashboardCard>
      </div>

      {/* Featured Services */}
      <DashboardCard
        title="Popular Services"
        description="Book these trending services"
        className="mt-6"
        delay={400}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Deep Cleaning", price: "$149", rating: 4.9, icon: Sparkles },
            { name: "Move-Out Clean", price: "$199", rating: 4.8, icon: Home },
            { name: "Office Cleaning", price: "$89/hr", rating: 4.7, icon: MapPin },
            { name: "Eco-Friendly", price: "$129", rating: 4.9, icon: Sparkles },
          ].map((service, i) => (
            <div
              key={service.name}
              onClick={() => router.push('/customer/services')}
              className="group rounded-xl border border-border/50 p-4 transition-all hover:border-customer/30 hover:shadow-lg cursor-pointer"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-customer/10 transition-transform group-hover:scale-110">
                <service.icon className="h-6 w-6 text-customer" />
              </div>
              <h4 className="font-medium">{service.name}</h4>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-lg font-bold text-customer">{service.price}</span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                  {service.rating}
                </span>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>
    </>
  );
}
