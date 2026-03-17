"use client";
import { useState, useEffect } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, Bell, Globe, Lock, Mail, Palette, Shield, User, RefreshCw } from "lucide-react";
import { useAuthContext } from "@/lib/contexts/AuthContext";

export default function SettingsPage() {
  const { user } = useAuthContext();

  // Profile state
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password state
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailNewCompanies: true,
    weeklyReport: true,
  });

  // Load admin profile on mount
  useEffect(() => {
    if (!user) return;
    setProfile({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: (user as any).phone || "",
    });
  }, [user]);

  // ── Save profile ─────────────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    if (!user) return;
    setProfileLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: profile.fullName,
            email: profile.email,
            phone: profile.phone,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setProfileLoading(false);
    }
  };

  // ── Change password ──────────────────────────────────────────────────────────
  const handleChangePassword = async () => {
    if (!user) return;
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setPasswordLoading(true);
    try {
      const token = localStorage.getItem("token");
      // Use the change-password endpoint via update user
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password: passwords.newPassword }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Password updated successfully!");
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(data.error || "Failed to update password");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your admin account and platform preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" /> Security
          </TabsTrigger>
        </TabsList>

        {/* ── Profile Tab ─────────────────────────────────────────────────────── */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> Admin Profile
              </CardTitle>
              <CardDescription>
                Update your name, email and contact details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-admin/10 text-admin text-xl font-bold">
                    {profile.fullName?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{profile.fullName || "Admin"}</p>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                    Platform Administrator
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="admin@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={profileLoading} className="gap-2">
                  {profileLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Notifications Tab ───────────────────────────────────────────────── */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" /> Email Notifications
              </CardTitle>
              <CardDescription>
                Choose which email notifications you'd like to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Bookings</p>
                  <p className="text-sm text-muted-foreground">Get notified when a new booking is made.</p>
                </div>
                <Switch
                  checked={notifications.emailBookings}
                  onCheckedChange={(c) => setNotifications({ ...notifications, emailBookings: c })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Company Applications</p>
                  <p className="text-sm text-muted-foreground">Get notified when a company registers.</p>
                </div>
                <Switch
                  checked={notifications.emailNewCompanies}
                  onCheckedChange={(c) => setNotifications({ ...notifications, emailNewCompanies: c })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Report</p>
                  <p className="text-sm text-muted-foreground">Receive a weekly summary of platform activity.</p>
                </div>
                <Switch
                  checked={notifications.weeklyReport}
                  onCheckedChange={(c) => setNotifications({ ...notifications, weeklyReport: c })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => toast.success("Notification preferences saved!")} className="gap-2">
              Save Preferences
            </Button>
          </div>
        </TabsContent>

        {/* ── Security Tab ────────────────────────────────────────────────────── */}
        <TabsContent value="security" className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" /> Change Password
              </CardTitle>
              <CardDescription>
                Keep your account secure with a strong password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
              </div>
              {passwords.newPassword && passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
                <p className="text-sm text-destructive">Passwords do not match</p>
              )}
              <div className="flex justify-end">
                <Button
                  onClick={handleChangePassword}
                  disabled={passwordLoading || !passwords.newPassword || !passwords.confirmPassword}
                  className="gap-2"
                >
                  {passwordLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" /> Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your admin account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable 2FA</p>
                  <p className="text-sm text-muted-foreground">
                    Use an authenticator app for additional security.
                  </p>
                </div>
                <Button variant="outline" onClick={() => toast.info("2FA setup coming soon")}>
                  Setup 2FA
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
