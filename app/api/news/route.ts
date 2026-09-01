import { NextResponse } from "next/server";
import { getMarvelNews } from "@/services/newsFeedService";

export async function GET() {
  const result = await getMarvelNews();
  return NextResponse.json(result, result.live ? { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } } : undefined);
}
