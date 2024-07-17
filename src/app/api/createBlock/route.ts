import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { name } = await req.json();

  try {
    const block = await prisma.block.create({
      data: { name },
    });
    return NextResponse.json(block);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error creating block" },
      { status: 500 }
    );
  }
}
