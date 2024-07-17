import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const texts = await prisma.text.findMany({
      select: {
        id: true,
        content: true,
        topicId: true,
      },
    });
    return NextResponse.json(texts);
  } catch (error) {
    console.error("Ошибка при получении текстов:", error);
    return NextResponse.json(
      { message: "Ошибка при получении текстов" },
      { status: 500 }
    );
  }
}
