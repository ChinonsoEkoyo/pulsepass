import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("images") as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 });
    }

    if (files.length > 4) {
      return NextResponse.json({ error: "Maximum 4 images allowed" }, { status: 400 });
    }

    if (!process.env.CLOUDINARY_URL) {
      console.error("CLOUDINARY_URL is missing. Available CLOUDINARY vars:", Object.keys(process.env).filter(k => k.toUpperCase().includes("CLOUDINARY")));
      return NextResponse.json({ error: "Image upload not configured - CLOUDINARY_URL env var missing on Vercel" }, { status: 500 });
    }

    const urls: string[] = [];

    for (const file of files) {
      const url = await uploadImage(file);
      urls.push(url);
    }

    return NextResponse.json({ data: urls }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
