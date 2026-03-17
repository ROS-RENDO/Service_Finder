"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
  LineChart, Line, Legend,
} from "recharts";
import {
  TrendingUp, Users, Building2, Calendar, DollarSign,
  Loader2, RefreshCw, AlertTriangle,
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  newUsersThisWeek: number;
  totalCompanies: number;
  pendingCompanies: number;
  totalBookings: number;
  activeBookings: number;
  totalRevenue: number;
  recentUsers: any[];
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

const CHART_COLORS = [
  "hsl(173, 58%, 39%)",
  "hsl(199, 89%, 48%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 60%, 50%)",
  "hsl(340, 75%, 55%)",
];

export default function AnalyticsPage() {
  const { stats, loading, error, refetch } = useAdminStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground">Loading analytics…</p>
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

  // Revenue display helper
  const fmtRevenue = (v: number) =>
    v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M`
    : v >= 1_000 ? `$${(v / 1_000).toFixed(1)}K`
    : `$${v.toFixed(0)}`;

  // Merge booking & user monthly data
  const combinedMonthly = stats.bookingsByMonth.map((b, i) => ({
    month: b.month,
    bookings: b.count,
    users: stats.usersByMonth[i]?.count ?? 0,
  }));

  // Pie chart: top categories
  const pieData = stats.topCategories.map((c, i) => ({
    name: c.name,
    value: c.bookings,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));
  const totalCatBookings = pieData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Real-time platform data</p>
        </div>
        <Button variant="outline" size="sm" onClick={refetch} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-semibold">{fmtRevenue(stats.totalRevenue)}</p>
              </div>
              <div className="rounded-full bg-success/10 p-2">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">From paid bookings</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-semibold">{stats.totalBookings.toLocaleString()}</p>
              </div>
              <div className="rounded-full bg-primary/10 p-2">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="mt-2 text-sm text-success">
              {stats.activeBookings} currently active
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-semibold">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="rounded-full bg-info/10 p-2">
                <Users className="h-5 w-5 text-info" />
              </div>
            </div>
            <p className="mt-2 text-sm text-success">
              +{stats.newUsersThisWeek} this week
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Companies</p>
                <p className="text-2xl font-semibold">{stats.totalCompanies}</p>
              </div>
              <div className="rounded-full bg-warning/10 p-2">
                <Building2 className="h-5 w-5 text-warning" />
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {stats.pendingCompanies} pending verification
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Bookings Trend */}
        <Card className="lg:col-span-2 shadow-elevated">
          <CardHeader>
            <CardTitle>Bookings Trend (Last 12 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            {combinedMonthly.every(d => d.bookings === 0) ? (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
                No booking data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={combinedMonthly}>
                  <defs>
                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(173, 58%, 39%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(173, 58%, 39%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 20%, 88%)" />
                  <XAxis dataKey="month" stroke="hsl(200, 15%, 45%)" fontSize={12} />
                  <YAxis stroke="hsl(200, 15%, 45%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(200, 20%, 88%)",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="bookings"
                    stroke="hsl(173, 58%, 39%)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorBookings)"
                    name="Bookings"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Bookings by Category pie */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>Bookings by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 || totalCatBookings === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
                No category booking data yet
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={95}
                      dataKey="value"
                      label={({ value }) =>
                        totalCatBookings > 0
                          ? `${Math.round((value / totalCatBookings) * 100)}%`
                          : ""
                      }
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: any) => [v.toLocaleString(), "Bookings"]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-3 flex flex-wrap gap-2">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5 text-xs">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name} ({item.value})</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Growth Line Chart */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>User Growth (Last 12 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            {combinedMonthly.every(d => d.users === 0) ? (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
                No user growth data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={combinedMonthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 20%, 88%)" />
                  <XAxis dataKey="month" stroke="hsl(200, 15%, 45%)" fontSize={12} />
                  <YAxis stroke="hsl(200, 15%, 45%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(200, 20%, 88%)",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="hsl(199, 89%, 48%)"
                    strokeWidth={2.5}
                    dot={{ fill: "hsl(199, 89%, 48%)", r: 3 }}
                    name="New Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top Categories Bar Chart */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>Top Categories by Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topCategories.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
                No category data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.topCategories} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 20%, 88%)" />
                  <XAxis type="number" stroke="hsl(200, 15%, 45%)" fontSize={12} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="hsl(200, 15%, 45%)"
                    fontSize={11}
                    width={100}
                    tick={{ textAnchor: "end" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(200, 20%, 88%)",
                      borderRadius: "8px",
                    }}
                    formatter={(v: any) => [v.toLocaleString(), "Bookings"]}
                  />
                  <Bar
                    dataKey="bookings"
                    fill="hsl(173, 58%, 39%)"
                    radius={[0, 4, 4, 0]}
                    name="Bookings"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
