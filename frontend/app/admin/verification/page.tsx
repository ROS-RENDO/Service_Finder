"use client";

import { useState, useEffect } from "react";
import {
  Shield, CheckCircle, XCircle, Eye, Building2,
  Mail, Phone, MapPin, FileText, Loader2, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Company {
  id: string;
  name: string;
  description: string;
  registrationNumber: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  verificationStatus: string;
  createdAt: string;
  owner: {
    fullName: string;
    email: string;
    phone: string;
  };
}

export default function VerificationPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [verifiedToday, setVerifiedToday] = useState(0);
  const [rejectedToday, setRejectedToday] = useState(0);

  useEffect(() => {
    fetchPendingCompanies();
    fetchTodayStats();
  }, []);

  const fetchPendingCompanies = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/companies?verificationStatus=pending&limit=50`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setCompanies(data.companies || []);
    } catch {
      toast.error("Failed to load pending companies");
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayStats = async () => {
    try {
      const token = localStorage.getItem("token");
      // Fetch recently verified companies (verified today)
      const [verRes, rejRes] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/companies?verificationStatus=verified&limit=100`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/companies?verificationStatus=rejected&limit=100`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ]);

      const verData = await verRes.json();
      const rejData = await rejRes.json();

      const today = new Date().toDateString();
      const todayVerified = (verData.companies || []).filter(
        (c: any) => new Date(c.verifiedAt || c.updatedAt).toDateString() === today
      ).length;
      const todayRejected = (rejData.companies || []).filter(
        (c: any) => new Date(c.updatedAt).toDateString() === today
      ).length;

      setVerifiedToday(todayVerified);
      setRejectedToday(todayRejected);
    } catch {
      // Silently fail — not critical
    }
  };

  const handleVerify = async (companyId: string) => {
    if (!confirm("Are you sure you want to verify this company?")) return;

    setVerifying(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/companies/${companyId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ verificationStatus: "verified" }),
        }
      );

      if (res.ok) {
        toast.success("Company verified successfully!");
        setVerifiedToday((v) => v + 1);
        fetchPendingCompanies();
        setSelectedCompany(null);
      } else {
        toast.error("Failed to verify company");
      }
    } catch {
      toast.error("Error verifying company");
    } finally {
      setVerifying(false);
    }
  };

  const handleReject = async () => {
    if (!selectedCompany || !rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setVerifying(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/companies/${selectedCompany.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            verificationStatus: "rejected",
            rejectionReason: rejectReason,
          }),
        }
      );

      if (res.ok) {
        toast.success("Company rejected");
        setRejectedToday((v) => v + 1);
        fetchPendingCompanies();
        setSelectedCompany(null);
        setShowRejectModal(false);
        setRejectReason("");
      } else {
        toast.error("Failed to reject company");
      }
    } catch {
      toast.error("Error rejecting company");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Company Verification</h1>
          <p className="text-muted-foreground mt-1">Review and verify pending company registrations</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { fetchPendingCompanies(); fetchTodayStats(); }} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Pending Verification</p>
            <p className="text-3xl font-bold text-warning mt-1">{loading ? "—" : companies.length}</p>
          </div>
          <div className="bg-warning/10 p-3 rounded-full">
            <Shield className="text-warning w-6 h-6" />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Verified Today</p>
            <p className="text-3xl font-bold text-success mt-1">{verifiedToday}</p>
          </div>
          <div className="bg-success/10 p-3 rounded-full">
            <CheckCircle className="text-success w-6 h-6" />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Rejected Today</p>
            <p className="text-3xl font-bold text-destructive mt-1">{rejectedToday}</p>
          </div>
          <div className="bg-destructive/10 p-3 rounded-full">
            <XCircle className="text-destructive w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : companies.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-16 text-center">
          <Shield className="mx-auto text-muted-foreground/30 mb-4 w-12 h-12" />
          <h3 className="text-xl font-semibold mb-2">No Pending Verifications</h3>
          <p className="text-muted-foreground">All companies have been reviewed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {companies.map((company) => (
            <div
              key={company.id}
              className="rounded-xl border border-border bg-card hover:shadow-elevated transition-shadow"
            >
              <div className="p-6">
                {/* Company Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2.5 rounded-lg">
                      <Building2 className="text-primary w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{company.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Reg: {company.registrationNumber || "N/A"}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-warning/10 text-warning border-warning/20 text-xs font-medium">
                    Pending
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {company.description || "No description provided"}
                </p>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium">{company.city || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{company.phone || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium truncate">{company.email || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Submitted</p>
                      <p className="text-sm font-medium">
                        {new Date(company.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Owner Info */}
                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-muted-foreground mb-1">Owner</p>
                  <p className="text-sm font-semibold">{company.owner?.fullName || "N/A"}</p>
                  <p className="text-xs text-muted-foreground">{company.owner?.email || "N/A"}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5"
                    onClick={() => setSelectedCompany(company)}
                  >
                    <Eye className="w-4 h-4" /> View Details
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 gap-1.5 bg-success hover:bg-success/90 text-success-foreground"
                    onClick={() => handleVerify(company.id)}
                    disabled={verifying}
                  >
                    <CheckCircle className="w-4 h-4" /> Verify
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1 gap-1.5"
                    onClick={() => { setSelectedCompany(company); setShowRejectModal(true); }}
                    disabled={verifying}
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedCompany && !showRejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedCompany.name}</h2>
                  <p className="text-muted-foreground">Complete Company Details</p>
                </div>
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="text-muted-foreground hover:text-foreground p-1"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="mt-1">{selectedCompany.description || "N/A"}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Registration Number</label>
                    <p className="mt-1 font-mono text-sm">{selectedCompany.registrationNumber || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">City</label>
                    <p className="mt-1">{selectedCompany.city || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Address</label>
                  <p className="mt-1">{selectedCompany.address || "N/A"}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="mt-1">{selectedCompany.phone || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="mt-1">{selectedCompany.email || "N/A"}</p>
                  </div>
                </div>
                <div className="border-t border-border pt-4">
                  <h3 className="font-semibold mb-3">Owner Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <p className="mt-1">{selectedCompany.owner?.fullName || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="mt-1">{selectedCompany.owner?.email || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <p className="mt-1">{selectedCompany.owner?.phone || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Submitted</label>
                      <p className="mt-1">{new Date(selectedCompany.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-border">
                <Button variant="outline" onClick={() => setSelectedCompany(null)} className="flex-1">
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowRejectModal(true)}
                  className="flex-1"
                >
                  Reject
                </Button>
                <Button
                  className="flex-1 bg-success hover:bg-success/90"
                  onClick={() => handleVerify(selectedCompany.id)}
                  disabled={verifying}
                >
                  {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify Company"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedCompany && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">Reject Company</h2>
              <p className="text-muted-foreground mb-4">
                Provide a reason for rejecting{" "}
                <strong className="text-foreground">{selectedCompany.name}</strong>
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason…"
                className="w-full px-4 py-3 rounded-lg border border-border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                rows={4}
              />
              <div className="flex gap-3 mt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => { setShowRejectModal(false); setRejectReason(""); }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 gap-2"
                  onClick={handleReject}
                  disabled={verifying || !rejectReason.trim()}
                >
                  {verifying && <Loader2 className="h-4 w-4 animate-spin" />}
                  Confirm Rejection
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}