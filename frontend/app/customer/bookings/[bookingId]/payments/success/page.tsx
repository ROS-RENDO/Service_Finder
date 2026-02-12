"use client"
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  Download,
  Home,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Confetti from "@/components/payment/Confetti";
import { useBookings } from "@/lib/hooks/useBookings";
import { Booking } from "@/types/booking.types";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");

    const { getBookingById, loading } = useBookings({ autoFetch: false });
  const [showConfetti, setShowConfetti] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
  if (!bookingId) {
    // Wrap in setTimeout to defer state update after render
    const timer = setTimeout(() => setError("Booking ID not found in URL."), 0);
    return () => clearTimeout(timer);
  }

  const fetchBooking = async () => {
    const result = await getBookingById(bookingId);
    if (result.success) {
      setBooking(result.booking);
    } else {
      setError(result.error || "Failed to fetch booking details.");
    }
  };

  fetchBooking();
}, []);



  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {showConfetti && <Confetti />}

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-14 h-14 text-green-600 dark:text-green-400" />
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Payment Successful!
          </h1>
          <p className="text-lg text-muted-foreground">
            Your booking has been confirmed. Weve sent the details to your email.
          </p>
        </motion.div>

        {/* Booking Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-6 shadow-card mb-6"
        >
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
            <div className="w-16 h-16 rounded-xl bg-gradient-hero flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                {booking?.service.name}
              </h2>
              <p className="text-muted-foreground">{booking?.company.name}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium text-foreground">{booking?.bookingDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium text-foreground">{booking?.startTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium text-foreground">{booking?.serviceAddress}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Paid</p>
              <p className="font-display text-2xl font-bold text-primary">
                ${booking?.totalPrice}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Booking ID</p>
              <p className="font-mono text-sm font-medium text-foreground">
                {booking?.id}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12 gap-2" asChild>
              <Link href={`/booking/${bookingId}`}>
                <FileText className="w-4 h-4" />
                View Booking
              </Link>
            </Button>
            <Button variant="outline" className="h-12 gap-2" asChild>
              <Link href={`/customer/payments/${booking?.payment?.id}`}>
                <Download className="w-4 h-4" />
                View Receipt
              </Link>
            </Button>
          </div>

          <Button size="lg" className="w-full h-14 gap-2" asChild>
            <Link href="/">
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </Button>
        </motion.div>

        {/* Help Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          Questions about your booking?{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact Support
          </Link>
        </motion.p>
      </main>
    </div>
  );
}
