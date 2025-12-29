"use client"
import { useParams , useRouter } from 'next/navigation';

import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, MapPin, User, Phone, Mail, DollarSign, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { bookings, companies } from '@/data/mockData';
import { useToast } from '@/lib/hooks/use-toast';
import Image from 'next/image';

export default function BookingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const booking = bookings.find((b) => b.id === id);
  const company = booking ? companies.find((c) => c.id === booking.companyId) : null;

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="font-display text-2xl font-semibold">Booking not found</h2>
        <Button asChild className="mt-4">
          <Link href="/customer/bookings">Back to Bookings</Link>
        </Button>
      </div>
    );
  }

  const handleCancel = () => {
    toast({
      title: 'Booking Canceled',
      description: 'Your booking has been canceled successfully.',
    });
    router.push('/customer/bookings');
  };

  const handlePay = () => {
    router.push(`/customer/payments/${booking.id}`);
  };

  const handleReview = () => {
    router.push('/customer/reviews/new');
  };

  return (
    <div className="animate-fade-in">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/customer/bookings">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bookings
        </Link>
      </Button>

      <PageHeader
        title={`Booking ${booking.id}`}
        description="View your booking details"
        actions={<StatusBadge status={booking.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <Card className="glass-card p-6 lg:col-span-2">
          <h3 className="mb-4 font-display text-xl font-semibold">Booking Information</h3>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Service</p>
                <p className="font-medium text-foreground">{booking.serviceName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="font-medium text-foreground">{booking.companyName}</p>
              </div>
              {booking.staffName && (
                <div>
                  <p className="text-sm text-muted-foreground">Staff Assigned</p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <p className="font-medium text-foreground">{booking.staffName}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Date & Time</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <p className="font-medium">{new Date(booking.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <p className="font-medium">{booking.time}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <p className="font-medium">{booking.location}</p>
                </div>
              </div>
            </div>
          </div>

          {booking.notes && (
            <>
              <Separator className="my-6" />
              <div>
                <p className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  Special Instructions
                </p>
                <p className="rounded-lg bg-muted p-4 text-foreground">{booking.notes}</p>
              </div>
            </>
          )}

          <Separator className="my-6" />

          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Total Amount</span>
            <span className="flex items-center text-2xl font-bold text-primary">
              <DollarSign className="h-6 w-6" />
              {booking.totalPrice}
            </span>
          </div>
        </Card>

        {/* Company Contact & Actions */}
        <div className="space-y-6">
          {company && (
            <Card className="glass-card p-6">
              <h3 className="mb-4 font-display text-lg font-semibold">Company Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={200}
                    height={200}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium">{company.name}</p>
                    <p className="text-sm text-muted-foreground">{company.category}</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 text-primary" />
                    {company.phone}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 text-primary" />
                    {company.email}
                  </div>
                </div>
              </div>
            </Card>
          )}

          <Card className="glass-card p-6">
            <h3 className="mb-4 font-display text-lg font-semibold">Actions</h3>
            <div className="space-y-3">
              {booking.status === 'pending' && (
                <Button onClick={handlePay} className="w-full">
                  Pay Now
                </Button>
              )}
              {booking.status === 'completed' && (
                <Button onClick={handleReview} className="w-full">
                  Write Review
                </Button>
              )}
              {(booking.status === 'pending' || booking.status === 'confirmed') && (
                <Button variant="destructive" onClick={handleCancel} className="w-full">
                  Cancel Booking
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
