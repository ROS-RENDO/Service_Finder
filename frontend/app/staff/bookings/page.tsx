"use client"
import { useState } from 'react';
import { Search, Filter, MapPin, Clock, User, ChevronRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type JobStatus = 'all' | 'upcoming' | 'in-progress' | 'completed';

const allJobs = [
  {
    id: '1',
    date: 'Today',
    time: '9:00 AM',
    duration: '2 hours',
    customer: 'Sarah Johnson',
    address: '123 Oak Street, Apt 4B',
    type: 'Deep Clean',
    status: 'upcoming' as const,
    price: 180,
  },
  {
    id: '2',
    date: 'Today',
    time: '12:00 PM',
    duration: '3 hours',
    customer: 'Michael Chen',
    address: '456 Maple Avenue',
    type: 'Move-out Clean',
    status: 'in-progress' as const,
    price: 320,
  },
  {
    id: '3',
    date: 'Today',
    time: '4:00 PM',
    duration: '1.5 hours',
    customer: 'Emily Davis',
    address: '789 Pine Road, Unit 12',
    type: 'Regular Clean',
    status: 'upcoming' as const,
    price: 95,
  },
  {
    id: '4',
    date: 'Tomorrow',
    time: '10:00 AM',
    duration: '2.5 hours',
    customer: 'Robert Kim',
    address: '567 Cedar Lane',
    type: 'Deep Clean',
    status: 'upcoming' as const,
    price: 220,
  },
  {
    id: '5',
    date: 'Yesterday',
    time: '9:00 AM',
    duration: '2 hours',
    customer: 'Lisa Wong',
    address: '234 Elm Street',
    type: 'Regular Clean',
    status: 'completed' as const,
    price: 120,
  },
  {
    id: '6',
    date: 'Dec 28',
    time: '2:00 PM',
    duration: '4 hours',
    customer: 'Tech Corp Office',
    address: '100 Business Park Drive',
    type: 'Commercial Clean',
    status: 'completed' as const,
    price: 450,
  },
];

const statusStyles = {
  upcoming: 'bg-secondary text-secondary-foreground',
  'in-progress': 'bg-primary/10 text-primary border border-primary/20',
  completed: 'bg-success/10 text-success',
};

const tabs: { label: string; value: JobStatus }[] = [
  { label: 'All Jobs', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' },
];

export default function StaffBookings() {
  const [activeTab, setActiveTab] = useState<JobStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = allJobs.filter((job) => {
    const matchesTab = activeTab === 'all' || job.status === activeTab;
    const matchesSearch = 
      job.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const groupedJobs = filteredJobs.reduce((acc, job) => {
    if (!acc[job.date]) {
      acc[job.date] = [];
    }
    acc[job.date].push(job);
    return acc;
  }, {} as Record<string, typeof allJobs>);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Active Jobs</h1>
        <p className="text-muted-foreground mt-1">Manage and track your cleaning jobs</p>
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
        {Object.entries(groupedJobs).map(([date, jobs], groupIndex) => (
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
                  className="job-card flex items-start gap-4 animate-slide-in"
                  style={{ animationDelay: `${0.25 + (groupIndex * jobs.length + index) * 0.03}s` }}
                >
                  {/* Time */}
                  <div className="flex-shrink-0 w-20">
                    <p className="text-sm font-semibold text-foreground">{job.time}</p>
                    <p className="text-xs text-muted-foreground">{job.duration}</p>
                  </div>

                  {/* Divider */}
                  <div className="w-px h-20 bg-border" />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-medium text-foreground">{job.type}</h3>
                        <p className="text-lg font-bold text-primary">${job.price}</p>
                      </div>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 capitalize",
                        statusStyles[job.status]
                      )}>
                        {job.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <User className="w-3.5 h-3.5" />
                        <span className="text-sm">{job.customer}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-xs truncate">{job.address}</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-2" />
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
