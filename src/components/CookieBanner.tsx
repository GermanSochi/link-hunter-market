"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Cookie } from "lucide-react";

const STORAGE_KEY = "cookie_consent_v1";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      if (!consent) setVisible(true);
    } catch {
      // localStorage blocked (private mode etc.)
    }
  }, []);

  const accept = () => {
    try { localStorage.setItem(STORAGE_KEY, "accepted"); } catch {}
    setVisible(false);
  };

  const decline = () => {
    try { localStorage.setItem(STORAGE_KEY, "declined"); } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-premium p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
            <Cookie className="h-5 w-5 text-[#005BFF]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-0.5">
              Мы используем файлы cookie
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Сайт использует cookie и аналогичные технологии для работы сервиса,
              аналитики и персонализации. Используя сайт, вы соглашаетесь с{" "}
              <Link href="/privacy" className="text-[#005BFF] hover:underline">
                Политикой конфиденциальности
              </Link>{" "}
              и{" "}
              <Link href="/terms" className="text-[#005BFF] hover:underline">
                Условиями использования
              </Link>
              . Данные обрабатываются в соответствии с ФЗ-152.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
          <button
            type="button"
            onClick={decline}
            className="text-xs text-gray-500 hover:text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Отклонить
          </button>
          <button
            type="button"
            onClick={accept}
            className="text-xs font-semibold text-white bg-gradient-to-r from-[#005BFF] to-[#0070ff] px-4 py-2 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
          >
            Принять всё
          </button>
          <button
            type="button"
            onClick={decline}
            title="Закрыть"
            className="h-7 w-7 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
