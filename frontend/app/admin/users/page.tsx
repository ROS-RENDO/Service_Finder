"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Filter, MoreHorizontal, Mail, Phone } from "lucide-react";

import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const users = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 234 567 8901",
    role: "Customer",
    status: "active" as const,
    joinedAt: "Dec 15, 2025",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike@example.com",
    phone: "+1 234 567 8902",
    role: "Staff",
    status: "active" as const,
    joinedAt: "Dec 10, 2025",
  },
  {
    id: "3",
    name: "Emma Williams",
    email: "emma@example.com",
    phone: "+1 234 567 8903",
    role: "Customer",
    status: "pending" as const,
    joinedAt: "Dec 8, 2025",
  },
  {
    id: "4",
    name: "James Brown",
    email: "james@example.com",
    phone: "+1 234 567 8904",
    role: "Company Admin",
    status: "active" as const,
    joinedAt: "Dec 5, 2025",
  },
  {
    id: "5",
    name: "Lisa Davis",
    email: "lisa@example.com",
    phone: "+1 234 567 8905",
    role: "Customer",
    status: "inactive" as const,
    joinedAt: "Nov 28, 2025",
  },
  {
    id: "6",
    name: "Robert Wilson",
    email: "robert@example.com",
    phone: "+1 234 567 8906",
    role: "Staff",
    status: "active" as const,
    joinedAt: "Nov 20, 2025",
  },
];

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: "name",
      label: "User",
      render: (item: typeof users[0]) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {item.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    { key: "phone", label: "Phone" },
    {
      key: "role",
      label: "Role",
      render: (item: typeof users[0]) => (
        <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
          {item.role}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item: typeof users[0]) => <StatusBadge status={item.status} />,
    },
    { key: "joinedAt", label: "Joined" },
    {
      key: "actions",
      label: "",
      render: (item: typeof users[0]) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/admin/users/${item.id}`)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Phone className="mr-2 h-4 w-4" />
              Call User
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Suspend User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-12",
    },
  ];

  return (
    <div className="space-y-6">

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        onRowClick={(user) => router.push(`/admin/users/${user.id}`)}
      />
    </div>
  );
}
