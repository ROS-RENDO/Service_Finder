"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Clock,
    ArrowRight,
    CheckCircle2,
    Calendar,
    DollarSign,
    Info,
    ChevronLeft,
    Building2
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useServices } from "@/lib/hooks/useServices";
import { Service } from "@/types/service.types";
import { useToast } from "@/lib/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function ServiceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const category = params.category as string;
    const serviceType = params.serviceType as string;
    const companyId = params.id as string;
    const serviceId = params.serviceId as string;

    const { toast } = useToast();
    const { getServiceById } = useServices({ autoFetch: false });

    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServiceDir = async () => {
            setLoading(true);
            const result = await getServiceById(serviceId);
            if (result.success && result.service) {
                setService(result.service);
            } else {
                toast({
                    title: "Error",
                    description: "Could not load service details.",
                    variant: "destructive",
                });
            }
            setLoading(false);
        };

        if (serviceId) {
            fetchServiceDir();
        }
    }, [serviceId]);

    const handleBookService = () => {
        router.push(
            `/customer/services/${category}/${serviceType}/company/${companyId}/booking?service=${serviceId}`
        );
    };

    const handleBack = () => {
        router.push(`/customer/services/${category}/${serviceType}/company/${companyId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col pt-[72px]">
                <Navbar />
                <main className="flex-1 flex flex-col items-center justify-center bg-background/50">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4 text-lg font-medium text-foreground">Loading service details...</p>
                </main>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen flex flex-col pt-[72px]">
                <Navbar />
                <main className="flex-1 flex flex-col items-center justify-center bg-background/50">
                    <p className="text-xl font-semibold text-foreground">Service not found.</p>
                    <Button onClick={handleBack} className="mt-4">Back to Company</Button>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 pt-[72px] pb-16 bg-background/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Back Button */}
                    <button
                        onClick={handleBack}
                        className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center group-hover:border-primary group-hover:text-primary transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </div>
                        Back to {(service as any).company?.name || 'Company'}
                    </button>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Main Details */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Header Image */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full h-[400px] relative rounded-3xl overflow-hidden shadow-elevated"
                            >
                                <Image
                                    src={service.image || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200"}
                                    alt={service.name}
                                    layout="fill"
                                    objectFit="cover"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <Badge className="bg-primary/90 hover:bg-primary text-primary-foreground mb-3 backdrop-blur-sm">
                                        {service.serviceType?.name || 'Service'}
                                    </Badge>
                                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-2">
                                        {service.name}
                                    </h1>
                                </div>
                            </motion.div>

                            {/* Service Details Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Card>
                                    <CardContent className="p-6 md:p-8">
                                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                            <Info className="w-6 h-6 text-primary" />
                                            About this Service
                                        </h2>
                                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                                            {service.description}
                                        </p>

                                        <Separator className="my-8" />

                                        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                                            <CheckCircle2 className="w-6 h-6 text-primary" />
                                            What's Included
                                        </h2>

                                        {service.features && service.features.length > 0 ? (
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                {service.features.map((feature: any, idx: number) => (
                                                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-accent/50 border border-border/50">
                                                        <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                                                        <span className="text-foreground font-medium">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground italic">No specific features listed for this service.</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Right Column - Booking Card (Sticky) */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="sticky top-24"
                            >
                                <Card className="border-primary/20 shadow-elevated overflow-hidden">
                                    <div className="bg-gradient-primary p-1" />
                                    <CardContent className="p-6">
                                        <div className="text-center mb-6">
                                            <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Starts at</p>
                                            <div className="flex justify-center items-start">
                                                <span className="text-2xl font-bold text-primary mt-1">$</span>
                                                <span className="text-5xl font-black text-foreground">{service.basePrice.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/50">
                                                <div className="flex items-center gap-3">
                                                    <Clock className="w-5 h-5 text-muted-foreground" />
                                                    <span className="font-medium text-foreground">Duration</span>
                                                </div>
                                                <span className="font-semibold text-foreground">
                                                    {((service.durationMin ?? 0) / 60).toFixed(1)}
                                                    {service.durationMax && service.durationMax > 0
                                                        ? ` - ${((service.durationMax ?? 0) / 60).toFixed(1)}`
                                                        : ""}{" "}
                                                    hrs
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/50">
                                                <div className="flex items-center gap-3">
                                                    <Building2 className="w-5 h-5 text-muted-foreground" />
                                                    <span className="font-medium text-foreground">Provider</span>
                                                </div>
                                                <span className="font-semibold text-foreground truncate max-w-[140px]" title={(service as any).company?.name}>
                                                    {(service as any).company?.name}
                                                </span>
                                            </div>
                                        </div>

                                        <Button
                                            size="lg"
                                            className="w-full gap-2 text-lg h-14 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                                            onClick={handleBookService}
                                        >
                                            <Calendar className="w-5 h-5" />
                                            Book Now
                                            <ArrowRight className="w-5 h-5" />
                                        </Button>
                                        <p className="text-center text-xs text-muted-foreground mt-4">
                                            You won't be charged yet.
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
