"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/ui/stat-card";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/lib/hooks/use-toast";
import {
  Calendar,
  Users,
  DollarSign,
  Star,
  TrendingUp,
  Clock,
  ArrowRight,
  MoreHorizontal,
  Loader2,
  Building2,
  CheckCircle2
} from "lucide-react";
import { useCompanyMe } from "@/lib/hooks/useCompanies";

interface BookingItem {
  id: string;
  status: string;
  bookingDate: string;
  startTime?: string;
  totalPrice?: number | string;
  customer?: { fullName?: string };
  service?: { name?: string };
}

interface StaffItem {
  id: string;
  fullName: string;
  role: string;
  averageRating?: number | null;
  completedJobs?: number;
}

export default function CompanyDashboard() {
  const { company, loading: companyLoading, error: companyError, fetchMe } = useCompanyMe({ autoFetch: true });
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [staff, setStaff] = useState<StaffItem[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingStaff, setLoadingStaff] = useState(true);

  // Onboarding State
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    registrationNumber: "",
  });
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!company) {
      // If no company, we shouldn't attempt to fetch dashboard data
      // We also ensure loading states are cleared to avoid stuck spinners if this component were to render
      setLoadingBookings(false);
      setLoadingStaff(false);
      return;
    }

    setLoadingBookings(true);
    setLoadingStaff(true);


    let cancelled = false;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
    const opts: RequestInit = { headers, credentials: "include" };

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/bookings?limit=10`, opts)
      .then((res) => res.ok ? res.json() : { bookings: [] })
      .then((data) => {
        if (!cancelled) setBookings(data.bookings || []);
      })
      .finally(() => { if (!cancelled) setLoadingBookings(false); });

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/staff`, opts)
      .then((res) => res.ok ? res.json() : { staff: [] })
      .then((data) => {
        if (!cancelled) setStaff(data.staff || []);
      })
      .finally(() => { if (!cancelled) setLoadingStaff(false); });

    return () => { cancelled = true; };
  }, [company]);

  const stats = useMemo(() => {
    const pending = bookings.filter((b) => b.status === "pending").length;
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const inProgress = bookings.filter((b) => b.status === "in_progress").length;
    const completed = bookings.filter((b) => b.status === "completed").length;
    const totalRevenue = bookings
      .filter((b) => b.status === "completed" || b.status === "in_progress")
      .reduce((sum, b) => sum + Number(b.totalPrice ?? 0), 0);
    return {
      totalBookings: bookings.length,
      pending,
      confirmed,
      inProgress,
      completed,
      monthlyRevenue: totalRevenue,
      activeStaff: staff.filter((s) => s).length,
      topStaff: staff
        .slice()
        .sort((a, b) => (b.completedJobs ?? 0) - (a.completedJobs ?? 0))
        .slice(0, 3),
    };
  }, [bookings, staff]);

  const recentBookings = useMemo(
    () =>
      bookings
        .slice()
        .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
        .slice(0, 5),
    [bookings]
  );

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create company");
      }

      toast({
        title: "Company Created!",
        description: "Your dashboard is now ready.",
      });

      fetchMe(); // Refresh company data
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (companyLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ONBOARDING FLOW: If no company exists, show create form
  if (!company && !companyLoading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
            <Building2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome to Service Finder!</h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">
            Let's get your business set up. Create your company profile to start managing bookings and staff.
          </p>
        </div>

        <div className="bg-card border rounded-xl shadow-lg p-8">
          <form onSubmit={handleCreateCompany} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  required
                  placeholder="e.g. Sparkle Cleaners"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Business Email <span className="text-destructive">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="contact@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell customers about your services..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
                <Input
                  id="phone"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  placeholder="Business Reg. No."
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
                <Input
                  id="city"
                  required
                  placeholder="New York"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Company...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Create Company Profile
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold">Company Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          {company ? `${company.name} – monitor performance and operations` : "Monitor your business performance and manage operations"}
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toFixed(0)}`}
          change={stats.completed > 0 ? `${stats.completed} completed` : "No completed bookings yet"}
          changeType="neutral"
          icon={DollarSign}
          iconClassName="bg-company/10 text-company"
          delay={100}
        />
        <StatCard
          title="Total Bookings"
          value={loadingBookings ? "…" : stats.totalBookings}
          change={stats.pending > 0 ? `${stats.pending} pending` : "All caught up"}
          changeType={stats.pending > 0 ? "neutral" : "positive"}
          icon={Calendar}
          iconClassName="bg-success/10 text-success"
          delay={150}
        />
        <StatCard
          title="Active Staff"
          value={company?.staffCount ?? (loadingStaff ? "…" : staff.length)}
          change={company ? `${company.servicesCount} services` : ""}
          changeType="neutral"
          icon={Users}
          iconClassName="bg-warning/10 text-warning"
          delay={200}
        />
        <StatCard
          title="Avg. Rating"
          value="—"
          change="From reviews"
          changeType="neutral"
          icon={Star}
          iconClassName="bg-company/10 text-company"
          delay={250}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <DashboardCard
          title="Revenue Overview"
          description="From recent bookings"
          action={
            <Button variant="ghost" size="sm" className="text-company gap-1" asChild>
              <Link href="/company/payments">View payments <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          }
          className="lg:col-span-2"
          delay={300}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-4">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-xl font-bold">${stats.monthlyRevenue.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">bookings</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-xl font-bold">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">jobs</p>
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Top Performers" description="By completed jobs" delay={350}>
          <div className="space-y-4">
            {loadingStaff ? (
              <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
            ) : stats.topStaff.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No staff yet</p>
            ) : (
              stats.topStaff.map((s, i) => (
                <Link key={s.id} href={`/company/staff/${s.id}`}>
                  <div className="flex items-center gap-3 rounded-lg border border-border/50 p-3 hover:bg-muted/50 transition-colors">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-company/10 text-company text-sm font-medium">
                        {String(s.fullName).split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{s.fullName}</p>
                      <p className="text-xs text-muted-foreground capitalize">{String(s.role).replace("_", " ")}</p>
                    </div>
                    <div className="text-right">
                      {s.averageRating != null && (
                        <p className="flex items-center gap-1 text-sm font-medium">
                          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                          {s.averageRating.toFixed(1)}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">{s.completedJobs ?? 0} jobs</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </DashboardCard>
      </div>

      <DashboardCard
        title="Recent Bookings"
        description="Latest customer appointments"
        action={
          <Button variant="ghost" size="sm" className="text-company gap-1" asChild>
            <Link href="/company/bookings">View all <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        }
        className="mt-6"
        delay={400}
      >
        {loadingBookings ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
        ) : recentBookings.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No bookings yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Service</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="group">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-muted text-xs">
                            {booking.customer?.fullName?.split(" ").map((n) => n[0]).join("") ?? "—"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{booking.customer?.fullName ?? "—"}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm">{booking.service?.name ?? "—"}</td>
                    <td className="py-4 text-sm text-muted-foreground">
                      {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-4 text-sm font-medium">
                      ${Number(booking.totalPrice ?? 0).toFixed(2)}
                    </td>
                    <td className="py-4">
                      <Badge
                        variant="secondary"
                        className={
                          booking.status === "in_progress"
                            ? "bg-company/10 text-company"
                            : booking.status === "pending"
                              ? "bg-warning/10 text-warning"
                              : booking.status === "completed"
                                ? "bg-success/10 text-success"
                                : ""
                        }
                      >
                        {booking.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href="/company/bookings">
                          <MoreHorizontal className="h-4 w-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardCard>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border/50 bg-card p-4 animate-slide-up" style={{ animationDelay: "450ms" }}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Pending</p>
            <Clock className="h-4 w-4 text-warning" />
          </div>
          <p className="mt-2 text-2xl font-bold">{stats.pending}</p>
          <p className="text-xs text-muted-foreground">Bookings need action</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-4 animate-slide-up" style={{ animationDelay: "500ms" }}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Confirmed</p>
            <Calendar className="h-4 w-4 text-success" />
          </div>
          <p className="mt-2 text-2xl font-bold">{stats.confirmed}</p>
          <p className="text-xs text-muted-foreground">Scheduled</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-4 animate-slide-up" style={{ animationDelay: "550ms" }}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Staff</p>
            <Users className="h-4 w-4 text-company" />
          </div>
          <p className="mt-2 text-2xl font-bold">{company?.staffCount ?? staff.length}</p>
          <p className="text-xs text-muted-foreground">Team members</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-4 animate-slide-up" style={{ animationDelay: "600ms" }}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Services</p>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold">{company?.servicesCount ?? "—"}</p>
          <p className="text-xs text-muted-foreground">Offered</p>
        </div>
      </div>
    </>
  );
}
