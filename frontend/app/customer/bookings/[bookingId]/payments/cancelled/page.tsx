"use client"
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  XCircle,
  Sparkles,
  RefreshCw,
  Home,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelled() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("booking_id");
  const reason = searchParams.get("reason"); // "failed", "cancelled", "expired"

  const isFailed = reason === "failed";
  const isExpired = reason === "expired";

  const getTitle = () => {
    if (isFailed) return "Payment Failed";
    if (isExpired) return "Payment Expired";
    return "Payment Cancelled";
  };

  const getMessage = () => {
    if (isFailed)
      return "We couldn't process your payment. Please check your card details and try again.";
    if (isExpired)
      return "Your payment session has expired. Please start a new booking to continue.";
    return "You've cancelled the payment. Your booking is still saved and you can complete the payment anytime.";
  };

  const getIcon = () => {
    if (isFailed || isExpired) {
      return (
        <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
          <XCircle className="w-14 h-14 text-destructive" />
        </div>
      );
    }
    return (
      <div className="w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
        <AlertTriangle className="w-14 h-14 text-amber-600 dark:text-amber-400" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">

      <main className="container mx-auto px-4 py-12 max-w-lg">
        {/* Status Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          {getIcon()}
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            {getTitle()}
          </h1>
          <p className="text-lg text-muted-foreground">{getMessage()}</p>
        </motion.div>

        {/* Error Details Card (for failed payments) */}
        {isFailed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 mb-6"
          >
            <h3 className="font-semibold text-foreground mb-2">
              Common reasons for payment failure:
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Insufficient funds in your account</li>
              <li>• Incorrect card details entered</li>
              <li>• Card expired or blocked for online transactions</li>
              <li>• Bank declined the transaction</li>
            </ul>
          </motion.div>
        )}

        {/* Pending Booking Info */}
        {!isExpired && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-card rounded-2xl p-5 shadow-soft mb-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Your booking is saved</p>
                <p className="text-sm text-muted-foreground">
                  Booking ID: {bookingId}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Complete your payment within 30 minutes to secure your booking slot.
            </p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          {!isExpired && (
            <Button

              size="lg"
              className="w-full h-14 gap-2"
              onClick={() => router.push(`/customer/bookings/${bookingId}/payments`)}
            >
              <RefreshCw className="w-5 h-5" />
              Try Payment Again
            </Button>
          )}

          {isExpired && (
            <Button size="lg" className="w-full h-14 gap-2" asChild>
              <Link href="/services">
                <Sparkles className="w-5 h-5" />
                Book Again
              </Link>
            </Button>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12 gap-2" asChild>
              <Link href="/">
                <Home className="w-4 h-4" />
                Home
              </Link>
            </Button>
            <Button variant="outline" className="h-12 gap-2" asChild>
              <Link href="/contact">
                <MessageCircle className="w-4 h-4" />
                Get Help
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Help Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          Need assistance?{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact our support team
          </Link>
        </motion.p>
      </main>
    </div>
  );
}
