import CatalogHome from "@/components/Home/CatalogHome";
import ComingSoon from "@/components/Home/ComingSoon";
import AboutSection from "@/components/Home/AboutSection";
import TestimonialsSection from "@/components/Home/TestimonialsSection";

const Home = () => {
  return (
    <div className="min-h-screen">
      <CatalogHome />
      <ComingSoon />
      <AboutSection />
      <TestimonialsSection />
    </div>
  );
};

export default Home;