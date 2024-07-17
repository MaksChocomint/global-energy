import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { content, topicId } = await req.json();

  try {
    const text = await prisma.text.create({
      data: {
        content,
        topicId: parseInt(topicId, 10),
      },
    });
    return NextResponse.json(text);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error creating text" },
      { status: 500 }
    );
  }
}
