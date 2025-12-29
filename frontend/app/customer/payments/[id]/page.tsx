"use client"
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, CreditCard, Download, DollarSign, FileText, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge, StatusType } from '@/components/common/StatusBadge';
import { payments, bookings } from '@/data/mockData';
import { useToast } from '@/lib/hooks/use-toast';

export default function PaymentDetailsPage() {
  const { id } = useParams();
  const { toast } = useToast();
  
  const payment = payments.find((p) => p.id === id);
  const booking = payment ? bookings.find((b) => b.id === payment.bookingId) : null;

  if (!payment) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="font-display text-2xl font-semibold">Payment not found</h2>
        <Button asChild className="mt-4">
          <Link href="/customer/payments">Back to Payments</Link>
        </Button>
      </div>
    );
  }

  const handleDownloadReceipt = () => {
    toast({
      title: 'Receipt Downloaded',
      description: 'Your receipt has been downloaded successfully.',
    });
  };

  return (
    <div className="animate-fade-in">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/customer/payments">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payments
        </Link>
      </Button>

      <PageHeader
        title={`Payment ${payment.id}`}
        description="View transaction details"
        actions={<StatusBadge status={payment.status as StatusType} />}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Payment Details */}
        <Card className="glass-card p-6">
          <h3 className="mb-4 font-display text-xl font-semibold">Transaction Details</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Hash className="h-4 w-4" />
                Payment ID
              </span>
              <span className="font-medium">{payment.id}</span>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4" />
                Booking ID
              </span>
              <Link 
                href={`/customer/bookings/${payment.bookingId}`}
                className="font-medium text-primary hover:underline"
              >
                {payment.bookingId}
              </Link>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                Payment Method
              </span>
              <span className="font-medium">{payment.method}</span>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Transaction Date
              </span>
              <span className="font-medium">
                {new Date(payment.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between pt-2">
              <span className="text-lg font-semibold">Amount Paid</span>
              <span className="flex items-center text-2xl font-bold text-primary">
                <DollarSign className="h-6 w-6" />
                {payment.amount}
              </span>
            </div>
          </div>
        </Card>

        {/* Service Info & Actions */}
        <div className="space-y-6">
          <Card className="glass-card p-6">
            <h3 className="mb-4 font-display text-lg font-semibold">Service Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Service</p>
                <p className="font-medium">{payment.serviceName}</p>
              </div>
              {booking && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium">{booking.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Service Date</p>
                    <p className="font-medium">
                      {new Date(booking.date).toLocaleDateString()} at {booking.time}
                    </p>
                  </div>
                </>
              )}
            </div>
          </Card>

          <Card className="glass-card p-6">
            <h3 className="mb-4 font-display text-lg font-semibold">Receipt</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Download a copy of your payment receipt for your records.
            </p>
            <Button onClick={handleDownloadReceipt} className="w-full" variant="secondary">
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
