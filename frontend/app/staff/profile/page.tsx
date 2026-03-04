"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Star,
  Calendar,
  DollarSign,
  Award,
  Edit3,
  Camera,
  Check,
  TrendingUp,
  Clock,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/lib/contexts/AuthContext";
import { useStaffMe } from "@/lib/hooks/useStaff";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const defaultRole = "Staff";
const defaultBio =
  "Detail-oriented professional. Update your profile to add a bio (coming soon).";

const badges = [
  { name: "Top Performer", description: "95%+ rating for 6 months", icon: "🏆" },
  { name: "Early Bird", description: "Completed 50+ morning jobs", icon: "🌅" },
  { name: "Deep Clean Expert", description: "100+ deep clean jobs", icon: "✨" },
  { name: "Perfect Week", description: "All 5-star reviews in a week", icon: "⭐" },
];

export default function StaffProfile() {
  const { user, checkAuth } = useAuthContext();
  const { staff, stats, recentReviews, loading: staffLoading, fetchMe } = useStaffMe({ autoFetch: true });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  useEffect(() => {
    if (user) {
      setEditName(user.fullName ?? "");
      setEditPhone(user.phone ?? "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
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
          credentials: "include",
          body: JSON.stringify({
            fullName: editName.trim() || user.fullName,
            phone: editPhone.trim() || undefined,
          }),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update profile");
      }
      setEditing(false);
      await checkAuth();
      toast.success("Profile updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const displayName = editing ? editName : (user?.fullName ?? staff?.user?.fullName ?? "Staff");
  const displayPhone = editing ? editPhone : (user?.phone ?? staff?.user?.phone ?? "");
  const displayEmail = user?.email ?? staff?.user?.email ?? "";
  const reviewCount = recentReviews.length;
  const avgRating =
    reviewCount > 0
      ? (
          recentReviews.reduce(
            (acc, r) => acc + (r.staffRating ?? r.companyRating ?? 0),
            0
          ) / reviewCount
        ).toFixed(1)
      : "—";

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-12 lg:pt-0 pb-8">
      <div className="animate-fade-in">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your profile and view your performance</p>
      </div>

      {/* Profile Card */}
      <div
        className="bg-card rounded-xl border border-border p-6 animate-fade-in"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">
                {displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "ST"}
              </span>
            </div>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
              aria-label="Change photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 w-full">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                {editing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Full name"
                      className="w-full max-w-xs px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                    />
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="Phone"
                      className="w-full max-w-xs px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-foreground truncate">{displayName}</h2>
                    <p className="text-primary font-medium">{defaultRole}</p>
                  </>
                )}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <div className="flex items-center gap-1 text-warning">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-semibold">{avgRating}</span>
                  </div>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-sm text-muted-foreground">
                    {reviewCount} review{reviewCount !== 1 ? "s" : ""}
                  </span>
                  {staff?.user && (
                    <>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-sm text-muted-foreground">
                        {stats.completedBookingsCount} jobs completed
                      </span>
                    </>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => (editing ? handleSave() : setEditing(true))}
                disabled={saving}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shrink-0",
                  editing
                    ? "bg-success text-success-foreground hover:bg-success/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : editing ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Edit3 className="w-4 h-4" />
                )}
                {saving ? "Saving..." : editing ? "Save" : "Edit"}
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{defaultBio}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Mail className="w-5 h-5 shrink-0" />
            <span className="text-sm truncate">{displayEmail}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Phone className="w-5 h-5 shrink-0" />
            <span className="text-sm">{displayPhone || "—"}</span>
          </div>
          {staff?.company && (
            <div className="flex items-center gap-3 text-muted-foreground sm:col-span-2">
              <MapPin className="w-5 h-5 shrink-0" />
              <span className="text-sm">Company: {staff.company.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid - real data from GET /api/staff/me */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in"
        style={{ animationDelay: "0.15s" }}
      >
        {[
          { label: "Total Jobs", value: String(stats.completedBookingsCount), icon: Calendar },
          { label: "Total Earned", value: `$${stats.totalEarnings.toFixed(2)}`, icon: DollarSign },
          { label: "This Month", value: "—", icon: TrendingUp },
          { label: "Reviews", value: String(reviewCount), icon: Clock },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {staffLoading ? "…" : stat.value}
            </p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Achievements</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.name}
              className="bg-card rounded-xl border border-border p-4 text-center hover:shadow-md transition-shadow"
            >
              <span className="text-3xl block mb-2">{badge.icon}</span>
              <p className="font-medium text-foreground text-sm">{badge.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reviews - from API */}
      <div className="animate-fade-in" style={{ animationDelay: "0.25s" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-warning" />
            <h2 className="text-lg font-semibold text-foreground">Recent Reviews</h2>
          </div>
          <span className="text-sm text-muted-foreground">{reviewCount} total</span>
        </div>
        {staffLoading && reviewCount === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : recentReviews.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
            No reviews yet. Complete jobs to receive customer feedback.
          </div>
        ) : (
          <div className="space-y-3">
            {recentReviews.map((review, index) => {
              const rating = review.staffRating ?? review.companyRating ?? 0;
              const comment = review.staffComment ?? review.companyComment ?? "";
              const customerName = review.customer?.fullName ?? "Customer";
              const dateStr = review.createdAt
                ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })
                : "";
              return (
                <div
                  key={review.id}
                  className="bg-card rounded-xl border border-border p-4 animate-slide-in"
                  style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-sm font-medium text-secondary-foreground">
                          {customerName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{customerName}</p>
                        <p className="text-xs text-muted-foreground">{dateStr}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < rating ? "text-warning fill-current" : "text-muted"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  {comment && (
                    <p className="text-sm text-muted-foreground leading-relaxed">{comment}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
