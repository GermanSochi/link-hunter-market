import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { z } from "zod";

const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  text: z.string().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
  }

  const { productId, rating, text } = parsed.data;

  const product = await prisma.product.findFirst({
    where: { id: productId, status: "APPROVED" },
  });
  if (!product) {
    return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
  }

  const hasPurchased = await prisma.order.findFirst({
    where: { clientId: user.id, productId, status: "COMPLETED" },
  });

  try {
    const review = await prisma.review.create({
      data: {
        productId,
        authorId: user.id,
        rating,
        text: text ?? null,
        isVerified: !!hasPurchased,
      },
    });

    // Пересчитать средний рейтинг продукта
    const agg = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
    });
    await prisma.product.update({
      where: { id: productId },
      data: { rating: agg._avg.rating ?? 0 },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "Вы уже оставили отзыв на этот товар" }, { status: 409 });
    }
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
