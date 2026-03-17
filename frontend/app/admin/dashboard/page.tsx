"use client";
import { useState, useEffect } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Users, Building2, DollarSign, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle2, Clock, ArrowRight, UserPlus,
  Activity, BarChart3, Shield, Loader2, RefreshCw,
} from "lucide-react";
import Link from "next/link";

interface AdminStats {
  totalUsers: number;
  newUsersThisWeek: number;
  totalCompanies: number;
  pendingCompanies: number;
  totalBookings: number;
  activeBookings: number;
  totalRevenue: number;
  recentUsers: {
    id: string; fullName: string; email: string;
    role: string; status: string; createdAt: string;
  }[];
  topCategories: { name: string; slug: string; bookings: number }[];
  bookingsByMonth: { month: string; count: number }[];
  usersByMonth: { month: string; count: number }[];
}

function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/admin/stats`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load stats");
      const data = await res.json();
      if (data.success) setStats(data.stats);
      else throw new Error(data.message || "Failed to load stats");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);
  return { stats, loading, error, refetch: fetchStats };
}

export default function AdminDashboard() {
  const { stats, loading, error, refetch } = useAdminStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground">Loading dashboard stats…</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-3" />
          <p className="text-destructive mb-3">{error || "Failed to load"}</p>
          <Button onClick={refetch} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  // Build chart data — max bookings for scaling
  const maxBookings = Math.max(...stats.bookingsByMonth.map(d => d.count), 1);
  const maxUsers = Math.max(...stats.usersByMonth.map(d => d.count), 1);

  // Revenue display
  const revenueDisplay = stats.totalRevenue >= 1000000
    ? `$${(stats.totalRevenue / 1000000).toFixed(1)}M`
    : stats.totalRevenue >= 1000
    ? `$${(stats.totalRevenue / 1000).toFixed(1)}K`
    : `$${stats.totalRevenue.toFixed(0)}`;

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Platform Overview</h1>
          <p className="mt-1 text-muted-foreground">
            Monitor and manage the Service Finder platform
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={refetch} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          change={`+${stats.newUsersThisWeek} this week`}
          changeType="positive"
          icon={Users}
          iconClassName="bg-admin/10 text-admin"
          delay={100}
        />
        <StatCard
          title="Active Companies"
          value={stats.totalCompanies}
          change={`+${stats.pendingCompanies} pending approval`}
          changeType="neutral"
          icon={Building2}
          iconClassName="bg-company/10 text-company"
          delay={150}
        />
        <StatCard
          title="Platform Revenue"
          value={revenueDisplay}
          change="From completed payments"
          changeType="positive"
          icon={DollarSign}
          iconClassName="bg-success/10 text-success"
          delay={200}
        />
        <StatCard
          title="Active Bookings"
          value={stats.activeBookings.toLocaleString()}
          change={`${stats.totalBookings.toLocaleString()} total`}
          changeType="neutral"
          icon={Activity}
          iconClassName="bg-warning/10 text-warning"
          delay={250}
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Platform Growth Chart */}
        <DashboardCard
          title="Platform Growth"
          description="Bookings & user activity (last 12 months)"
          action={
            <Link href="/admin/analytics">
              <Button variant="ghost" size="sm" className="text-admin gap-1">
                Full analytics <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          }
          className="lg:col-span-2"
          delay={300}
        >
          <div className="space-y-6">
            {/* Bar chart */}
            <div className="flex h-48 items-end gap-2">
              {stats.bookingsByMonth.map((data, i) => {
                const userData = stats.usersByMonth[i];
                return (
                  <div key={i} className="flex flex-1 flex-col gap-0.5">
                    <div className="flex h-full flex-col justify-end gap-0.5">
                      <div
                        className="w-full rounded-t-sm bg-admin/70 transition-all hover:bg-admin"
                        style={{ height: `${(data.count / maxBookings) * 100}%` }}
                        title={`${data.count} bookings`}
                      />
                      <div
                        className="w-full rounded-t-sm bg-primary/40 transition-all hover:bg-primary/60"
                        style={{ height: `${(userData?.count ?? 0) / maxUsers * 100}%` }}
                        title={`${userData?.count ?? 0} new users`}
                      />
                    </div>
                    <span className="text-center text-[10px] text-muted-foreground">
                      {data.month}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-admin" />
                <span className="text-muted-foreground">Bookings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-primary/60" />
                <span className="text-muted-foreground">New Users</span>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-2xl font-bold">{stats.totalCompanies}</p>
                <p className="text-xs text-muted-foreground">Companies</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-2xl font-bold">{stats.totalBookings.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Bookings</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-2xl font-bold">{revenueDisplay}</p>
                <p className="text-xs text-muted-foreground">Revenue</p>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* System Status */}
        <DashboardCard title="Platform Status" delay={350}>
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/5 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">System Operational</p>
                <p className="text-xs text-muted-foreground">All services running</p>
              </div>
            </div>

            {stats.pendingCompanies > 0 && (
              <div className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warning/10">
                  <Clock className="h-4 w-4 text-warning" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{stats.pendingCompanies} companies pending review</p>
                  <p className="text-xs text-muted-foreground">Needs verification</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 rounded-lg border border-border/50 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm">{stats.activeBookings} active bookings</p>
                <p className="text-xs text-muted-foreground">Currently in progress</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border/50 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm">+{stats.newUsersThisWeek} new users this week</p>
                <p className="text-xs text-muted-foreground">Recent registrations</p>
              </div>
            </div>

            <Link href="/admin/verification">
              <Button variant="outline" className="w-full">
                Review Pending Companies ({stats.pendingCompanies})
              </Button>
            </Link>
          </div>
        </DashboardCard>
      </div>

      {/* Recent Users & Top Categories */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <DashboardCard
          title="Recent Registrations"
          action={
            <Link href="/admin/users">
              <Button variant="ghost" size="sm" className="text-admin gap-1">
                <UserPlus className="h-4 w-4" /> View all
              </Button>
            </Link>
          }
          delay={400}
        >
          <div className="space-y-3">
            {stats.recentUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No users yet</p>
            ) : (
              stats.recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback
                        className={
                          user.role === "company_admin"
                            ? "bg-company/10 text-company"
                            : "bg-customer/10 text-customer"
                        }
                      >
                        {user.fullName?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.fullName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={
                        user.role === "company_admin"
                          ? "bg-company/10 text-company"
                          : user.role === "admin"
                          ? "bg-admin/10 text-admin"
                          : "bg-customer/10 text-customer"
                      }
                    >
                      {user.role.replace("_", " ")}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={
                        user.status === "active"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      }
                    >
                      {user.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </DashboardCard>

        {/* Top Categories */}
        <DashboardCard
          title="Top Categories"
          description="By booking volume"
          delay={450}
        >
          <div className="space-y-4">
            {stats.topCategories.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No bookings yet</p>
            ) : (
              stats.topCategories.map((category, i) => {
                const maxCatBookings = Math.max(...stats.topCategories.map(c => c.bookings), 1);
                return (
                  <div key={category.slug} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-admin/10 text-xs font-bold text-admin">
                          {i + 1}
                        </span>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {category.bookings.toLocaleString()} bookings
                      </span>
                    </div>
                    <Progress value={(category.bookings / maxCatBookings) * 100} className="h-2" />
                  </div>
                );
              })
            )}
          </div>
        </DashboardCard>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Manage Users", icon: Users, count: `${stats.totalUsers.toLocaleString()} total`, href: "/admin/users" },
          { label: "Review Companies", icon: Building2, count: `${stats.pendingCompanies} pending`, href: "/admin/verification" },
          { label: "View Analytics", icon: BarChart3, count: "Detailed charts", href: "/admin/analytics" },
          { label: "Categories", icon: Shield, count: `${stats.topCategories.length} active`, href: "/admin/categories" },
        ].map((action, i) => (
          <Link key={action.label} href={action.href}>
            <button
              className="group flex w-full items-center justify-between rounded-xl border border-border/50 bg-card p-4 text-left transition-all hover:border-admin/30 hover:shadow-lg animate-slide-up"
              style={{ animationDelay: `${500 + i * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-admin/10 transition-transform group-hover:scale-110">
                  <action.icon className="h-5 w-5 text-admin" />
                </div>
                <div>
                  <p className="font-medium">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.count}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        ))}
      </div>
    </>
  );
}
