import { StatCard } from "@/components/ui/stat-card";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Users,
  DollarSign,
  Star,
  TrendingUp,
  Clock,
  ArrowRight,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";

const recentBookings = [
  {
    id: 1,
    customer: "Emma Wilson",
    service: "Deep Cleaning",
    date: "Today, 9:00 AM",
    amount: "$149",
    status: "in-progress",
  },
  {
    id: 2,
    customer: "James Brown",
    service: "Regular Cleaning",
    date: "Today, 2:00 PM",
    amount: "$79",
    status: "scheduled",
  },
  {
    id: 3,
    customer: "Olivia Davis",
    service: "Window Cleaning",
    date: "Tomorrow, 10:00 AM",
    amount: "$99",
    status: "scheduled",
  },
  {
    id: 4,
    customer: "Michael Chen",
    service: "Office Cleaning",
    date: "Dec 31, 9:00 AM",
    amount: "$299",
    status: "scheduled",
  },
];

const topStaff = [
  { id: 1, name: "Maria Garcia", role: "Senior Cleaner", rating: 4.9, jobs: 156 },
  { id: 2, name: "John Smith", role: "Team Lead", rating: 4.8, jobs: 142 },
  { id: 3, name: "Lisa Anderson", role: "Cleaner", rating: 4.7, jobs: 98 },
];

export default function CompanyDashboard() {
  return (
    <>
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold">Company Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Monitor your business performance and manage operations
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Monthly Revenue"
          value="$24,580"
          change="+12.5% vs last month"
          changeType="positive"
          icon={DollarSign}
          iconClassName="bg-company/10 text-company"
          delay={100}
        />
        <StatCard
          title="Total Bookings"
          value={186}
          change="+8 today"
          changeType="positive"
          icon={Calendar}
          iconClassName="bg-success/10 text-success"
          delay={150}
        />
        <StatCard
          title="Active Staff"
          value={12}
          change="2 on leave"
          changeType="neutral"
          icon={Users}
          iconClassName="bg-warning/10 text-warning"
          delay={200}
        />
        <StatCard
          title="Avg. Rating"
          value="4.8"
          change="Top 5% provider"
          changeType="positive"
          icon={Star}
          iconClassName="bg-company/10 text-company"
          delay={250}
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart Placeholder */}
        <DashboardCard
          title="Revenue Overview"
          description="Monthly performance"
          action={
            <Button variant="ghost" size="sm" className="text-company gap-1">
              View report <ArrowRight className="h-4 w-4" />
            </Button>
          }
          className="lg:col-span-2"
          delay={300}
        >
          <div className="space-y-6">
            {/* Chart placeholder */}
            <div className="flex h-48 items-end gap-2">
              {[40, 65, 45, 80, 55, 90, 75, 85, 60, 95, 70, 88].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-sm bg-company/20 transition-all hover:bg-company/40"
                    style={{ height: `${height}%` }}
                  >
                    <div
                      className="w-full rounded-t-sm gradient-company"
                      style={{ height: `${height * 0.7}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
                  </span>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-4">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-xl font-bold">$24,580</p>
                <p className="flex items-center gap-1 text-xs text-success">
                  <ArrowUpRight className="h-3 w-3" /> +12.5%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Month</p>
                <p className="text-xl font-bold">$21,840</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3" /> +8.2%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-bold">$3,420</p>
                <p className="flex items-center gap-1 text-xs text-warning">
                  <Clock className="h-3 w-3" /> 12 invoices
                </p>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Top Staff */}
        <DashboardCard title="Top Performers" description="This month" delay={350}>
          <div className="space-y-4">
            {topStaff.map((staff, i) => (
              <div
                key={staff.id}
                className="flex items-center gap-3 rounded-lg border border-border/50 p-3"
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-company/10 text-company text-sm font-medium">
                      {staff.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-card border-2 border-card text-xs font-bold text-company">
                    {i + 1}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{staff.name}</p>
                  <p className="text-xs text-muted-foreground">{staff.role}</p>
                </div>
                <div className="text-right">
                  <p className="flex items-center gap-1 text-sm font-medium">
                    <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                    {staff.rating}
                  </p>
                  <p className="text-xs text-muted-foreground">{staff.jobs} jobs</p>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      {/* Recent Bookings */}
      <DashboardCard
        title="Recent Bookings"
        description="Latest customer appointments"
        action={
          <Button variant="ghost" size="sm" className="text-company gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Button>
        }
        className="mt-6"
        delay={400}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                  Customer
                </th>
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                  Service
                </th>
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                  Date & Time
                </th>
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                  Amount
                </th>
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="group">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-muted text-xs">
                          {booking.customer.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{booking.customer}</span>
                    </div>
                  </td>
                  <td className="py-4 text-sm">{booking.service}</td>
                  <td className="py-4 text-sm text-muted-foreground">{booking.date}</td>
                  <td className="py-4 text-sm font-medium">{booking.amount}</td>
                  <td className="py-4">
                    <Badge
                      variant="secondary"
                      className={
                        booking.status === "in-progress"
                          ? "bg-company/10 text-company"
                          : booking.status === "scheduled"
                          ? "bg-warning/10 text-warning"
                          : ""
                      }
                    >
                      {booking.status}
                    </Badge>
                  </td>
                  <td className="py-4 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>

      {/* Quick Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border/50 bg-card p-4 animate-slide-up" style={{ animationDelay: "450ms" }}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Completion Rate</p>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
          <p className="mt-2 text-2xl font-bold">98.5%</p>
          <Progress value={98.5} className="mt-2 h-1.5" />
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-4 animate-slide-up" style={{ animationDelay: "500ms" }}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Response Time</p>
            <Clock className="h-4 w-4 text-warning" />
          </div>
          <p className="mt-2 text-2xl font-bold">15 min</p>
          <Progress value={85} className="mt-2 h-1.5" />
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-4 animate-slide-up" style={{ animationDelay: "550ms" }}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Customer Retention</p>
            <Users className="h-4 w-4 text-company" />
          </div>
          <p className="mt-2 text-2xl font-bold">87%</p>
          <Progress value={87} className="mt-2 h-1.5" />
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-4 animate-slide-up" style={{ animationDelay: "600ms" }}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">5-Star Reviews</p>
            <Star className="h-4 w-4 text-warning" />
          </div>
          <p className="mt-2 text-2xl font-bold">156</p>
          <Progress value={78} className="mt-2 h-1.5" />
        </div>
      </div>
    </>
  );
}
