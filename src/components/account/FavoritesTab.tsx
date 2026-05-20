"use client";

import { Heart } from "lucide-react";
import OzonProductCard, { OzonProduct } from "@/components/OzonProductCard";

// Подключи к реальному backend: localStorage / БД favourites
const MOCK_FAVORITES: OzonProduct[] = [
  {
    id: "f1", slug: "gpt-resume-assistant", title: "GPT-Ассистент для резюме",
    priceCents: 49900, oldPriceCents: 69900, rating: 4.8, reviewCount: 312,
    image: "https://picsum.photos/seed/gpt-resume/300/300", category: "work",
  },
  {
    id: "f2", slug: "midjourney-style-guide", title: "Гайд Midjourney v6: 200 стилей с промптами",
    priceCents: 14900, oldPriceCents: 24900, rating: 4.9, reviewCount: 2104,
    image: "https://picsum.photos/seed/midjourney-guide/300/300", category: "hobby",
  },
  {
    id: "f3", slug: "python-data-pack", title: "Курс Python для Data Science с AI-решениями",
    priceCents: 99900, oldPriceCents: 149900, rating: 4.9, reviewCount: 2871,
    image: "https://picsum.photos/seed/python-ds/300/300", category: "study",
  },
];

export default function FavoritesTab() {
  if (MOCK_FAVORITES.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Heart className="h-12 w-12 text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">Список избранного пуст</p>
        <p className="text-sm text-gray-400 mt-1">Нажимайте ♥ на карточках товаров</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {MOCK_FAVORITES.map((p) => (
        <OzonProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
