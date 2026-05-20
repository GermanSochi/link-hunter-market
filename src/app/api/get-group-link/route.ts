import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await req.json();
  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  const userId = session.user.id;

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  const hasFullAccess = subscription && (subscription.tier === "FULL" || subscription.tier === "VIP");

  const userAccess = await prisma.userAccess.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (!hasFullAccess && !userAccess) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  return NextResponse.json({ groupUrl: product.groupUrl }, { status: 200 });
}
