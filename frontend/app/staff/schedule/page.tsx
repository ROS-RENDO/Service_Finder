"use client"
import { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Clock, User } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Mock schedule data
const scheduleData: Record<string, Array<{
  id: string;
  time: string;
  duration: string;
  customer: string;
  address: string;
  type: string;
  status: 'upcoming' | 'in-progress' | 'completed';
}>> = {
  '2024-12-30': [
    { id: '1', time: '10:00 AM', duration: '2h', customer: 'Lisa Wong', address: '234 Elm St', type: 'Regular Clean', status: 'completed' },
  ],
  '2024-12-31': [
    { id: '2', time: '9:00 AM', duration: '2h', customer: 'Sarah Johnson', address: '123 Oak St, Apt 4B', type: 'Deep Clean', status: 'upcoming' },
    { id: '3', time: '12:00 PM', duration: '3h', customer: 'Michael Chen', address: '456 Maple Ave', type: 'Move-out Clean', status: 'in-progress' },
    { id: '4', time: '4:00 PM', duration: '1.5h', customer: 'Emily Davis', address: '789 Pine Rd', type: 'Regular Clean', status: 'upcoming' },
  ],
  '2025-01-02': [
    { id: '5', time: '9:00 AM', duration: '2.5h', customer: 'Robert Kim', address: '567 Cedar Lane', type: 'Deep Clean', status: 'upcoming' },
    { id: '6', time: '2:00 PM', duration: '2h', customer: 'Anna Martinez', address: '890 Birch Blvd', type: 'Regular Clean', status: 'upcoming' },
  ],
  '2025-01-03': [
    { id: '7', time: '11:00 AM', duration: '4h', customer: 'Tech Corp Office', address: '100 Business Park', type: 'Commercial Clean', status: 'upcoming' },
  ],
};

const statusStyles = {
  upcoming: 'bg-secondary text-secondary-foreground',
  'in-progress': 'bg-primary/10 text-primary',
  completed: 'bg-success/10 text-success',
};

export default function StaffSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (number | null)[] = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const hasJobs = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return scheduleData[formatDateKey(date)]?.length > 0;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const selectedDateJobs = scheduleData[formatDateKey(selectedDate)] || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">My Schedule</h1>
        <p className="text-muted-foreground mt-1">View and manage your upcoming jobs</p>
      </div>

      <div className="grid lg:grid-cols-[1fr,380px] gap-6">
        {/* Calendar */}
        <div className="bg-card rounded-xl border border-border p-4 lg:p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Week days header */}
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentDate).map((day, index) => (
              <button
                key={index}
                onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                disabled={!day}
                className={cn(
                  "aspect-square p-1 rounded-lg text-sm font-medium transition-all relative",
                  !day && "invisible",
                  day && "hover:bg-secondary",
                  day && isToday(day) && "bg-primary/10 text-primary",
                  day && isSelected(day) && "bg-primary text-primary-foreground hover:bg-primary",
                )}
              >
                {day}
                {day && hasJobs(day) && !isSelected(day) && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Day Jobs */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </h3>
            <span className="text-sm text-muted-foreground">
              {selectedDateJobs.length} job{selectedDateJobs.length !== 1 ? 's' : ''}
            </span>
          </div>

          {selectedDateJobs.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No jobs scheduled</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Enjoy your day off!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateJobs.map((job, index) => (
                <Link
                  key={job.id}
                  href={`/staff/bookings/${job.id}`}
                  className="job-card block animate-slide-in"
                  style={{ animationDelay: `${0.25 + index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground">{job.time}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-sm text-muted-foreground">{job.duration}</span>
                    </div>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium capitalize",
                      statusStyles[job.status]
                    )}>
                      {job.status.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-primary mb-1">{job.type}</p>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <User className="w-3.5 h-3.5" />
                    <span className="text-sm">{job.customer}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-xs">{job.address}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
