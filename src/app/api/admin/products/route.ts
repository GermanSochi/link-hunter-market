import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !["SUPERADMIN", "ADMIN", "MODERATOR"].includes(user.role)) return null;
  return user;
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const url = new URL(req.url);
  const status = url.searchParams.get("status") ?? "PENDING_MODERATION";
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const limit = 20;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: { status: status as never },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        seller: { select: { id: true, name: true, username: true, email: true, karma: true, rating: true, isGoldSeller: true } },
      },
    }),
    prisma.product.count({ where: { status: status as never } }),
  ]);

  return NextResponse.json({ products, total, page, totalPages: Math.ceil(total / limit) });
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { productId, status } = await req.json();
  if (!productId || !status) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  await prisma.product.update({
    where: { id: productId },
    data: { status },
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: `product_${status.toLowerCase()}`,
      meta: { productId },
    },
  });

  return NextResponse.json({ success: true });
}
