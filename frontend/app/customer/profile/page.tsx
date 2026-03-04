"use client"
import { useEffect, useState } from 'react';
import { User, Mail, Phone, Edit2, Save, X, Gift, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/common/PageHeader';
import { useToast } from '@/lib/hooks/use-toast';
import { useAuthContext } from '@/lib/contexts/AuthContext';
import { useUser } from '@/lib/hooks/useUser';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function ProfilePage() {
  const { toast } = useToast();
  const router= useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const { user } = useAuthContext();
  const {updateUser}= useUser();

  const handleSave = async () => {
  try {
    await updateUser({
      fullName: formData.name,
      email: formData.email,
      phone: formData.phone,
    })

    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been saved successfully.',
    })

    setIsEditing(false)
  } catch (err) {
    toast({
      title: 'Update Failed',
      description: err instanceof Error ? err.message : 'Something went wrong',
      variant: 'destructive',
    })
  }
}

  const handleCancel = () => {
    setFormData({
      name: user?.fullName ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
    });
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    toast({
      title: 'Password Reset Email Sent',
      description: 'Check your email for instructions to reset your password.',
    });
    router.push('/auth/forgot-password')
  };

useEffect(() => {
    if (user){
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: user.fullName,
        email: user.email,
        phone: user.phone ?? '',
      });
    }
  }, [user])

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="My Profile"
        description="Manage your personal information and preferences"
      />

      <div className="grid gap-6 lg:grid-cols-2">
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
                <Avatar className="h-32 w-32 ring-4 ring-primary/20">
                  <AvatarFallback className="text-2xl font-semibold">
                    {user?.fullName ? user.fullName.charAt(0) : 'U'}
                  </AvatarFallback>
                </Avatar>
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

      </div>
    </div>
  );
}
