import { Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  onBook: (serviceId: string) => void;
  index: number;
}

export function ServiceCard({ id, name, price, duration, description, onBook, index }: ServiceCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30",
        "animate-fade-in"
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex-1">
        <h4 className="font-display text-lg font-semibold text-foreground">{name}</h4>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <div className="mt-3 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-foreground font-medium">
            <DollarSign className="h-4 w-4 text-primary" />
            ${price}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            {duration}
          </div>
        </div>
      </div>
      <Button onClick={() => onBook(id)} className="w-full sm:w-auto">
        Book Now
      </Button>
    </div>
  );
}
