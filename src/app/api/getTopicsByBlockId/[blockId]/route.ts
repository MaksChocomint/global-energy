import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { blockId: string } }
) {
  const { blockId } = params;

  try {
    const topics = await prisma.topic.findMany({
      where: { blockId: Number(blockId) },
      include: { charts: true },
    });

    return NextResponse.json(topics);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching topics" },
      { status: 500 }
    );
  }
}
