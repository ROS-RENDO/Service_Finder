"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, TrendingUp, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const reviews = [
  { id: 1, customer: "Sarah Johnson", rating: 5, date: "Dec 28, 2025", service: "Deep Clean", comment: "Absolutely amazing service! Maria did an incredible job. Every corner was spotless. Will definitely book again!" },
  { id: 2, customer: "Mike Chen", rating: 4, date: "Dec 26, 2025", service: "Regular Clean", comment: "Good service overall. The team was punctual and professional. Minor areas could use more attention but satisfied overall." },
  { id: 3, customer: "Emily Davis", rating: 5, date: "Dec 24, 2025", service: "Move-out Clean", comment: "Best cleaning service I've ever used! They made my old apartment look brand new. Highly recommend!" },
  { id: 4, customer: "James Wilson", rating: 5, date: "Dec 22, 2025", service: "Office Clean", comment: "Professional team, excellent attention to detail. Our office has never looked better!" },
  { id: 5, customer: "Lisa Brown", rating: 4, date: "Dec 20, 2025", service: "Regular Clean", comment: "Reliable and thorough. The booking process was easy and the team arrived on time." },
];

const stats = [
  { label: "Average Rating", value: "4.8", icon: Star, color: "text-yellow-500" },
  { label: "Total Reviews", value: "156", icon: MessageSquare, color: "text-primary" },
  { label: "Rating Trend", value: "+0.2", icon: TrendingUp, color: "text-green-500" },
];

export default function Reviews() {
  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Reviews</h1>
          <p className="text-muted-foreground mt-1">Customer feedback and ratings</p>
        </div>

        {/* Stats */}
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

        {/* Reviews List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="pb-6 border-b border-border last:border-0 last:pb-0">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-secondary">
                      {review.customer.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{review.customer}</h4>
                        <p className="text-sm text-muted-foreground">{review.service} • {review.date}</p>
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
