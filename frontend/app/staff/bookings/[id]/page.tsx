"use client"
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Circle,
  AlertCircle,
  Home,
  Sparkles,
  Navigation
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type JobStatus = 'upcoming' | 'in-progress' | 'completed';

const jobData: {
  id: string;
  date: string;
  time: string;
  duration: string;
  customer: { name: string; phone: string; email: string };
  address: string;
  type: string;
  status: JobStatus;
  price: number;
  notes: string;
  propertyType: string;
  checklist: { id: string; task: string; completed: boolean }[];
} = {
  id: '2',
  date: 'Tuesday, December 31, 2024',
  time: '12:00 PM - 3:00 PM',
  duration: '3 hours',
  customer: {
    name: 'Michael Chen',
    phone: '+1 (555) 234-5678',
    email: 'michael.chen@email.com',
  },
  address: '456 Maple Avenue, San Francisco, CA 94102',
  type: 'Move-out Clean',
  status: 'in-progress',
  price: 320,
  notes: 'Please pay extra attention to the kitchen and bathrooms. The tenant is moving out and needs the deposit back.',
  propertyType: '2 Bedroom Apartment',
  checklist: [
    { id: '1', task: 'Kitchen deep clean', completed: true },
    { id: '2', task: 'Bathroom sanitization (x2)', completed: true },
    { id: '3', task: 'Vacuum all carpets', completed: false },
    { id: '4', task: 'Mop hardwood floors', completed: false },
    { id: '5', task: 'Clean windows interior', completed: false },
    { id: '6', task: 'Wipe all surfaces and cabinets', completed: false },
    { id: '7', task: 'Clean appliances (oven, fridge)', completed: false },
    { id: '8', task: 'Final walkthrough', completed: false },
  ],
};

const statusStyles = {
  upcoming: { bg: 'bg-secondary', text: 'text-secondary-foreground', label: 'Upcoming' },
  'in-progress': { bg: 'bg-primary/10', text: 'text-primary', label: 'In Progress' },
  completed: { bg: 'bg-success/10', text: 'text-success', label: 'Completed' },
};

export default function StaffBookingDetail() {
  const { id } = useParams();
  const [checklist, setChecklist] = useState(jobData.checklist);

  const toggleTask = (taskId: string) => {
    setChecklist(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedCount = checklist.filter(t => t.completed).length;
  const progress = (completedCount / checklist.length) * 100;

  const status = statusStyles[jobData.status];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-12 lg:pt-0 pb-24">
      {/* Back Button */}
      <Link
        href="/staff/bookings"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors animate-fade-in"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Jobs</span>
      </Link>

      {/* Header Card */}
      <div className="bg-card rounded-xl border border-border p-5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className={cn("text-xs px-2 py-1 rounded-full font-medium", status.bg, status.text)}>
              {status.label}
            </span>
            <h1 className="text-xl font-bold text-foreground mt-2">{jobData.type}</h1>
            <p className="text-2xl font-bold text-primary mt-1">${jobData.price}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Clock className="w-5 h-5" />
            <div>
              <p className="text-sm font-medium text-foreground">{jobData.time}</p>
              <p className="text-xs">{jobData.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Home className="w-5 h-5" />
            <div>
              <p className="text-sm font-medium text-foreground">{jobData.propertyType}</p>
              <p className="text-xs">{jobData.duration}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Location Card */}
      <div className="bg-card rounded-xl border border-border p-5 animate-fade-in" style={{ animationDelay: '0.15s' }}>
        <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Location
        </h2>
        <p className="text-muted-foreground mb-4">{jobData.address}</p>
        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
          <Navigation className="w-5 h-5" />
          Get Directions
        </button>
      </div>

      {/* Customer Card */}
      <div className="bg-card rounded-xl border border-border p-5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Customer
        </h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-lg font-semibold text-secondary-foreground">MC</span>
          </div>
          <div>
            <p className="font-medium text-foreground">{jobData.customer.name}</p>
            <p className="text-sm text-muted-foreground">{jobData.customer.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card text-foreground hover:bg-secondary transition-colors">
            <Phone className="w-4 h-4" />
            <span className="text-sm font-medium">Call</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card text-foreground hover:bg-secondary transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">Message</span>
          </button>
        </div>
      </div>

      {/* Notes Card */}
      {jobData.notes && (
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-5 animate-fade-in" style={{ animationDelay: '0.25s' }}>
          <h2 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-accent" />
            Special Instructions
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{jobData.notes}</p>
        </div>
      )}

      {/* Checklist Card */}
      <div className="bg-card rounded-xl border border-border p-5 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Cleaning Checklist
          </h2>
          <span className="text-sm text-muted-foreground">{completedCount}/{checklist.length}</span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-secondary rounded-full mb-4 overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-2">
          {checklist.map((task) => (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left",
                task.completed 
                  ? "bg-success/5 text-success" 
                  : "bg-secondary/50 hover:bg-secondary text-foreground"
              )}
            >
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
              )}
              <span className={cn("text-sm", task.completed && "line-through opacity-70")}>
                {task.task}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="max-w-3xl mx-auto flex gap-3">
          {jobData.status === 'upcoming' && (
            <button className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
              Start Job
            </button>
          )}
          {jobData.status === 'in-progress' && (
            <>
              <button className="flex-1 py-3 rounded-lg border border-border bg-card text-foreground font-medium hover:bg-secondary transition-colors">
                Report Issue
              </button>
              <button 
                className={cn(
                  "flex-1 py-3 rounded-lg font-medium transition-colors",
                  progress === 100 
                    ? "bg-success text-success-foreground hover:bg-success/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {progress === 100 ? 'Complete Job' : 'Mark Complete'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
