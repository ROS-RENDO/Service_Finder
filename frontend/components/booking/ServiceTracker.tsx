import { motion } from "framer-motion";
import { CheckCircle, Circle, Clock, UserCheck, Navigation, Wrench, ClipboardCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TrackingStep {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  status: "completed" | "current" | "upcoming";
  time?: string;
}

interface ServiceTrackerProps {
  bookingStatus: string;
  staffName?: string;
  staffPhoto?: string;
  tasks?: { name: string; done: boolean }[];
}

export default function ServiceTracker({ bookingStatus, staffName, staffPhoto, tasks }: ServiceTrackerProps) {
  const steps: TrackingStep[] = [
    { id: "confirmed", label: "Booking Confirmed", description: "Payment received", icon: CheckCircle, status: "completed", time: "10:00 AM" },
    { id: "assigned", label: "Staff Assigned", description: staffName ? `${staffName} assigned` : "Awaiting assignment", icon: UserCheck, status: bookingStatus === "confirmed" ? "upcoming" : "completed", time: staffName ? "10:15 AM" : undefined },
    { id: "enroute", label: "En Route", description: "Staff is on the way", icon: Navigation, status: ["enroute", "in_progress", "completed"].includes(bookingStatus) ? "completed" : bookingStatus === "assigned" ? "current" : "upcoming", time: bookingStatus !== "confirmed" && bookingStatus !== "assigned" ? "10:30 AM" : undefined },
    { id: "in_progress", label: "Service In Progress", description: "Work has started", icon: Wrench, status: bookingStatus === "in_progress" ? "current" : bookingStatus === "completed" ? "completed" : "upcoming", time: bookingStatus === "in_progress" || bookingStatus === "completed" ? "10:45 AM" : undefined },
    { id: "completed", label: "Completed", description: "Service finished", icon: ClipboardCheck, status: bookingStatus === "completed" ? "completed" : "upcoming" },
  ];

  const completedCount = steps.filter((s) => s.status === "completed").length;
  const progressPercent = (completedCount / steps.length) * 100;

  const doneTasks = tasks?.filter((t) => t.done).length ?? 0;
  const totalTasks = tasks?.length ?? 0;

  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft">
      <h2 className="font-display text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" />
        Service Tracking
      </h2>

      {/* Overall progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Overall Progress</span>
          <span className="font-medium text-foreground">{Math.round(progressPercent)}%</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Staff info */}
      {staffName && (
        <div className="flex items-center gap-3 mb-6 p-3 bg-secondary/50 rounded-xl">
          <img src={staffPhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"} alt={staffName} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="font-medium text-foreground text-sm">{staffName}</p>
            <p className="text-xs text-muted-foreground">Assigned Staff</p>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-0">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isLast = idx === steps.length - 1;
          return (
            <div key={step.id} className="flex gap-3">
              {/* Line + dot */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.status === "completed" ? "bg-green-500/15" : step.status === "current" ? "bg-primary/15" : "bg-muted"
                  }`}
                >
                  {step.status === "completed" ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : step.status === "current" ? (
                    <Icon className="w-4 h-4 text-primary animate-pulse" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground/40" />
                  )}
                </motion.div>
                {!isLast && (
                  <div className={`w-0.5 h-8 ${step.status === "completed" ? "bg-green-500/30" : "bg-border"}`} />
                )}
              </div>
              {/* Content */}
              <div className="pb-4">
                <p className={`text-sm font-medium ${step.status === "upcoming" ? "text-muted-foreground" : "text-foreground"}`}>
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
                {step.time && <p className="text-xs text-muted-foreground/70 mt-0.5">{step.time}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task checklist when in progress */}
      {bookingStatus === "in_progress" && tasks && tasks.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium text-foreground">Tasks</p>
            <span className="text-xs text-muted-foreground">{doneTasks}/{totalTasks} done</span>
          </div>
          <div className="space-y-2">
            {tasks.map((task, i) => (
              <div key={i} className={`flex items-center gap-2 text-sm ${task.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                {task.done ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Circle className="w-4 h-4 text-muted-foreground/40" />}
                {task.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
