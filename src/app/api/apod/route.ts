import { NextRequest, NextResponse } from "next/server";

const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const APOD_BASE = "https://api.nasa.gov/planetary/apod";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const isRandom = searchParams.get("random") === "true";

  try {
    let url: string;
    if (isRandom) {
      // Random date between 1995-06-16 (APOD start) and today
      const start = new Date("1995-06-16").getTime();
      const end = Date.now();
      const randomTime = start + Math.random() * (end - start);
      const randomDate = new Date(randomTime).toISOString().split("T")[0];
      url = `${APOD_BASE}?api_key=${encodeURIComponent(NASA_API_KEY)}&date=${randomDate}`;
    } else {
      url = `${APOD_BASE}?api_key=${encodeURIComponent(NASA_API_KEY)}`;
    }

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return NextResponse.json(
        { error: "NASA API request failed" },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
