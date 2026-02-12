// cleaningCategoryVisual.ts
import {
  Home,
  Building2,
  Sparkles,
  Truck,
  Waves,
  ChefHat,
  ShowerHead,
  Zap,
} from "lucide-react";

export const serviceTypeVisual = [
  {
    id: "residential",
    slug: "residential",
    name: "Residential Cleaning",
    description: "Regular home cleaning for bedrooms, living areas & more",
    icon: Home,
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600",
    gradient: "from-sky-500/90 to-blue-600/90",
  },
  {
    id: "commercial",
    slug: "commercial",
    name: "Commercial Cleaning",
    description: "Professional cleaning for offices & business facilities",
    icon: Building2,
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600",
    gradient: "from-violet-500/90 to-purple-600/90",
  },
  {
    id: "deep",
    slug: "deep",
    name: "Deep Cleaning",
    description: "Thorough cleaning that reaches every corner",
    icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=600",
    gradient: "from-amber-500/90 to-orange-600/90",
  },
  {
    id: "move",
    slug: "move",
    name: "Move-In / Move-Out",
    description: "Perfect for relocations and getting deposits back",
    icon: Truck,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600",
    gradient: "from-emerald-500/90 to-green-600/90",
  },
  {
    id: "carpet",
    slug: "carpet",
    name: "Carpet & Upholstery",
    description: "Deep clean carpets, sofas, and fabric furniture",
    icon: Waves,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600",
    gradient: "from-pink-500/90 to-rose-600/90",
  },
  {
    id: "kitchen",
    slug: "kitchen",
    name: "Kitchen Deep Clean",
    description: "Appliances, grease removal & full sanitization",
    icon: ChefHat,
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600",
    gradient: "from-red-500/90 to-orange-600/90",
  },
  {
    id: "plumbing",
    slug: "plumbing",
    name: "Plumbing",
    description: "Pipe repairs, installations, and maintenance",
    icon: ShowerHead,
    image:
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=600",
    gradient: "from-cyan-500/90 to-blue-600/90",
  },
  {
    id: "electrical",
    slug: "electrical",
    name: "Electrical",
    description: "Wiring, repairs, and electrical installations",
    icon: Zap,
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600",
    gradient: "from-yellow-500/90 to-amber-600/90",
  },
];
