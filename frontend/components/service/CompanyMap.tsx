import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Link from 'next/link';
import { Star, MapPin, Shield, Clock, ArrowRight, X, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface Company {
  id: number;
  name: string;
  logo: string;
  coverImage: string;
  rating: number;
  reviews: number;
  location: string;
  verified: boolean;
  yearsInBusiness: number;
  priceRange: { min: number; max: number };
  description: string;
  highlights: string[];
  responseTime: string;
  coordinates?: { lat: number; lng: number };
}

interface CompanyMapProps {
  companies: Company[];
}

// Mock coordinates for demo (in production, these would come from the database)
const locationCoordinates: Record<string, { lat: number; lng: number }> = {
  "Downtown": { lat: 40.7580, lng: -73.9855 },
  "Business District": { lat: 40.7527, lng: -73.9772 },
  "Citywide": { lat: 40.7484, lng: -73.9857 },
  "All Areas": { lat: 40.7614, lng: -73.9776 },
  "Suburbs": { lat: 40.7282, lng: -73.7949 },
  "Restaurant Row": { lat: 40.7604, lng: -73.9900 },
  "Eco District": { lat: 40.7193, lng: -74.0060 },
  "Premium Areas": { lat: 40.7794, lng: -73.9632 },
};

const MAPBOX_TOKEN_KEY = 'mapbox_public_token';

export default function CompanyMap({ companies }: CompanyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [mapboxToken, setMapboxToken] = useState(() => 
    localStorage.getItem(MAPBOX_TOKEN_KEY) || ''
  );
  const [tokenInput, setTokenInput] = useState('');
  const [isMapReady, setIsMapReady] = useState(false);

  const saveToken = () => {
    if (tokenInput.trim()) {
      localStorage.setItem(MAPBOX_TOKEN_KEY, tokenInput.trim());
      setMapboxToken(tokenInput.trim());
    }
  };

  const clearToken = () => {
    localStorage.removeItem(MAPBOX_TOKEN_KEY);
    setMapboxToken('');
    setTokenInput('');
    setIsMapReady(false);
  };

  useEffect(() => {
  if (!mapContainer.current || !mapboxToken) return;

  mapboxgl.accessToken = mapboxToken;

  const mapInstance = new mapboxgl.Map({
    container: mapContainer.current,
    style: "mapbox://styles/mapbox/light-v11",
    zoom: 11,
    center: [-73.9857, 40.7484],
    pitch: 30,
  });

  map.current = mapInstance;

  mapInstance.addControl(
    new mapboxgl.NavigationControl({ visualizePitch: true }),
    "top-right"
  );

  mapInstance.on("load", () => {
    setIsMapReady(true);
  });

  mapInstance.on("error", () => {
    setIsMapReady(false);
    clearToken();
  });

  return () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    mapInstance.remove();
  };
}, [mapboxToken]);


  // Add markers when map is ready
  useEffect(() => {
    if (!map.current || !isMapReady) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each company
    companies.forEach((company) => {
      const coords = locationCoordinates[company.location];
      if (!coords) return;

      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'company-marker';
      el.innerHTML = `
        <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform border-2 border-white">
          <span class="font-bold text-sm">$${company.priceRange.min}</span>
        </div>
      `;

      el.addEventListener('click', () => {
        setSelectedCompany(company);
        map.current?.flyTo({
          center: [coords.lng, coords.lat],
          zoom: 14,
          duration: 1000,
        });
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([coords.lng, coords.lat])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [companies, isMapReady]);

  if (!mapboxToken) {
    return (
      <div className="h-125 rounded-2xl bg-card border-2 border-dashed border-border flex items-center justify-center">
        <div className="max-w-md text-center p-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            Connect Mapbox to View Map
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            Enter your Mapbox public token to display the interactive map. 
            Get your free token at{' '}
            <a 
              href="https://mapbox.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="pk.eyJ1Ijo..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="flex-1"
            />
            <Button onClick={saveToken} disabled={!tokenInput.trim()}>
              Connect
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-125 rounded-2xl overflow-hidden shadow-card">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Selected Company Card */}
      {selectedCompany && (
        <div className="absolute bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-96 bg-card rounded-xl shadow-elevated p-4 z-10">
          <button
            onClick={() => setSelectedCompany(null)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex gap-4">
            <Image
              src={selectedCompany.logo}
              alt={selectedCompany.name}
              width={200}
              height={200}
              className="w-16 h-16 rounded-xl object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=100";
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-display font-semibold text-foreground truncate">
                  {selectedCompany.name}
                </h3>
                {selectedCompany.verified && (
                  <Shield className="w-4 h-4 text-accent shrink-0" />
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="font-medium">{selectedCompany.rating}</span>
                  <span className="text-muted-foreground">({selectedCompany.reviews})</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {selectedCompany.location}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {selectedCompany.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {selectedCompany.responseTime}
                </div>
                <Badge variant="secondary" className="font-semibold">
                  From ${selectedCompany.priceRange.min}
                </Badge>
              </div>
            </div>
          </div>
          
          <Button asChild className="w-full mt-4" >
            <Link href={`/services/${selectedCompany.id}`}>
              View Details & Book
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="secondary"
          size="sm"
          onClick={clearToken}
          className="bg-card shadow-lg hover:bg-card/90"
        >
          <Key className="w-4 h-4 mr-2" />
          Change Token
        </Button>
      </div>
    </div>
  );
}
