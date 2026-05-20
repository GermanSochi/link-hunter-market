import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireSuperAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || (user.role !== "SUPERADMIN" && user.role !== "ADMIN")) return null;
  return user;
}

export async function GET(req: NextRequest) {
  const admin = await requireSuperAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const search = url.searchParams.get("search") ?? "";
  const limit = 20;
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { email: { contains: search, mode: "insensitive" as const } },
          { name: { contains: search, mode: "insensitive" as const } },
          { username: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, email: true, name: true, username: true, role: true,
        isBanned: true, isReadOnly: true, isGoldSeller: true,
        karma: true, rating: true, balanceCoins: true, createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({ users, total, page, totalPages: Math.ceil(total / limit) });
}

export async function PATCH(req: NextRequest) {
  const admin = await requireSuperAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { userId, action, reason } = await req.json();
  if (!userId || !action) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const isSuperAdmin = admin.role === "SUPERADMIN";

  switch (action) {
    case "ban":
      await prisma.user.update({
        where: { id: userId },
        data: { isBanned: true, banReason: reason ?? "Нарушение правил" },
      });
      break;
    case "unban":
      await prisma.user.update({
        where: { id: userId },
        data: { isBanned: false, banReason: null },
      });
      break;
    case "setRole":
      if (!isSuperAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      await prisma.user.update({ where: { id: userId }, data: { role: reason } });
      break;
    case "setGold":
      if (!isSuperAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      await prisma.user.update({ where: { id: userId }, data: { isGoldSeller: true } });
      break;
    case "setKarma": {
      if (!isSuperAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      const delta = parseInt(reason ?? "0");
      if (isNaN(delta)) return NextResponse.json({ error: "Invalid delta" }, { status: 400 });
      await prisma.user.update({ where: { id: userId }, data: { karma: { increment: delta } } });
      break;
    }
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  await prisma.auditLog.create({
    data: { userId: admin.id, action: `admin_${action}`, meta: { targetUserId: userId, reason } },
  });

  return NextResponse.json({ success: true });
}
