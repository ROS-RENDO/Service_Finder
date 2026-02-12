"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { Service } from "@/types/service.types";
import { useRouter, useParams, useSearchParams } from "next/navigation";
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
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";
import { useBookings } from "@/lib/hooks/useBookings";

const steps = [
  { id: 1, name: "Date & Time", icon: Calendar },
  { id: 2, name: "Address", icon: MapPin },
  { id: 3, name: "Confirm", icon: Check },
];

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00",
  "23:00", "00:00"
];



export default function BookService() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { createBooking, loading: bookingLoading } = useBookings({ autoFetch: false });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [service, setService] = useState<Service | null>(null);
  const [serviceLoading, setServiceLoading] = useState(true);
  
  // Try to get companyId from URL params first, fallback to service data
  const urlCompanyId = params.companyId as string;
  const serviceId = searchParams.get("service");
  
  // Use companyId from service data if URL param is not available
  const companyId = urlCompanyId || service?.companyId;

  // Form data
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    zip: "",
    notes: "",
  });

  // Fetch service data on mount
  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) return;
      
      setServiceLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/services/${serviceId}`
        );

        if (response.ok) {
          const data = await response.json();
          setService(data.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to load service details",
            variant: "destructive",
          });
          router.back();
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load service details",
          variant: "destructive",
        });
        router.back();
      } finally {
        setServiceLoading(false);
      }
    };

    fetchService();
  }, [serviceId, router, toast]);

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

  const handleConfirm = async () => {
    console.log('handleConfirm called');
    
    if (!service) {
      console.log('No service found');
      toast({
        title: "Error",
        description: "Service information not loaded",
        variant: "destructive",
      });
      return;
    }
    
    // Use companyId from service if not in URL
    const finalCompanyId = companyId || service.companyId;
    
    if (!finalCompanyId) {
      toast({
        title: "Error",
        description: "Company ID not found",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const serviceAddress = `${address.street}, ${address.city}, ${address.zip}`;
      
      // Ensure IDs are valid numbers
      const parsedCompanyId = parseInt(finalCompanyId);
      const parsedServiceId = parseInt(serviceId!);
      
      console.log('Parsed IDs:', { parsedCompanyId, parsedServiceId });
      
      if (isNaN(parsedCompanyId) || isNaN(parsedServiceId)) {
        console.log('Invalid IDs');
        toast({
          title: "Error",
          description: "Invalid company or service ID",
          variant: "destructive",
        });
        return;
      }
      
      const bookingData = {
        companyId: parsedCompanyId,
        serviceId: parsedServiceId,
        bookingDate: selectedDate,
        startTime: selectedTime,
        serviceAddress: serviceAddress,
        // Optional fields - only include if they have values
        ...(address.notes && { specialInstructions: address.notes })
      };

      console.log('Booking data being sent:', bookingData);
      console.log('Calling createBooking...');
      const result = await createBooking(bookingData);
      console.log('Booking result:', result);

      if (result.success) {
        const bookingId = result.booking.id;
        
        toast({
          title: "Booking Created!",
          description: "Redirecting to payment...",
        });

        router.push(`/customer/bookings/${bookingId}/payments`);
      } else {
        toast({
          title: "Booking Failed",
          description: result.error || "Failed to create booking",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    }
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

  const formatTimeDisplay = (time24: string) => {
    const [hour] = time24.split(':');
    const hourNum = parseInt(hour);
    const isPM = hourNum >= 12;
    const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
    return `${displayHour}:00 ${isPM ? 'PM' : 'AM'}`;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  // Show loading state
  if (serviceLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-4" />
          <p className="text-muted-foreground">Loading service details...</p>
        </div>
      </div>
    );
  }

  // Show error if service not found
  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground font-semibold mb-2">Service not found</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const platformFee = service.platformFee ;
  const totalPrice = service.basePrice + platformFee;

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
                            {formatTimeDisplay(time)}
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
                        {selectedDate} at {formatTimeDisplay(selectedTime)}
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
                      <span className="font-medium text-foreground">
                        {formatDuration(service.durationMin)}
                      </span>
                    </div>

                    {address.notes && (
                      <div className="py-3 border-t border-border">
                        <p className="text-sm text-muted-foreground mb-1">Special Instructions:</p>
                        <p className="text-sm text-foreground">{address.notes}</p>
                      </div>
                    )}
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
                  onClick={() => {
                    console.log('Button clicked!');
                    console.log('Service:', service);
                    console.log('CompanyId:', companyId);
                    console.log('ServiceId:', serviceId);
                    console.log('Booking loading:', bookingLoading);
                    handleConfirm();
                  }}
                  disabled={bookingLoading}
                  className="gap-2"
                >
                  {bookingLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Payment
                      <CreditCard className="w-4 h-4" />
                    </>
                  )}
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
                    <p className="text-sm text-muted-foreground">
                      {service.company?.name || 'Service Provider'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 py-4 border-y border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span className="text-foreground">${service.basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span className="text-foreground">${platformFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}