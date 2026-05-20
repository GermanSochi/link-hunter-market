// Авторизация через NextAuth: /api/auth/signin
// Этот эндпоинт оставлен для обратной совместимости
import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json(
    { error: "Используйте /api/auth/signin (NextAuth)" },
    { status: 410 }
  );
}
