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

async function getDbProducts(categories?: string[], userId?: string | null): Promise<OzonProduct[]> {
  try {
    const items = await prisma.product.findMany({
      where: {
        status: "APPROVED",
        ...(categories && categories.length > 0 ? { category: { in: categories } } : {}),
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
      accessibleProductIds = new Set(userAccess.map((ua) => ua.productId));

      const subscription = await prisma.subscription.findUnique({
        where: { userId },
      });

      if (subscription && (subscription.tier === "FULL" || subscription.tier === "VIP")) {
        accessibleProductIds = new Set(items.map((p) => p.id));
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
    return [];
  }
}

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const [interests, products] = await Promise.all([
    getUserInterests(userId),
    getDbProducts(/* no pre-filter — ProductFeed handles it client-side */, userId),
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
                Реклама на AI-маркетплейсе
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
                Разместите ваш продукт <br className="hidden md:block" />
                среди лучших AI-инструментов
              </h3>
              <p className="text-white/75 text-sm mb-6">
                Тысячи разработчиков, маркетологов и предпринимателей смотрят на эту страницу каждый день.
              </p>
              <Link
                href="mailto:legal@aimarket.dev"
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
