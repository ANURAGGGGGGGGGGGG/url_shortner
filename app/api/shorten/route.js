import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { connectDB } from "@/lib/mongodb";
import ShortUrl from "@/models/ShortUrl";

export async function POST(request) {
  try {
    await connectDB();

    const { originalUrl, customAlias } = await request.json();

    if (!originalUrl) {
      return NextResponse.json(
        { error: "Please provide a URL." },
        { status: 400 }
      );
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(originalUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL." },
        { status: 400 }
      );
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        { error: "Only HTTP and HTTPS URLs are allowed." },
        { status: 400 }
      );
    }

    const shortCode = customAlias?.trim() || nanoid(7);

    if (!/^[a-zA-Z0-9_-]{3,30}$/.test(shortCode)) {
      return NextResponse.json(
        { error: "Alias must be 3–30 characters (letters, numbers, _ or -)." },
        { status: 400 }
      );
    }

    const existingUrl = await ShortUrl.findOne({ shortCode });

    if (existingUrl) {
      return NextResponse.json(
        { error: "This alias is already taken. Please choose another." },
        { status: 409 }
      );
    }

    const newUrl = await ShortUrl.create({
      shortCode,
      originalUrl: parsedUrl.toString(),
    });

    return NextResponse.json(
      {
        success: true,
        shortCode: newUrl.shortCode,
        shortUrl: `${new URL(request.url).origin}/s/${newUrl.shortCode}`,
        originalUrl: newUrl.originalUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Short URL creation error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "This alias is already taken." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Server error while creating short URL." },
      { status: 500 }
    );
  }
}
