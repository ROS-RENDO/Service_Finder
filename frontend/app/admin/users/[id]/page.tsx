"use client"
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Edit, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Mock user data
const userData = {
  id: "1",
  name: "Sarah Johnson",
  email: "sarah@example.com",
  phone: "+1 234 567 8901",
  address: "123 Main St, New York, NY 10001",
  role: "Customer",
  status: "active" as const,
  joinedAt: "December 15, 2025",
  totalBookings: 12,
  totalSpent: "$1,450",
  lastBooking: "December 28, 2025",
};

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/admin/users")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1 shadow-elevated">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                  {userData.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="mt-4 text-xl font-semibold">{userData.name}</h3>
              <p className="text-muted-foreground">{userData.role}</p>
              <div className="mt-3">
                <StatusBadge status={userData.status} />
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{userData.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{userData.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {userData.joinedAt}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats & Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="shadow-soft">
              <CardContent className="pt-6">
                <p className="text-3xl font-semibold text-primary">{userData.totalBookings}</p>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardContent className="pt-6">
                <p className="text-3xl font-semibold text-success">{userData.totalSpent}</p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardContent className="pt-6">
                <p className="text-lg font-semibold">{userData.lastBooking}</p>
                <p className="text-sm text-muted-foreground">Last Booking</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Booked Deep Cleaning", date: "Dec 28, 2025", status: "Completed" },
                  { action: "Updated profile", date: "Dec 25, 2025", status: "—" },
                  { action: "Booked Regular Cleaning", date: "Dec 20, 2025", status: "Completed" },
                  { action: "Left a review (5 stars)", date: "Dec 18, 2025", status: "—" },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{activity.status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
