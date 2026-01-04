
import { CTASection } from "@/components/Home/CTASection";
import { FeaturedServices } from "@/components/Home/FeaturedServices";
import { HeroSection } from "@/components/Home/HeroSection";
import { HowItWorks } from "@/components/Home/HowItWorks";
import { Testimonials } from "@/components/Home/Testimonials";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";



const Index = () => {

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