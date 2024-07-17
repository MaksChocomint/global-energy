import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { id } = await req.json();

  try {
    const deletedChart = await prisma.chart.delete({
      where: {
        id: parseInt(id, 10),
      },
    });
    return NextResponse.json(deletedChart);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error deleting chart" },
      { status: 500 }
    );
  }
}
