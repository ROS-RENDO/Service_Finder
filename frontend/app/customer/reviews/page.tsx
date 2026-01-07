"use client"
import Link from 'next/link';
import { Star, Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/common/PageHeader';
import { RatingStars } from '@/components/common/RatingStars';
import { EmptyState } from '@/components/common/EmptyState';
import { reviews } from '@/data/mockData';
import { useReviews } from '@/lib/hooks/useReviews';
import { useEffect } from 'react';


export default function ReviewsPage() {
    const { reviews } = useReviews({ autoFetch: true });

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="My Reviews"
        description="View and manage your service reviews"
        actions={
          <Button asChild>
            <Link href="/customer/reviews/new">
              <Plus className="mr-2 h-4 w-4" />
              Write Review
            </Link>
          </Button>
        }
      />

      {reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No reviews yet"
          description="Share your experience with service providers to help others make informed decisions."
          action={{
            label: 'Write Your First Review',
            href: '/customer/reviews/new',
          }}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <Card 
              key={review.id} 
              className="glass-card hover-lift p-6 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="font-display font-semibold text-foreground">
                    {review.booking.company.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{review.booking.service.name}</p>
                </div>
                <RatingStars rating={review.rating} size="sm" />
              </div>
              
              <p className="mb-4 line-clamp-3 text-sm text-foreground">
                {review.comment}
              </p>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
