"use client";

import { PRODUCT_CATEGORIES } from "@/config";
import { Menu, X, BarChart2, BookOpen, ShoppingBag, Home, Briefcase, GraduationCap, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const categoryIcons: Record<string, React.ReactNode> = {
  "Дом": <Home className="h-4 w-4" />,
  "Работа": <Briefcase className="h-4 w-4" />,
  "Учёба": <GraduationCap className="h-4 w-4" />,
  "Хобби": <Heart className="h-4 w-4" />,
};

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setIsOpen(false); }, [pathname]);

  useEffect(() => {
    if (isOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  const closeOnCurrent = (href: string) => {
    if (pathname === href) setIsOpen(false);
  };

  if (!isOpen)
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="lg:hidden relative -m-1.5 inline-flex items-center justify-center rounded-xl p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>
    );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 z-50 w-[85vw] max-w-sm flex flex-col bg-white dark:bg-gray-900 shadow-2xl lg:hidden overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 dark:border-white/[0.08]">
          <span className="text-base font-bold text-gray-900 dark:text-white">Меню</span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-white/[0.08] hover:text-gray-600 dark:hover:text-white transition-colors"
            aria-label="Закрыть меню"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Quick links */}
        <div className="px-4 pt-4 pb-2 space-y-1">
          <Link
            href="/compare-ai"
            onClick={() => closeOnCurrent("/compare-ai")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10 text-gray-700 dark:text-slate-300 hover:text-[#005BFF] dark:hover:text-blue-400 transition-colors"
          >
            <BarChart2 className="h-4 w-4 text-[#005BFF]" />
            <span className="text-sm font-medium">Сравнить ИИ</span>
            <span className="ml-auto text-[10px] bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full font-semibold">NEW</span>
          </Link>
          <Link
            href="/blog"
            onClick={() => closeOnCurrent("/blog")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.06] text-gray-700 dark:text-slate-300 transition-colors"
          >
            <BookOpen className="h-4 w-4 text-gray-400 dark:text-slate-500" />
            <span className="text-sm font-medium">Блоги</span>
          </Link>
          <Link
            href="/products"
            onClick={() => closeOnCurrent("/products")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.06] text-gray-700 dark:text-slate-300 transition-colors"
          >
            <ShoppingBag className="h-4 w-4 text-gray-400 dark:text-slate-500" />
            <span className="text-sm font-medium">Каталог</span>
          </Link>
        </div>

        {/* Categories */}
        <div className="px-4 pt-2 pb-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-600 px-3 mb-2">
            Категории
          </p>
          {PRODUCT_CATEGORIES.map((category) => (
            <div key={category.label} className="mb-4">
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="text-gray-400 dark:text-slate-500">{categoryIcons[category.label] ?? <ShoppingBag className="h-4 w-4" />}</span>
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{category.label}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 px-1">
                {category.featured.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => closeOnCurrent(item.href)}
                    className="group flex flex-col gap-1.5 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        fill
                        src={item.imageSrc}
                        alt={item.name}
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-slate-300 leading-tight">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Auth links */}
        <div className="mt-auto border-t border-gray-100 dark:border-white/[0.08] px-4 py-5 space-y-2">
          <Link
            href="/sign-in"
            onClick={() => closeOnCurrent("/sign-in")}
            className="flex items-center justify-center h-10 rounded-xl border border-gray-200 dark:border-white/15 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors"
          >
            Войти
          </Link>
          <Link
            href="/sign-up"
            onClick={() => closeOnCurrent("/sign-up")}
            className="flex items-center justify-center h-10 rounded-xl bg-gradient-to-r from-[#005BFF] to-[#0070FF] text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Регистрация
          </Link>
        </div>
      </div>
    </>
  );
};

export default MobileNav;
