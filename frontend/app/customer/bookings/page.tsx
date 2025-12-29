"use client"
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { bookings } from '@/data/mockData';

type FilterStatus = 'all' | 'upcoming' | 'past';

export default function BookingsPage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const filteredBookings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.date);
      
      switch (filterStatus) {
        case 'upcoming':
          return bookingDate >= today && booking.status !== 'canceled' && booking.status !== 'completed';
        case 'past':
          return bookingDate < today || booking.status === 'completed' || booking.status === 'canceled';
        default:
          return true;
      }
    });
  }, [filterStatus]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="My Bookings"
        description="View and manage all your service bookings"
        actions={
          <Button asChild>
            <Link href="/customer/bookings/new">
              <Plus className="mr-2 h-4 w-4" />
              New Booking
            </Link>
          </Button>
        }
      />

      {/* Filters */}
      <div className="mb-6 flex items-center gap-4">
        <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as FilterStatus)}>
          <SelectTrigger className="w-40 bg-card">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Bookings</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="past">Past</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings Table */}
      {filteredBookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No bookings found"
          description="You haven't made any bookings yet. Start by browsing our service providers."
          action={{
            label: 'Browse Companies',
            onClick: () => window.location.href = '/customer/companies',
          }}
        />
      ) : (
        <Card className="glass-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking, index) => (
                <TableRow 
                  key={booking.id} 
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>{booking.serviceName}</TableCell>
                  <TableCell>{booking.companyName}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {new Date(booking.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {booking.time}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={booking.status} />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${booking.totalPrice}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/customer/bookings/${booking.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
