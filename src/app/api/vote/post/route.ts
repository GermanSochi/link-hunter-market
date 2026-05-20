import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId, isPositive } = await req.json();
  if (!postId || typeof isPositive !== "boolean") {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const userId = session.user.id;

  const existing = await prisma.postVote.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  if (existing) {
    if (existing.isPositive === isPositive) {
      await prisma.postVote.delete({ where: { userId_postId: { userId, postId } } });
    } else {
      await prisma.postVote.update({
        where: { userId_postId: { userId, postId } },
        data: { isPositive },
      });
    }
  } else {
    await prisma.postVote.create({ data: { userId, postId, isPositive } });
  }

  const votes = await prisma.postVote.findMany({ where: { postId } });
  const voteCount = votes.length;
  const positiveVotes = votes.filter((v) => v.isPositive).length;
  const isGold = voteCount >= 100 && positiveVotes > voteCount / 2;

  await prisma.post.update({
    where: { id: postId },
    data: { voteCount, positiveVotes, isGold },
  });

  // Karma boost автору при Gold Post
  if (isGold) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (post) {
      await prisma.karmaEvent.create({
        data: {
          userId: post.authorId,
          delta: 50,
          reason: "gold_post",
          referenceId: postId,
        },
      });
      await prisma.user.update({
        where: { id: post.authorId },
        data: { karma: { increment: 50 } },
      });
    }
  }

  return NextResponse.json({ voteCount, positiveVotes, isGold });
}
