"use client"
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/hooks/use-toast";
import { useBookings } from "@/lib/hooks/useBookings";
import ReviewForm from "@/components/review/ReviewForm";
import Image from "next/image";
import { LoadingCard } from "@/components/common/LoadingCard";

export default function BookingConfirmation() {

  const { bookingId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { getBookingById, loading } = useBookings({ autoFetch: false });
  
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) return;
      
      const result = await getBookingById(bookingId as string);
      console.log("API result:", result);
      
      if (result.success) {
        setBooking(result.booking);
      } else {
        setError(result.error || 'Booking not found');
      }
    };

    fetchBooking();
  }, [bookingId]);

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
        text: `My ${booking?.service?.name} booking on ${booking?.bookingDate}`,
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

  const handleContactCompany = () => {
    toast({
      title: "Opening Chat",
      description: `Connecting you with ${booking?.company?.name}...`,
    });
  };

  // Loading state
  if (loading) <LoadingCard />

  // Error state
  if (error || !booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Booking Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            {error || "We couldn't find the booking you're looking for."}
          </p>
          <Button onClick={() => router.push("/dashboard")}>
            <Home className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Determine status from backend
  const isPending = booking.status === 'pending';
  const isPaid = booking.status === 'paid';
  const isCompleted = booking.status === 'completed';

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Status Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex flex-col items-center mb-8"
        >
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
            isCompleted 
              ? "bg-primary/10" 
              : isPending 
                ? "bg-amber-500/10" 
                : "bg-green-500/10"
          }`}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              {isCompleted ? (
                <Sparkles className="w-12 h-12 text-primary" />
              ) : isPending ? (
                <Timer className="w-12 h-12 text-amber-500" />
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
                : "Booking Confirmed!"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-center"
          >
            {isCompleted 
              ? "We hope you enjoyed your service. Please leave a review below!"
              : isPending
                ? `Complete your payment to confirm booking #${bookingId}`
                : `Your booking #${bookingId} has been successfully placed.`
            }
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
                <h3 className="font-semibold text-foreground mb-1">Action Required</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Your booking is reserved but not confirmed yet. Complete your payment to secure this time slot.
                </p>
                <Button
                  variant="default"
                  size="sm"
                  className="gap-2 bg-amber-500 hover:bg-amber-600"
                  onClick={() => router.push(`/customer/bookings/${bookingId}/payments`)}
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
            <div className="bg-card rounded-2xl p-6 shadow-soft">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Service Details
              </h2>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">{booking.service.name}</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    {booking.service.category || 'Service'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Time</span>
                  </div>
                  <p className="font-semibold text-foreground">
                    {booking.startTime} - {booking.endTime}
                  </p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">Status</span>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    isCompleted 
                      ? "bg-primary/10 text-primary"
                      : isPending 
                        ? "bg-amber-500/10 text-amber-600" 
                        : "bg-green-500/10 text-green-600"
                  }`}>
                    {isCompleted ? "Completed" : isPending ? "Pending Payment" : "Confirmed"}
                  </span>
                </div>
              </div>
            </div>

            {/* Schedule & Location Card */}
            <div className="bg-card rounded-2xl p-6 shadow-soft">
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
                      {new Date(booking.bookingDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })} at {booking.startTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Details Card */}
            <div className="bg-card rounded-2xl p-6 shadow-soft">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Service Provider
              </h2>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">{booking.company.name}</h3>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" className="gap-2" onClick={handleContactCompany}>
                  <MessageSquare className="w-4 h-4" />
                  Message
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => router.push(`/company/${booking.company.id}`)}
                >
                  View Profile
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Payment Details Card */}
            <div className={`bg-card rounded-2xl p-6 shadow-soft ${isPending ? "border-2 border-amber-500/30" : ""}`}>
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <CreditCard className={`w-5 h-5 ${isPending ? "text-amber-500" : "text-primary"}`} />
                Payment Details
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="text-foreground">${parseFloat(booking.totalPrice).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-border">
                <span className="font-semibold text-foreground">
                  {isPending ? "Amount Due" : "Total Paid"}
                </span>
                <span className={`font-display text-xl font-bold ${isPending ? "text-amber-600" : "text-primary"}`}>
                  ${parseFloat(booking.totalPrice).toFixed(2)}
                </span>
              </div>

              {isPending ? (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-amber-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Timer className="w-5 h-5 text-amber-500" />
                      <span className="text-sm font-medium text-amber-600">Awaiting Payment</span>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    className="w-full gap-2 bg-amber-500 hover:bg-amber-600"
                    onClick={() => router.push(`/customer/bookings/${bookingId}/payments`)}
                  >
                    <CreditCard className="w-4 h-4" />
                    Pay Now - ${parseFloat(booking.totalPrice).toFixed(2)}
                  </Button>
                </div>
              ) : (
                <div className="mt-4 flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-green-600">Payment Successful</span>
                  </div>
                </div>
              )}
            </div>

            {/* Review Section - Only show for completed bookings */}
            {isCompleted && (
              <ReviewForm
                serviceName={booking.service.name}
                companyName={booking.company.name}
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
              <div className="bg-card rounded-2xl p-6 shadow-soft">
                <h3 className="font-display font-semibold text-foreground mb-4">Quick Actions</h3>
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
                    onClick={() => router.push("/services")}
                  >
                    <Sparkles className="w-5 h-5 text-primary" />
                    Book Another Service
                  </Button>
                </div>
              </div>

              {/* What's Next Card - Show for pending */}
              {isPending && (
                <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-2xl p-6">
                  <h3 className="font-display font-semibold text-foreground mb-3">Complete Your Booking</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-amber-600">1</span>
                      </div>
                      <p className="text-muted-foreground">
                        Complete payment to confirm your booking.
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-amber-600">2</span>
                      </div>
                      <p className="text-muted-foreground">
                        Time slot is reserved for 30 minutes.
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-amber-600">3</span>
                      </div>
                      <p className="text-muted-foreground">
                        Booking expires if payment is not completed.
                      </p>
                    </li>
                  </ul>
                </div>
              )}

              {/* What's Next Card - Show for confirmed (paid, not completed) */}
              {isPaid && (
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6">
                  <h3 className="font-display font-semibold text-foreground mb-3">Whats Next?</h3>
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
              <div className="bg-card rounded-2xl p-6 shadow-soft">
                <h3 className="font-display font-semibold text-foreground mb-2">Need Help?</h3>
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
            onClick={() => router.push("/dashboard")}
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