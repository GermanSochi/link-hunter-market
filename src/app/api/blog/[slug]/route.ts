import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      author: {
        select: { id: true, name: true, username: true, image: true, isGoldSeller: true },
      },
    },
  });

  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Increment view count (fire-and-forget)
  prisma.post.update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});

  return NextResponse.json(post);
}
