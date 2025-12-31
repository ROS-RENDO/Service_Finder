"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function ServiceEdit() {
  const { id } = useParams();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Service updated successfully!");
    router.push("/company/services");
  };

  return (
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/company/services">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Edit Service</h1>
            <p className="text-muted-foreground mt-1">Update service details</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name</Label>
                <Input id="name" defaultValue="Deep Cleaning" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" defaultValue="Thorough deep cleaning of all areas" rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Base Price ($)</Label>
                  <Input id="price" type="number" defaultValue="180" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Estimated Duration</Label>
                  <Input id="duration" defaultValue="4-5 hours" />
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-y border-border">
                <div>
                  <Label htmlFor="active">Active Status</Label>
                  <p className="text-sm text-muted-foreground">Make this service available for booking</p>
                </div>
                <Switch id="active" defaultChecked />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" asChild className="flex-1">
                  <Link href="/company/services">Cancel</Link>
                </Button>
                <Button type="submit" className="flex-1">Save Changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
  );
}
