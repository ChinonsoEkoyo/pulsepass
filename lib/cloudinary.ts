import { v2 as cloudinary } from "cloudinary";

const url = process.env.CLOUDINARY_URL;
if (url) {
  cloudinary.config(url);
}

export async function uploadImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "pulsepass/events",
        resource_type: "image",
        format: file.name.split(".").pop() || "jpg",
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload failed"));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    stream.end(buffer);
  });
}
