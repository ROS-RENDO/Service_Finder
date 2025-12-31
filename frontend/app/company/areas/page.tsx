"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const areas = [
  { id: 1, name: "Manhattan", zipCodes: ["10001", "10002", "10003", "10004", "10005"], status: "active", bookings: 45 },
  { id: 2, name: "Brooklyn", zipCodes: ["11201", "11215", "11217", "11238"], status: "active", bookings: 32 },
  { id: 3, name: "Queens", zipCodes: ["11101", "11102", "11103"], status: "active", bookings: 18 },
  { id: 4, name: "Bronx", zipCodes: ["10451", "10452", "10453"], status: "inactive", bookings: 0 },
  { id: 5, name: "Staten Island", zipCodes: ["10301", "10302"], status: "active", bookings: 8 },
];

export default function Areas() {
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

        <div className="grid gap-4">
          {areas.map((area) => (
            <Card key={area.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{area.name}</h3>
                        <Badge variant={area.status === 'active' ? 'default' : 'secondary'}>
                          {area.status === 'active' ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </>
                          ) : (
                            'Inactive'
                          )}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {area.bookings} bookings this month
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-wrap gap-1.5 max-w-xs">
                      {area.zipCodes.slice(0, 4).map((zip) => (
                        <span key={zip} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                          {zip}
                        </span>
                      ))}
                      {area.zipCodes.length > 4 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                          +{area.zipCodes.length - 4} more
                        </span>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Area</DropdownMenuItem>
                        <DropdownMenuItem>View Bookings</DropdownMenuItem>
                        <DropdownMenuItem>
                          {area.status === 'active' ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
  );
}
