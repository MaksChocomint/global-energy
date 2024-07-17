import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClient } from "@prisma/client/extension";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // Perform the check and create operation atomically
    const result = await prisma.$transaction(async (prisma: PrismaClient) => {
      const admins = await prisma.admin.findMany();
      const adminsExist = admins.length > 0;

      return { adminsExist };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ adminsExist: false }, { status: 500 });
  }
}
