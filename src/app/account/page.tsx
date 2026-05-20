import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import AccountDashboard from "@/components/account/AccountDashboard";
import { Suspense } from "react";
import type { OrderItem } from "@/components/account/OrdersTab";
import type { TxItem } from "@/components/account/WalletTab";

async function getAccountData(userId: string) {
  const [userFull, rawOrders, transactions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, image: true, balanceCoins: true,
        accounts: { select: { provider: true } },
      },
    }),
    prisma.order.findMany({
      where: { clientId: userId },
      include: { product: { select: { id: true, title: true, slug: true, images: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const orders: OrderItem[] = rawOrders.map((o) => {
    const imgs = o.product
      ? typeof o.product.images === "string"
        ? (JSON.parse(o.product.images) as { url: string }[])
        : (o.product.images as { url: string }[])
      : [];
    return {
      id: o.id,
      productId: o.product?.id ?? "",
      productTitle: o.product?.title ?? "Удалённый товар",
      productImage: imgs[0]?.url ?? `https://picsum.photos/seed/${o.product?.slug ?? "default"}/80/80`,
      productSlug: o.product?.slug ?? "",
      amountCoins: o.amountCoins,
      status: o.status,
      createdAt: o.createdAt.toISOString(),
    };
  });

  const txs: TxItem[] = transactions.map((t) => ({
    id: t.id,
    type: t.type,
    amountCoins: t.amountCoins,
    balanceAfter: t.balanceAfter,
    createdAt: t.createdAt.toISOString(),
    meta: t.meta as Record<string, unknown> | null,
  }));

  return { user: userFull, orders, transactions: txs };
}

export default async function AccountPage() {
  const session = await getSessionUser();
  if (!session) redirect("/sign-in?callbackUrl=/account");

  const { user, orders, transactions } = await getAccountData(session.id);
  if (!user) redirect("/sign-in");

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-4">
      <MaxWidthWrapper>
        <Suspense fallback={null}>
          <AccountDashboard user={user} orders={orders} transactions={transactions} />
        </Suspense>
      </MaxWidthWrapper>
    </div>
  );
}
