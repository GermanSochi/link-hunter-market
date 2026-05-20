import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Icons } from "./Icons";
import NavItems from "./NavItems";
import Cart from "./Cart";
import { getSessionUser } from "@/lib/auth";
import UserAccountNav from "./UserAccountNav";
import MobileNav from "./MobileNav";
import SearchBar from "./SearchBar";
import { Menu, User, ClipboardList, Wallet, BookOpen, Shield, Ghost, BarChart2 } from "lucide-react";
import { formatCoins } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";

async function NavBar() {
  const user = await getSessionUser();

  return (
    <div className="sticky z-50 top-0 inset-x-0">
      {/* Glass header */}
      <header className="glass border-b border-white/40 shadow-glass">
        <MaxWidthWrapper>
          {/* Main header row */}
          <div className="flex h-14 items-center gap-2.5">
            {/* Mobile nav */}
            <div className="lg:hidden">
              <MobileNav />
            </div>

            {/* Logo */}
            <Link href="/" className="shrink-0 hidden lg:block press text-gray-900 dark:text-white">
              <Icons.aiMarketLogo className="h-8 w-auto" />
            </Link>

            {/* Catalog button */}
            <Link
              href="/products"
              className="hidden lg:flex items-center gap-2 h-9 px-4 rounded-xl bg-gradient-blue text-white text-sm font-semibold hover:opacity-90 hover:shadow-blue-glow transition-all duration-200 shrink-0 press"
            >
              <Menu className="h-4 w-4" />
              Каталог
            </Link>

            {/* Blog */}
            <Link
              href="/blog"
              className="hidden lg:flex items-center gap-1.5 h-9 px-3 rounded-xl text-gray-600 dark:text-slate-400 text-sm font-medium hover:bg-gray-100/80 dark:hover:bg-white/[0.08] hover:text-gray-900 dark:hover:text-white transition-all duration-150 shrink-0"
            >
              <BookOpen className="h-4 w-4" />
              Блоги
            </Link>

            {/* Compare AI */}
            <Link
              href="/compare-ai"
              className="hidden lg:flex items-center gap-1.5 h-9 px-3 rounded-xl text-gray-600 dark:text-slate-400 text-sm font-medium hover:bg-gray-100/80 dark:hover:bg-white/[0.08] hover:text-gray-900 dark:hover:text-white transition-all duration-150 shrink-0"
            >
              <BarChart2 className="h-4 w-4" />
              Сравнить ИИ
            </Link>

            {/* Admin — only for staff */}
            {user && ["SUPERADMIN", "ADMIN", "MODERATOR"].includes(user.role) && (
              <Link
                href="/admin"
                className="hidden lg:flex items-center gap-1.5 h-9 px-3 rounded-xl text-orange-600 text-sm font-semibold hover:bg-orange-50 transition-all duration-150 shrink-0"
              >
                <Shield className="h-4 w-4" />
                Админ
              </Link>
            )}

            {/* Search — fills remaining space */}
            <div className="flex-1 hidden lg:flex">
              <SearchBar />
            </div>

            {/* Right side */}
            <div className="ml-auto lg:ml-0 flex items-center gap-1">
              {user ? (
                <>
                  {/* Balance chip */}
                  <Link
                    href="/account?tab=wallet"
                    className="hidden md:flex items-center gap-1.5 border border-gray-200/80 dark:border-white/10 rounded-xl px-3 h-9 hover:border-[#005BFF]/40 hover:bg-blue-50/50 dark:hover:bg-blue-500/10 transition-all duration-150 group"
                    title="Кошелёк"
                  >
                    <Wallet className="h-3.5 w-3.5 text-[#005BFF]" />
                    <span className="text-sm font-bold text-gray-800 dark:text-white tabular-nums group-hover:text-[#005BFF] transition-colors">
                      {formatCoins(user.balanceCoins)}
                    </span>
                    <span className="ml-0.5 h-4 w-4 bg-[#005BFF] rounded-full flex items-center justify-center text-white text-[10px] font-bold leading-none hover:bg-[#004DE0]">
                      +
                    </span>
                  </Link>

                  {/* Orders */}
                  <Link
                    href="/account"
                    className="hidden sm:flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl hover:bg-gray-100/80 transition-colors text-gray-500 hover:text-gray-900"
                  >
                    <ClipboardList className="h-5 w-5" />
                    <span className="text-[10px] leading-none">Заказы</span>
                  </Link>

                  <UserAccountNav
                    user={{
                      id: user.id,
                      email: user.email,
                      name: user.name,
                      role: user.role,
                      balanceCoins: user.balanceCoins,
                    }}
                  />
                </>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link
                    href="/sign-in?guest=1"
                    className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-xl border border-dashed border-gray-300 dark:border-white/15 text-sm font-medium text-gray-500 dark:text-slate-400 hover:border-[#005BFF]/50 hover:text-[#005BFF] hover:bg-blue-50/50 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 transition-all duration-150"
                    title="Войти как гость"
                  >
                    <Ghost className="h-4 w-4" />
                    <span className="hidden md:inline">Гость</span>
                  </Link>
                  <Link
                    href="/sign-in"
                    className="flex items-center gap-2 h-9 px-4 rounded-xl border border-gray-200 dark:border-white/15 text-sm font-medium text-gray-700 dark:text-slate-300 hover:border-[#005BFF]/50 hover:text-[#005BFF] hover:bg-blue-50/50 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 transition-all duration-150"
                  >
                    <User className="h-4 w-4" />
                    Войти
                  </Link>
                </div>
              )}

              <ThemeToggle />
              <Cart />
            </div>
          </div>

          {/* Mobile search */}
          <div className="lg:hidden py-2 border-t border-white/30">
            <SearchBar />
          </div>

          {/* Category nav */}
          <div className="hidden lg:block border-t border-white/30 py-0.5">
            <NavItems />
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
}

export default NavBar;
