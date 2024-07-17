import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  const { textId, content, topicId } = await req.json();

  try {
    const text = await prisma.text.update({
      where: { id: parseInt(textId, 10) },
      data: {
        content,
        topicId: parseInt(topicId, 10),
      },
    });
    return NextResponse.json(text);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Ошибка при обновлении текста" },
      { status: 500 }
    );
  }
}
