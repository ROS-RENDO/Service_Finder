"use client"
import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Check,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";

const steps = [
  { id: 1, name: "Date & Time", icon: Calendar },
  { id: 2, name: "Address", icon: MapPin },
  { id: 3, name: "Confirm", icon: Check },
];

const timeSlots = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
];

export default function BookService() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form data
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    zip: "",
    notes: "",
  });

  // Mock service data
  const service = {
    name: "Premium Home Cleaning",
    company: "Sparkle Home Services",
    price: 85,
    duration: "2-3 hours",
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirm = () => {
    setIsLoading(true);
    // Generate a mock booking ID and redirect to payment
    const bookingId = `BK${Date.now()}`;
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Booking Created!",
        description: "Redirecting to payment...",
      });
      router.push(`/payment/${bookingId}`);
    }, 1000);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedDate && selectedTime;
      case 2:
        return address.street && address.city && address.zip;
      default:
        return true;
    }
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
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((step) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    step.id <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className="mt-2 text-xs font-medium text-muted-foreground hidden sm:block">
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-card rounded-2xl p-6 shadow-soft"
                >
                  <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                    Select Date & Time
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="mt-2 h-12"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>

                    <div>
                      <Label>Preferred Time</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className={`p-3 rounded-lg text-sm font-medium transition-all ${
                              selectedTime === time
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-card rounded-2xl p-6 shadow-soft"
                >
                  <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                    Service Address
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        className="mt-2 h-12"
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          className="mt-2 h-12"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input
                          id="zip"
                          value={address.zip}
                          onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                          className="mt-2 h-12"
                          placeholder="12345"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Special Instructions (Optional)</Label>
                      <Input
                        id="notes"
                        value={address.notes}
                        onChange={(e) => setAddress({ ...address, notes: e.target.value })}
                        className="mt-2 h-12"
                        placeholder="Gate code, parking info, etc."
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-card rounded-2xl p-6 shadow-soft"
                >
                  <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                    Confirm Your Booking
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span className="text-muted-foreground">Date & Time</span>
                      </div>
                      <span className="font-medium text-foreground">
                        {selectedDate} at {selectedTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <span className="text-muted-foreground">Address</span>
                      </div>
                      <span className="font-medium text-foreground text-right">
                        {address.street}, {address.city} {address.zip}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="text-muted-foreground">Duration</span>
                      </div>
                      <span className="font-medium text-foreground">{service.duration}</span>
                    </div>
                  </div>

                  <p className="mt-6 text-sm text-muted-foreground text-center">
                    Youll complete payment on the next page
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="gap-2"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
      
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading ? "Processing..." : "Proceed to Payment"}
                  <CreditCard className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-2xl p-6 shadow-card">
              <h3 className="font-display font-semibold text-foreground mb-4">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{service.name}</p>
                    <p className="text-sm text-muted-foreground">{service.company}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 py-4 border-y border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span className="text-foreground">${service.price}.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span className="text-foreground">$5.00</span>
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">${service.price + 5}.00</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
