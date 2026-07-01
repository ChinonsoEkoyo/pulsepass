import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("images") as File[];

    if (files.length > 4) {
      return NextResponse.json({ error: "Maximum 4 images allowed" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "events");
    await mkdir(uploadDir, { recursive: true });

    const urls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = file.name.split(".").pop() || "jpg";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filepath = path.join(uploadDir, filename);

      await writeFile(filepath, buffer);
      urls.push(`/uploads/events/${filename}`);
    }

    return NextResponse.json({ data: urls }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
