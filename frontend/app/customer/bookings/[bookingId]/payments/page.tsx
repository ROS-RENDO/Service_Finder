// app/customer/bookings/[bookingId]/payment/page.tsx

"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  CreditCard,
  Check,
  Sparkles,
  Shield,
  Lock,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";
import { useBookings } from "@/lib/hooks/useBookings";
import { Booking } from "@/types/booking.types";
import { usePayments } from "@/lib/hooks/usePayments";

const paymentMethods = [
  { id: "card", name: "Credit / Debit Card", icon: CreditCard },
  { id: "wallet", name: "Digital Wallet", icon: Wallet },
  { id: "cash", name: "Pay at Service", icon: Lock },
];

export default function Payment() {
  const { bookingId } = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "wallet" | "cash">("card");


  const { getBookingById, loading: bookingLoading } = useBookings({
    autoFetch: false,
  });
  const { createCheckoutSession, completePayment } = usePayments({ autoFetch: false });
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch booking details
  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) return;

      const result = await getBookingById(bookingId as string);

      if (result.success) {
        // Check if already paid
        if (result.booking.status !== "pending") {
          toast({
            title: "Already Processed",
            description: "This booking has already been processed.",
            variant: "destructive",
          });
          router.push(`/customer/bookings/${bookingId}`);
          return;
        }
        setBooking(result.booking);
      } else {
        setError(result.error || "Booking not found");
      }
    };

    fetchBooking();
  }, [bookingId]);

  // Handle payment submission
 const handlePayment = async () => {
  if (!bookingId) return;

  setIsLoading(true);

  try {
    if (paymentMethod === "card") {
      // ✅ CARD: Redirect to Stripe Checkout
      const result = await createCheckoutSession(bookingId as string);

      if (result.success && result.url) {
        window.location.href = result.url; // Redirect to Stripe
      } else {
        toast({
          title: "Payment Error",
          description: result.error || "Failed to create checkout session",
          variant: "destructive",
        });
      }
    } else {
      // ✅ CASH/WALLET: Use completePayment API
      const result = await completePayment({
        bookingId: bookingId as string,
        method: paymentMethod,
      });

      console.log("Complete payment result:", result); // Debug log

      if (result.success) {
        toast({
          title: "Success!",
          description: result.message || "Booking confirmed successfully",
        });

        // Wait a moment for UI feedback, then redirect
        setTimeout(() => {
          router.push(`/customer/bookings/${bookingId}`);
        }, 1000);
      } else {
        toast({
          title: "Payment Failed",
          description: result.error || "Failed to complete payment",
          variant: "destructive",
        });
      }
    }
  } catch (err: any) {
    console.error("Payment error:", err);
    toast({
      title: "Error",
      description: err.message || "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};





  return (
    <div className="min-h-screen bg-background">
      {/* Header - same as before */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            Complete Your Payment
          </h1>
          <p className="text-muted-foreground">
            Secure payment for booking #{bookingId}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form - same as before */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Payment Methods */}
            <div className="bg-card rounded-2xl p-6 shadow-soft">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                Select Payment Method
              </h2>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() =>
                      setPaymentMethod(method.id as "card" | "wallet" | "cash")
                    }
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        paymentMethod === method.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      <method.icon className="w-6 h-6" />
                    </div>
                    <span className="font-medium text-foreground">
                      {method.name}
                    </span>
                    {paymentMethod === method.id && (
                      <Check className="w-5 h-5 text-primary ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Card Details Form */}
            {paymentMethod === "card" && (
              <div></div>
            )}

            {/* Wallet Info */}
            {paymentMethod === "wallet" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-card rounded-2xl p-6 shadow-soft text-center"
              >
                <Wallet className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Youll be redirected to complete payment via your digital
                  wallet.
                </p>
              </motion.div>
            )}

            {/* Cash Info */}
            {paymentMethod === "cash" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-accent/50 rounded-2xl p-6 shadow-soft"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Pay at Service
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Pay directly to the cleaning staff when they arrive. Cash
                      or card accepted.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>Your payment is secured with 256-bit SSL encryption</span>
            </div>

            {/* Pay Button */}
            <Button
              size="lg"
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full h-14 text-lg gap-2"
            >
              {isLoading ? (
                "Processing..."
              ) : paymentMethod === "cash" ? (
                <>
                  <Check className="w-5 h-5" />
                  Confirm Booking
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Pay ${Number(booking?.totalPrice || 0).toFixed(2)}
                </>
              )}
            </Button>
          </motion.div>

          {/* Order Summary - same as before */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 bg-card rounded-2xl p-6 shadow-card">
              <h3 className="font-display font-semibold text-foreground mb-4">
                Booking Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {booking?.service?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {booking?.company?.name}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="text-foreground">
                      {booking?.bookingDate
                        ? new Date(booking.bookingDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="text-foreground">
                      {booking?.startTime
                        ? new Date(booking.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                      {" - "}
                      {booking?.endTime
                        ? new Date(booking.endTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address</span>
                    <span className="text-foreground text-right max-w-[150px]">
                      {booking?.serviceAddress}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 py-4 border-y border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span className="text-foreground">
                    ${Number(booking?.service?.basePrice || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span className="text-foreground">
                    $
                    {(
                      Number(booking?.totalPrice || 0) -
                      Number(booking?.service?.basePrice || 0)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-display text-xl font-bold text-primary">
                  ${Number(booking?.totalPrice || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
