"use client"
import { useState } from 'react';
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
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/hooks/useAuth';

const profileData = {
  name: 'Jane Doe',
  email: 'jane.doe@email.com',
  phone: '+1 (555) 123-4567',
  address: '123 Cleaner Street, San Francisco, CA 94102',
  role: 'Senior Cleaning Specialist',
  joinDate: 'March 2022',
  avatar: null,
  bio: 'Detail-oriented cleaning professional with 5+ years of experience. Specializing in deep cleaning and move-out services.',
};

const stats = [
  { label: 'Total Jobs', value: '347', icon: Calendar },
  { label: 'Total Earned', value: '$28,450', icon: DollarSign },
  { label: 'This Month', value: '$2,840', icon: TrendingUp },
  { label: 'Avg. Hours/Week', value: '32', icon: Clock },
];

const reviews = [
  {
    id: '1',
    customer: 'Sarah Johnson',
    rating: 5,
    date: '2 days ago',
    comment: 'Jane did an amazing job! My apartment has never looked this clean. Very thorough and professional.',
  },
  {
    id: '2',
    customer: 'Michael Chen',
    rating: 5,
    date: '1 week ago',
    comment: 'Excellent move-out cleaning. She paid attention to every detail and even cleaned spots I forgot about.',
  },
  {
    id: '3',
    customer: 'Emily Davis',
    rating: 4,
    date: '2 weeks ago',
    comment: 'Great service overall. Very punctual and friendly. Would recommend!',
  },
];

const badges = [
  { name: 'Top Performer', description: '95%+ rating for 6 months', icon: '🏆' },
  { name: 'Early Bird', description: 'Completed 50+ morning jobs', icon: '🌅' },
  { name: 'Deep Clean Expert', description: '100+ deep clean jobs', icon: '✨' },
  { name: 'Perfect Week', description: 'All 5-star reviews in a week', icon: '⭐' },
];
export default function StaffProfile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);

  const profile = user
    ? {
        ...profileData,
        name: user.fullName,
        email: user.email,
        phone: user.phone || profileData.phone,
      }
    : profileData;

  const handleSave = () => {
    setEditing(false);
    // TODO: call profile update API here if needed
  };

  const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-12 lg:pt-0 pb-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your profile and view your performance</p>
      </div>

      {/* Profile Card */}
      <div className="bg-card rounded-xl border border-border p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex flex-col sm:flex-row items-start gap-5">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">JD</span>
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
                <p className="text-primary font-medium">{profile.role}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 text-warning">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-semibold">{averageRating}</span>
                  </div>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-sm text-muted-foreground">{reviews.length} reviews</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-sm text-muted-foreground">Since {profile.joinDate}</span>
                </div>
              </div>
              <button
                onClick={() => editing ? handleSave() : setEditing(true)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors",
                  editing 
                    ? "bg-success text-success-foreground hover:bg-success/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {editing ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                {editing ? 'Save' : 'Edit'}
              </button>
            </div>

            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{profile.bio}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Mail className="w-5 h-5" />
            <span className="text-sm">{profile.email}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Phone className="w-5 h-5" />
            <span className="text-sm">{profile.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground sm:col-span-2">
            <MapPin className="w-5 h-5" />
            <span className="text-sm">{profile.address}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.15s' }}>
        {stats.map((stat, index) => (
          <div key={stat.label} className="stat-card">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Achievements</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {badges.map((badge) => (
            <div key={badge.name} className="bg-card rounded-xl border border-border p-4 text-center hover:shadow-md transition-shadow">
              <span className="text-3xl block mb-2">{badge.icon}</span>
              <p className="font-medium text-foreground text-sm">{badge.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="animate-fade-in" style={{ animationDelay: '0.25s' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-warning" />
            <h2 className="text-lg font-semibold text-foreground">Recent Reviews</h2>
          </div>
          <span className="text-sm text-muted-foreground">{reviews.length} total</span>
        </div>
        <div className="space-y-3">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="bg-card rounded-xl border border-border p-4 animate-slide-in"
              style={{ animationDelay: `${0.3 + index * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-sm font-medium text-secondary-foreground">
                      {review.customer.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{review.customer}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < review.rating ? "text-warning fill-current" : "text-muted"
                      )}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
