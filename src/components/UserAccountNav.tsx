"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown";
import { useAuth } from "@/hooks/useAuth";
import { SlidersHorizontal, User, Package, ShoppingBag, LogOut, Wallet } from "lucide-react";
import { formatCoins } from "@/lib/utils";

interface UserShape {
  id: string;
  email: string;
  name?: string | null;
  role?: string;
  balanceCoins?: number;
}

function UserAccountNav({ user }: { user: UserShape }) {
  const { signOut } = useAuth();
  const initial = (user.name ?? user.email)[0]?.toUpperCase() ?? "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 h-9 px-2.5 rounded-xl hover:bg-gray-100/80 dark:hover:bg-white/[0.08] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#005BFF]/40"
        >
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#005BFF] to-[#7B61FF] flex items-center justify-center text-white text-xs font-bold shrink-0 select-none">
            {initial}
          </div>
          <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-slate-300 max-w-[100px] truncate">
            {user.name ?? user.email.split("@")[0]}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 rounded-2xl border border-gray-200/80 dark:border-white/[0.08] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-xl p-1.5"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-3 pb-2.5">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#005BFF] to-[#7B61FF] flex items-center justify-center text-white text-sm font-bold shrink-0 select-none">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-gray-900 dark:text-white truncate leading-tight">
              {user.name ?? user.email.split("@")[0]}
            </p>
            <p className="text-xs text-gray-400 dark:text-slate-500 truncate">{user.email}</p>
          </div>
        </div>

        {user.balanceCoins !== undefined && (
          <div className="mx-3 mb-2.5 flex items-center gap-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 px-3 py-2">
            <Wallet className="h-3.5 w-3.5 text-[#005BFF] shrink-0" />
            <span className="text-xs text-[#005BFF] font-semibold">
              {formatCoins(user.balanceCoins)} на балансе
            </span>
          </div>
        )}

        <DropdownMenuSeparator className="my-1 bg-gray-100 dark:bg-white/[0.08]" />

        <DropdownMenuItem asChild>
          <Link href="/account" className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.06] text-gray-700 dark:text-slate-300">
            <User className="h-4 w-4 text-gray-400 dark:text-slate-500" />
            <span className="text-sm">Личный кабинет</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/account?tab=products" className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.06] text-gray-700 dark:text-slate-300">
            <Package className="h-4 w-4 text-gray-400" />
            <span className="text-sm">Мои товары</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/account?tab=orders" className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.06] text-gray-700 dark:text-slate-300">
            <ShoppingBag className="h-4 w-4 text-gray-400" />
            <span className="text-sm">Заказы</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings/interests" className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.06] text-gray-700 dark:text-slate-300">
            <SlidersHorizontal className="h-4 w-4 text-gray-400" />
            <span className="text-sm">Мои интересы</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 bg-gray-100 dark:bg-white/[0.08]" />

        <DropdownMenuItem
          onClick={signOut}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Выйти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserAccountNav;
