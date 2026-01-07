"use client"
import { CTASection } from "@/components/Home/CTASection";
import { FeaturedServices } from "@/components/Home/FeaturedServices";
import { HeroSection } from "@/components/Home/HeroSection";
import { HowItWorks } from "@/components/Home/HowItWorks";
import { Testimonials } from "@/components/Home/Testimonials";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

import { useAuthContext } from "@/lib/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";



const Index = () => {
  const { user, loading, isAuthenticated } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      // ✅ Redirect to dashboard based on role
      const dashboards = {
        customer: '/customer/dashboard',
        company_admin: '/company/dashboard',
        staff: '/staff/dashboard',
        admin: '/admin/dashboard'
      }
      
      router.push(dashboards[user.role as keyof typeof dashboards])
    }
  }, [loading, isAuthenticated, user, router])

    if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Redirecting to dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar/>

      <main>
        <HeroSection />
        <FeaturedServices/>
        <HowItWorks/>
        <Testimonials/>
        <CTASection/>

      </main>

      <Footer/>

    </div>
  );
};

export default Index;