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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Types matching actual backend response
interface Booking {
  id: string;
  customerId: string;
  companyId: string;
  serviceId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  serviceAddress: string;
  latitude: string | null;
  longitude: string | null;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  totalPrice: string;
  platformFee: string;
  companyEarnings: string;
  createdAt: string;
  updatedAt: string;
  service: {
    name: string;
    description: string;
    basePrice: string;
  };
  customer: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  company: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
}

const statusConfig = {
  pending: { color: "bg-amber-500 text-white", icon: Clock, label: "Pending Approval" },
  confirmed: { color: "bg-accent text-accent-foreground", icon: CheckCircle2, label: "Confirmed" },
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
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());

  // Default tasks if service doesn't have features
  const defaultTasks = [
    "Complete service as described",
    "Clean and organize work area",
    "Verify customer satisfaction",
    "Collect payment (if cash)",
  ];

  // Fetch booking details
  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staff/bookings/${id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            toast.error('Booking not found');
            setTimeout(() => router.push('/staff/bookings'), 2000);
            return;
          }
          if (response.status === 401) {
            toast.error('Please login to continue');
            setTimeout(() => router.push('/auth/login'), 2000);
            return;
          }
          throw new Error('Failed to fetch booking details');
        }

        const result = await response.json();
        console.log('Booking data:', result); // Debug log
        setBooking(result.data || result.booking || result);

        // Load completed tasks from localStorage
        const savedTasks = localStorage.getItem(`booking-${id}-tasks`);
        if (savedTasks) {
          setCompletedTasks(new Set(JSON.parse(savedTasks)));
        }

      } catch (error) {
        console.error('Error fetching booking:', error);
        toast.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, router]);

  // Save completed tasks to localStorage
  useEffect(() => {
    if (id && completedTasks.size > 0) {
      localStorage.setItem(`booking-${id}-tasks`, JSON.stringify([...completedTasks]));
    }
  }, [completedTasks, id]);

  // Update booking status
  const updateStatus = async (newStatus: 'confirmed' | 'in_progress' | 'completed') => {
    if (!id || !booking) return;

    try {
      setIsUpdating(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staff/bookings/${id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update status');
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

    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Failed to update status');
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
      const lat = booking.latitude || '0';
      const lng = booking.longitude || '0';
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
              <div className="h-64 w-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 flex flex-col items-center justify-center gap-3 relative overflow-hidden">
                {/* Decorative map-like pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-primary rounded-full" />
                  <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-primary rounded-full" />
                  <div className="absolute bottom-1/4 right-1/4 w-40 h-40 border-2 border-primary rounded-full" />
                </div>
                
                {/* Location marker */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-800 animate-bounce">
                    <MapPin className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md">
                    <p className="text-sm font-medium">{booking.customer.fullName}</p>
                  </div>
                </div>
              </div>
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
                    <p className="text-lg font-bold text-primary">${booking.companyEarnings}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total Price</p>
                  <p className="text-sm font-medium">${booking.totalPrice}</p>
                  <p className="text-xs text-muted-foreground">Platform Fee: ${booking.platformFee}</p>
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
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      completedTasks.has(index)
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary hover:bg-secondary/80"
                    } ${
                      (booking.status === 'completed' || booking.status === 'cancelled')
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        completedTasks.has(index)
                          ? "border-primary bg-primary"
                          : "border-muted-foreground"
                      }`}
                    >
                      {completedTasks.has(index) && (
                        <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                      )}
                    </div>
                    <span
                      className={`text-sm text-left ${
                        completedTasks.has(index) ? "line-through" : ""
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