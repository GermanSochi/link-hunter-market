import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ interests: [] });

  const interests = await prisma.userInterest.findMany({
    where: { userId: session.user.id },
    select: { category: true },
  });

  return NextResponse.json({ interests: interests.map((i) => i.category) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { category } = await req.json();
  if (!category) return NextResponse.json({ error: "category required" }, { status: 400 });

  const userId = session.user.id;
  const existing = await prisma.userInterest.findUnique({
    where: { userId_category: { userId, category } },
  });

  if (existing) {
    await prisma.userInterest.delete({ where: { id: existing.id } });
    return NextResponse.json({ action: "removed", category });
  } else {
    await prisma.userInterest.create({ data: { userId, category } });
    return NextResponse.json({ action: "added", category });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { categories } = await req.json();
  if (!Array.isArray(categories)) {
    return NextResponse.json({ error: "categories array required" }, { status: 400 });
  }

  const userId = session.user.id;

  await prisma.$transaction([
    prisma.userInterest.deleteMany({ where: { userId } }),
    ...categories.map((category: string) =>
      prisma.userInterest.create({ data: { userId, category } })
    ),
  ]);

  return NextResponse.json({ ok: true, categories });
}
