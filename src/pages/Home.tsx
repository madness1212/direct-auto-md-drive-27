import HeroSection from "@/components/Home/HeroSection";
import FeaturedCars from "@/components/Home/FeaturedCars";
import ComingSoon from "@/components/Home/ComingSoon";
import AboutSection from "@/components/Home/AboutSection";
import TestimonialsSection from "@/components/Home/TestimonialsSection";

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedCars />
      <ComingSoon />
      <AboutSection />
      <TestimonialsSection />
    </div>
  );
};

export default Home;