import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { name, texts, blockId } = await req.json();

  try {
    const topic = await prisma.topic.create({
      data: {
        name,
        texts,
        blockId: parseInt(blockId, 10),
      },
    });
    return NextResponse.json(topic);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error creating topic" },
      { status: 500 }
    );
  }
}
