import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const topics = await prisma.topic.findMany();
    return NextResponse.json(topics);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching topics" },
      { status: 500 }
    );
  }
}
