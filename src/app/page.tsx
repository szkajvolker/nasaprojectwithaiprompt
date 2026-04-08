import SpaceScrollHero from "@/components/SpaceScrollHero";
import HeroSection from "@/components/HeroSection";
import VideoScrollSection from "@/components/VideoScrollSection";
import NasaBentoGrid from "@/components/NasaBentoGrid";

export default function Home() {
  return (
    <main className="relative bg-deep-space">
      <SpaceScrollHero />
      <HeroSection />
      <VideoScrollSection />
      <NasaBentoGrid />
    </main>
  );
}
