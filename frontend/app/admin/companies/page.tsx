"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Filter, MoreHorizontal, Star, MapPin } from "lucide-react";
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

const companies = [
  {
    id: "1",
    name: "SparkleClean Pro",
    email: "contact@sparkleclean.com",
    location: "New York, NY",
    rating: 4.9,
    totalBookings: 245,
    status: "active" as const,
    joinedAt: "Oct 15, 2025",
  },
  {
    id: "2",
    name: "Fresh & Tidy",
    email: "info@freshtidy.com",
    location: "Los Angeles, CA",
    rating: 4.7,
    totalBookings: 189,
    status: "active" as const,
    joinedAt: "Nov 2, 2025",
  },
  {
    id: "3",
    name: "CleanMasters",
    email: "hello@cleanmasters.com",
    location: "Chicago, IL",
    rating: 4.8,
    totalBookings: 312,
    status: "active" as const,
    joinedAt: "Sep 20, 2025",
  },
  {
    id: "4",
    name: "EcoClean Solutions",
    email: "eco@ecoclean.com",
    location: "Seattle, WA",
    rating: 4.6,
    totalBookings: 156,
    status: "pending" as const,
    joinedAt: "Dec 10, 2025",
  },
  {
    id: "5",
    name: "PureShine Co",
    email: "team@pureshine.com",
    location: "Miami, FL",
    rating: 4.5,
    totalBookings: 98,
    status: "inactive" as const,
    joinedAt: "Aug 5, 2025",
  },
];

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: "name",
      label: "Company",
      render: (item: typeof companies[0]) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-lg">
            <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-sm font-medium">
              {item.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (item: typeof companies[0]) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {item.location}
        </div>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      render: (item: typeof companies[0]) => (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-warning text-warning" />
          <span className="font-medium">{item.rating}</span>
        </div>
      ),
    },
    {
      key: "totalBookings",
      label: "Bookings",
      render: (item: typeof companies[0]) => (
        <span className="font-medium">{item.totalBookings}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item: typeof companies[0]) => <StatusBadge status={item.status} />,
    },
    { key: "joinedAt", label: "Joined" },
    {
      key: "actions",
      label: "",
      render: (item: typeof companies[0]) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/admin/companies/${item.id}`)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>Edit Company</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Suspend Company
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
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/companies/pending")}
        >
          View Pending
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredCompanies}
        onRowClick={(company) => router.push(`/admin/companies/${company.id}`)}
      />
    </div>
  );
}
