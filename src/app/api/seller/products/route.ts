import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user.id;
}

export async function GET(req: NextRequest) {
  const userId = await requireAuth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const limit = 20;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: { sellerId: userId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, title: true, slug: true, status: true,
        priceCents: true, salesCount: true, rating: true,
        category: true, isGold: true, createdAt: true,
      },
    }),
    prisma.product.count({ where: { sellerId: userId } }),
  ]);

  return NextResponse.json({ products, total, page, totalPages: Math.ceil(total / limit) });
}

export async function DELETE(req: NextRequest) {
  const userId = await requireAuth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.sellerId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (product.status === "APPROVED" && product.salesCount > 0) {
    return NextResponse.json({ error: "Нельзя удалить товар с продажами" }, { status: 400 });
  }

  await prisma.product.delete({ where: { id: productId } });
  return NextResponse.json({ success: true });
}
