"use client"
import { useState, useEffect } from "react";
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

interface Company {
  id: string;
  name: string;
  email: string;
  city: string; // location in UI
  ratingSummary?: { averageRating: number };
  _count?: { bookings: number };
  status: string;
  verificationStatus: string;
  createdAt: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setCompanies(data.companies || []);
      }
    } catch (error) {
      console.error("Failed to fetch companies", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: "name",
      label: "Company",
      render: (item: Company) => (
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
      render: (item: Company) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {item.city || "—"}
        </div>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      render: (item: Company) => (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-warning text-warning" />
          <span className="font-medium">{item.ratingSummary?.averageRating?.toFixed(1) || "—"}</span>
        </div>
      ),
    },
    {
      key: "totalBookings",
      label: "Bookings",
      render: (item: Company) => (
        <span className="font-medium">{item._count?.bookings || 0}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item: Company) => <StatusBadge status={item.status as any} />,
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (item: Company) => new Date(item.createdAt).toLocaleDateString()
    },
    {
      key: "actions",
      label: "",
      render: (item: Company) => (
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
          onClick={() => router.push("/admin/verification")}
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
