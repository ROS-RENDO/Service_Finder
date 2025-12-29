"use client"
import { useState } from 'react';
import { User, Mail, Phone, Edit2, Save, X, Gift, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/common/PageHeader';
import { userProfile } from '@/data/mockData';
import { useToast } from '@/lib/hooks/use-toast';
import Image from 'next/image';

export default function ProfilePage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone,
  });

  const handleSave = () => {
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been saved successfully.',
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone,
    });
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    toast({
      title: 'Password Reset Email Sent',
      description: 'Check your email for instructions to reset your password.',
    });
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="My Profile"
        description="Manage your personal information and preferences"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="glass-card p-6 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold">Personal Information</h3>
            {!isEditing ? (
              <Button variant="secondary" onClick={() => setIsEditing(true)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6 sm:flex-row">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <Image
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  width={200}
                  height={200}
                  className="h-32 w-32 rounded-full object-cover ring-4 ring-primary/20"
                />
                {isEditing && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Form */}
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10 bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10 bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10 bg-background"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Password Section */}
          <div>
            <h4 className="mb-4 font-display text-lg font-semibold">Security</h4>
            <Button variant="secondary" onClick={handleChangePassword}>
              <Lock className="mr-2 h-4 w-4" />
              Change Password
            </Button>
          </div>
        </Card>

        {/* Loyalty Points Card */}
        <Card className="glass-card h-fit p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
              <Gift className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold">Loyalty Points</h3>
              <p className="text-sm text-muted-foreground">Earn points with every booking</p>
            </div>
          </div>

          <div className="mb-4 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 p-6 text-center">
            <p className="text-sm text-muted-foreground">Available Points</p>
            <p className="font-display text-4xl font-bold text-foreground">
              {userProfile.loyaltyPoints}
            </p>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Points Value</span>
              <span className="font-medium text-foreground">
                ${(userProfile.loyaltyPoints * 0.01).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Member Since</span>
              <span className="font-medium text-foreground">Jan 2024</span>
            </div>
          </div>

          <Separator className="my-4" />

          <Button variant="secondary" className="w-full">
            Redeem Points
          </Button>
        </Card>
      </div>
    </div>
  );
}
