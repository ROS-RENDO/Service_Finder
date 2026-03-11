'use client'
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    User,
    DollarSign,
    FileText,
    CheckCircle,
    XCircle,
    Timer,
    Loader2,
    UserPlus,
    Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const statusConfig: Record<string, { color: string; label: string }> = {
    pending: { color: "bg-amber-500 text-white", label: "Pending" },
    confirmed: { color: "bg-blue-500 text-white", label: "Confirmed" },
    in_progress: { color: "bg-primary text-white", label: "In Progress" },
    completed: { color: "bg-emerald-500 text-white", label: "Completed" },
    cancelled: { color: "bg-destructive text-white", label: "Cancelled" },
};

interface StaffMember {
    id: string;
    fullName: string;
    role: string;
    status: string;
    activeRequests: number;
    activeBookings: number;
}

interface BookingDetail {
    id: string;
    status: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    serviceAddress: string;
    totalPrice: number;
    platformFee: number;
    companyEarnings: number;
    latitude: number | null;
    longitude: number | null;
    customer: { id: string; fullName: string; email: string; phone: string };
    service: { id: string; name: string; description: string; basePrice: number };
    assignedStaff: { id: string; fullName: string; role: string } | null;
}

export default function CompanyBookingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : undefined;

    const [booking, setBooking] = useState<BookingDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [assigning, setAssigning] = useState(false);
    const [selectedStaffId, setSelectedStaffId] = useState("");
    const [showAssign, setShowAssign] = useState(false);
    const [loadingStaff, setLoadingStaff] = useState(false);
    const [confirmingCash, setConfirmingCash] = useState(false);

    const fetchBooking = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/bookings/${id}`, {
                credentials: "include",
            });
            if (!res.ok) throw new Error("Booking not found");
            const data = await res.json();
            setBooking(data.booking);
        } catch {
            toast.error("Failed to load booking");
            setTimeout(() => router.push("/company/bookings"), 1500);
        } finally {
            setLoading(false);
        }
    };

    const fetchStaff = async () => {
        setLoadingStaff(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/staff`, {
                credentials: "include",
            });
            const data = await res.json();
            setStaff(data.staff || []);
        } catch {
            toast.error("Failed to load staff");
        } finally {
            setLoadingStaff(false);
        }
    };

    const handleAssign = async () => {
        if (!booking || !selectedStaffId) return;
        setAssigning(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/assign-staff`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ bookingId: booking.id, staffId: selectedStaffId }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to assign");
            }
            toast.success("Staff assigned successfully!");
            setShowAssign(false);
            fetchBooking();
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Failed to assign staff");
        } finally {
            setAssigning(false);
        }
    };


    useEffect(() => { fetchBooking(); }, [id]);

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" });

    const formatTime = (start: string, end: string) => {
        const fmt = (iso: string) => {
            const d = new Date(iso);
            const h = d.getUTCHours(), m = d.getUTCMinutes();
            const ampm = h >= 12 ? "PM" : "AM";
            return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${ampm}`;
        };
        return `${fmt(start)} – ${fmt(end)}`;
    };

    const openInMaps = () => {
        if (booking?.latitude && booking?.longitude) {
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${booking.latitude},${booking.longitude}`, "_blank");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
    );

    if (!booking) return null;

    const status = statusConfig[booking.status] ?? { color: "bg-gray-500 text-white", label: booking.status };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <Link href="/company/bookings">
                                <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
                            </Link>
                            <div>
                                <h1 className="font-semibold text-foreground">Booking #{booking.id}</h1>
                                <p className="text-xs text-muted-foreground">{booking.service.name}</p>
                            </div>
                        </div>
                        <Badge className={status.color}>{status.label}</Badge>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
                {/* Customer Info */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" /> Customer Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 mb-4">
                                <Avatar className="w-14 h-14">
                                    <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                                        {booking.customer.fullName.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h3 className="font-semibold">{booking.customer.fullName}</h3>
                                    <p className="text-sm text-muted-foreground">{booking.customer.email}</p>
                                    {booking.customer.phone && (
                                        <p className="text-sm text-muted-foreground">{booking.customer.phone}</p>
                                    )}
                                </div>
                            </div>
                            {booking.customer.phone && (
                                <Button variant="outline" className="gap-2 w-full" asChild>
                                    <a href={`tel:${booking.customer.phone}`}>
                                        <Phone className="w-4 h-4" /> Call Customer
                                    </a>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Location */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-primary" /> Service Location
                                </CardTitle>
                                {booking.latitude && booking.longitude && (
                                    <Button variant="outline" size="sm" onClick={openInMaps}>
                                        Navigate
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm font-medium">{booking.serviceAddress}</p>
                            {!booking.latitude && (
                                <p className="text-xs text-muted-foreground mt-1">No GPS coordinates stored</p>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Booking Details */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" /> Booking Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Date</p>
                                        <p className="text-sm font-medium">{formatDate(booking.bookingDate)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Time</p>
                                        <p className="text-sm font-medium">{formatTime(booking.startTime, booking.endTime)}</p>
                                    </div>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Your Earnings</p>
                                        <p className="text-lg font-bold text-primary">${Number(booking.companyEarnings ?? 0).toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground">Total Price</p>
                                    <p className="text-sm font-medium">${Number(booking.totalPrice ?? 0).toFixed(2)}</p>
                                    <p className="text-xs text-muted-foreground">Fee: ${Number(booking.platformFee ?? 0).toFixed(2)}</p>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm font-medium mb-2">Service Description</p>
                                <div className="bg-secondary rounded-lg p-3">
                                    <p className="text-sm text-muted-foreground">{booking.service.description || "—"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Assigned Staff */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <UserPlus className="w-5 h-5 text-primary" /> Assigned Staff
                                </CardTitle>
                                {!booking.assignedStaff && booking.status !== "completed" && booking.status !== "cancelled" && (
                                    <Button size="sm" onClick={() => { setShowAssign(!showAssign); fetchStaff(); }}>
                                        <UserPlus className="w-4 h-4 mr-2" /> Assign
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {booking.assignedStaff ? (
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-12 h-12">
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                            {booking.assignedStaff.fullName.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{booking.assignedStaff.fullName}</p>
                                        <p className="text-sm text-muted-foreground">{booking.assignedStaff.role}</p>
                                    </div>
                                    <CheckCircle className="w-5 h-5 text-emerald-500 ml-auto" />
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">No staff assigned yet.</p>
                            )}

                            {/* Inline assign panel */}
                            {showAssign && (
                                <div className="mt-4 space-y-3 border-t pt-4">
                                    {loadingStaff ? (
                                        <div className="flex justify-center py-4">
                                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                        </div>
                                    ) : staff.length === 0 ? (
                                        <p className="text-sm text-muted-foreground text-center">No active staff found.</p>
                                    ) : (
                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                            {staff.filter(s => s.status === "active").map((s) => (
                                                <label
                                                    key={s.id}
                                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedStaffId === s.id
                                                        ? "border-primary bg-primary/5"
                                                        : "border-border hover:border-primary/30"
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="staff"
                                                        value={s.id}
                                                        checked={selectedStaffId === s.id}
                                                        onChange={(e) => setSelectedStaffId(e.target.value)}
                                                        className="sr-only"
                                                    />
                                                    <Avatar className="w-9 h-9">
                                                        <AvatarFallback>{s.fullName.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{s.fullName}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {s.role} · {s.activeRequests} pending · {s.activeBookings} active
                                                        </p>
                                                    </div>
                                                    {selectedStaffId === s.id && (
                                                        <CheckCircle className="w-4 h-4 text-primary" />
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <Button variant="outline" className="flex-1" onClick={() => setShowAssign(false)}>Cancel</Button>
                                        <Button
                                            className="flex-1"
                                            disabled={!selectedStaffId || assigning}
                                            onClick={handleAssign}
                                        >
                                            {assigning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                                            {assigning ? "Assigning..." : "Confirm Assignment"}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </main>
        </div>
    );
}
