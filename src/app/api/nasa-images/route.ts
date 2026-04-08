import { NextResponse } from "next/server";

const SEARCH_TERMS = [
  "artemis moon",
  "nebula",
  "mars surface",
  "galaxy hubble",
  "astronaut spacewalk",
  "saturn rings",
  "earth from space",
  "lunar landing",
  "james webb",
  "international space station",
];

interface NasaImageItem {
  data: { title: string; description?: string; date_created: string }[];
  links: { href: string }[];
}

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const term =
      SEARCH_TERMS[Math.floor(Math.random() * SEARCH_TERMS.length)];

    const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(term)}&media_type=image&page_size=50`;

    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json(
        { error: "NASA Image Library request failed" },
        { status: res.status },
      );
    }

    const json = await res.json();
    const items: NasaImageItem[] = json.collection?.items ?? [];

    // Filter items that have both data and image links
    const valid = items.filter(
      (item) =>
        item.data?.[0]?.title &&
        item.links?.[0]?.href,
    );

    // Shuffle and pick 6
    const shuffled = valid.sort(() => Math.random() - 0.5).slice(0, 6);

    const results = shuffled.map((item) => ({
      title: item.data[0].title,
      description: (item.data[0].description ?? "").slice(0, 200),
      date: item.data[0].date_created?.split("T")[0] ?? "",
      image: item.links[0].href,
    }));

    return NextResponse.json({ query: term, results });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
