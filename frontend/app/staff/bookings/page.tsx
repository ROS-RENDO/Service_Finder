"use client"
import { useState } from 'react';
import { Search, Filter, Clock, User, ChevronRight, Calendar, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useStaffBookings } from '@/lib/hooks/useStaff';

type JobStatus = 'all' | 'pending' | 'confirmed' | 'completed';

const statusStyles = {
  pending: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
  confirmed: 'bg-secondary text-secondary-foreground',
  in_progress: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
  completed: 'bg-green-500/10 text-green-600',
  cancelled: 'bg-red-500/10 text-red-600',
};

const tabs: { label: string; value: JobStatus }[] = [
  { label: 'All Jobs', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
];

export default function StaffBookings() {
  const [activeTab, setActiveTab] = useState<JobStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get staff ID from auth
  const getStaffId = () => {
    if (typeof window === 'undefined') return '';
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.staffId || '';
  };

  const [staffId] = useState<string>(getStaffId);

  // Fetch bookings from staff backend (company-based for this staff)
  const { bookings, loading, error, fetchBookings } = useStaffBookings({
    autoFetch: true,
  });

  // Filter bookings
  const filteredJobs = bookings.filter((job) => {
    const matchesTab = activeTab === 'all' || job.status === activeTab;
    const matchesSearch = 
      job.service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Helper to format relative date
  const getRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

    if (dateOnly.getTime() === todayOnly.getTime()) return 'Today';
    if (dateOnly.getTime() === yesterdayOnly.getTime()) return 'Yesterday';
    if (dateOnly.getTime() === tomorrowOnly.getTime()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Helper to calculate duration
  const calculateDuration = (start: string, end: string) => {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const durationMinutes = endMinutes - startMinutes;
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    if (hours === 0) return `${minutes} min`;
    if (minutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours}h ${minutes}m`;
  };

  // Group jobs by date
  const groupedJobs = filteredJobs.reduce((acc, job) => {
    const relativeDate = getRelativeDate(job.bookingDate);
    if (!acc[relativeDate]) {
      acc[relativeDate] = [];
    }
    acc[relativeDate].push(job);
    return acc;
  }, {} as Record<string, typeof bookings>);

  // Sort groups by date
  const sortedGroups = Object.entries(groupedJobs).sort((a, b) => {
    const dateA = a[1][0].bookingDate;
    const dateB = b[1][0].bookingDate;
    return new Date(dateA).getTime() - new Date(dateB).getTime();
  });

  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };
    return statusMap[status] || status;
  };

  if (loading && !bookings.length) {
    return (
      <div className="max-w-4xl mx-auto pt-12 lg:pt-0">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto pt-12 lg:pt-0">
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-6 text-center">
          <p className="text-destructive font-medium">Failed to load jobs</p>
          <button 
            onClick={() => fetchBookings()}
            className="mt-3 text-sm text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Active Jobs</h1>
        <p className="text-muted-foreground mt-1">Manage and track your jobs</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card text-foreground hover:bg-secondary transition-colors">
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filters</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 animate-fade-in" style={{ animationDelay: '0.15s' }}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
              activeTab === tab.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Jobs List */}
      <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        {sortedGroups.map(([date, jobs], groupIndex) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">{date}</h3>
            </div>
            <div className="space-y-3">
              {jobs.map((job, index) => (
                <Link
                  key={job.id}
                  href={`/staff/bookings/${job.id}`}
                  className="block bg-card rounded-xl border border-border p-4 hover:border-primary/50 hover:shadow-md transition-all animate-slide-in"
                  style={{ animationDelay: `${0.25 + (groupIndex * jobs.length + index) * 0.03}s` }}
                >
                  <div className="flex items-start gap-4">
                    {/* Time */}
                    <div className="flex-shrink-0 w-20">
                      <p className="text-sm font-semibold text-foreground">{job.startTime}</p>
                      <p className="text-xs text-muted-foreground">
                        {calculateDuration(job.startTime, job.endTime)}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-20 bg-border" />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-medium text-foreground">{job.service.name}</h3>
                          <p className="text-lg font-bold text-primary">
                            ${parseFloat(job.totalPrice).toFixed(2)}
                          </p>
                        </div>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0",
                          statusStyles[job.status as keyof typeof statusStyles] || statusStyles.pending
                        )}>
                          {getStatusDisplay(job.status)}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <User className="w-3.5 h-3.5" />
                          <span className="text-sm">{job.company.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{job.startTime} - {job.endTime}</span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-2" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-foreground">No jobs found</p>
            <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}