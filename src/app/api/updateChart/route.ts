import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const { id, name, type, data, options, topicId } = await req.json();

    const chart = await prisma.chart.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        type,
        data,
        options,
        topicId: parseInt(topicId, 10),
      },
    });

    return NextResponse.json(chart);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error updating chart" },
      { status: 500 }
    );
  }
}
