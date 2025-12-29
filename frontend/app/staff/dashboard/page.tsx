import { StatCard } from "@/components/ui/stat-card";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Navigation,
  Timer,
  Briefcase,
  Star,
} from "lucide-react";

const todaySchedule = [
  {
    id: 1,
    time: "9:00 AM - 11:00 AM",
    service: "Deep Cleaning",
    customer: "Emma Wilson",
    address: "123 Oak Street, Apt 4B",
    phone: "+1 (555) 123-4567",
    status: "completed",
    notes: "Use eco-friendly products",
  },
  {
    id: 2,
    time: "12:00 PM - 1:30 PM",
    service: "Regular Cleaning",
    customer: "James Brown",
    address: "456 Maple Avenue",
    phone: "+1 (555) 234-5678",
    status: "in-progress",
    notes: "Pet-friendly home",
  },
  {
    id: 3,
    time: "3:00 PM - 5:00 PM",
    service: "Window Cleaning",
    customer: "Olivia Davis",
    address: "789 Pine Road, Suite 12",
    phone: "+1 (555) 345-6789",
    status: "upcoming",
    notes: "High-rise building",
  },
];

const weeklyStats = [
  { day: "Mon", jobs: 4, hours: 8 },
  { day: "Tue", jobs: 3, hours: 6.5 },
  { day: "Wed", jobs: 5, hours: 9 },
  { day: "Thu", jobs: 4, hours: 7.5 },
  { day: "Fri", jobs: 3, hours: 6 },
  { day: "Sat", jobs: 2, hours: 4 },
  { day: "Sun", jobs: 0, hours: 0 },
];

export default function StaffDashboard() {
  return (
    <>
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Good morning, Maria! ☀️</h1>
            <p className="mt-1 text-muted-foreground">
              You have 3 jobs scheduled for today
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card px-4 py-2">
            <span className="text-sm font-medium">Available for work</span>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Jobs"
          value={3}
          change="1 completed, 1 in progress"
          changeType="neutral"
          icon={Briefcase}
          iconClassName="bg-staff/10 text-staff"
          delay={100}
        />
        <StatCard
          title="Hours Today"
          value="6.5h"
          change="2h remaining"
          changeType="neutral"
          icon={Timer}
          iconClassName="bg-warning/10 text-warning"
          delay={150}
        />
        <StatCard
          title="This Week"
          value="21 jobs"
          change="37h worked"
          changeType="positive"
          icon={Calendar}
          iconClassName="bg-success/10 text-success"
          delay={200}
        />
        <StatCard
          title="Rating"
          value="4.9"
          change="Top performer"
          changeType="positive"
          icon={Star}
          iconClassName="bg-staff/10 text-staff"
          delay={250}
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Schedule */}
        <DashboardCard
          title="Today's Schedule"
          description="December 29, 2024"
          action={
            <Button variant="ghost" size="sm" className="text-staff gap-1">
              Full schedule <ArrowRight className="h-4 w-4" />
            </Button>
          }
          className="lg:col-span-2"
          delay={300}
        >
          <div className="space-y-4">
            {todaySchedule.map((job) => (
              <div
                key={job.id}
                className={`rounded-xl border p-4 transition-all ${
                  job.status === "in-progress"
                    ? "border-staff/50 bg-staff/5 ring-2 ring-staff/20"
                    : job.status === "completed"
                    ? "border-success/30 bg-success/5"
                    : "border-border/50"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={
                          job.status === "in-progress"
                            ? "bg-staff/10 text-staff"
                            : job.status === "completed"
                            ? "bg-success/10 text-success"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {job.status === "in-progress" && (
                          <span className="mr-1.5 h-2 w-2 rounded-full bg-staff animate-pulse" />
                        )}
                        {job.status === "completed" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                        {job.status}
                      </Badge>
                      <span className="text-sm font-medium text-muted-foreground">
                        {job.time}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{job.service}</h4>
                      <p className="text-sm text-muted-foreground">{job.customer}</p>
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span>{job.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4 shrink-0" />
                        <span>{job.phone}</span>
                      </div>
                      {job.notes && (
                        <div className="flex items-center gap-2 text-warning">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>{job.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {job.status === "in-progress" && (
                      <Button className="gap-2 gradient-staff text-white border-0">
                        <CheckCircle2 className="h-4 w-4" />
                        Complete
                      </Button>
                    )}
                    {job.status === "upcoming" && (
                      <Button variant="outline" className="gap-2">
                        <Navigation className="h-4 w-4" />
                        Navigate
                      </Button>
                    )}
                    {job.status !== "completed" && (
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Weekly Overview */}
        <DashboardCard title="Weekly Overview" delay={350}>
          <div className="space-y-4">
            {/* Mini Chart */}
            <div className="flex items-end justify-between gap-1 h-32">
              {weeklyStats.map((stat, i) => (
                <div key={stat.day} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t-sm transition-all ${
                      i === 3 ? "gradient-staff" : "bg-staff/20"
                    }`}
                    style={{ height: `${(stat.jobs / 5) * 100}%`, minHeight: stat.jobs > 0 ? "8px" : "0" }}
                  />
                  <span className="text-xs text-muted-foreground">{stat.day}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
                <p className="text-2xl font-bold">21</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hours Worked</p>
                <p className="text-2xl font-bold">41h</p>
              </div>
            </div>

            {/* Earnings */}
            <div className="rounded-lg border border-staff/20 bg-staff/5 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Estimated Earnings</p>
                <p className="text-2xl font-bold text-staff">$820</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Based on completed jobs this week
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Request Time Off", icon: Calendar, desc: "Submit leave request" },
          { label: "Update Availability", icon: Clock, desc: "Set your schedule" },
          { label: "View Earnings", icon: Briefcase, desc: "Payment history" },
          { label: "Contact Support", icon: Phone, desc: "Get help" },
        ].map((action, i) => (
          <button
            key={action.label}
            className="group flex items-center gap-4 rounded-xl border border-border/50 bg-card p-4 text-left transition-all hover:border-staff/30 hover:shadow-lg animate-slide-up"
            style={{ animationDelay: `${400 + i * 50}ms` }}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-staff/10 transition-transform group-hover:scale-110">
              <action.icon className="h-6 w-6 text-staff" />
            </div>
            <div>
              <p className="font-medium">{action.label}</p>
              <p className="text-sm text-muted-foreground">{action.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
