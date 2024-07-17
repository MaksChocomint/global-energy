// app/api/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { nameOrEmail, password } = await req.json();

  try {
    const user = await prisma.admin.findFirst({
      where: {
        OR: [{ name: nameOrEmail }, { email: nameOrEmail }],
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "неверное имя или пароль" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "неверное имя или пароль" },
        { status: 401 }
      );
    }

    // Логин успешен
    return NextResponse.json({ message: "вход выполнен успешно" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
