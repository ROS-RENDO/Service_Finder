"use client"
import { StatCard } from "@/components/ui/stat-card";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/lib/contexts/AuthContext";
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
} from "lucide-react";

const upcomingBookings = [
  {
    id: 1,
    service: "Deep Cleaning",
    company: "Sparkle Clean Co.",
    date: "Dec 30, 2024",
    time: "9:00 AM",
    status: "confirmed",
    avatar: "",
  },
  {
    id: 2,
    service: "Regular Cleaning",
    company: "Fresh Home Services",
    date: "Jan 2, 2025",
    time: "2:00 PM",
    status: "pending",
    avatar: "",
  },
  {
    id: 3,
    service: "Window Cleaning",
    company: "Crystal Clear",
    date: "Jan 5, 2025",
    time: "10:00 AM",
    status: "confirmed",
    avatar: "",
  },
];

const recentActivity = [
  { id: 1, action: "Booking completed", service: "Office Cleaning", date: "2 days ago" },
  { id: 2, action: "Review submitted", service: "Deep Cleaning", date: "1 week ago" },
  { id: 3, action: "Payment processed", service: "Regular Cleaning", date: "2 weeks ago" },
];

export default function CustomerDashboard() {
  const {user}= useAuthContext();
  return (
    <>
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold">Welcome back, {user?.fullName}! 👋</h1>
        <p className="mt-1 text-muted-foreground">
          Heres whats happening with your cleaning services
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 flex flex-wrap gap-3 animate-slide-up" style={{ animationDelay: "50ms" }}>
        <Button className="gap-2 gradient-customer text-white border-0 shadow-lg hover:opacity-90">
          <Plus className="h-4 w-4" />
          Book a Service
        </Button>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          View Schedule
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={24}
          change="+3 this month"
          changeType="positive"
          icon={CalendarCheck}
          iconClassName="bg-customer/10 text-customer"
          delay={100}
        />
        <StatCard
          title="Upcoming"
          value={3}
          change="Next: Dec 30"
          changeType="neutral"
          icon={Clock}
          iconClassName="bg-warning/10 text-warning"
          delay={150}
        />
        <StatCard
          title="Completed"
          value={21}
          change="98% satisfaction"
          changeType="positive"
          icon={CheckCircle2}
          iconClassName="bg-success/10 text-success"
          delay={200}
        />
        <StatCard
          title="Loyalty Points"
          value="2,450"
          change="Gold member"
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
            <Button variant="ghost" size="sm" className="text-customer gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          }
          className="lg:col-span-2"
          delay={300}
        >
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center gap-4 rounded-lg border border-border/50 p-4 transition-all hover:border-customer/30 hover:bg-customer/5"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={booking.avatar} />
                  <AvatarFallback className="bg-customer/10 text-customer font-medium">
                    {booking.company.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{booking.service}</p>
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
                  <p className="text-sm text-muted-foreground">{booking.company}</p>
                  <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {booking.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {booking.time}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Details
                </Button>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Recent Activity */}
        <DashboardCard title="Recent Activity" delay={350}>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 border-b border-border/50 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-customer/10">
                  <CheckCircle2 className="h-4 w-4 text-customer" />
                </div>
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.service}</p>
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      {/* Featured Services */}
      <DashboardCard
        title="Recommended Services"
        description="Based on your preferences"
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
