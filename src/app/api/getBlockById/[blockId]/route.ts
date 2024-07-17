import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { blockId: string } }
) {
  const { blockId } = params;

  try {
    const block = await prisma.block.findUnique({
      where: { id: Number(blockId) },
      include: {
        topics: {
          include: {
            charts: true,
          },
        },
      },
    });

    if (!block) {
      return NextResponse.json({ message: "Block not found" }, { status: 404 });
    }

    return NextResponse.json(block);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching block" },
      { status: 500 }
    );
  }
}
