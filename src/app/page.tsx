import SpaceScrollHero from "@/components/SpaceScrollHero";
import HeroSection from "@/components/HeroSection";

export const dynamic = "force-dynamic";

const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";

async function getApod() {
  try {
    const res = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${encodeURIComponent(NASA_API_KEY)}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function Home() {
  const apod = await getApod();

  return (
    <main className="bg-deep-space">
      <SpaceScrollHero />
      <HeroSection initialApod={apod} />
    </main>
  );
}
