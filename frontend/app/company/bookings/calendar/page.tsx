"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, List } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const bookings = [
  { id: 1, day: 31, time: "2:00 PM", customer: "Sarah J.", service: "Deep Clean" },
  { id: 2, day: 31, time: "4:30 PM", customer: "Mike C.", service: "Regular Clean" },
  { id: 3, day: 1, time: "9:00 AM", customer: "Emily D.", service: "Move-out" },
  { id: 4, day: 2, time: "1:00 PM", customer: "James W.", service: "Office Clean" },
];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function BookingsCalendar() {
  const [currentMonth] = useState("December 2025");

  const getDaysInMonth = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }
    return days;
  };

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Calendar</h1>
            <p className="text-muted-foreground mt-1">View bookings in calendar format</p>
          </div>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/company/bookings">
              <List className="h-4 w-4" />
              List View
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>{currentMonth}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
              {daysOfWeek.map((day) => (
                <div key={day} className="bg-muted p-3 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
              {/* Empty cells for start of month (Dec 2025 starts on Monday) */}
              <div className="bg-card p-3 min-h-[100px]" />
              {getDaysInMonth().map((day) => {
                const dayBookings = bookings.filter((b) => b.day === day);
                return (
                  <div key={day} className="bg-card p-2 min-h-[100px] border-t border-border">
                    <span className={`text-sm font-medium ${day === 31 ? 'text-primary' : ''}`}>{day}</span>
                    <div className="mt-1 space-y-1">
                      {dayBookings.map((booking) => (
                        <Link
                          key={booking.id}
                          href={`/company/bookings/${booking.id}`}
                          className="block text-xs p-1.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors truncate"
                        >
                          {booking.time} - {booking.customer}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
