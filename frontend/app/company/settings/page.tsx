"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { FlickerDots } from "@/components/common/FlickerDots";

export default function Settings() {
  const [companyId, setCompanyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    description: "",
    logoUrl: "",
    coverImageUrl: ""
  });

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Get user's company ID
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = await userRes.json();
      const cId = userData.data?.company?.id || userData.data?.companyId;
      
      if (!cId) {
        setLoading(false);
        return;
      }
      setCompanyId(cId);

      // Fetch company details
      const compRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/${cId}`);
      if (compRes.ok) {
        const compData = await compRes.json();
        const c = compData.data;
        setFormData({
          name: c.name || "",
          phone: c.phone || "",
          email: c.email || "",
          address: c.address || "",
          description: c.description || "",
          logoUrl: c.logoUrl || "",
          coverImageUrl: c.coverImageUrl || ""
        });
      }
    } catch (error) {
      console.error("Failed to fetch company", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    if (!companyId) return;
    setSaving(true);
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/${companyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save settings");
      }
      
      toast.success("Settings saved successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><FlickerDots /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your business settings</p>
      </div>

      <Tabs defaultValue="business" className="space-y-6">
        <TabsList>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Update your company details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Logo</Label>
                  <ImageUpload 
                    value={formData.logoUrl} 
                    onChange={(url) => setFormData(prev => ({ ...prev, logoUrl: url }))} 
                    label="Upload Logo"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <ImageUpload 
                    value={formData.coverImageUrl} 
                    onChange={(url) => setFormData(prev => ({ ...prev, coverImageUrl: url }))} 
                    label="Upload Cover"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input id="name" value={formData.name} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" value={formData.phone} onChange={handleInputChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Business Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Textarea id="address" value={formData.address} onChange={handleInputChange} rows={2} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Online Booking</Label>
                  <p className="text-sm text-muted-foreground">Allow customers to book services online</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Instant Confirmation</Label>
                  <p className="text-sm text-muted-foreground">Automatically confirm bookings</p>
                </div>
                <Switch />
              </div>

              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>New Booking Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when you receive a new booking</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Cancellation Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when a booking is cancelled</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Payment Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified about payment status changes</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Review Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when customers leave reviews</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">Receive tips and updates from SparkleClean</p>
                </div>
                <Switch />
              </div>

              <Button onClick={handleSave}>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
              <CardDescription>Manage your subscription and payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg bg-accent">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Professional Plan</h4>
                    <p className="text-sm text-muted-foreground">$49/month • Billed monthly</p>
                  </div>
                  <Button variant="outline">Upgrade</Button>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">Payment Method</h4>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-14 bg-muted rounded flex items-center justify-center text-xs font-medium">
                      VISA
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/26</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Update</Button>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">Payout Integration</h4>
                <p className="text-sm text-muted-foreground mb-4">Configure how you receive funds from bookings. (PayPal and Local Bank Supported)</p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="paypalEmail">PayPal Email</Label>
                    <Input id="paypalEmail" type="email" placeholder="business@example.com" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Local Bank Name</Label>
                      <Input id="bankName" placeholder="e.g., Chase Bank" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input id="accountNumber" type="password" placeholder="••••••••8901" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="routingNumber">Routing / BSB Number</Label>
                      <Input id="routingNumber" placeholder="123456789" />
                    </div>
                    <div className="space-y-2 flex items-end">
                      <Button variant="outline" className="w-full">Verify Bank</Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Billing History</h4>
                <p className="text-sm text-muted-foreground">View and download your past invoices</p>
                <Button variant="outline" className="mt-4">View Invoices</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
