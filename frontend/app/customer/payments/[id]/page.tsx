"use client"
import Link from "next/link";
import { useParams } from "next/navigation";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function PaymentDetails() {
  const { paymentId } = useParams();

  // Mock payment data - in real app, fetch from API
  const payment = {
    id: paymentId || "PAY-2026011500001",
    transactionId: "TXN-8A4F2C9E1B3D",
    status: "completed",
    method: "Credit Card",
    cardLast4: "4242",
    cardBrand: "Visa",
    date: "January 15, 2026",
    time: "10:32 AM",
    booking: {
      id: "BK1769248347424",
      service: "Premium Home Cleaning",
      company: "Sparkle Home Services",
      scheduledDate: "January 18, 2026",
      scheduledTime: "10:00 AM",
    },
    breakdown: {
      serviceFee: 85.0,
      platformFee: 5.0,
      discount: 0,
      tax: 0,
      total: 90.0,
    },
    billingAddress: {
      name: "John Doe",
      email: "john.doe@example.com",
      address: "123 Main Street, New York, NY 10001",
    },
  };

  return (
    <div className="min-h-screen bg-background">

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            Payment Receipt
          </h1>
          <p className="text-muted-foreground">
            Transaction completed successfully
          </p>
        </motion.div>

        {/* Receipt Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl shadow-card overflow-hidden"
        >
          {/* Receipt Header */}
          <div className="bg-gradient-hero p-6 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Receipt className="w-6 h-6" />
                <div>
                  <p className="text-sm opacity-80">Payment ID</p>
                  <p className="font-mono font-semibold">{payment.id}</p>
                </div>
              </div>
              <Badge className="bg-white/20 text-white border-0">
                {payment.status === "completed" ? "Paid" : "Pending"}
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
                <div>
                  <p className="text-muted-foreground">Transaction ID</p>
                  <p className="font-mono text-foreground">{payment.transactionId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment Method</p>
                  <div className="flex items-center gap-2 text-foreground">
                    <CreditCard className="w-4 h-4" />
                    <span>{payment.cardBrand} •••• {payment.cardLast4}</span>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <div className="flex items-center gap-2 text-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{payment.date}</span>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Time</p>
                  <div className="flex items-center gap-2 text-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{payment.time}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Service Details */}
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
                    <p className="font-semibold text-foreground">{payment.booking.service}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Building2 className="w-3 h-3" />
                      <span>{payment.booking.company}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {payment.booking.scheduledDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {payment.booking.scheduledTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Breakdown */}
            <div>
              <h3 className="font-display font-semibold text-foreground mb-4">
                Payment Breakdown
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span className="text-foreground">${payment.breakdown.serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span className="text-foreground">${payment.breakdown.platformFee.toFixed(2)}</span>
                </div>
                {payment.breakdown.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${payment.breakdown.discount.toFixed(2)}</span>
                  </div>
                )}
                {payment.breakdown.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="text-foreground">${payment.breakdown.tax.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between pt-2">
                  <span className="font-semibold text-foreground">Total Paid</span>
                  <span className="font-display text-xl font-bold text-primary">
                    ${payment.breakdown.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Billing Info */}
            <div>
              <h3 className="font-display font-semibold text-foreground mb-4">
                Billing Information
              </h3>
              <div className="text-sm space-y-1">
                <p className="text-foreground font-medium">{payment.billingAddress.name}</p>
                <p className="text-muted-foreground">{payment.billingAddress.email}</p>
                <p className="text-muted-foreground">{payment.billingAddress.address}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-border p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex-1 gap-2">
                <Download className="w-4 h-4" />
                Download Receipt
              </Button>
              <Link href={`/booking/${payment.booking.id}`} className="flex-1">
                <Button className="w-full gap-2">
                  View Booking Details
                </Button>
              </Link>
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
