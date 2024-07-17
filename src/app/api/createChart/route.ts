import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const { name, type, data, options, topicId } = await request.json();

  try {
    const chart = await prisma.chart.create({
      data: {
        name,
        type,
        data,
        options,
        topic: {
          connect: { id: parseInt(topicId, 10) },
        },
      },
    });

    return NextResponse.json(chart);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error creating chart" },
      { status: 500 }
    );
  }
}
