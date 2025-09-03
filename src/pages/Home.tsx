import CatalogHome from "@/components/Home/CatalogHome";
import FeaturedCars from "@/components/Home/FeaturedCars";
import ComingSoon from "@/components/Home/ComingSoon";
import AboutSection from "@/components/Home/AboutSection";
import TestimonialsSection from "@/components/Home/TestimonialsSection";
import { usePageTracking } from "@/hooks/usePageTracking";

const Home = () => {
  usePageTracking();
  
  return (
    <div className="min-h-screen">
      <CatalogHome />
      <FeaturedCars />
      <ComingSoon />
      <AboutSection />
      <TestimonialsSection />
    </div>
  );
};

export default Home;