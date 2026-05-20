import { NextRequest, NextResponse } from "next/server";
import type { AIItem, AICategory, CompareApiResponse } from "@/types/ai-compare";
import { buildHardcodedServices } from "@/data/ai-services";

export const revalidate = 43200; // 12 часов ISR

// ── Центробанк РФ ──────────────────────────────────────────────────────────
async function fetchUsdRate(): Promise<number> {
  try {
    const res = await fetch("https://cbr-xml-daily.ru/daily_json.js", {
      next: { revalidate: 43200 },
    });
    if (!res.ok) throw new Error("CBR error");
    const data = await res.json();
    const rate: number = data?.Valute?.USD?.Value;
    if (!rate || rate < 50) throw new Error("bad rate");
    return rate;
  } catch {
    return 92; // fallback
  }
}

// ── OpenRouter моделей ──────────────────────────────────────────────────────
interface ORModel {
  id: string;
  name: string;
  pricing?: { prompt?: string; completion?: string };
  context_length?: number;
  description?: string;
}

async function fetchOpenRouterModels(): Promise<ORModel[]> {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      headers: { "HTTP-Referer": "https://masmarket.vercel.app" },
      next: { revalidate: 43200 },
    });
    if (!res.ok) throw new Error("OR error");
    const data = await res.json();
    return (data?.data ?? []) as ORModel[];
  } catch {
    return [];
  }
}

function normalizePowerLabel(score: number): AIItem["powerLabel"] {
  if (score >= 90) return "Супер-интеллект";
  if (score >= 70) return "Продвинутый";
  return "Базовый";
}

// Сортировка: сначала без VPN, потом по powerScore desc
function sortItems(items: AIItem[]): AIItem[] {
  return [...items].sort((a, b) => {
    if (a.rfpStatus === "ru_ok" && b.rfpStatus !== "ru_ok") return -1;
    if (a.rfpStatus !== "ru_ok" && b.rfpStatus === "ru_ok") return 1;
    return b.powerScore - a.powerScore;
  });
}

// OpenRouter → AIItem
function orModelToAIItem(model: ORModel, usdRate: number, now: string): AIItem | null {
  const promptPrice = parseFloat(model.pricing?.prompt ?? "0");
  const completionPrice = parseFloat(model.pricing?.completion ?? "0");
  if (!promptPrice && !completionPrice) return null;

  // Цена за 1 млн токенов (среднее prompt+completion) в рублях
  const avgUsd = (promptPrice + completionPrice) / 2;
  const tokenPriceRUB = parseFloat((avgUsd * 1_000_000 * usdRate).toFixed(2));

  const name = model.name ?? model.id;
  const isRussian = /yandex|sber|gigachat|mistral.*ru/i.test(model.id);
  const isChinese = /deepseek|qwen|baidu/i.test(model.id);
  const rfpStatus: AIItem["rfpStatus"] = isRussian || isChinese ? "ru_ok" : "vpn_required";
  const paymentStatus: AIItem["paymentStatus"] = isRussian ? "ru_cards" : "foreign_only";

  // powerScore эвристика по контексту и цене
  const ctx = model.context_length ?? 8000;
  const powerScore = Math.min(
    95,
    Math.max(30, 50 + Math.log10(ctx) * 8 - Math.min(tokenPriceRUB / 200, 30))
  );

  return {
    id: `or-${model.id}`,
    name,
    slug: model.id.replace(/[^a-z0-9]/gi, "-").toLowerCase(),
    category: "text" as AICategory,
    hasFreeTier: false,
    officialPriceUSD: 0,
    monthlyPriceRUB: 0,
    tokenPriceRUB,
    rfpStatus,
    paymentStatus,
    powerScore: Math.round(powerScore),
    powerLabel: normalizePowerLabel(powerScore),
    bestFor: "API для разработчиков",
    tooltip: model.description?.slice(0, 200) ?? `Модель ${name} через OpenRouter API`,
    features: [`Контекст: ${(ctx / 1000).toFixed(0)}K токенов`],
    pros: ["API-доступ", "Оплата токенами"],
    cons: ["Только для разработчиков"],
    logoUrl: "/logos/openrouter.svg",
    isPopular: false,
    isBestChoice: false,
    isRussian,
    source: "api" as const,
    updatedAt: now,
  };
}

// ── Главный handler ─────────────────────────────────────────────────────────
export async function GET(req: NextRequest): Promise<NextResponse<CompareApiResponse>> {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get("category") as AICategory | "all" | null;
  const freeOnly = searchParams.get("free") === "true";
  const rfOnly = searchParams.get("rf") === "true";
  const apiOnly = searchParams.get("api") === "true"; // только OR-модели

  const now = new Date().toISOString();

  const [usdRate, orModels] = await Promise.all([
    fetchUsdRate(),
    apiOnly ? fetchOpenRouterModels() : Promise.resolve([]),
  ]);

  // Хардкод-сервисы
  const hardcoded = buildHardcodedServices(usdRate);

  // OpenRouter-модели (только когда нужны для dev-режима)
  const apiItems: AIItem[] = orModels
    .map((m) => orModelToAIItem(m, usdRate, now))
    .filter((x): x is AIItem => x !== null)
    .slice(0, 30); // берём топ-30 чтобы не перегружать

  let items: AIItem[] = [...hardcoded, ...apiItems];

  // Фильтрация
  if (category && category !== "all") {
    items = items.filter((i) => i.category === category);
  }
  if (freeOnly) {
    items = items.filter((i) => i.hasFreeTier);
  }
  if (rfOnly) {
    items = items.filter((i) => i.rfpStatus === "ru_ok");
  }

  items = sortItems(items);

  return NextResponse.json({ items, usdRate, updatedAt: now });
}
