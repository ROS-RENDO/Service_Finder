"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Sparkles,
  CreditCard,
  Download,
  CheckCircle2,
  Receipt,
  Calendar,
  Clock,
  Building2,
  FileText,
  Loader2,
  AlertCircle,
  Home,
  Wallet,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/layout/Navbar";
import { usePayments } from "@/lib/hooks/usePayments";
import { useToast } from "@/lib/hooks/use-toast";
import { Payment } from "@/types/payment.type";

export default function PaymentDetails() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const paymentId = params.id as string;

  const { getPaymentById, loading } = usePayments({ autoFetch: false });
  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayment = async () => {
      if (!paymentId) return;

      const result = await getPaymentById(paymentId);

      if (result.success && result.payment) {
        setPayment(result.payment);
      } else {
        setError(result.error || "Payment not found");
      }
    };

    fetchPayment();
  }, []);

  const handleDownloadReceipt = () => {
    toast({
      title: "Downloading Receipt",
      description: "Your receipt is being prepared...",
    });
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "card":
        return <CreditCard className="w-4 h-4" />;
      case "wallet":
        return <Wallet className="w-4 h-4" />;
      case "cash":
        return <Banknote className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  // Get payment method display name
  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "card":
        return "Credit/Debit Card";
      case "wallet":
        return "Digital Wallet";
      case "cash":
        return "Cash Payment";
      default:
        return method;
    }
  };

  // Loading state
  if (loading && !payment) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading payment details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !payment) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md px-4">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Payment Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              {error || "We couldn't find the payment you're looking for."}
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

  // Format dates
  const paidAtDate = payment.paidAt ? new Date(payment.paidAt) : null;
  const bookingDate = payment.booking?.bookingDate
    ? new Date(payment.booking.bookingDate)
    : null;
  const startTime = payment.booking?.startTime
    ? new Date(payment.booking.startTime)
    : null;

  // Calculate total
  const totalAmount = Number(payment.amount);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Back Button */}
        <Link
          href="/customer/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${payment.status === "paid"
                ? "bg-green-500/10"
                : payment.status === "pending"
                  ? "bg-amber-500/10"
                  : payment.status === "failed"
                    ? "bg-red-500/10"
                    : "bg-blue-500/10"
              }`}
          >
            {payment.status === "paid" ? (
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            ) : payment.status === "pending" ? (
              <Clock className="w-8 h-8 text-amber-600" />
            ) : payment.status === "failed" ? (
              <AlertCircle className="w-8 h-8 text-red-600" />
            ) : (
              <Receipt className="w-8 h-8 text-blue-600" />
            )}
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            Payment Receipt
          </h1>
          <p className="text-muted-foreground">
            {payment.status === "paid"
              ? "Transaction completed successfully"
              : payment.status === "pending"
                ? "Payment is being processed"
                : payment.status === "failed"
                  ? "Payment failed"
                  : "Payment refunded"}
          </p>
        </motion.div>

        {/* Receipt Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl shadow-soft border overflow-hidden"
        >
          {/* Receipt Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Receipt className="w-6 h-6" />
                <div>
                  <p className="text-sm opacity-80">Payment ID</p>
                  <p className="font-mono font-semibold">{payment.id}</p>
                </div>
              </div>
              <Badge
                className={`border-0 ${payment.status === "paid"
                    ? "bg-green-500/20 text-white"
                    : payment.status === "pending"
                      ? "bg-amber-500/20 text-white"
                      : payment.status === "failed"
                        ? "bg-red-500/20 text-white"
                        : "bg-blue-500/20 text-white"
                  }`}
              >
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </Badge>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Transaction Details */}
            <div>
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Transaction Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {payment.transactionRef && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Transaction Reference</p>
                    <p className="font-mono text-foreground">
                      {payment.transactionRef}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Payment Method</p>
                  <div className="flex items-center gap-2 text-foreground">
                    {getPaymentMethodIcon(payment.method)}
                    <span>{getPaymentMethodName(payment.method)}</span>
                  </div>
                </div>
                {paidAtDate && (
                  <>
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <div className="flex items-center gap-2 text-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {paidAtDate.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Time</p>
                      <div className="flex items-center gap-2 text-foreground">
                        <Clock className="w-4 h-4" />
                        <span>
                          {paidAtDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <Separator />

            {/* Service Details */}
            {payment.booking && (
              <div>
                <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Service Details
                </h3>
                <div className="bg-secondary/50 rounded-xl p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">
                        {payment.booking.service.name}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Building2 className="w-3 h-3" />
                        <span>{payment.booking.company.name}</span>
                      </div>
                      {bookingDate && startTime && (
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {bookingDate.toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {startTime.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {/* Payment Breakdown */}
            <div>
              <h3 className="font-display font-semibold text-foreground mb-4">
                Payment Breakdown
              </h3>
              <div className="space-y-3 text-sm">
                {payment.booking && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service Fee</span>
                      <span className="text-foreground">
                        ${Number(payment.booking.totalPrice).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform Fee</span>
                      <span className="text-foreground">
                        ${Number(payment.booking.platformFee).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
                <Separator />
                <div className="flex justify-between pt-2">
                  <span className="font-semibold text-foreground">
                    Total {payment.status === "paid" ? "Paid" : "Amount"}
                  </span>
                  <span className="font-display text-xl font-bold text-primary">
                    ${totalAmount.toFixed(2)} {payment.currency}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Billing Info */}
            {payment.user && (
              <div>
                <h3 className="font-display font-semibold text-foreground mb-4">
                  Billing Information
                </h3>
                <div className="text-sm space-y-1">
                  <p className="text-foreground font-medium">
                    {payment.user.fullName}
                  </p>
                  <p className="text-muted-foreground">{payment.user.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="border-t border-border p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={handleDownloadReceipt}
              >
                <Download className="w-4 h-4" />
                Download Receipt
              </Button>
              {payment.booking && (
                <Link
                  href={`/customer/bookings/${payment.booking.id}`}
                  className="flex-1"
                >
                  <Button className="w-full gap-2">
                    View Booking Details
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        {/* Help Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          Questions about this payment?{" "}
          <Link href="/support" className="text-primary hover:underline">
            Contact Support
          </Link>
        </motion.p>
      </main>
    </div>
  );
}
