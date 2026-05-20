"use client";

import { useState, useMemo } from "react";
import OzonProductCard, { OzonProduct } from "./OzonProductCard";
import { Sparkles, TrendingUp, Zap, PackageSearch, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const TICKER_FILTERS = [
  { id: "gpt",       label: "🤖 GPT-4 промпты",      category: "work"  },
  { id: "midjourney",label: "🎨 Midjourney гайды",    category: "hobby" },
  { id: "python",    label: "🐍 Python скрипты",      category: "work"  },
  { id: "suno",      label: "🎵 Suno AI паки",         category: "hobby" },
  { id: "home",      label: "🏠 Home Assistant",       category: "home"  },
  { id: "data",      label: "📊 Data Science",         category: "study" },
  { id: "telegram",  label: "🤖 Telegram боты",        category: "work"  },
  { id: "diffusion", label: "🎬 Stable Diffusion",     category: "hobby" },
  { id: "email",     label: "📧 Email автоматизация",  category: "work"  },
  { id: "seo",       label: "🔍 SEO AI-анализ",        category: "work"  },
];

function SectionHeader({
  icon: Icon, title, subtitle,
}: {
  icon: React.ElementType; title: string; subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        <div className="h-8 w-8 rounded-xl bg-gradient-blue flex items-center justify-center shadow-sm">
          <Icon className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900">{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-gray-500 ml-11">{subtitle}</p>}
    </div>
  );
}

interface Props {
  products: OzonProduct[];
  hasInterests: boolean;
  interests: string[];
  isLoggedIn: boolean;
}

export default function ProductFeed({ products, hasInterests, interests, isLoggedIn }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleFilter = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const clearFilters = () => setSelectedIds([]);

  // derive which categories the selected filters map to
  const activeCats = useMemo(() => {
    if (selectedIds.length === 0) return null;
    const cats = new Set(
      TICKER_FILTERS.filter((f) => selectedIds.includes(f.id)).map((f) => f.category)
    );
    return cats;
  }, [selectedIds]);

  const filtered = useMemo(() => {
    if (activeCats) {
      return products.filter((p) => p.category && activeCats.has(p.category));
    }
    return products;
  }, [products, activeCats]);

  const gold = filtered.filter((p) => p.isGold).slice(0, 5);
  const trending = filtered.filter((p) => !p.isGold).slice(0, 10);
  const rest = filtered.filter((p) => !p.isGold).slice(10);

  const CATEGORY_LABELS: Record<string, string> = {
    work: "Работа", study: "Учёба", home: "Дом", hobby: "Хобби", ai: "AI/Tech",
  };

  return (
    <div className="space-y-8">
      {/* Combined scrolling ticker + filter strip */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-r from-[#f7f8fc] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-l from-[#f7f8fc] to-transparent" />

        {/* Strip */}
        <div className="border-y border-gray-200/70 bg-white/90 backdrop-blur-sm py-2.5 overflow-hidden">
          <div className="flex gap-2 w-max animate-ticker px-4">
            {[...TICKER_FILTERS, ...TICKER_FILTERS].map((item, idx) => {
              const active = selectedIds.includes(item.id);
              return (
                <button
                  key={`${item.id}-${idx}`}
                  type="button"
                  onClick={() => toggleFilter(item.id)}
                  className={cn(
                    "flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold",
                    "border transition-all duration-200 whitespace-nowrap",
                    active
                      ? "bg-green-50 border-green-400 text-green-700 shadow-sm scale-105"
                      : "bg-gray-50/80 border-gray-200 text-gray-500 hover:border-[#005BFF]/40 hover:text-[#005BFF] hover:bg-blue-50/50"
                  )}
                >
                  {item.label}
                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset chip — only when active */}
        {selectedIds.length > 0 && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2 z-20">
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm hover:bg-red-600 transition-colors"
            >
              <X className="h-3 w-3" />
              Сбросить
            </button>
          </div>
        )}
      </div>

      {/* Interests bar (only when logged in and no ticker filter) */}
      {isLoggedIn && !activeCats && (
        <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <Zap className="h-4 w-4 text-[#005BFF] shrink-0" />
            {hasInterests ? (
              <>
                <span className="text-sm text-gray-600">Лента по интересам:</span>
                {interests.map((cat) => (
                  <span key={cat} className="text-xs bg-blue-50 text-[#005BFF] font-medium px-2.5 py-1 rounded-full">
                    {CATEGORY_LABELS[cat] ?? cat}
                  </span>
                ))}
              </>
            ) : (
              <span className="text-sm text-gray-500">Показываем всё — настройте ленту под себя</span>
            )}
          </div>
          <Link href="/settings/interests" className="shrink-0 text-xs text-[#005BFF] hover:underline font-medium">
            {hasInterests ? "Изменить" : "Настроить"}
          </Link>
        </div>
      )}

      {/* Products */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <PackageSearch className="h-8 w-8 text-[#005BFF]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ничего не найдено
          </h3>
          <p className="text-sm text-gray-500 max-w-xs mb-5">
            По выбранным фильтрам товаров пока нет. Попробуйте другую категорию.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#005BFF] to-[#0070ff] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 shadow-sm"
          >
            Показать всё
          </button>
        </div>
      ) : (
        <>
          {gold.length > 0 && (
            <section>
              <SectionHeader
                icon={Sparkles}
                title="Gold продукты"
                subtitle="Лучшее по голосам сообщества"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {gold.map((product, i) => (
                  <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <OzonProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {trending.length > 0 && (
            <section>
              <SectionHeader
                icon={TrendingUp}
                title="Популярное сейчас"
                subtitle="AI-инструменты, скрипты и шаблоны с высоким рейтингом"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {trending.map((product, i) => (
                  <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 45}ms` }}>
                    <OzonProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {rest.length > 0 && (
            <section>
              <SectionHeader icon={Zap} title="Ещё продукты" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {rest.map((product, i) => (
                  <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
                    <OzonProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
