import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { topicId: string } }
) {
  const { topicId } = params;

  try {
    const charts = await prisma.chart.findMany({
      where: { topicId: Number(topicId) },
    });

    return NextResponse.json(charts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching charts" },
      { status: 500 }
    );
  }
}
