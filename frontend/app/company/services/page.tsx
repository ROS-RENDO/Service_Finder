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

const services = [
  { id: 1, name: "Regular Cleaning", description: "Standard house cleaning service", price: 95, duration: "2-3 hours", status: "active" },
  { id: 2, name: "Deep Cleaning", description: "Thorough deep cleaning of all areas", price: 180, duration: "4-5 hours", status: "active" },
  { id: 3, name: "Move-in/Move-out", description: "Complete cleaning for moving", price: 320, duration: "6-8 hours", status: "active" },
  { id: 4, name: "Office Cleaning", description: "Commercial office cleaning service", price: 250, duration: "3-4 hours", status: "active" },
  { id: 5, name: "Carpet Cleaning", description: "Professional carpet shampooing", price: 150, duration: "2-3 hours", status: "inactive" },
  { id: 6, name: "Window Cleaning", description: "Interior and exterior windows", price: 120, duration: "2-3 hours", status: "active" },
];

export default function Services() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{service.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        service.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {service.status}
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
                    <span className="font-medium text-foreground">${service.price}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
  );
}
