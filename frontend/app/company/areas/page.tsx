"use client"
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, MoreVertical, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCompanies } from "@/lib/hooks/useCompanies";

type ServiceArea = {
  city: string;
  coverageRadiusKm: number;
};

export default function Areas() {
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getCompanyById } = useCompanies({ autoFetch: false });

  useEffect(() => {
    const storedCompanyId =
      typeof window !== "undefined" ? localStorage.getItem("companyId") : null;
    if (!storedCompanyId) return;

    const loadCompany = async () => {
      setLoading(true);
      setError(null);
      const result = await getCompanyById(storedCompanyId);
      if (result.success && result.company) {
        const company: any = result.company;
        setServiceAreas(company.serviceAreas || []);
      } else {
        setError(result.error || "Failed to load company service areas");
      }
      setLoading(false);
    };

    loadCompany();
  }, [getCompanyById]);

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Service Areas</h1>
            <p className="text-muted-foreground mt-1">Manage your coverage zones</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Area
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Service Area</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="areaName">Area Name</Label>
                  <Input id="areaName" placeholder="e.g., Manhattan" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCodes">ZIP Codes (comma separated)</Label>
                  <Input id="zipCodes" placeholder="10001, 10002, 10003" />
                </div>
                <Button className="w-full">Add Area</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading && (
          <p className="text-sm text-muted-foreground">Loading service areas...</p>
        )}
        {error && !loading && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {!loading && !error && (
        <div className="grid gap-4">
          {serviceAreas.map((area, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{area.city}</h3>
                        <Badge variant="default">
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Coverage radius: {area.coverageRadiusKm} km
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-wrap gap-1.5 max-w-xs" />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Area</DropdownMenuItem>
                        <DropdownMenuItem>View Bookings</DropdownMenuItem>
                        <DropdownMenuItem>Toggle Active</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
