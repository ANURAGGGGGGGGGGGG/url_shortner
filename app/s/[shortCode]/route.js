import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ShortUrl from "@/models/ShortUrl";

export async function GET(request, { params }) {
  try {
    const { shortCode } = await params;

    await connectDB();

    const url = await ShortUrl.findOneAndUpdate(
      { shortCode },
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!url) {
      return new NextResponse("Short URL not found.", {
        status: 404,
      });
    }

    return NextResponse.redirect(url.originalUrl, 302);
  } catch (error) {
    console.error("Redirect error:", error);

    return new NextResponse("Unable to redirect.", {
      status: 500,
    });
  }
}
