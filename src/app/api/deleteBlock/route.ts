import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { id } = await req.json();

  try {
    const deletedBlock = await prisma.block.delete({
      where: {
        id: parseInt(id, 10),
      },
    });
    return NextResponse.json(deletedBlock);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error deleting block" },
      { status: 500 }
    );
  }
}
