"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, TrendingUp, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useReviews } from "@/lib/hooks/useReviews";

export default function Reviews() {
  const { reviews, loading, error, pagination, fetchReviews } = useReviews({
    autoFetch: true,
  });

  const totalReviews = pagination.total || reviews.length;
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  const stats = [
    { label: "Average Rating", value: averageRating, icon: Star, color: "text-yellow-500" },
    { label: "Total Reviews", value: String(totalReviews), icon: MessageSquare, color: "text-primary" },
    { label: "Rating Trend", value: "+0.0", icon: TrendingUp, color: "text-green-500" },
  ];

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Reviews</h1>
          <p className="text-muted-foreground mt-1">Customer feedback and ratings</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="stat-card">
              <CardContent className="p-0 flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading && (
              <p className="text-sm text-muted-foreground">Loading reviews...</p>
            )}
            {error && !loading && (
              <div className="flex items-center justify-between text-sm text-destructive">
                <span>Failed to load reviews.</span>
                <button
                  type="button"
                  onClick={fetchReviews}
                  className="underline underline-offset-2"
                >
                  Retry
                </button>
              </div>
            )}
            {!loading && !error && reviews.map((review) => (
              <div key={review.id} className="pb-6 border-b border-border last:border-0 last:pb-0">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-secondary">
                      {review.customer.fullName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{review.customer.fullName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {review.booking.service.name} •{" "}
                          {new Date(review.booking.bookingDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-foreground">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
  );
}
