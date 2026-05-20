"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Trash2, Star, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface SellerProduct {
  id: string;
  title: string;
  slug: string;
  status: string;
  priceCents: number;
  salesCount: number;
  rating: number;
  category: string;
  isGold: boolean;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  DRAFT:               { label: "Черновик",    icon: <Clock size={12} />,        color: "text-gray-500 bg-gray-100" },
  PENDING_MODERATION:  { label: "На проверке", icon: <AlertCircle size={12} />,  color: "text-yellow-700 bg-yellow-100" },
  APPROVED:            { label: "Опубликован", icon: <CheckCircle size={12} />,  color: "text-green-700 bg-green-100" },
  REJECTED:            { label: "Отклонён",    icon: <XCircle size={12} />,      color: "text-red-700 bg-red-100" },
};

const CATEGORY_LABELS: Record<string, string> = {
  work: "Работа", study: "Учёба", home: "Дом", hobby: "Хобби", ai: "AI/Tech",
};

export default function SellerTab() {
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/seller/products");
    if (res.ok) {
      const data = await res.json();
      setProducts(data.products ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Удалить "${title}"?`)) return;
    setDeleting(id);
    const res = await fetch("/api/seller/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Товар удалён");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      setMessage(data.error ?? "Ошибка удаления");
    }
    setDeleting(null);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {loading ? "Загрузка..." : `${products.length} товар${products.length === 1 ? "" : products.length < 5 ? "а" : "ов"}`}
        </p>
        <Link
          href="/products/new"
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#005BFF] to-[#0070ff] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus size={15} />
          Загрузить товар
        </Link>
      </div>

      {message && (
        <div className="mb-3 p-2.5 bg-blue-50 text-blue-700 text-sm rounded-lg border border-blue-200">
          {message}
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-14">
          <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
            <Plus className="h-7 w-7 text-[#005BFF]" />
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">Нет товаров</p>
          <p className="text-xs text-gray-400 mb-4">Загрузите свой первый AI-инструмент или скрипт</p>
          <Link
            href="/products/new"
            className="inline-flex items-center gap-1.5 bg-[#005BFF] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus size={15} /> Загрузить товар
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-left">
                <th className="pb-2 pr-4 font-medium">Товар</th>
                <th className="pb-2 pr-4 font-medium">Статус</th>
                <th className="pb-2 pr-4 font-medium">Цена</th>
                <th className="pb-2 pr-4 font-medium">Продаж</th>
                <th className="pb-2 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const sc = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.DRAFT;
                return (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        {p.isGold && <Star size={13} className="text-yellow-500 fill-yellow-400 shrink-0" />}
                        <div>
                          <p className="font-medium text-gray-900 truncate max-w-[180px]">{p.title}</p>
                          <p className="text-xs text-gray-400">{CATEGORY_LABELS[p.category] ?? p.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${sc.color}`}>
                        {sc.icon} {sc.label}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-600">
                      {p.priceCents === 0 ? "Бесплатно" : `${(p.priceCents / 100).toFixed(0)} ₽`}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{p.salesCount}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/products/${p.slug}`}
                          className="text-xs text-[#005BFF] hover:underline"
                        >
                          Открыть
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.title)}
                          disabled={deleting === p.id}
                          className="flex items-center gap-0.5 text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
                        >
                          <Trash2 size={12} />
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
