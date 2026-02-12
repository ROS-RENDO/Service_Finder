"use client"
import { useState } from "react";
import Link from "next/link";
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
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  // Mock booking data - in real app, fetch from API using bookingId
  const booking = {
    id: bookingId,
    service: "Premium Home Cleaning",
    company: "Sparkle Home Services",
    date: "Jan 15, 2026",
    time: "10:00 AM",
    address: "123 Main Street, New York, 10001",
    subtotal: 85,
    platformFee: 5,
    total: 90,
  };

  const handlePayment = () => {
    if (paymentMethod === "card") {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        toast({
          title: "Missing Information",
          description: "Please fill in all card details.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Payment Successful!",
        description: "Your booking has been confirmed.",
      });
      router.push(`/booking/${bookingId}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={() => router.back()} className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
            </Link>
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
          {/* Payment Form */}
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
                    onClick={() => setPaymentMethod(method.id)}
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
                    <span className="font-medium text-foreground">{method.name}</span>
                    {paymentMethod === method.id && (
                      <Check className="w-5 h-5 text-primary ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Card Details Form */}
            {paymentMethod === "card" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-card rounded-2xl p-6 shadow-soft"
              >
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                  Card Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      placeholder="John Doe"
                      className="mt-2 h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                      className="mt-2 h-12"
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        placeholder="MM/YY"
                        className="mt-2 h-12"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        placeholder="123"
                        className="mt-2 h-12"
                        maxLength={4}
                        type="password"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
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
                  Youll be redirected to complete payment via your digital wallet.
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
                    <h3 className="font-semibold text-foreground mb-1">Pay at Service</h3>
                    <p className="text-sm text-muted-foreground">
                      Pay directly to the cleaning staff when they arrive. Cash or card accepted.
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
                  Pay ${booking.total.toFixed(2)}
                </>
              )}
            </Button>
          </motion.div>

          {/* Order Summary */}
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
                    <p className="font-semibold text-foreground">{booking.service}</p>
                    <p className="text-sm text-muted-foreground">{booking.company}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="text-foreground">{booking.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="text-foreground">{booking.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address</span>
                    <span className="text-foreground text-right max-w-[150px]">{booking.address}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 py-4 border-y border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span className="text-foreground">${booking.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span className="text-foreground">${booking.platformFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-display text-xl font-bold text-primary">
                  ${booking.total.toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
