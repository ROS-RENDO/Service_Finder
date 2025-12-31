"use client"
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Mail, Phone, MoreVertical, Star } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const staff = [
  { id: 1, name: "Maria Garcia", email: "maria@sparkle.com", phone: "+1 (555) 234-5678", role: "Lead Cleaner", status: "active", rating: 4.9, jobs: 156 },
  { id: 2, name: "John Smith", email: "john@sparkle.com", phone: "+1 (555) 345-6789", role: "Cleaner", status: "active", rating: 4.7, jobs: 89 },
  { id: 3, name: "Ana Rodriguez", email: "ana@sparkle.com", phone: "+1 (555) 456-7890", role: "Cleaner", status: "active", rating: 4.8, jobs: 124 },
  { id: 4, name: "David Lee", email: "david@sparkle.com", phone: "+1 (555) 567-8901", role: "Cleaner", status: "on_leave", rating: 4.6, jobs: 67 },
  { id: 5, name: "Sarah Wilson", email: "sarah@sparkle.com", phone: "+1 (555) 678-9012", role: "Lead Cleaner", status: "active", rating: 4.9, jobs: 203 },
];

export default function Staff() {
  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Staff</h1>
            <p className="text-muted-foreground mt-1">Manage your cleaning team</p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/company/staff/new">
              <Plus className="h-4 w-4" />
              Add Staff
            </Link>
          </Button>
        </div>

        <div className="grid gap-4">
          {staff.map((member) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{member.name}</h3>
                        <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                          {member.status === 'active' ? 'Active' : 'On Leave'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-8">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {member.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {member.phone}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{member.rating}</span>
                      <span className="text-muted-foreground">({member.jobs} jobs)</span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View Schedule</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
  );
}
