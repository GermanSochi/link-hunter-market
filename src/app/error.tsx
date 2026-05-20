"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6 h-16 w-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Что-то пошло не так
        </h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Произошла непредвиденная ошибка. Попробуйте обновить страницу
          или вернитесь на главную.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#005BFF] to-[#0070ff] text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Попробовать снова
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold text-sm px-6 py-2.5 rounded-xl hover:border-[#005BFF]/40 hover:text-[#005BFF] transition-all"
          >
            <Home className="h-4 w-4" />
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
