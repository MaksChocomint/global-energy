import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const blocks = await prisma.block.findMany();
    return NextResponse.json(blocks);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching blocks" },
      { status: 500 }
    );
  }
}
