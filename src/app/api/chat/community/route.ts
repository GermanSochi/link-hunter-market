import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function getCommunityRoom() {
  let room = await prisma.chatRoom.findFirst({ where: { type: "COMMUNITY", name: "general" } });
  if (!room) {
    room = await prisma.chatRoom.create({ data: { type: "COMMUNITY", name: "general" } });
  }
  return room;
}

export async function GET() {
  const room = await getCommunityRoom();

  const messages = await prisma.chatMessage.findMany({
    where: { roomId: room.id, deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      author: { select: { id: true, name: true, username: true, image: true, isGoldSeller: true } },
    },
  });

  return NextResponse.json(messages.reverse());
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.isBanned) {
    return NextResponse.json({ error: "Аккаунт заблокирован" }, { status: 403 });
  }

  if (user.isReadOnly) {
    // Read-only: 1 сообщение в день
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const room = await getCommunityRoom();
    const todayCount = await prisma.chatMessage.count({
      where: {
        authorId: user.id,
        roomId: room.id,
        createdAt: { gte: today },
      },
    });
    if (todayCount >= 1) {
      return NextResponse.json(
        { error: "Лимит сообщений исчерпан. Karma < -20: только 1 сообщение в день." },
        { status: 429 }
      );
    }
  }

  const { text } = await req.json();
  if (!text?.trim()) return NextResponse.json({ error: "Empty message" }, { status: 400 });

  const room = await getCommunityRoom();

  const message = await prisma.chatMessage.create({
    data: {
      roomId: room.id,
      authorId: session.user.id,
      text: text.trim(),
    },
    include: {
      author: { select: { id: true, name: true, username: true, image: true, isGoldSeller: true } },
    },
  });

  return NextResponse.json(message, { status: 201 });
}
