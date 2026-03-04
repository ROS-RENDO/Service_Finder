"use client"
import { useMemo } from "react";
import { useRouter } from "next/navigation";
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
  Timer,
  Briefcase,
  Star,
  Loader2,
  Building2,
  AlertTriangle,
  Ruler
} from "lucide-react";
import { useAuthContext } from "@/lib/contexts/AuthContext";
import { useStaffBookings, useStaffServiceRequests, formatStaffTime } from "@/lib/hooks/useStaff";
import { format } from "date-fns";

export default function StaffDashboard() {
  const { user } = useAuthContext();
  const router = useRouter();

  // Fetch all staff bookings
  const { bookings, loading, error: bookingsError } = useStaffBookings({ autoFetch: true });

  // Fetch pending service requests
  const { pendingServices, loading: servicesLoading } = useStaffServiceRequests({ autoFetch: true });

  // Filter today's bookings
  const todaySchedule = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return bookings.filter(booking => {
      const bookingDate = new Date(booking.bookingDate);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === today.getTime();
    }).sort((a, b) => {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });
  }, [bookings]);

  // Calculate stats
  const stats = useMemo(() => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const thisWeekBookings = bookings.filter(b => {
      const date = new Date(b.bookingDate);
      return date >= weekStart;
    });

    const completedToday = todaySchedule.filter(b => b.status === 'completed').length;
    const inProgressToday = todaySchedule.filter(b =>
      b.status === 'in_progress' || (b.status as any) === 'in-progress'
    ).length;

    return {
      todayJobs: todaySchedule.length,
      completedToday,
      inProgressToday,
      weeklyJobs: thisWeekBookings.length,
      weeklyHours: thisWeekBookings.reduce((sum, b) => {
        const start = new Date(b.startTime);
        const end = new Date(b.endTime);
        return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }, 0),
    };
  }, [bookings, todaySchedule]);

  const formatTimeRange = (start: string, end: string) => {
    return `${formatStaffTime(start)} - ${formatStaffTime(end)}`;
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // HANDLE UNASSIGNED STAFF STATE
  // If we have an error fetching bookings (likely 403/404 because not staff), show unassigned message
  if (bookingsError && bookings.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 animate-fade-in text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-yellow-100 mb-6">
          <AlertTriangle className="w-10 h-10 text-yellow-600" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Account Not Assigned</h1>
        <p className="text-xl text-muted-foreground max-w-lg mx-auto mb-8">
          Your account is active, but you haven't been assigned to a company yet.
        </p>

        <div className="bg-card border rounded-xl shadow-sm p-6 max-w-lg mx-auto text-left">
          <h3 className="font-semibold text-lg mb-2">Next Steps:</h3>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <div className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">1</span>
              </div>
              <p className="text-muted-foreground">Contact your Company Administrator.</p>
            </li>
            <li className="flex gap-3">
              <div className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">2</span>
              </div>
              <div>
                <p className="text-muted-foreground">Give them your registered email address:</p>
                <code className="bg-muted px-2 py-1 rounded text-sm mt-1 inline-block font-semibold">
                  {user?.email}
                </code>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">3</span>
              </div>
              <p className="text-muted-foreground">Ask them to add you to the company staff list.</p>
            </li>
          </ul>
        </div>

        <div className="mt-8">
          <p className="text-sm text-muted-foreground">
            Once they add you, refresh this page to see your dashboard.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Good morning, {user?.fullName}! ☀️</h1>
            <p className="mt-1 text-muted-foreground">
              You have {todaySchedule.length} job{todaySchedule.length !== 1 ? 's' : ''} scheduled for today
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
          value={stats.todayJobs}
          change={`${stats.completedToday} completed, ${stats.inProgressToday} in progress`}
          changeType="neutral"
          icon={Briefcase}
          iconClassName="bg-staff/10 text-staff"
          delay={100}
        />
        <StatCard
          title="Hours Today"
          value={`${stats.todayJobs > 0 ? Math.round(stats.weeklyHours / stats.weeklyJobs * stats.todayJobs) || 0 : 0}h`}
          change={`${stats.todayJobs - stats.completedToday} remaining`}
          changeType="neutral"
          icon={Timer}
          iconClassName="bg-warning/10 text-warning"
          delay={150}
        />
        <StatCard
          title="This Week"
          value={`${stats.weeklyJobs} jobs`}
          change={`${Math.round(stats.weeklyHours)}h worked`}
          changeType="positive"
          icon={Calendar}
          iconClassName="bg-success/10 text-success"
          delay={200}
        />
        <StatCard
          title="Pending Requests"
          value={pendingServices.length}
          change="Need approval"
          changeType={pendingServices.length > 0 ? "neutral" : "positive"}
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
          description={format(new Date(), 'MMMM dd, yyyy')}
          action={
            <Button
              variant="ghost"
              size="sm"
              className="text-staff gap-1"
              onClick={() => router.push('/staff/schedule')}
            >
              Full schedule <ArrowRight className="h-4 w-4" />
            </Button>
          }
          className="lg:col-span-2"
          delay={300}
        >
          <div className="space-y-4">
            {todaySchedule.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No jobs scheduled for today</p>
                <p className="text-sm mt-1">Enjoy your day off!</p>
              </div>
            ) : (
              todaySchedule.map((job) => (
                <div
                  key={job.id}
                  onClick={() => router.push(`/staff/bookings/${job.id}`)}
                  className={`rounded-xl border p-4 transition-all cursor-pointer hover:shadow-lg ${job.status === "in_progress"
                    ? "border-staff/50 bg-staff/5 ring-2 ring-staff/20"
                    : job.status === "completed"
                      ? "border-success/30 bg-success/5"
                      : "border-border/50 hover:border-staff/30"
                    }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={
                            job.status === "in_progress" ? "bg-staff/10 text-staff" : job.status === "completed" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                          }
                        >
                          {(job.status === "in_progress") && (
                            <span className="mr-1.5 h-2 w-2 rounded-full bg-staff animate-pulse" />
                          )}
                          {job.status === "completed" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                          {job.status.replace('_', ' ')}
                        </Badge>
                        <span className="text-sm font-medium text-muted-foreground">
                          {formatTimeRange(job.startTime, job.endTime)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{job.service?.name || 'Service'}</h4>
                        <p className="text-sm text-muted-foreground">{job.customer?.fullName || job.company?.name}</p>
                      </div>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span>{job.serviceAddress}</span>
                        </div>
                        {job.customer?.phone && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4 shrink-0" />
                            <span>{job.customer.phone}</span>
                          </div>
                        )}
                        {job.customerNotes && (
                          <div className="flex items-center gap-2 text-warning">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{job.customerNotes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button className="gap-2 gradient-staff text-white border-0">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DashboardCard>

        {/* Quick Stats */}
        <DashboardCard title="Quick Stats" delay={350}>
          <div className="space-y-4">
            {/* Weekly chart placeholder */}
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground mb-2">This Week</p>
              <p className="text-2xl font-bold">{stats.weeklyJobs}</p>
              <p className="text-xs text-muted-foreground">Total Jobs</p>
            </div>

            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground mb-2">Hours Worked</p>
              <p className="text-2xl font-bold">{Math.round(stats.weeklyHours)}</p>
              <p className="text-xs text-muted-foreground">This Week</p>
            </div>

            {pendingServices.length > 0 && (
              <div
                className="rounded-lg border border-staff/20 bg-staff/5 p-4 cursor-pointer hover:bg-staff/10 transition-colors"
                onClick={() => router.push('/staff/services')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Pending Requests</p>
                    <p className="text-2xl font-bold text-staff">{pendingServices.length}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-staff" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Service requests need your approval
                </p>
              </div>
            )}
          </div>
        </DashboardCard>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "My Schedule", icon: Calendar, desc: "View full calendar", href: "/staff/schedule" },
          { label: "Update Availability", icon: Clock, desc: "Set your schedule", href: "/staff/availability" },
          { label: "Active Jobs", icon: Briefcase, desc: "Manage bookings", href: "/staff/bookings" },
          { label: "My Profile", icon: Star, desc: "View performance", href: "/staff/profile" },
          { label: "Measure Wall", icon: Ruler, desc: "AI Area Calc", href: "/staff/measurement" },
        ].map((action, i) => (
          <button
            key={action.label}
            onClick={() => router.push(action.href)}
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
