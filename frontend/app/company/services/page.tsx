"use client"
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, Clock, DollarSign, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useServices } from "@/lib/hooks/useServices";

export default function Services() {
  const { services, loading, error, fetchServices } = useServices({ autoFetch: true });

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Services</h1>
            <p className="text-muted-foreground mt-1">Manage your cleaning service offerings</p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/company/services/new">
              <Plus className="h-4 w-4" />
              Add Service
            </Link>
          </Button>
        </div>

        {loading && (
          <p className="text-muted-foreground">Loading services...</p>
        )}
        {error && !loading && (
          <div className="flex items-center justify-between bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2 text-sm text-destructive">
            <span>Failed to load services.</span>
            <Button variant="ghost" size="sm" onClick={fetchServices}>
              Retry
            </Button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{service.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        service.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {service.isActive ? "active" : "inactive"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/company/services/${service.id}/edit`} className="flex items-center gap-2">
                          <Edit className="h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium text-foreground">
                      ${service.basePrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {service.durationMin}–{service.durationMax} min
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        )}
      </div>
  );
}
