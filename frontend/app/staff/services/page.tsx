"use client";

import { useStaffBookings } from "@/lib/hooks/useStaff";
import { Clock, User, MapPin, Calendar, Briefcase, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function StaffServicesPage() {
    const { bookings, loading } = useStaffBookings({ status: "confirmed", limit: 50 });

    if (loading && !bookings.length) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Clock className="w-12 h-12 animate-spin mx-auto mb-4 text-primary opacity-50" />
                    <p className="text-muted-foreground animate-pulse">Loading your upcoming assignments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pt-12 lg:pt-0">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Assigned Services</h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Your upcoming service appointments that have been assigned to you.
                </p>
            </div>

            {bookings.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-primary/5 rounded-2xl border border-primary/10 p-16 text-center"
                >
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground mb-3">You're All Caught Up!</h3>
                    <p className="text-muted-foreground max-w-md mx-auto text-lg">
                        You don't have any upcoming assigned services at the moment. Take a break or check back later!
                    </p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookings.map((booking, index) => {
                        const dateObj = new Date(booking.bookingDate || booking.createdAt);
                        const startTimeObj = new Date(booking.startTime || booking.createdAt);

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={booking.id}
                            >
                                <Link href={`/staff/bookings/${booking.id}`}>
                                    <div className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 h-full flex flex-col cursor-pointer">
                                        {/* Header */}
                                        <div className="bg-muted/50 p-5 flex justify-between items-start border-b border-border/50">
                                            <div>
                                                <div className="inline-flex flex-wrap items-center gap-2 mb-2">
                                                    <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full items-center flex gap-1.5">
                                                        <Briefcase className="w-3.5 h-3.5" /> Upcoming Job
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                                    {booking.service?.name || "Service Request"}
                                                </h3>
                                            </div>
                                            <div className="bg-background rounded-full p-2 shadow-sm shrink-0 border border-border group-hover:scale-110 transition-transform">
                                                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </div>
                                        </div>

                                        {/* Body */}
                                        <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-2">
                                                {/* Date */}
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                                        <Calendar className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium text-muted-foreground mb-0.5">Date</p>
                                                        <p className="text-sm font-semibold text-foreground">
                                                            {format(dateObj, "MMM d, yyyy")}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Time */}
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                                                        <Clock className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium text-muted-foreground mb-0.5">Time</p>
                                                        <p className="text-sm font-semibold text-foreground">
                                                            {format(startTimeObj, "h:mm a")}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Customer */}
                                                {booking.customer && (
                                                    <div className="flex items-start gap-3 col-span-1 sm:col-span-2 mt-1">
                                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                                            <User className="w-4 h-4" />
                                                        </div>
                                                        <div className="flex-1 truncate">
                                                            <p className="text-xs font-medium text-muted-foreground mb-0.5">Customer</p>
                                                            <p className="text-sm font-medium text-foreground truncate">
                                                                {booking.customer.fullName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Address */}
                                                {booking.serviceAddress && (
                                                    <div className="flex items-start gap-3 col-span-1 sm:col-span-2 pt-1">
                                                        <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                                                            <MapPin className="w-4 h-4" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-xs font-medium text-muted-foreground mb-0.5">Location</p>
                                                            <p className="text-sm text-foreground line-clamp-2 leading-snug">
                                                                {booking.serviceAddress}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {booking.service?.description && (
                                                <div className="pt-4 mt-2 border-t border-border/50">
                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                        {booking.service.description}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
