import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Send, ThumbsUp, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";

interface ReviewFormProps {
  serviceName: string;
  companyName: string;
  staffName?: string;
  onSubmit?: (review: {
    rating: number;
    comment: string;
    staffRating?: number;
    staffComment?: string;
  }) => void;
}

export default function ReviewForm({
  serviceName,
  companyName,
  staffName,
  onSubmit,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [includeStaffReview, setIncludeStaffReview] = useState(false);
  const [staffRating, setStaffRating] = useState(0);
  const [staffHoverRating, setStaffHoverRating] = useState(0);
  const [staffComment, setStaffComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  const quickFeedback = [
    "Great service!",
    "Very professional",
    "On time arrival",
    "Excellent quality",
    "Friendly staff",
    "Would recommend",
  ];

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        description: "Tap on the stars to rate your experience.",
        variant: "destructive",
      });
      return;
    }
    if (includeStaffReview && staffRating === 0) {
      toast({
        title: "Please rate the staff",
        description: "Tap on the stars to rate the staff member.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);

    toast({
      title: "Review Submitted!",
      description: "Thank you for your feedback.",
    });
    onSubmit?.({
      rating,
      comment,
      ...(includeStaffReview ? { staffRating, staffComment } : {}),
    });
  };

  const handleQuickFeedback = (feedback: string) => {
    setComment((prev) => {
      if (prev.includes(feedback)) return prev;
      return prev ? `${prev} ${feedback}` : feedback;
    });
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl p-6 shadow-soft text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4"
        >
          <ThumbsUp className="w-8 h-8 text-green-500" />
        </motion.div>
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          Thanks for Your Review!
        </h3>
        <p className="text-muted-foreground">
          Your feedback helps {companyName} improve their services.
        </p>
        <div className="flex items-center justify-center gap-1 mt-4">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-6 shadow-soft"
    >
      <h2 className="font-display text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        Rate Your Experience
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        How was your {serviceName} service with {companyName}?
      </p>

      {/* Company Star Rating */}
      <StarRatingInput
        label="Company Rating"
        rating={rating}
        hoverRating={hoverRating}
        onRate={setRating}
        onHover={setHoverRating}
        ratingLabels={ratingLabels}
      />

      {/* Quick Feedback Tags */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">Quick feedback:</p>
        <div className="flex flex-wrap gap-2">
          {quickFeedback.map((feedback) => (
            <button
              key={feedback}
              type="button"
              onClick={() => handleQuickFeedback(feedback)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                comment.includes(feedback)
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              {feedback}
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div className="mb-6">
        <Textarea
          placeholder="Share more details about your experience (optional)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground mt-1 text-right">
          {comment.length}/500
        </p>
      </div>

      {/* Optional Staff Review */}
      {staffName && (
        <div className="mb-6 border-t border-border pt-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <Label htmlFor="staff-review" className="text-sm font-medium">
                Also review staff: {staffName}
              </Label>
            </div>
            <Switch
              id="staff-review"
              checked={includeStaffReview}
              onCheckedChange={setIncludeStaffReview}
            />
          </div>

          {includeStaffReview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4"
            >
              <StarRatingInput
                label="Staff Rating"
                rating={staffRating}
                hoverRating={staffHoverRating}
                onRate={setStaffRating}
                onHover={setStaffHoverRating}
                ratingLabels={ratingLabels}
                size="sm"
              />
              <Textarea
                placeholder={`How was ${staffName}'s service? (optional)`}
                value={staffComment}
                onChange={(e) => setStaffComment(e.target.value)}
                rows={2}
                className="resize-none"
              />
            </motion.div>
          )}
        </div>
      )}

      {/* Submit */}
      <Button
        className="w-full gap-2"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Submit Review
          </>
        )}
      </Button>
    </motion.div>
  );
}

/* Reusable star rating input */
function StarRatingInput({
  rating,
  hoverRating,
  onRate,
  onHover,
  ratingLabels,
  size = "default",
}: {
  label: string;
  rating: number;
  hoverRating: number;
  onRate: (r: number) => void;
  onHover: (r: number) => void;
  ratingLabels: string[];
  size?: "default" | "sm";
}) {
  const starSize = size === "sm" ? "w-7 h-7" : "w-10 h-10";
  return (
    <div className="flex flex-col items-center mb-4">
      <div className="flex items-center gap-1.5 mb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.button
            key={i}
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onRate(i + 1)}
            onMouseEnter={() => onHover(i + 1)}
            onMouseLeave={() => onHover(0)}
            className="p-0.5 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
          >
            <Star
              className={`${starSize} transition-colors ${i < (hoverRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
            />
          </motion.button>
        ))}
      </div>
      <span className="text-sm font-medium text-foreground h-5">
        {ratingLabels[hoverRating || rating]}
      </span>
    </div>
  );
}
