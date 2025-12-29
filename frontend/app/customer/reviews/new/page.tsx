"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/common/PageHeader';
import { RatingStars } from '@/components/common/RatingStars';
import { companies, bookings } from '@/data/mockData';
import { useToast } from '@/lib/hooks/use-toast';

export default function NewReviewPage() {
  const router = useRouter();
  const { toast } = useToast();

  const completedBookings = bookings.filter((b) => b.status === 'completed');

  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedBooking = completedBookings.find((b) => b.id === selectedBookingId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBookingId || rating === 0 || !reviewText.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please select a booking, provide a rating, and write your review.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      toast({
        title: 'Review Submitted!',
        description: 'Thank you for sharing your feedback.',
      });
      router.push('/customer/reviews');
    }, 1000);
  };

  return (
    <div className="animate-fade-in">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/customer/reviews">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reviews
        </Link>
      </Button>

      <PageHeader
        title="Write a Review"
        description="Share your experience with our service providers"
      />

      <Card className="glass-card mx-auto max-w-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Booking Selection */}
          <div className="space-y-2">
            <Label htmlFor="booking">Select a Completed Booking *</Label>
            <Select value={selectedBookingId} onValueChange={setSelectedBookingId}>
              <SelectTrigger id="booking" className="bg-background">
                <SelectValue placeholder="Choose a booking to review" />
              </SelectTrigger>
              <SelectContent>
                {completedBookings.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No completed bookings available
                  </SelectItem>
                ) : (
                  completedBookings.map((booking) => (
                    <SelectItem key={booking.id} value={booking.id}>
                      {booking.serviceName} - {booking.companyName} ({new Date(booking.date).toLocaleDateString()})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Your Rating *</Label>
            <div className="flex items-center gap-3">
              <RatingStars
                rating={rating}
                size="lg"
                interactive
                onChange={setRating}
              />
              {rating > 0 && (
                <span className="text-sm text-muted-foreground">
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent'}
                </span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <Label htmlFor="review">Your Review *</Label>
            <Textarea
              id="review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this service. What did you like? What could be improved?"
              className="min-h-32 bg-background"
            />
          </div>

          {/* Selected Booking Summary */}
          {selectedBooking && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Reviewing:</p>
              <p className="font-medium">{selectedBooking.serviceName}</p>
              <p className="text-sm text-muted-foreground">by {selectedBooking.companyName}</p>
            </div>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              'Submitting...'
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Review
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
