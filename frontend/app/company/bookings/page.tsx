"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, List, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const bookings = [
  { id: 1, customer: "Sarah Johnson", email: "sarah@email.com", service: "Deep Clean", date: "Dec 31, 2025", time: "2:00 PM", status: "confirmed", amount: "$180", address: "123 Oak Street" },
  { id: 2, customer: "Mike Chen", email: "mike@email.com", service: "Regular Clean", date: "Dec 31, 2025", time: "4:30 PM", status: "pending", amount: "$95", address: "456 Pine Ave" },
  { id: 3, customer: "Emily Davis", email: "emily@email.com", service: "Move-out Clean", date: "Jan 1, 2026", time: "9:00 AM", status: "confirmed", amount: "$320", address: "789 Elm Road" },
  { id: 4, customer: "James Wilson", email: "james@email.com", service: "Office Clean", date: "Jan 1, 2026", time: "1:00 PM", status: "in_progress", amount: "$250", address: "321 Business Park" },
  { id: 5, customer: "Lisa Brown", email: "lisa@email.com", service: "Regular Clean", date: "Jan 2, 2026", time: "10:00 AM", status: "completed", amount: "$95", address: "654 Maple Lane" },
];

const statusConfig = {
  pending: { label: "Pending", variant: "secondary" as const, icon: Clock },
  confirmed: { label: "Confirmed", variant: "default" as const, icon: CheckCircle },
  in_progress: { label: "In Progress", variant: "default" as const, icon: Clock },
  completed: { label: "Completed", variant: "outline" as const, icon: CheckCircle },
  cancelled: { label: "Cancelled", variant: "destructive" as const, icon: XCircle },
};

export default function Bookings() {
  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Bookings</h1>
            <p className="text-muted-foreground mt-1">Manage your service bookings</p>
          </div>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/company/bookings/calendar">
              <Calendar className="h-4 w-4" />
              Calendar View
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium text-muted-foreground">Customer</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Service</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Date & Time</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Amount</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => {
                        const status = statusConfig[booking.status as keyof typeof statusConfig];
                        return (
                          <tr key={booking.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                            <td className="p-4">
                              <div>
                                <p className="font-medium">{booking.customer}</p>
                                <p className="text-sm text-muted-foreground">{booking.email}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <p>{booking.service}</p>
                              <p className="text-sm text-muted-foreground">{booking.address}</p>
                            </td>
                            <td className="p-4">
                              <p>{booking.date}</p>
                              <p className="text-sm text-muted-foreground">{booking.time}</p>
                            </td>
                            <td className="p-4">
                              <Badge variant={status.variant} className="gap-1">
                                <status.icon className="h-3 w-3" />
                                {status.label}
                              </Badge>
                            </td>
                            <td className="p-4 font-medium">{booking.amount}</td>
                            <td className="p-4 text-right">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/company/bookings/${booking.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center py-8">Filter shows pending bookings</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="confirmed" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center py-8">Filter shows confirmed bookings</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center py-8">Filter shows completed bookings</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
}
