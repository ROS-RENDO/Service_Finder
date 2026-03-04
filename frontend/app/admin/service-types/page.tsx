"use client"

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tag, Archive } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface ServiceType {
    id: string;
    name: string;
    slug: string;
    description: string;
    categoryId: string;
    category?: {
        id: string;
        name: string;
        slug: string;
    };
    icon?: string;
    status: 'active' | 'inactive';
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

export default function AdminServiceTypesPage() {
    const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingType, setEditingType] = useState<ServiceType | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        categoryId: '',
        icon: '',
        status: 'active'
    });

    useEffect(() => {
        fetchServiceTypes();
        fetchCategories();
    }, []);

    const fetchServiceTypes = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/service-types`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                // Controller returns { success: true, data: [...] }
                setServiceTypes(data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch service types:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
            if (response.ok) {
                const data = await response.json();
                setCategories(data.categories || []);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const handleOpenModal = (type: ServiceType | null) => {
        setEditingType(type);
        if (type) {
            setFormData({
                name: type.name,
                slug: type.slug,
                description: type.description || '',
                categoryId: type.categoryId,
                icon: type.icon || '',
                status: type.status as string
            });
        } else {
            setFormData({
                name: '',
                slug: '',
                description: '',
                categoryId: '',
                icon: '',
                status: 'active'
            });
        }
        setShowModal(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const url = editingType
                ? `${process.env.NEXT_PUBLIC_API_URL}/api/service-types/${editingType.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/api/service-types`;

            const method = editingType ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success(editingType ? 'Service type updated' : 'Service type created');
                setShowModal(false);
                fetchServiceTypes();
            } else {
                const error = await response.json();
                toast.error(error.message || 'Operation failed');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this service type?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/service-types/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                toast.success('Service type deleted');
                fetchServiceTypes();
            } else {
                toast.error('Failed to delete service type');
            }
        } catch (error) {
            console.error('Failed to delete service type:', error);
        }
    };

    if (loading && serviceTypes.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-gray-600">Loading service types...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 pt-12 lg:pt-0">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Service Types</h1>
                    <p className="text-muted-foreground mt-1">Manage service types across all categories</p>
                </div>
                <Button onClick={() => handleOpenModal(null)} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service Type
                </Button>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-muted">
                        <tr>
                            <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Name</th>
                            <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Category</th>
                            <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Slug</th>
                            <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Status</th>
                            <th className="text-right px-6 py-3 text-sm font-medium text-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {serviceTypes.map((type) => (
                            <tr key={type.id} className="hover:bg-muted/50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {type.icon && (
                                            <span className="text-2xl">{type.icon}</span>
                                        )}
                                        <div>
                                            <p className="font-medium text-foreground">{type.name}</p>
                                            {type.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-1">{type.description}</p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                    {type.category?.name || '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <code className="text-sm bg-muted px-2 py-1 rounded">{type.slug}</code>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${type.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {type.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleOpenModal(type)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(type.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {serviceTypes.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <Tag className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">No service types found</p>
                        <p className="text-sm text-gray-500 mt-1">Create your first service type to get started</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            {editingType ? 'Edit Service Type' : 'Add Service Type'}
                        </h2>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={formData.categoryId.toString()}
                                    onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(c => (
                                            <SelectItem key={c.id} value={c.id.toString()}>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="icon">Icon (Emoji)</Label>
                                <Input
                                    id="icon"
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    placeholder="🧹"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val) => setFormData({ ...formData, status: val as any })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editingType ? 'Save Changes' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
