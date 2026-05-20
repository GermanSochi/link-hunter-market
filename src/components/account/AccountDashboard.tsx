"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ShoppingBag, Heart, Settings, Wallet, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import OrdersTab, { OrderItem } from "./OrdersTab";
import FavoritesTab from "./FavoritesTab";
import ProfileTab from "./ProfileTab";
import WalletTab, { TxItem } from "./WalletTab";
import SellerTab from "./SellerTab";

type Tab = "orders" | "favorites" | "settings" | "wallet" | "seller";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "orders",    label: "Мои покупки",  icon: <ShoppingBag className="h-4 w-4" /> },
  { id: "seller",    label: "Мои товары",   icon: <Store className="h-4 w-4" /> },
  { id: "favorites", label: "Избранное",    icon: <Heart className="h-4 w-4" /> },
  { id: "wallet",    label: "Кошелёк",      icon: <Wallet className="h-4 w-4" /> },
  { id: "settings",  label: "Настройки",    icon: <Settings className="h-4 w-4" /> },
];

type User = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  balanceCoins: number;
  accounts: { provider: string }[];
};

interface Props {
  user: User;
  orders: OrderItem[];
  transactions: TxItem[];
}

export default function AccountDashboard({ user, orders, transactions }: Props) {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>((searchParams.get("tab") as Tab) ?? "orders");

  // Реагировать на смену ?tab= в URL (например, клик по «Пополнить» в NavBar)
  useEffect(() => {
    const t = searchParams.get("tab") as Tab | null;
    if (t && TABS.some((x) => x.id === t)) setTab(t);
  }, [searchParams]);

  return (
    <div className="flex gap-4 min-h-[calc(100vh-120px)]">
      {/* Сайдбар */}
      <aside className="hidden md:flex flex-col w-52 shrink-0">
        <div className="sticky top-20 bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {/* Шапка профиля */}
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt="" className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div className="h-9 w-9 rounded-full bg-[#005BFF]/10 flex items-center justify-center text-[#005BFF] font-bold text-sm">
                  {(user.name ?? user.email)[0].toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#242424] truncate">{user.name ?? "Профиль"}</p>
                <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Пункты меню */}
          <nav className="p-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left",
                  tab === t.id
                    ? "bg-[#005BFF] text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Мобильный таббар */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
              tab === t.id ? "text-[#005BFF]" : "text-gray-500"
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Контент */}
      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          {/* Заголовок вкладки */}
          <h2 className="text-base font-bold text-[#242424] mb-4 flex items-center gap-2">
            {TABS.find((t) => t.id === tab)?.icon}
            {TABS.find((t) => t.id === tab)?.label}
          </h2>

          {tab === "orders"    && <OrdersTab orders={orders} />}
          {tab === "seller"    && <SellerTab />}
          {tab === "favorites" && <FavoritesTab />}
          {tab === "wallet"    && <WalletTab balance={user.balanceCoins} transactions={transactions} />}
          {tab === "settings"  && (
            <ProfileTab
              user={{
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                accounts: user.accounts,
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
