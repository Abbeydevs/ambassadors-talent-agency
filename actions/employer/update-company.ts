"use server";

import * as z from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CompanyProfileSchema } from "@/schemas";

export const updateCompanyProfile = async (
  values: z.infer<typeof CompanyProfileSchema>
) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!session || session.user.role !== "EMPLOYER" || !userId) {
      return { error: "Unauthorized" };
    }

    const validatedFields = CompanyProfileSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const {
      companyName,
      image,
      companyDescription,
      industryType,
      country,
      city,
      websiteUrl,
      companySize,
      foundedYear,
    } = validatedFields.data;

    await db.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          companyName: companyName,
          image: image,
        },
      });

      await tx.employerProfile.upsert({
        where: { userId: userId },
        update: {
          companyDescription,
          industryType,
          country,
          city,
          websiteUrl,
          companySize,
          foundedYear,
        },
        create: {
          userId: userId,
          companyLogoUrl: image,
          companyDescription,
          industryType,
          country,
          city,
          websiteUrl,
          companySize,
          foundedYear,
        },
      });
    });

    return { success: "Company profile updated!" };
  } catch (error) {
    console.error("COMPANY_UPDATE_ERROR", error);
    return { error: "Something went wrong!" };
  }
};
