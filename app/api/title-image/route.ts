import { NextRequest, NextResponse } from "next/server";
import { resolveTitleImage } from "@/services/titleImageService";

export async function GET(request: NextRequest) {
  const title = request.nextUrl.searchParams.get("title")?.trim();
  const media = request.nextUrl.searchParams.get("type")?.trim() ?? "";
  if (!title) return new NextResponse(null, { status: 400 });

  const image = await resolveTitleImage(title, media);
  if (!image) return new NextResponse(null, { status: 404 });
  const imageUrl = new URL(image);
  if (!imageUrl.hostname.endsWith("wikimedia.org") && !imageUrl.hostname.endsWith("media-amazon.com")) return new NextResponse(null, { status: 404 });

  try {
    const imageResponse = await fetch(imageUrl, {
      cache: "force-cache",
      headers: { "User-Agent": "Marvel-Nexus/1.0 (image proxy)" },
      signal: AbortSignal.timeout(8000),
    });
    const contentType = imageResponse.headers.get("content-type") ?? "";
    if (!imageResponse.ok || !contentType.startsWith("image/") || !imageResponse.body) return new NextResponse(null, { status: 404 });
    return new NextResponse(imageResponse.body, { headers: { "Content-Type": contentType, "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000" } });
  } catch {
    return new NextResponse(null, { status: 504 });
  }
}
