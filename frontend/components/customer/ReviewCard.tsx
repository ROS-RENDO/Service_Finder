import { Star, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReviewCardProps {
  author: string;
  rating: number;
  date: string;
  content: string;
  helpful: number;
}

export function ReviewCard({ author, rating, date, content, helpful }: ReviewCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground">
            {author.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-foreground">{author}</p>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < rating ? "fill-accent text-accent" : "text-muted"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{date}</span>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-foreground">{content}</p>
      <div className="mt-4 flex items-center gap-2">
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <ThumbsUp className="mr-1 h-4 w-4" />
          Helpful ({helpful})
        </Button>
      </div>
    </div>
  );
}
