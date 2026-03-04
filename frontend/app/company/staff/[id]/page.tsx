"use client"

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit2, Trash2, RotateCcw, Mail, Phone, Briefcase, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingCard } from "@/components/common/LoadingCard";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { useToast } from "@/lib/hooks/use-toast";
import { useCompanies } from "@/lib/hooks/useCompanies";
import { format } from "date-fns";

interface StaffDetail {
    id: string;
    userId: string;
    role: string;
    status: string;
    createdAt?: string;
    activeRequests?: number;
    completedJobs?: number;
    averageRating?: number | null;
    user?: { fullName?: string; email?: string; phone?: string | null; avatar?: string | null };
}

export default function StaffDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { toast } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        getStaffMemberById,
        removeStaffMember,
        reactivateStaffMember,
        loading
    } = useCompanies({});

    const [staff, setStaff] = useState<StaffDetail | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        const fetchStaff = async () => {
            const result = await getStaffMemberById(resolvedParams.id);
            if (cancelled) return;
            if (result.success && result.staff) {
                setStaff(result.staff as StaffDetail);
                setError(null);
            } else {
                setError(result.error || "Failed to load staff member");
            }
        };
        fetchStaff();
        return () => { cancelled = true; };
    }, [resolvedParams.id]);

    const handleRemove = async () => {
        if (!confirm("Are you sure you want to remove this staff member? This action cannot be undone.")) {
            return;
        }

        setIsDeleting(true);
        const result = await removeStaffMember(resolvedParams.id);

        if (result.success) {
            toast({
                title: "Staff Member Removed",
                description: "The staff member has been removed successfully.",
            });
            router.push("/company/staff");
        } else {
            toast({
                title: "Error",
                description: result.error || "Failed to remove staff member",
                variant: "destructive",
            });
        }
        setIsDeleting(false);
    };

    const handleReactivate = async () => {
        const result = await reactivateStaffMember(resolvedParams.id);

        if (result.success) {
            toast({
                title: "Staff Member Reactivated",
                description: "The staff member has been reactivated successfully.",
            });
            if (staff) {
                setStaff({ ...staff, status: "active" });
            }
        } else {
            toast({
                title: "Error",
                description: result.error || "Failed to reactivate staff member",
                variant: "destructive",
            });
        }
    };

    if (loading && !staff) return <LoadingCard />;
    if (error && !staff) return <ErrorMessage message={error} />;
    if (!staff) return <LoadingCard />; // Fallback for initial state or unexpected null

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-6 flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
            </div>

            <PageHeader
                title={staff.user?.fullName || "Staff Member"}
                description={`Role: ${staff.role || "Staff"}`}
                actions={
                    <div className="flex gap-2">
                        {staff.status === "inactive" ? (
                            <Button
                                onClick={handleReactivate}
                                variant="default"
                            >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Reactivate
                            </Button>
                        ) : (
                            <>
                                <Button
                                    onClick={handleRemove}
                                    variant="destructive"
                                    disabled={isDeleting}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {isDeleting ? "Removing..." : "Remove"}
                                </Button>
                            </>
                        )}
                    </div>
                }
            />

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Info Card */}
                <Card className="glass-card p-6 lg:col-span-2">
                    <h3 className="font-display text-xl font-semibold mb-6">Staff Information</h3>

                    {/* Avatar and Basic Info */}
                    <div className="flex items-start gap-6 mb-6">
                        <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                            <AvatarFallback className="text-2xl font-semibold">
                                {staff.user?.fullName?.charAt(0) || "S"}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl font-bold">{staff.user?.fullName}</h2>
                                <Badge variant={staff.status === "active" ? "default" : "secondary"}>
                                    {staff.status}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground mb-4">{staff.role || "Staff Member"}</p>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{staff.user?.email}</span>
                                </div>
                                {staff.user?.phone && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{staff.user.phone}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Additional Details */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">User ID</p>
                            <p className="font-medium">{staff.userId}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Staff ID</p>
                            <p className="font-medium">{staff.id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Joined Date</p>
                            <p className="font-medium">
                                {staff.createdAt ? format(new Date(staff.createdAt), "MMM dd, yyyy") : "N/A"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Status</p>
                            <Badge variant={staff.status === "active" ? "default" : "secondary"}>
                                {staff.status}
                            </Badge>
                        </div>
                    </div>
                </Card>

                {/* Stats Card */}
                <Card className="glass-card p-6">
                    <h3 className="font-display text-lg font-semibold mb-6">Performance</h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Briefcase className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Jobs Completed</p>
                                    <p className="text-2xl font-bold">{staff.completedJobs || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                                    <CheckCircle2 className="h-5 w-5 text-success" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Rating</p>
                                    <p className="text-2xl font-bold">{staff.averageRating ? staff.averageRating.toFixed(1) : "N/A"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                                    <Calendar className="h-5 w-5 text-warning" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Active Bookings</p>
                                    <p className="text-2xl font-bold">{staff.activeRequests || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card className="glass-card p-6 mt-6">
                <h3 className="font-display text-lg font-semibold mb-4">Recent Activity</h3>
                <p className="text-sm text-muted-foreground text-center py-8">
                    No recent activity to display
                </p>
            </Card>
        </div>
    );
}
