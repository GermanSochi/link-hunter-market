"use client";

import { Download, Package } from "lucide-react";

export type OrderItem = {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  productSlug: string;
  amountCoins: number;
  status: string;
  createdAt: string;
};

export default function OrdersTab({ orders }: { orders: OrderItem[] }) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Package className="h-12 w-12 text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">Покупок пока нет</p>
        <p className="text-sm text-gray-400 mt-1">Найдите AI-инструменты в каталоге</p>
        <a href="/products" className="mt-4 px-4 py-2 bg-[#005BFF] text-white text-sm font-medium rounded-lg hover:bg-[#004DE0] transition-colors">
          В каталог
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
          {/* Картинка */}
          <div className="h-14 w-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={order.productImage}
              alt={order.productTitle}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Инфо */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#242424] line-clamp-1">{order.productTitle}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(order.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
              {" · "}
              <span className={order.status === "COMPLETED" ? "text-green-600" : "text-amber-500"}>
                {order.status === "COMPLETED" ? "Выполнен" : order.status === "FUNDED" ? "Оплачен" : order.status}
              </span>
            </p>
          </div>

          {/* Сумма */}
          <div className="hidden sm:block text-sm font-semibold text-gray-700 shrink-0">
            {order.amountCoins.toLocaleString("ru-RU")} ₽
          </div>

          {/* Кнопка */}
          <a
            href={`/product/${order.productId}`}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#005BFF] text-white text-xs font-semibold rounded-lg hover:bg-[#004DE0] transition-colors shrink-0"
          >
            <Download className="h-3.5 w-3.5" />
            Получить доступ
          </a>
        </div>
      ))}
    </div>
  );
}
