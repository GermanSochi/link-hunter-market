"use client";

import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <span className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#005BFF] to-[#00BFFF] tabular-nums select-none">
            404
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Страница не найдена
        </h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Возможно, ссылка устарела или страница была перемещена.
          Вернитесь на главную и найдите нужный продукт.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#005BFF] to-[#0070ff] text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
          >
            <Home className="h-4 w-4" />
            На главную
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold text-sm px-6 py-2.5 rounded-xl hover:border-[#005BFF]/40 hover:text-[#005BFF] transition-all"
          >
            <Search className="h-4 w-4" />
            Каталог
          </Link>
        </div>

        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 mt-6 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Назад
        </button>
      </div>
    </div>
  );
}
