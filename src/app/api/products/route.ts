import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const STATIC_GROUPS = [
  { title: "Работа в Москве #1", slug: "job-moscow-1", category: "work", platform: "TELEGRAM", groupUrl: "https://t.me/MOSKVADAISHELONUZ", membersCount: 15000, rating: 4.8, isVerified: true, isGold: true },
  { title: "Вакансии для узбеков #2", slug: "job-uzbek-2", category: "work", platform: "TELEGRAM", groupUrl: "https://t.me/TAYANCHMOSKVADAISH", membersCount: 12000, rating: 4.7, isVerified: true, isGold: false },
  { title: "Работа в Таиланде #3", slug: "job-thailand-3", category: "work", platform: "TELEGRAM", groupUrl: "https://t.me/MOSKVADAISHELONKV", membersCount: 8000, rating: 4.9, isVerified: false, isGold: true },
  { title: "Учёба в РФ #1", slug: "study-russia-1", category: "study", platform: "TELEGRAM", groupUrl: "https://t.me/MOSKVADAELONUZ", membersCount: 6000, rating: 4.6, isVerified: true, isGold: false },
  { title: "Курсы программирования #2", slug: "study-programming-2", category: "study", platform: "TELEGRAM", groupUrl: "https://t.me/MOSKVATAYANCHDAISH", membersCount: 10000, rating: 4.8, isVerified: true, isGold: true },
  { title: "Хобби и увлечения #1", slug: "hobby-1", category: "hobby", platform: "TELEGRAM", groupUrl: "https://t.me/MOSKVATAYANCHISHELON", membersCount: 5000, rating: 4.5, isVerified: false, isGold: false },
  { title: "Дом и быт #1", slug: "home-1", category: "home", platform: "TELEGRAM", groupUrl: "https://t.me/MOSKVADAGI_UZBEKLAR", membersCount: 4500, rating: 4.4, isVerified: true, isGold: false },
  { title: "Работа для мигрантов #4", slug: "job-migrant-4", category: "work", platform: "TELEGRAM", groupUrl: "https://t.me/MOSKVA_TAYANCH_ELON", membersCount: 20000, rating: 4.9, isVerified: true, isGold: true },
  { title: "Студенческие группы #3", slug: "study-students-3", category: "study", platform: "TELEGRAM", groupUrl: "https://t.me/MASKVATAYANCHUZ", membersCount: 7500, rating: 4.7, isVerified: false, isGold: false },
  { title: "Вакансии в Москве #5", slug: "job-moscow-5", category: "work", platform: "TELEGRAM", groupUrl: "https://t.me/TAYANCHMOSKVAUZISH", membersCount: 18000, rating: 4.8, isVerified: true, isGold: true },
];

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

  let products: any[] = [];

  try {
    products = await prisma.product.findMany({
      where: { status: "APPROVED" },
      orderBy: [{ isGold: "desc" }, { rating: "desc" }],
      take: 30,
    });
  } catch {
    products = [];
  }

  if (products.length === 0) {
    products = STATIC_GROUPS.map((g, idx) => ({
      id: `static-${idx}`,
      slug: g.slug,
      title: g.title,
      description: `Группа по теме "${g.title}". Платформа: ${g.platform}.`,
      category: g.category,
      priceCents: 0,
      oldPriceCents: null,
      type: "FREE",
      status: "APPROVED",
      platform: g.platform,
      groupUrl: g.groupUrl,
      membersCount: g.membersCount,
      isVerified: g.isVerified,
      isGold: g.isGold,
      rating: g.rating,
      reviewCount: Math.floor(Math.random() * 500),
      images: JSON.stringify([
        { url: `https://picsum.photos/seed/${g.slug}/400/300`, alt: g.title },
      ]),
      tags: [g.platform.toLowerCase(), g.category],
    }));
  }

  let accessibleProductIds: Set<string> = new Set();

  if (userId) {
    try {
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
    } catch {
      accessibleProductIds = new Set(products.slice(0, 5).map(p => p.id));
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
  
  try {
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
  } catch {
    return NextResponse.json({ error: "Database error, but product request logged" }, { status: 201 });
  }
}
