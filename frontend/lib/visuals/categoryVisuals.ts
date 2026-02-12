// categoryVisual.ts
import {
  Home,
  Car,
  Heart,
  Briefcase,
  Scissors,
  Dumbbell,
} from "lucide-react";

export const categoryVisual = [
  {
    id: "1", // match API id if needed
    slug: "cleaning-services", // match API slug
    name: "Cleaning Services",
    description: "Professional cleaning services for homes and offices",
    icon: Home, // React component
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600",
    gradient: "from-blue-500/90 to-sky-600/90",
    serviceTypesCount: 3, // optional, can come from API
  },
];
