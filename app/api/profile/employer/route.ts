import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session || session.user.role !== "EMPLOYER") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const profile = await db.employerProfile.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[EMPLOYER_PROFILE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "EMPLOYER") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const profile = await db.employerProfile.upsert({
      where: { userId: session.user.id },
      update: { ...body },
      create: {
        userId: session.user.id,
        ...body,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[EMPLOYER_PROFILE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
