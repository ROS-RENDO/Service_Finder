import { StatCard } from "@/components/ui/stat-card";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserPlus,
  Activity,
  BarChart3,
  Shield,
} from "lucide-react";

const recentUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@email.com", role: "customer", status: "active", joined: "2h ago" },
  { id: 2, name: "CleanPro LLC", email: "admin@cleanpro.com", role: "company", status: "pending", joined: "5h ago" },
  { id: 3, name: "Bob Williams", email: "bob@email.com", role: "customer", status: "active", joined: "1d ago" },
  { id: 4, name: "Fresh Clean Co", email: "info@freshclean.com", role: "company", status: "active", joined: "2d ago" },
];

const systemAlerts = [
  { id: 1, type: "warning", message: "High server load detected", time: "10 min ago" },
  { id: 2, type: "info", message: "3 new company registrations pending review", time: "1h ago" },
  { id: 3, type: "success", message: "Database backup completed", time: "3h ago" },
];

const topCategories = [
  { name: "Deep Cleaning", bookings: 2450, revenue: "$367,500", growth: 12 },
  { name: "Regular Cleaning", bookings: 1890, revenue: "$151,200", growth: 8 },
  { name: "Office Cleaning", bookings: 980, revenue: "$245,000", growth: 15 },
  { name: "Window Cleaning", bookings: 650, revenue: "$65,000", growth: -3 },
];

export default function AdminDashboard() {
  return (
    <>
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold">Platform Overview</h1>
        <p className="mt-1 text-muted-foreground">
          Monitor and manage the CleanFlow platform
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value="12,847"
          change="+234 this week"
          changeType="positive"
          icon={Users}
          iconClassName="bg-admin/10 text-admin"
          delay={100}
        />
        <StatCard
          title="Active Companies"
          value={486}
          change="+12 pending approval"
          changeType="neutral"
          icon={Building2}
          iconClassName="bg-company/10 text-company"
          delay={150}
        />
        <StatCard
          title="Platform Revenue"
          value="$1.2M"
          change="+18.5% vs last month"
          changeType="positive"
          icon={DollarSign}
          iconClassName="bg-success/10 text-success"
          delay={200}
        />
        <StatCard
          title="Active Bookings"
          value="3,429"
          change="Real-time"
          changeType="neutral"
          icon={Activity}
          iconClassName="bg-warning/10 text-warning"
          delay={250}
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Platform Analytics */}
        <DashboardCard
          title="Platform Growth"
          description="User & booking trends"
          action={
            <Button variant="ghost" size="sm" className="text-admin gap-1">
              Full analytics <ArrowRight className="h-4 w-4" />
            </Button>
          }
          className="lg:col-span-2"
          delay={300}
        >
          <div className="space-y-6">
            {/* Chart */}
            <div className="flex h-48 items-end gap-3">
              {[
                { users: 40, bookings: 35 },
                { users: 45, bookings: 42 },
                { users: 52, bookings: 48 },
                { users: 58, bookings: 55 },
                { users: 65, bookings: 60 },
                { users: 72, bookings: 68 },
                { users: 78, bookings: 75 },
                { users: 85, bookings: 80 },
                { users: 88, bookings: 82 },
                { users: 92, bookings: 88 },
                { users: 95, bookings: 90 },
                { users: 100, bookings: 95 },
              ].map((data, i) => (
                <div key={i} className="flex flex-1 flex-col gap-1">
                  <div className="flex h-full flex-col justify-end gap-0.5">
                    <div
                      className="w-full rounded-t-sm bg-admin/70 transition-all hover:bg-admin"
                      style={{ height: `${data.users}%` }}
                    />
                    <div
                      className="w-full rounded-t-sm bg-primary/40 transition-all hover:bg-primary/60"
                      style={{ height: `${data.bookings}%` }}
                    />
                  </div>
                  <span className="text-center text-[10px] text-muted-foreground">
                    {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
                  </span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-admin" />
                <span className="text-muted-foreground">Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-primary/60" />
                <span className="text-muted-foreground">Bookings</span>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-2xl font-bold">12.8K</p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-2xl font-bold">486</p>
                <p className="text-xs text-muted-foreground">Companies</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-2xl font-bold">1.2K</p>
                <p className="text-xs text-muted-foreground">Staff</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-2xl font-bold">98.9%</p>
                <p className="text-xs text-muted-foreground">Uptime</p>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* System Alerts */}
        <DashboardCard title="System Alerts" delay={350}>
          <div className="space-y-3">
            {systemAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-3 rounded-lg border p-3 ${
                  alert.type === "warning"
                    ? "border-warning/30 bg-warning/5"
                    : alert.type === "success"
                    ? "border-success/30 bg-success/5"
                    : "border-border/50"
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    alert.type === "warning"
                      ? "bg-warning/10"
                      : alert.type === "success"
                      ? "bg-success/10"
                      : "bg-muted"
                  }`}
                >
                  {alert.type === "warning" && (
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  )}
                  {alert.type === "success" && (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  )}
                  {alert.type === "info" && (
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Alerts
            </Button>
          </div>
        </DashboardCard>
      </div>

      {/* Recent Users & Top Categories */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <DashboardCard
          title="Recent Registrations"
          action={
            <Button variant="ghost" size="sm" className="text-admin gap-1">
              <UserPlus className="h-4 w-4" />
              View all
            </Button>
          }
          delay={400}
        >
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg border border-border/50 p-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback
                      className={
                        user.role === "company"
                          ? "bg-company/10 text-company"
                          : "bg-customer/10 text-customer"
                      }
                    >
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={
                      user.role === "company"
                        ? "bg-company/10 text-company"
                        : "bg-customer/10 text-customer"
                    }
                  >
                    {user.role}
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
            ))}
          </div>
        </DashboardCard>

        {/* Top Categories */}
        <DashboardCard
          title="Top Categories"
          description="By booking volume"
          delay={450}
        >
          <div className="space-y-4">
            {topCategories.map((category, i) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-admin/10 text-xs font-bold text-admin">
                      {i + 1}
                    </span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground">
                      {category.bookings.toLocaleString()} bookings
                    </span>
                    <span
                      className={`flex items-center gap-0.5 font-medium ${
                        category.growth > 0 ? "text-success" : "text-destructive"
                      }`}
                    >
                      {category.growth > 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {Math.abs(category.growth)}%
                    </span>
                  </div>
                </div>
                <Progress
                  value={(category.bookings / 2450) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Manage Users", icon: Users, count: "12.8K" },
          { label: "Review Companies", icon: Building2, count: "12 pending" },
          { label: "View Analytics", icon: BarChart3, count: "Real-time" },
          { label: "Security Center", icon: Shield, count: "All clear" },
        ].map((action, i) => (
          <button
            key={action.label}
            className="group flex items-center justify-between rounded-xl border border-border/50 bg-card p-4 text-left transition-all hover:border-admin/30 hover:shadow-lg animate-slide-up"
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
        ))}
      </div>
    </>
  );
}
