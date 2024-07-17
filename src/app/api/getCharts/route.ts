import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const charts = await prisma.chart.findMany();

    return NextResponse.json(charts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching charts" },
      { status: 500 }
    );
  }
}
