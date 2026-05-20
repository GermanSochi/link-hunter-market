// Выход через NextAuth: /api/auth/signout
import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json(
    { error: "Используйте /api/auth/signout (NextAuth)" },
    { status: 410 }
  );
}
