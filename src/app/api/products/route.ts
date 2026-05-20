import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function toSlug(str: string): string {
  const map: Record<string, string> = {
    а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",
    й:"j",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",
    у:"u",ф:"f",х:"h",ц:"ts",ч:"ch",ш:"sh",щ:"sch",ъ:"",ы:"y",ь:"",
    э:"e",ю:"yu",я:"ya",
  };
  return str
    .toLowerCase()
    .split("")
    .map((c) => map[c] ?? c)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  const products = await prisma.product.findMany({
    where: {
      status: "APPROVED",
    },
    orderBy: [{ isGold: "desc" }, { rating: "desc" }],
    take: 30,
  });

  let accessibleProductIds: Set<string> = new Set();

  if (userId) {
    const userAccess = await prisma.userAccess.findMany({
      where: { userId },
      select: { productId: true },
    });
    accessibleProductIds = new Set(userAccess.map(ua => ua.productId));

    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (subscription && (subscription.tier === "FULL" || subscription.tier === "VIP")) {
      accessibleProductIds = new Set(products.map(p => p.id));
    }
  }

  const sanitizedProducts = products.map(product => ({
    ...product,
    groupUrl: accessibleProductIds.has(product.id) ? product.groupUrl : "hidden",
  }));

  return NextResponse.json({ products: sanitizedProducts }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, category, priceCents, type, aiModel, trialUrl, tags } = await req.json();

  if (!title?.trim() || !description?.trim() || !category) {
    return NextResponse.json({ error: "Заполните обязательные поля" }, { status: 400 });
  }

  const baseSlug = toSlug(title);
  let slug = baseSlug;
  let attempt = 0;
  while (await prisma.product.findUnique({ where: { slug } })) {
    attempt++;
    slug = `${baseSlug}-${attempt}`;
  }

  const product = await prisma.product.create({
    data: {
      sellerId: session.user.id,
      title: title.trim(),
      slug,
      description: description.trim(),
      category,
      priceCents: priceCents ?? 0,
      type: type ?? (priceCents > 0 ? "PAID" : "FREE"),
      status: "PENDING_MODERATION",
      aiModel: aiModel?.trim() || null,
      trialUrl: trialUrl?.trim() || null,
      tags: tags ?? [],
    },
  });

  return NextResponse.json({ product }, { status: 201 });
}
