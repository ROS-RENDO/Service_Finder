"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Download,
  Share2,
  Home,
  Sparkles,
  Building2,
  CreditCard,
  FileText,
  Star,
  ChevronRight,
  AlertCircle,
  Timer,
  Loader2,
  Mail,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/lib/hooks/use-toast";
import { useBookings } from "@/lib/hooks/useBookings";
import ReviewForm from "@/components/booking/ReviewForm";
import ServiceTracker from "@/components/booking/ServiceTracker";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Booking } from "@/types/booking.types";
import { useMessages } from "@/lib/hooks/useChat";
import { useSocket } from "@/lib/hooks/useSocket";
import dynamic from "next/dynamic";

const InteractiveMap = dynamic(() => import("@/components/maps/InteractiveMap"), { ssr: false });

export default function BookingConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const bookingId = params.bookingId as string;

  const { getBookingById, loading } = useBookings({ autoFetch: false });

  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startingChat, setStartingChat] = useState(false);
  const [staffLat, setStaffLat] = useState<number | null>(null);
  const [staffLng, setStaffLng] = useState<number | null>(null);
  const { sendMessage } = useMessages();
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) return;

      const result = await getBookingById(bookingId);

      if (result.success && result.booking) {
        setBooking(result.booking);
      } else {
        setError(result.error || "Booking not found");
      }
    };

    fetchBooking();
  }, []);

  // Handle socket connection and real-time live location tracking
  useEffect(() => {
    if (isConnected && socket && bookingId) {
      // Subscribe to this specific booking's location broadcast
      socket.emit("join_booking", bookingId);

      socket.on("staff_location_updated", (data: any) => {
        if (data.latitude && data.longitude) {
          setStaffLat(data.latitude);
          setStaffLng(data.longitude);
        }
      });

      return () => {
        socket.off("staff_location_updated");
        socket.emit("leave_booking", bookingId);
      };
    }
  }, [isConnected, socket, bookingId]);


  const handleDownloadReceipt = () => {
    toast({
      title: "Downloading Receipt",
      description: "Your receipt is being prepared...",
    });
  };

  const handleShareBooking = () => {
    if (navigator.share) {
      navigator.share({
        title: `Booking #${bookingId}`,
        text: `My ${booking?.service?.name} booking`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Booking link copied to clipboard.",
      });
    }
  };

  const handleContactCompany = async () => {
    if (!booking?.company?.ownerId) {
      toast({
        title: "Error",
        description: "Company contact information not available.",
        variant: "destructive",
      });
      return;
    }

    setStartingChat(true);
    toast({
      title: "Opening Chat",
      description: `Connecting you with ${booking?.company?.name}...`,
    });

    try {
      const result = await sendMessage({
        content: `Hi ${booking.company.name}, I'm contacting you regarding my booking #${booking.id} (${booking.service.name}).`,
        recipientId: booking.company.ownerId.toString(),
      });

      if (result.success && result.conversationId) {
        router.push(`/customer/messages?conversation=${result.conversationId}`);
      } else {
        throw new Error(result.error || "Failed to start conversation");
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to connect to chat.",
        variant: "destructive",
      });
    } finally {
      setStartingChat(false);
    }
  };

  // Loading state
  if (loading && !booking) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !booking) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md px-4">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Booking Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              {error || "We couldn't find the booking you're looking for."}
            </p>
            <Button onClick={() => router.push("/customer/dashboard")}>
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Determine status from backend
  const isPending = booking.status === "pending";
  const isConfirmed = booking.status === "confirmed";
  const isInProgress = booking.status === "in_progress";
  const isCompleted = booking.status === "completed";
  const isCancelled = booking.status === "cancelled";

  // Format dates
  const bookingDate = new Date(booking.bookingDate);
  const startTime = booking.startTime ? new Date(booking.startTime) : null;
  const endTime = booking.endTime ? new Date(booking.endTime) : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Status Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex flex-col items-center mb-8"
        >
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isCompleted
              ? "bg-primary/10"
              : isPending
                ? "bg-amber-500/10"
                : isInProgress
                  ? "bg-blue-500/10"
                  : isCancelled
                    ? "bg-red-500/10"
                    : "bg-green-500/10"
              }`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              {isCompleted ? (
                <Sparkles className="w-12 h-12 text-primary" />
              ) : isPending ? (
                <Timer className="w-12 h-12 text-amber-500" />
              ) : isInProgress ? (
                <Clock className="w-12 h-12 text-blue-500" />
              ) : isCancelled ? (
                <AlertCircle className="w-12 h-12 text-red-500" />
              ) : (
                <CheckCircle className="w-12 h-12 text-green-500" />
              )}
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2 text-center"
          >
            {isCompleted
              ? "Service Completed!"
              : isPending
                ? "Payment Pending"
                : isInProgress
                  ? "Service In Progress"
                  : isCancelled
                    ? "Booking Cancelled"
                    : "Booking Confirmed!"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-center max-w-md"
          >
            {isCompleted
              ? "We hope you enjoyed your service. Please leave a review below!"
              : isPending
                ? `Complete your payment to confirm booking #${bookingId}`
                : isInProgress
                  ? "Your service is currently being performed."
                  : isCancelled
                    ? "This booking has been cancelled."
                    : `Your booking #${bookingId} has been successfully placed.`}
          </motion.p>
        </motion.div>

        {/* Pending Payment Alert Banner */}
        {isPending && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  Action Required
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Your booking is reserved but not confirmed yet. Complete your
                  payment to secure this time slot.
                </p>
                <Button
                  variant="default"
                  size="sm"
                  className="gap-2 bg-amber-500 hover:bg-amber-600"
                  onClick={() =>
                    router.push(`/customer/bookings/${bookingId}/payments`)
                  }
                >
                  <CreditCard className="w-4 h-4" />
                  Complete Payment
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Booking Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Service Details Card */}
            <div className="bg-card rounded-2xl p-6 shadow-soft border">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Service Details
              </h2>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">
                    {booking.service.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    {booking.service?.serviceType?.category?.name || "Service"} •{" "}
                    {booking.service?.serviceType?.name || ""}
                  </p>
                  {booking.service?.description && (
                    <p className="text-sm text-muted-foreground">
                      {booking.service.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Time</span>
                  </div>
                  <p className="font-semibold text-foreground">
                    {startTime
                      ? startTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      : "N/A"}
                    {" - "}
                    {endTime
                      ? endTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      : "N/A"}
                  </p>
                </div>

                <div className="bg-secondary/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">Status</span>
                  </div>
                  <Badge
                    className={
                      isCompleted
                        ? "bg-primary/10 text-primary"
                        : isPending
                          ? "bg-amber-500/10 text-amber-600"
                          : isInProgress
                            ? "bg-blue-500/10 text-blue-600"
                            : isCancelled
                              ? "bg-red-500/10 text-red-600"
                              : "bg-green-500/10 text-green-600"
                    }
                  >
                    {isCompleted
                      ? "Completed"
                      : isPending
                        ? "Pending Payment"
                        : isInProgress
                          ? "In Progress"
                          : isCancelled
                            ? "Cancelled"
                            : "Confirmed"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Schedule & Location Card */}
            <div className="bg-card rounded-2xl p-6 shadow-soft border">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Schedule & Location
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="font-semibold text-foreground">
                      {bookingDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      at{" "}
                      {startTime
                        ? startTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Service Address
                    </p>
                    <p className="font-semibold text-foreground">
                      {booking.serviceAddress || "Address not provided"}
                    </p>
                  </div>
                </div>

                {/* Interactive Map with customer + company + live staff */}
                {(() => {
                  const customerLat = (booking as any).latitude ? Number((booking as any).latitude) : null;
                  const customerLng = (booking as any).longitude ? Number((booking as any).longitude) : null;
                  const companyLat = (booking as any).company?.latitude ? Number((booking as any).company.latitude) : null;
                  const companyLng = (booking as any).company?.longitude ? Number((booking as any).company.longitude) : null;
                  const hasMapData = (customerLat && customerLng) || (companyLat && companyLng);
                  if (!hasMapData) return null;

                  const mapMarkers: any[] = [];
                  if (customerLat && customerLng) {
                    mapMarkers.push({ lat: customerLat, lng: customerLng, type: "customer", label: "Your Location", popupHtml: `<b>📍 Your Location</b><br/><span style="color:#6b7280;font-size:12px">${booking.serviceAddress}</span>` });
                  }
                  if (companyLat && companyLng) {
                    mapMarkers.push({ lat: companyLat, lng: companyLng, type: "company", label: booking.company.name, popupHtml: `<b>🏢 ${booking.company.name}</b>` });
                  }
                  if (staffLat && staffLng) {
                    mapMarkers.push({ lat: staffLat, lng: staffLng, type: "staff", label: "Staff", popupHtml: `<b>👷 Staff En Route</b>` });
                  }

                  return (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Live Map</span>
                        {(booking.status === "in_progress" || booking.status === "enroute") && (
                          <span className="flex items-center gap-1 ml-auto text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block"></span>
                            Live Tracking
                          </span>
                        )}
                      </div>
                      <InteractiveMap
                        className="h-64"
                        markers={mapMarkers}
                        zoom={14}
                        trackStaff={booking.status === "in_progress" || booking.status === "enroute"}
                        onStaffMoved={(lat, lng) => { setStaffLat(lat); setStaffLng(lng); }}
                      />
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-sky-500 inline-block"></span>You</div>
                        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-violet-600 inline-block"></span>Company</div>
                        {booking.assignedStaff && <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>Staff</div>}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Company Details Card */}
            <div className="bg-card rounded-2xl p-6 shadow-soft border">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Service Provider
              </h2>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">
                    {booking.company.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    {booking.company.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {booking.company.phone}
                      </div>
                    )}
                    {booking.company.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {booking.company.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleContactCompany}
                  disabled={startingChat}
                >
                  {startingChat ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <MessageSquare className="w-4 h-4" />
                  )}
                  Message
                </Button>
                {booking.company.phone && (
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href={`tel:${booking.company.phone}`}>
                      <Phone className="w-4 h-4" />
                      Call
                    </a>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    const categorySlug = (booking as any).service?.serviceType?.category?.slug || "general";
                    const serviceTypeSlug = (booking as any).service?.serviceType?.slug || "service";
                    router.push(`/customer/services/${categorySlug}/${serviceTypeSlug}/company/${booking.company.id}`);
                  }}
                >
                  View Profile
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Customer Details Card */}
            <div className="bg-card rounded-2xl p-6 shadow-soft border">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Customer Information
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="font-medium text-foreground">
                    {booking.customer.fullName}
                  </span>
                </div>
                {booking.customer.email && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Email</span>
                    <span className="font-medium text-foreground">
                      {booking.customer.email}
                    </span>
                  </div>
                )}
                {booking.customer.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Phone</span>
                    <span className="font-medium text-foreground">
                      {booking.customer.phone}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Details Card */}
            <div
              className={`bg-card rounded-2xl p-6 shadow-soft border ${isPending ? "border-amber-500/30" : ""
                }`}
            >
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <CreditCard
                  className={`w-5 h-5 ${isPending ? "text-amber-500" : "text-primary"}`}
                />
                Payment Details
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span className="text-foreground">
                    ${Number(booking.totalPrice).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span className="text-foreground">
                    ${Number(booking.platformFee).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-border">
                <span className="font-semibold text-foreground">
                  {isPending ? "Amount Due" : "Total Paid"}
                </span>
                <span
                  className={`font-display text-xl font-bold ${isPending ? "text-amber-600" : "text-primary"
                    }`}
                >
                  $
                  {(
                    Number(booking.totalPrice) + Number(booking.platformFee)
                  ).toFixed(2)}
                </span>
              </div>

              {isPending ? (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-amber-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Timer className="w-5 h-5 text-amber-500" />
                      <span className="text-sm font-medium text-amber-600">
                        Awaiting Payment
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Expires in 30 min
                    </span>
                  </div>
                  <Button
                    variant="default"
                    className="w-full gap-2 bg-amber-500 hover:bg-amber-600"
                    onClick={() =>
                      router.push(`/customer/bookings/${bookingId}/payments`)
                    }
                  >
                    <CreditCard className="w-4 h-4" />
                    Pay Now - $
                    {(
                      Number(booking.totalPrice) + Number(booking.platformFee)
                    ).toFixed(2)}
                  </Button>
                </div>
              ) : (
                <div className="mt-4 flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-green-600">
                      Payment Successful
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Service Tracker - Show when staff is assigned */}
            {booking.assignedStaff && (isConfirmed || isInProgress || isCompleted) && (
              <ServiceTracker
                bookingStatus={booking.status}
                staffName={booking.assignedStaff.user.fullName}
                staffPhoto={booking.assignedStaff.user.avatar ?? undefined}
                tasks={[]}
              />
            )}

            {/* Review Section - Only show for completed bookings */}
            {isCompleted && (
              <ReviewForm
                bookingId={String(booking.id)}
                serviceName={booking.service.name}
                companyName={booking.company.name}
                staffName={booking.assignedStaff?.user?.fullName}
                staffId={booking.assignedStaff?.id ? String(booking.assignedStaff.id) : undefined}
              />
            )}
          </motion.div>

          {/* Sidebar Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 space-y-4">
              {/* Quick Actions Card */}
              <div className="bg-card rounded-2xl p-6 shadow-soft border">
                <h3 className="font-display font-semibold text-foreground mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={handleDownloadReceipt}
                  >
                    <Download className="w-5 h-5 text-primary" />
                    Download Receipt
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={handleShareBooking}
                  >
                    <Share2 className="w-5 h-5 text-primary" />
                    Share Booking
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={() => router.push("/customer/services")}
                  >
                    <Sparkles className="w-5 h-5 text-primary" />
                    Book Another Service
                  </Button>
                </div>
              </div>

              {/* What's Next Card - Show for pending */}
              {isPending && (
                <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-2xl p-6 border border-amber-500/20">
                  <h3 className="font-display font-semibold text-foreground mb-3">
                    Complete Your Booking
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-amber-600">
                          1
                        </span>
                      </div>
                      <p className="text-muted-foreground">
                        Complete payment to confirm your booking.
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-amber-600">
                          2
                        </span>
                      </div>
                      <p className="text-muted-foreground">
                        Time slot is reserved for 30 minutes.
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-amber-600">
                          3
                        </span>
                      </div>
                      <p className="text-muted-foreground">
                        Booking expires if payment is not completed.
                      </p>
                    </li>
                  </ul>
                </div>
              )}

              {/* What's Next Card - Show for confirmed */}
              {(isConfirmed || isInProgress) && (
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20">
                  <h3 className="font-display font-semibold text-foreground mb-3">
                    What Next?
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">1</span>
                      </div>
                      <p className="text-muted-foreground">
                        Youll receive a confirmation email with booking details.
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">2</span>
                      </div>
                      <p className="text-muted-foreground">
                        The service provider will contact you before arrival.
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">3</span>
                      </div>
                      <p className="text-muted-foreground">
                        Rate your experience after the service is complete.
                      </p>
                    </li>
                  </ul>
                </div>
              )}

              {/* Help Card */}
              <div className="bg-card rounded-2xl p-6 shadow-soft border">
                <h3 className="font-display font-semibold text-foreground mb-2">
                  Need Help?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our support team is available 24/7 to assist you.
                </p>
                <Button variant="secondary" className="w-full">
                  Contact Support
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center"
        >
          <Button
            size="lg"
            onClick={() => router.push("/customer/dashboard")}
            className="gap-2"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
