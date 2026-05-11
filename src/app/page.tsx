import HeroSection from "@/components/home/HeroSection";
import NewArrivals from "@/components/home/NewArrivals";
import HeritageSection from "@/components/home/HeritageSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import Footer from "@/components/nav/Footer";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <NewArrivals />
      <HeritageSection />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
