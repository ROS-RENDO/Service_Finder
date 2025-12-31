"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Calendar,
  DollarSign,
} from "lucide-react";

const revenueData = [
  { month: "Jan", revenue: 28000 },
  { month: "Feb", revenue: 32000 },
  { month: "Mar", revenue: 35000 },
  { month: "Apr", revenue: 38000 },
  { month: "May", revenue: 42000 },
  { month: "Jun", revenue: 40000 },
  { month: "Jul", revenue: 45000 },
  { month: "Aug", revenue: 48000 },
  { month: "Sep", revenue: 47000 },
  { month: "Oct", revenue: 52000 },
  { month: "Nov", revenue: 55000 },
  { month: "Dec", revenue: 58000 },
];

const bookingsByService = [
  { name: "Deep Cleaning", value: 35, color: "hsl(173, 58%, 39%)" },
  { name: "Regular Cleaning", value: 28, color: "hsl(199, 89%, 48%)" },
  { name: "Office Cleaning", value: 20, color: "hsl(142, 71%, 45%)" },
  { name: "Move-out", value: 10, color: "hsl(38, 92%, 50%)" },
  { name: "Other", value: 7, color: "hsl(200, 15%, 45%)" },
];

const userGrowth = [
  { month: "Jul", customers: 1800, companies: 120 },
  { month: "Aug", customers: 2000, companies: 128 },
  { month: "Sep", customers: 2150, companies: 135 },
  { month: "Oct", customers: 2400, companies: 142 },
  { month: "Nov", customers: 2600, companies: 150 },
  { month: "Dec", customers: 2847, companies: 156 },
];

const topCompanies = [
  { name: "SparkleClean Pro", bookings: 245, revenue: 34500 },
  { name: "CleanMasters", bookings: 312, revenue: 42800 },
  { name: "Fresh & Tidy", bookings: 189, revenue: 28600 },
  { name: "EcoClean Solutions", bookings: 156, revenue: 21400 },
  { name: "PureShine Co", bookings: 98, revenue: 15200 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-semibold">$520,000</p>
              </div>
              <div className="rounded-full bg-success/10 p-2">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </div>
            <p className="mt-2 text-sm text-success">+23.5% from last year</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-semibold">12,847</p>
              </div>
              <div className="rounded-full bg-primary/10 p-2">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="mt-2 text-sm text-success">+18.2% from last year</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-semibold">2,847</p>
              </div>
              <div className="rounded-full bg-info/10 p-2">
                <Users className="h-5 w-5 text-info" />
              </div>
            </div>
            <p className="mt-2 text-sm text-success">+32.1% from last year</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Companies</p>
                <p className="text-2xl font-semibold">156</p>
              </div>
              <div className="rounded-full bg-warning/10 p-2">
                <Building2 className="h-5 w-5 text-warning" />
              </div>
            </div>
            <p className="mt-2 text-sm text-success">+28.3% from last year</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-elevated">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient
                    id="colorRevenue2"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(173, 58%, 39%)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(173, 58%, 39%)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(200, 20%, 88%)"
                />
                <XAxis
                  dataKey="month"
                  stroke="hsl(200, 15%, 45%)"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(200, 15%, 45%)"
                  fontSize={12}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(200, 20%, 88%)",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number | undefined) => [
                    `$${value?.toLocaleString() || "0"}`,
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(173, 58%, 39%)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>Bookings by Service</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingsByService}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${value}%`}
                  labelLine={false}
                >
                  {bookingsByService.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-wrap gap-2">
              {bookingsByService.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2 text-xs"
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowth}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(200, 20%, 88%)"
                />
                <XAxis
                  dataKey="month"
                  stroke="hsl(200, 15%, 45%)"
                  fontSize={12}
                />
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
                  dataKey="customers"
                  stroke="hsl(199, 89%, 48%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(199, 89%, 48%)" }}
                  name="Customers"
                />
                <Line
                  type="monotone"
                  dataKey="companies"
                  stroke="hsl(173, 58%, 39%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(173, 58%, 39%)" }}
                  name="Companies"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>Top Performing Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCompanies.map((company, index) => (
                <div
                  key={company.name}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{company.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {company.bookings} bookings
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-success">
                    ${company.revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
