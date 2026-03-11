'use client'
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Navigation,
  CheckCircle2,
  Timer,
  User,
  FileText,
  DollarSign,
  ExternalLink,
  XCircle,
  Ban,
  ThumbsUp,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useStaffBookings } from "@/lib/hooks/useStaff";
import type { Booking, BookingStatus } from "@/types/booking.types";
import dynamic from "next/dynamic";

const DynamicStaffBookingMapCore = dynamic(
  () => import("@/components/service/StaffBookingMapCore"),
  { ssr: false, loading: () => <div className="h-64 w-full bg-slate-100 animate-pulse flex items-center justify-center">Loading Map...</div> }
);

const statusConfig = {
  pending: { color: "bg-amber-500 text-white", icon: Clock, label: "Pending Approval" },
  confirmed: { color: "bg-accent text-accent-foreground", icon: CheckCircle2, label: "Confirmed" },
  enroute: { color: "bg-blue-500 text-white", icon: Navigation, label: "En Route" },
  in_progress: { color: "bg-primary text-primary-foreground", icon: Timer, label: "In Progress" },
  completed: { color: "bg-emerald-500 text-white", icon: CheckCircle2, label: "Completed" },
  cancelled: { color: "bg-destructive text-destructive-foreground", icon: XCircle, label: "Cancelled" },
};

export default function StaffBookingDetail() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : undefined;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [confirmingCash, setConfirmingCash] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  const { getBookingById, updateBookingStatus } = useStaffBookings({
    autoFetch: false,
  });

  const fetchBooking = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const result = await getBookingById(id);
      if (!result.success || !result.booking) {
        toast.error(result.error || "Booking not found");
        setTimeout(() => router.push("/staff/bookings"), 2000);
        return;
      }
      setBooking(result.booking as Booking);
      const savedTasks = localStorage.getItem(`booking-${id}-tasks`);
      if (savedTasks) {
        setCompletedTasks(new Set(JSON.parse(savedTasks)));
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      toast.error("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  // Default tasks if service doesn't have features
  const defaultTasks = [
    "Complete service as described",
    "Clean and organize work area",
    "Verify customer satisfaction",
    "Collect payment (if cash)",
  ];

  // Fetch booking details
  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handleConfirmCash = async () => {
    if (!booking) return;
    setConfirmingCash(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/cash/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
        body: JSON.stringify({ bookingId: booking.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to confirm cash");

      toast.success("✅ Cash received confirmed! Booking marked as completed.");
      fetchBooking();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Confirmation failed");
    } finally {
      setConfirmingCash(false);
    }
  };

  // Save completed tasks to localStorage
  useEffect(() => {
    if (id && completedTasks.size > 0) {
      localStorage.setItem(`booking-${id}-tasks`, JSON.stringify([...completedTasks]));
    }
  }, [completedTasks, id]);

  // Update booking status
  const updateStatus = async (newStatus: Extract<BookingStatus, 'confirmed' | 'in_progress' | 'completed'>) => {
    if (!id || !booking) return;

    try {
      setIsUpdating(true);
      const result = await updateBookingStatus(id, newStatus);

      if (!result.success) {
        throw new Error(result.error || "Failed to update status");
      }

      // Update local state
      setBooking(prev => prev ? { ...prev, status: newStatus } : null);

      // Show success message
      const messages = {
        confirmed: 'Job approved! Customer has been notified.',
        in_progress: 'Job started! Timer is now running.',
        completed: 'Job marked as complete! Great work! 🎉',
      };
      toast.success(messages[newStatus]);

      // Clear completed tasks from localStorage after completion
      if (newStatus === 'completed') {
        localStorage.removeItem(`booking-${id}-tasks`);
      }

    } catch (err: unknown) {
      console.error('Error updating status:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handler functions
  const handleApproveJob = () => updateStatus('confirmed');
  const handleStartJob = () => updateStatus('in_progress');
  const handleCompleteJob = () => {
    if (completedTasks.size < defaultTasks.length) {
      toast.error('Please complete all tasks before finishing the job');
      return;
    }
    updateStatus('completed');
  };

  // Toggle task completion
  const toggleTask = (index: number) => {
    setCompletedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Open in Google Maps
  const openInMaps = () => {
    if (booking) {
      const lat = booking.latitude != null ? String(booking.latitude) : "0";
      const lng = booking.longitude != null ? String(booking.longitude) : "0";
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(url, "_blank");
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    if (compareDate.getTime() === today.getTime()) {
      return `Today, ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else if (compareDate.getTime() === tomorrow.getTime()) {
      return `Tomorrow, ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  // Format time from ISO datetime to 12-hour format
  const formatTime = (startTimeISO: string, endTimeISO: string) => {
    const formatTimeString = (isoString: string) => {
      const date = new Date(isoString);
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHour = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, '0');
      return `${displayHour}:${displayMinutes} ${ampm}`;
    };

    return `${formatTimeString(startTimeISO)} - ${formatTimeString(endTimeISO)}`;
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading job details...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Job not found</h2>
          <p className="text-muted-foreground mb-4">The requested booking could not be found.</p>
          <Link href="/staff/bookings">
            <Button>Back to Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[booking.status];
  const StatusIcon = status.icon;
  const progress = (completedTasks.size / defaultTasks.length) * 100;
  const formattedDate = formatDate(booking.bookingDate);
  const formattedTime = formatTime(booking.startTime, booking.endTime);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/staff/bookings">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="font-display font-semibold text-foreground">Booking #{booking.id}</h1>
                <p className="text-xs text-muted-foreground">{booking.service.name}</p>
              </div>
            </div>
            <Badge className={status.color}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {status.label}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
        {/* Map Section - Prototype UI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Customer Location
                </CardTitle>
                {booking.latitude && booking.longitude && (
                  <Button variant="outline" size="sm" onClick={openInMaps}>
                    <Navigation className="w-4 h-4 mr-2" />
                    Navigate
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <DynamicStaffBookingMapCore
                latitude={booking.latitude != null ? Number(booking.latitude) : null}
                longitude={booking.longitude != null ? Number(booking.longitude) : null}
                customerName={booking.customer.fullName}
                serviceAddress={booking.serviceAddress}
              />
              <div className="p-4 bg-secondary/50">
                <p className="text-sm font-medium">{booking.serviceAddress}</p>
                {!booking.latitude && !booking.longitude && (
                  <p className="text-xs text-muted-foreground mt-1">
                    No GPS coordinates available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Customer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-14 h-14">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(booking.customer.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{booking.customer.fullName}</h3>
                  <p className="text-sm text-muted-foreground">{booking.customer.phone}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" asChild>
                  <a href={`tel:${booking.customer.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </a>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <a href={`sms:${booking.customer.phone}`}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Job Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Job Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-sm font-medium">{formattedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="text-sm font-medium">{formattedTime}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Your Earnings</p>
                    <p className="text-lg font-bold text-primary">${Number(booking.companyEarnings ?? 0).toFixed(2)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total Price</p>
                  <p className="text-sm font-medium">${Number(booking.totalPrice ?? 0).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Platform Fee: ${Number(booking.platformFee ?? 0).toFixed(2)}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium mb-2">Service Description</p>
                <div className="bg-secondary rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">{booking.service.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Task Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Task Checklist
                </CardTitle>
                <span className="text-sm text-muted-foreground">
                  {completedTasks.size}/{defaultTasks.length} completed
                </span>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-secondary rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {defaultTasks.map((task, index) => (
                  <button
                    key={index}
                    onClick={() => toggleTask(index)}
                    disabled={booking.status === 'completed' || booking.status === 'cancelled'}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${completedTasks.has(index)
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary hover:bg-secondary/80"
                      } ${(booking.status === 'completed' || booking.status === 'cancelled')
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                      }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${completedTasks.has(index)
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                        }`}
                    >
                      {completedTasks.has(index) && (
                        <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                      )}
                    </div>
                    <span
                      className={`text-sm text-left ${completedTasks.has(index) ? "line-through" : ""
                        }`}
                    >
                      {task}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cash Confirmation Card (for staff when pay at service) */}
        {booking.payment?.method === 'cash' &&
          booking.status === 'confirmed' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
              <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 shrink-0 rounded-full bg-amber-500 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-2">
                        Cash Payment Pending
                      </h3>
                      <p className="text-sm text-amber-700 dark:text-amber-400 mt-1 mb-4 leading-relaxed">
                        This customer chose to pay <strong>${Number(booking.totalPrice).toFixed(2)}</strong> in cash at the time of service. Only click confirm below once you have physically received the cash.
                      </p>

                      <div className="flex items-start gap-3 p-3 bg-amber-100/50 dark:bg-amber-900/50 rounded-lg mb-4">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                        <div className="text-xs text-amber-800 dark:text-amber-300">
                          <strong>Security Warning:</strong> Action is irreversible. Your account will be recorded as having collected this cash payment. Do not confirm if the customer has not paid.
                        </div>
                      </div>

                      <Button
                        onClick={handleConfirmCash}
                        disabled={confirmingCash}
                        className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        {confirmingCash ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Confirming...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Confirm Cash Received
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

        {/* Status-specific UI */}
        {booking.status === "completed" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">Job Completed</h3>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                      Great work! This job was successfully completed.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {booking.status === "cancelled" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-destructive flex items-center justify-center">
                    <Ban className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-destructive">Job Cancelled</h3>
                    <p className="text-sm text-muted-foreground">
                      This job has been cancelled and is no longer active.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex gap-3 pb-6"
        >
          {/* Pending: Approve Job */}
          {booking.status === "pending" && (
            <Button
              className="flex-1"
              onClick={handleApproveJob}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Approve Job
                </>
              )}
            </Button>
          )}

          {/* Confirmed: Start Job */}
          {booking.status === "confirmed" && (
            <Button
              className="flex-1"
              onClick={handleStartJob}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Timer className="w-4 h-4 mr-2" />
                  Start Job
                </>
              )}
            </Button>
          )}

          {/* In Progress: Complete Job */}
          {booking.status === "in_progress" && (
            <Button
              className="flex-1"
              onClick={handleCompleteJob}
              disabled={isUpdating || completedTasks.size < defaultTasks.length}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Completing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Complete Job
                  {completedTasks.size < defaultTasks.length && (
                    <span className="ml-2 text-xs opacity-75">
                      ({completedTasks.size}/{defaultTasks.length})
                    </span>
                  )}
                </>
              )}
            </Button>
          )}
        </motion.div>
      </main>
    </div>
  );
}