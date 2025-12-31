"use client"
import { useState } from "react";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const categories = [
  {
    id: "1",
    name: "Deep Cleaning",
    description: "Thorough cleaning of all surfaces, appliances, and hard-to-reach areas.",
    serviceCount: 24,
    color: "bg-primary/10 text-primary",
  },
  {
    id: "2",
    name: "Regular Cleaning",
    description: "Standard cleaning for maintaining a clean home environment.",
    serviceCount: 45,
    color: "bg-success/10 text-success",
  },
  {
    id: "3",
    name: "Move-out Cleaning",
    description: "Complete cleaning service for tenants moving out of properties.",
    serviceCount: 18,
    color: "bg-info/10 text-info",
  },
  {
    id: "4",
    name: "Office Cleaning",
    description: "Professional cleaning services for commercial office spaces.",
    serviceCount: 32,
    color: "bg-warning/10 text-warning",
  },
  {
    id: "5",
    name: "Carpet Cleaning",
    description: "Deep cleaning and stain removal for carpets and rugs.",
    serviceCount: 15,
    color: "bg-destructive/10 text-destructive",
  },
  {
    id: "6",
    name: "Window Cleaning",
    description: "Interior and exterior window cleaning services.",
    serviceCount: 21,
    color: "bg-accent text-accent-foreground",
  },
];

export default function CategoriesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<typeof categories[0] | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
    setDialogOpen(true);
  };

  const handleEdit = (category: typeof categories[0]) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingCategory) {
      toast.success(`Category "${formData.name}" updated successfully!`);
    } else {
      toast.success(`Category "${formData.name}" created successfully!`);
    }
    setDialogOpen(false);
  };

  const handleDelete = (category: typeof categories[0]) => {
    toast.success(`Category "${category.name}" deleted.`);
  };

  return (
    <div className="space-y-6">

      {/* Categories Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <Card
            key={category.id}
            className="shadow-soft hover:shadow-elevated transition-shadow animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className={`rounded-lg p-3 ${category.color}`}>
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
                {category.description}
              </p>
              <p className="mt-4 text-sm">
                <span className="font-medium">{category.serviceCount}</span>
                <span className="text-muted-foreground"> services</span>
              </p>
            </CardContent>
          </Card>
        ))}
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
