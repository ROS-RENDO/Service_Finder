import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Link from 'next/link';
import { Star, MapPin, Shield, ArrowRight, X, Key, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface Company {
  id: string;
  name: string;
  description?: string;
  city?: string;
  rating?: number | null;
  reviewCount?: number;
  reviews?: number;
  location?: string;
  verified?: boolean;
  yearsInBusiness?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  latitude?: number | null;
  longitude?: number | null;
  verificationStatus?: string;
  servicesCount?: number;
  logo?: string;
  coverImage?: string;
  highlights?: string[];
  responseTime?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface CompanyMapProps {
  companies: Company[];
}

const MAPBOX_TOKEN_KEY = 'mapbox_public_token';

export default function CompanyMap({ companies }: CompanyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [mapboxToken, setMapboxToken] = useState(() => 
    typeof window !== 'undefined' ? localStorage.getItem(MAPBOX_TOKEN_KEY) || '' : ''
  );
  const [tokenInput, setTokenInput] = useState('');
  const [isMapReady, setIsMapReady] = useState(false);

  // Filter companies that have valid coordinates
  const companiesWithCoords = companies.filter(
    (c) => c.latitude != null && c.longitude != null
  );

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

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    // Calculate center point from companies with coordinates
    let center: [number, number] = [-73.9857, 40.7484]; // Default NYC
    if (companiesWithCoords.length > 0) {
      const avgLng = companiesWithCoords.reduce((sum, c) => sum + (c.longitude || 0), 0) / companiesWithCoords.length;
      const avgLat = companiesWithCoords.reduce((sum, c) => sum + (c.latitude || 0), 0) / companiesWithCoords.length;
      center = [avgLng, avgLat];
    }

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      zoom: companiesWithCoords.length > 0 ? 11 : 10,
      center,
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

    // Add markers for each company with coordinates
    companiesWithCoords.forEach((company) => {
      if (!company.latitude || !company.longitude) return;

      // Use coordinates from company object or from lat/lng fields
      const coords = company.coordinates || {
        lat: company.latitude,
        lng: company.longitude
      };

      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'company-marker';
      const price = company.priceRange?.min || 0;
      
      el.innerHTML = `
        <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform border-2 border-white">
          <span class="font-bold text-sm">${price > 0 ? `${price}` : '★'}</span>
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

    // Fit bounds to show all markers
    if (companiesWithCoords.length > 1 && map.current) {
      const bounds = new mapboxgl.LngLatBounds();
      companiesWithCoords.forEach(company => {
        const coords = company.coordinates || (company.latitude && company.longitude ? {
          lat: company.latitude,
          lng: company.longitude
        } : null);
        if (coords) {
          bounds.extend([coords.lng, coords.lat]);
        }
      });
      map.current.fitBounds(bounds, { padding: 100, maxZoom: 13 });
    }
  }, [companies, isMapReady]);

  if (!mapboxToken) {
    return (
      <div className="h-[600px] rounded-2xl bg-card border-2 border-dashed border-border flex items-center justify-center">
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

  if (companiesWithCoords.length === 0) {
    return (
      <div className="h-[600px] rounded-2xl bg-card border-2 border-dashed border-border flex items-center justify-center">
        <div className="text-center p-8">
          <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            No Locations Available
          </h3>
          <p className="text-muted-foreground text-sm">
            Companies in this area havent set their coordinates yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-card">
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
            {selectedCompany.logo ? (
              <Image
                src={selectedCompany.logo}
                alt={selectedCompany.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-xl object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-primary">
                  {selectedCompany.name.charAt(0)}
                </span>
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-display font-semibold text-foreground truncate">
                  {selectedCompany.name}
                </h3>
                {(selectedCompany.verified || selectedCompany.verificationStatus === 'verified') && (
                  <Shield className="w-4 h-4 text-primary shrink-0" />
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {selectedCompany.rating && (
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="font-medium">
                      {typeof selectedCompany.rating === 'number' 
                        ? selectedCompany.rating.toFixed(1) 
                        : selectedCompany.rating}
                    </span>
                    {(selectedCompany.reviews || selectedCompany.reviewCount) && (
                      <span className="text-muted-foreground">
                        ({selectedCompany.reviews || selectedCompany.reviewCount})
                      </span>
                    )}
                  </div>
                )}
                {(selectedCompany.city || selectedCompany.location) && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {selectedCompany.location || selectedCompany.city}
                    </div>
                  </>
                )}
              </div>
              
              {selectedCompany.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {selectedCompany.description}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                {selectedCompany.responseTime ? (
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {selectedCompany.responseTime}
                  </div>
                ) : selectedCompany.servicesCount ? (
                  <div className="text-xs text-muted-foreground">
                    {selectedCompany.servicesCount} service{selectedCompany.servicesCount !== 1 ? 's' : ''}
                  </div>
                ) : (
                  <div />
                )}
                {selectedCompany.priceRange && selectedCompany.priceRange.min > 0 && (
                  <Badge variant="secondary" className="font-semibold">
                    From ${selectedCompany.priceRange.min}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <Button asChild className="w-full mt-4">
            <Link href={`/company/${selectedCompany.id}`}>
              View Details & Book
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={clearToken}
          className="bg-card shadow-lg hover:bg-card/90"
        >
          <Key className="w-4 h-4 mr-2" />
          Change Token
        </Button>
        
        <Badge variant="secondary" className="bg-card shadow-lg">
          {companiesWithCoords.length} location{companiesWithCoords.length !== 1 ? 's' : ''}
        </Badge>
      </div>
    </div>
  );
}