import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, isPositive } = await req.json();
  if (!productId || typeof isPositive !== "boolean") {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const userId = session.user.id;

  const existing = await prisma.productVote.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    if (existing.isPositive === isPositive) {
      // Отмена голоса
      await prisma.productVote.delete({
        where: { userId_productId: { userId, productId } },
      });
    } else {
      // Смена голоса
      await prisma.productVote.update({
        where: { userId_productId: { userId, productId } },
        data: { isPositive },
      });
    }
  } else {
    await prisma.productVote.create({ data: { userId, productId, isPositive } });
  }

  // Пересчёт статистики продукта
  const votes = await prisma.productVote.findMany({ where: { productId } });
  const voteCount = votes.length;
  const positiveVotes = votes.filter((v) => v.isPositive).length;
  const isGold = voteCount >= 10 && positiveVotes / voteCount > 0.92;

  await prisma.product.update({
    where: { id: productId },
    data: { voteCount, positiveVotes, isGold },
  });

  // Если Gold — продавец получает Gold Status
  if (isGold) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (product) {
      await prisma.user.update({
        where: { id: product.sellerId },
        data: { isGoldSeller: true },
      });
    }
  }

  return NextResponse.json({ voteCount, positiveVotes, isGold });
}
