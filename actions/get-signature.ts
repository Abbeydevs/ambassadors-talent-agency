"use server";

import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary";

export const getCloudinarySignature = async (
  folder: string = "ambassador-talent-profiles"
) => {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
      folder: folder,
    },
    process.env.CLOUDINARY_API_SECRET!
  );

  return { timestamp, signature };
};
