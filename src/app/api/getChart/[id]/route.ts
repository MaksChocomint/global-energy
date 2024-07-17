import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const chart = await prisma.chart.findUnique({
      where: { id: Number(id) },
    });

    if (!chart) {
      return NextResponse.json({ message: "Chart not found" }, { status: 404 });
    }

    return NextResponse.json(chart);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching chart" },
      { status: 500 }
    );
  }
}
