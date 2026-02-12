"use client"
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, CheckCircle, XCircle, Clock, UserPlus, Loader2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BookingStatus } from "@/types/booking.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/lib/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

const statusConfig = {
  pending: { label: "Pending", variant: "secondary" as const, icon: Clock },
  confirmed: { label: "Confirmed", variant: "default" as const, icon: CheckCircle },
  in_progress: { label: "In Progress", variant: "default" as const, icon: Clock },
  completed: { label: "Completed", variant: "outline" as const, icon: CheckCircle },
  cancelled: { label: "Cancelled", variant: "destructive" as const, icon: XCircle },
};

interface StaffMember {
  id: string; // CompanyStaff.id
  userId: string;
  fullName: string;
  email: string;
  avatar: string | null;
  phone: string;
  role: string;
  activeRequests: number;
  activeBookings: number;
  isAvailable: boolean;
  status: string;
}

interface Booking {
  id: string;
  customer: {
    id: string;
    fullName: string;
    email: string;
    avatar: string | null;
  };
  service: {
    id: string;
    name: string;
    basePrice: number;
    image: string | null;
  };
  bookingDate: string;
  startTime: string;
  endTime: string;
  serviceAddress: string;
  status: BookingStatus;
  totalPrice: number;
  assignedStaff: {
    id: string;
    fullName: string;
    avatar: string | null;
  } | null;
}

export default function Bookings() {
  const [activeTab, setActiveTab] = useState<"all" | BookingStatus>("all");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [assignmentNotes, setAssignmentNotes] = useState<string>("");
  const [assigning, setAssigning] = useState(false);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);

  // Fetch bookings
  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (activeTab !== "all") {
        params.append("status", activeTab);
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/bookings?${params.toString()}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings');
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch staff members
  const fetchStaffMembers = async () => {
    setLoadingStaff(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/staff`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch staff members');
      }
      
      const data = await response.json();
      setStaffMembers(data.staff || []);
    } catch (err) {
      console.error('Error fetching staff:', err);
      toast({
        title: "Error",
        description: "Failed to load staff members",
        variant: "destructive",
      });
    } finally {
      setLoadingStaff(false);
    }
  };

  // Load bookings on mount and when tab changes
  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const openAssignDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setSelectedStaffId("");
    setAssignmentNotes("");
    setAssignDialogOpen(true);
    fetchStaffMembers();
  };

  const handleAssignStaff = async () => {
    if (!selectedBooking || !selectedStaffId) return;
    setAssigning(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/assign-staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          staffId: selectedStaffId,
          notes: assignmentNotes || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to assign staff');
      }

      const data = await response.json();
      const staff = staffMembers.find((s) => s.id === selectedStaffId);
      
      toast({
        title: "Staff Assigned",
        description: `${staff?.fullName} has been assigned to this booking.`,
      });

      setAssignDialogOpen(false);
      fetchBookings(); // Refresh bookings list
    } catch (err: any) {
      console.error('Error assigning staff:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to assign staff to this booking",
        variant: "destructive",
      });
    } finally {
      setAssigning(false);
    }
  };

  const filteredBookings = bookings;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Bookings</h1>
            <p className="text-muted-foreground mt-1">Manage your service bookings and assign staff</p>
          </div>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/company/bookings/calendar">
              <Calendar className="h-4 w-4" />
              Calendar View
            </Link>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "all" | BookingStatus)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardContent className="p-0">
                {loading && (
                  <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                )}
                {error && !loading && (
                  <div className="flex items-center justify-between p-4 text-sm text-destructive">
                    <span>{error}</span>
                    <Button variant="ghost" size="sm" onClick={fetchBookings}>
                      Retry
                    </Button>
                  </div>
                )}
                {!loading && !error && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-border bg-muted/50">
                        <tr>
                          <th className="text-left p-4 font-medium text-muted-foreground">Customer</th>
                          <th className="text-left p-4 font-medium text-muted-foreground">Service</th>
                          <th className="text-left p-4 font-medium text-muted-foreground">Date & Time</th>
                          <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                          <th className="text-left p-4 font-medium text-muted-foreground">Staff</th>
                          <th className="text-left p-4 font-medium text-muted-foreground">Amount</th>
                          <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.map((booking) => {
                          const status = statusConfig[booking.status as keyof typeof statusConfig];
                          const bookingDate = new Date(booking.bookingDate);
                          const startTime = new Date(booking.startTime);
                          return (
                            <tr
                              key={booking.id}
                              className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                            >
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={booking.customer.avatar || undefined} />
                                    <AvatarFallback>{booking.customer.fullName[0]}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{booking.customer.fullName}</p>
                                    <p className="text-sm text-muted-foreground">{booking.customer.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <p>{booking.service.name}</p>
                                <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                  {booking.serviceAddress}
                                </p>
                              </td>
                              <td className="p-4">
                                <p>{bookingDate.toLocaleDateString()}</p>
                                <p className="text-sm text-muted-foreground">
                                  {startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </td>
                              <td className="p-4">
                                <Badge variant={status.variant} className="gap-1">
                                  <status.icon className="h-3 w-3" />
                                  {status.label}
                                </Badge>
                              </td>
                              <td className="p-4">
                                {booking.assignedStaff ? (
                                  <div className="flex items-center gap-2">
                                    <Avatar className="w-6 h-6">
                                      <AvatarImage src={booking.assignedStaff.avatar || undefined} />
                                      <AvatarFallback>{booking.assignedStaff.fullName[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">{booking.assignedStaff.fullName}</span>
                                  </div>
                                ) : (
                                  <span className="text-sm text-muted-foreground italic">Unassigned</span>
                                )}
                              </td>
                              <td className="p-4 font-medium">
                                ${Number(booking.totalPrice).toFixed(2)}
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {!booking.assignedStaff && (
                                    <Button
                                      variant="default"
                                      size="sm"
                                      onClick={() => openAssignDialog(booking)}
                                      className="gap-1"
                                    >
                                      <UserPlus className="h-3.5 w-3.5" />
                                      <span className="hidden sm:inline">Assign</span>
                                    </Button>
                                  )}
                                  <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/company/bookings/${booking.id}`}>
                                      <Eye className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {filteredBookings.length === 0 && (
                          <tr>
                            <td colSpan={7} className="p-12 text-center text-muted-foreground">
                              No bookings found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Assign Staff Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Staff to Booking</DialogTitle>
            <DialogDescription>
              Select a staff member to assign to this booking.
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              {/* Booking Summary */}
              <div className="p-3 rounded-lg bg-secondary/50 border border-border/50 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={selectedBooking.customer.avatar || undefined} />
                    <AvatarFallback>{selectedBooking.customer.fullName[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm text-foreground">
                    {selectedBooking.customer.fullName}
                  </span>
                </div>
                <p className="text-sm text-foreground font-medium">{selectedBooking.service.name}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> 
                    {new Date(selectedBooking.bookingDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 
                    {new Date(selectedBooking.startTime).toLocaleTimeString([], { 
                      hour: "2-digit", 
                      minute: "2-digit" 
                    })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedBooking.serviceAddress}
                </p>
              </div>

              {/* Staff Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Select Staff Member</label>
                
                {loadingStaff ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : staffMembers.length === 0 ? (
                  <div className="text-center p-4 text-sm text-muted-foreground">
                    No staff members found. Please add staff to your company first.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {staffMembers.map((staff) => (
                      <label
                        key={staff.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedStaffId === staff.id
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:border-primary/30 hover:bg-secondary/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="staff"
                          value={staff.id}
                          checked={selectedStaffId === staff.id}
                          onChange={(e) => setSelectedStaffId(e.target.value)}
                          className="sr-only"
                        />
                        <Avatar className="w-9 h-9">
                          <AvatarImage src={staff.avatar || undefined} />
                          <AvatarFallback>{staff.fullName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-foreground">{staff.fullName}</p>
                          <p className="text-xs text-muted-foreground">
                            {staff.role} · {staff.activeRequests} pending · {staff.activeBookings} active
                          </p>
                          {staff.isAvailable && (
                            <Badge variant="outline" className="mt-1 text-xs px-1.5 py-0 border-green-500 text-green-700">
                              Available Today
                            </Badge>
                          )}
                        </div>
                        {selectedStaffId === staff.id && (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Optional Notes */}
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium text-foreground">
                  Notes (Optional)
                </label>
                <Textarea
                  id="notes"
                  placeholder="Add any special instructions or notes..."
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleAssignStaff}
              disabled={!selectedStaffId || assigning || loadingStaff}
            >
              {assigning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Assigning...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Assign Staff
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}