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
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const limit = 30;
  const skip = (page - 1) * limit;

  const room = await prisma.chatRoom.findFirst({ where: { type: "COMMUNITY", name: "general" } });
  if (!room) return NextResponse.json({ messages: [], total: 0 });

  const [messages, total] = await Promise.all([
    prisma.chatMessage.findMany({
      where: { roomId: room.id },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, username: true, email: true, isGoldSeller: true } },
      },
    }),
    prisma.chatMessage.count({ where: { roomId: room.id } }),
  ]);

  return NextResponse.json({ messages, total, page, totalPages: Math.ceil(total / limit) });
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { messageId } = await req.json();
  if (!messageId) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  await prisma.chatMessage.update({
    where: { id: messageId },
    data: { deletedAt: new Date() },
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "chat_message_deleted",
      meta: { messageId },
    },
  });

  return NextResponse.json({ success: true });
}
