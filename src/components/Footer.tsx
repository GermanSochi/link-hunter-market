"use client";

import { usePathname } from "next/navigation";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Icons } from "./Icons";
import Link from "next/link";

const Footer = () => {
  const pathname = usePathname();
  const minimal = ["/verify-email", "/sign-up", "/sign-in"].includes(pathname);

  if (minimal) {
    return (
      <footer className="border-t border-gray-100 bg-white py-4">
        <p className="text-center text-xs text-gray-400">
          © {new Date().getFullYear()} AI-маркет. Все права защищены.
        </p>
      </footer>
    );
  }

  return (
    <footer className="bg-white border-t border-gray-100 flex-grow-0 mt-auto">
      <MaxWidthWrapper>
        <div className="py-10">
          {/* Top row */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-8 mb-8">
            <div>
              <Icons.aiMarketLogo className="h-8 w-auto mb-3" />
              <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                Маркетплейс AI-инструментов №1 в СНГ. Покупай, продавай, зарабатывай.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-2 text-sm">
              <div className="space-y-2">
                <p className="font-semibold text-gray-800 text-xs uppercase tracking-wide mb-3">Маркет</p>
                <Link href="/products" className="block text-gray-500 hover:text-gray-800 transition-colors">Каталог</Link>
                <Link href="/blog" className="block text-gray-500 hover:text-gray-800 transition-colors">Блоги</Link>
                <Link href="/sign-up" className="block text-gray-500 hover:text-gray-800 transition-colors">Стать продавцом</Link>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-gray-800 text-xs uppercase tracking-wide mb-3">Аккаунт</p>
                <Link href="/account" className="block text-gray-500 hover:text-gray-800 transition-colors">Личный кабинет</Link>
                <Link href="/settings/interests" className="block text-gray-500 hover:text-gray-800 transition-colors">Мои интересы</Link>
                <Link href="/cart" className="block text-gray-500 hover:text-gray-800 transition-colors">Корзина</Link>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-gray-800 text-xs uppercase tracking-wide mb-3">Документы</p>
                <Link href="/privacy" className="block text-gray-500 hover:text-gray-800 transition-colors">Конфиденциальность</Link>
                <Link href="/terms" className="block text-gray-500 hover:text-gray-800 transition-colors">Условия</Link>
                <a href="mailto:legal@aimarket.dev" className="block text-gray-500 hover:text-gray-800 transition-colors">Контакты</a>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} AI-маркет. Все права защищены.
              Обработка данных по ФЗ-152.
            </p>
            <div className="flex items-center gap-5 text-xs text-gray-400">
              <Link href="/privacy" className="hover:text-gray-600 transition-colors">Политика конфиденциальности</Link>
              <Link href="/terms" className="hover:text-gray-600 transition-colors">Условия использования</Link>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
};

export default Footer;
