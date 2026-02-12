"use client"
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Mail, Phone, MoreVertical, Briefcase, Loader2, Star } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { StaffMember } from "@/types/staff.types";

export default function Staff() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStaff = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/staff`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch staff');
      }
      
      const data = await response.json();
      setStaff(data.staff || []);
    } catch (err) {
      console.error('Error fetching staff:', err);
      setError('Failed to load staff members');
      toast.error("Failed to load staff members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleRemoveStaff = async (staffId: string, staffName: string) => {
    if (!confirm(`Are you sure you want to remove ${staffName}?`)) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/staff/${staffId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to remove staff member');
      }

      toast.success(`${staffName} has been removed`);
      fetchStaff(); // Refresh list
    } catch (err: any) {
      console.error('Error removing staff:', err);
      toast.error(err.message || "Failed to remove staff member");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Staff</h1>
          <p className="text-muted-foreground mt-1">Manage your team members</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/company/staff/new">
            <Plus className="h-4 w-4" />
            Add Staff
          </Link>
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">{error}</p>
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={fetchStaff}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!error && staff.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-muted-foreground mb-4">No staff members yet</p>
            <Button asChild>
              <Link href="/company/staff/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Staff Member
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {staff.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {member.fullName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{member.fullName}</h3>
                      <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                        {member.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                      {member.isAvailable && (
                        <Badge variant="outline" className="border-green-500 text-green-700">
                          Available Today
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground capitalize">
                      {member.role.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {member.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {member.phone}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{member.activeRequests}</span>
                    <span className="text-muted-foreground">active</span>
                  </div>

                  <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{member.averageRating}</span>
                      <span className="text-muted-foreground">({member.completedJobs} jobs)</span>
                    </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/company/staff/${member.id}`}>
                        View Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/company/staff/${member.id}/edit`}>
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/company/staff/${member.id}/schedule`}>
                        View Schedule
                      </Link>
                    </DropdownMenuItem>
                    {member.status === 'active' ? (
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleRemoveStaff(member.id, member.fullName)}
                      >
                        Remove
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={async () => {
                          try {
                            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/staff/${member.id}/reactivate`, {
                              method: 'POST',
                              credentials: 'include',
                            });
                            if (response.ok) {
                              toast.success("Staff member reactivated");
                              fetchStaff();
                            }
                          } catch (err) {
                            toast.error("Failed to reactivate staff member");
                          }
                        }}
                      >
                        Reactivate
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile view */}
              <div className="md:hidden mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {member.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {member.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{member.activeRequests}</span>
                  <span className="text-muted-foreground">active requests</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}