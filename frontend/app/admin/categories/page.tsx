"use client"
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, MoreHorizontal, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/lib/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  status: string;
  serviceTypesCount: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
      const data = await res.json();
      if (res.ok) {
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
    setDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = editingCategory
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${editingCategory.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/categories`;

      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save category");

      toast({
        title: "Success",
        description: `Category ${editingCategory ? "updated" : "created"} successfully`,
      });

      setDialogOpen(false);
      fetchCategories();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong",
      });
    }
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete ${category.name}?`)) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${category.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete category");

      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      fetchCategories();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete category",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p>Loading...</p>
        ) : (
          categories.map((category, index) => (
            <Card
              key={category.id}
              className="shadow-soft hover:shadow-elevated transition-shadow animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className={`rounded-lg p-3 bg-primary/10 text-primary`}>
                    <FolderTree className="h-5 w-5" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(category)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(category)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{category.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {category.description || "No description"}
                </p>
                <p className="mt-4 text-sm">
                  <span className="font-medium">{category.serviceTypesCount || 0}</span>
                  <span className="text-muted-foreground"> service types</span>
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update the category details below."
                : "Create a new cleaning service category."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Deep Cleaning"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this category includes..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingCategory ? "Save Changes" : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
