import HeroSection from "@/components/Home/HeroSection";
import FeaturedCars from "@/components/Home/FeaturedCars";
import AboutSection from "@/components/Home/AboutSection";
import TestimonialsSection from "@/components/Home/TestimonialsSection";

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedCars />
      <AboutSection />
      <TestimonialsSection />
    </div>
  );
};

export default Home;