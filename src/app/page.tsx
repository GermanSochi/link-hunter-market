import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductFeed from "@/components/ProductFeed";
import CommunityChatSection from "@/components/CommunityChatSection";
import HeroSection from "@/components/HeroSection";
import { prisma } from "@/lib/prisma";
import { Zap } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { OzonProduct } from "@/components/OzonProductCard";

async function getUserInterests(userId: string | null): Promise<string[]> {
  if (!userId) return [];
  try {
    const interests = await prisma.userInterest.findMany({
      where: { userId },
      select: { category: true },
    });
    return interests.map((i) => i.category);
  } catch {
    return [];
  }
}

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

async function getDbProducts(categories?: string[], userId?: string | null): Promise<OzonProduct[]> {
  try {
    let items: any[] = [];
    
    try {
      items = await prisma.product.findMany({
        where: {
          status: "APPROVED",
          ...(categories && categories.length > 0 ? { category: { in: categories } } : {}),
        },
        orderBy: [{ isGold: "desc" }, { rating: "desc" }],
        take: 30,
      });
    } catch {
      items = [];
    }

    if (items.length === 0) {
      items = STATIC_GROUPS.map((g, idx) => ({
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
        accessibleProductIds = new Set(userAccess.map((ua) => ua.productId));

        const subscription = await prisma.subscription.findUnique({
          where: { userId },
        });

        if (subscription && (subscription.tier === "FULL" || subscription.tier === "VIP")) {
          accessibleProductIds = new Set(items.map((p) => p.id));
        }
      } catch {
        if (userId) {
          accessibleProductIds = new Set(items.slice(0, 5).map((p) => p.id));
        }
      }
    }

    return items.map((p) => {
      const imgs =
        typeof p.images === "string"
          ? (JSON.parse(p.images) as { url: string }[])
          : (p.images as { url: string }[]) ?? [];
      return {
        id: p.id, slug: p.slug, title: p.title,
        priceCents: p.priceCents, rating: p.rating,
        image: imgs[0]?.url ?? `https://picsum.photos/seed/${p.slug}/400/400`,
        category: p.category, isGold: p.isGold,
        platform: p.platform as any,
        membersCount: p.membersCount,
        isVerified: p.isVerified,
        groupUrl: accessibleProductIds.has(p.id) ? p.groupUrl : "hidden",
        reviewCount: p.reviewCount,
        oldPriceCents: p.oldPriceCents,
      };
    });
  } catch {
    return STATIC_GROUPS.map((g, idx) => ({
      id: `static-${idx}`, slug: g.slug, title: g.title,
      priceCents: 0, rating: g.rating,
      image: `https://picsum.photos/seed/${g.slug}/400/400`,
      category: g.category, isGold: g.isGold,
      platform: g.platform as any,
      membersCount: g.membersCount,
      isVerified: g.isVerified,
      groupUrl: "hidden",
      reviewCount: Math.floor(Math.random() * 500),
      oldPriceCents: null,
    }));
  }
}

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const [interests, products] = await Promise.all([
    getUserInterests(userId),
    getDbProducts(undefined, userId),
  ]);

  return (
    <div className="bg-[#f7f8fc] min-h-screen">
      <HeroSection />

      <MaxWidthWrapper className="py-8 space-y-12">
        {/* Interactive ticker filter + product grid */}
        <ProductFeed
          products={products}
          hasInterests={interests.length > 0}
          interests={interests}
          isLoggedIn={!!userId}
        />

        {/* Ad Banner */}
        <section>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#005BFF] via-[#0070ff] to-[#00BFFF] p-8 md:p-10 text-white shadow-premium">
            <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/8 animate-blob" />
            <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/6 animate-blob animation-delay-3s" />
            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1 text-xs font-semibold mb-4 backdrop-blur-sm">
                <Zap className="h-3 w-3" />
                Поиск сотрудников и работы
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
                Найди работу или сотрудников<br className="hidden md:block" />
                в наших группах
              </h3>
              <p className="text-white/75 text-sm mb-6">
                Тысячи работодателей и специалистов смотрят на эту страницу каждый день.
              </p>
              <Link
                href="mailto:support@linkhunter.ru"
                className="inline-block bg-white text-[#005BFF] font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
              >
                Связаться с нами →
              </Link>
            </div>
          </div>
        </section>

        {/* Community Chat — collapsible */}
        <section className="max-w-2xl">
          <CommunityChatSection />
        </section>
      </MaxWidthWrapper>
    </div>
  );
}
