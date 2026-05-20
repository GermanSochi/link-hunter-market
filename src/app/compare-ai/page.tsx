import type { Metadata } from "next";
import { Suspense } from "react";
import { buildHardcodedServices } from "@/data/ai-services";
import CompareClient from "./CompareClient";
import Link from "next/link";
import { HelpCircle, BookOpen, ArrowRight } from "lucide-react";

// ── SEO Metadata ─────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "ИИ Сравни — Цены на нейросети в рублях | 30+ сервисов без VPN и с картой РФ",
  description:
    "Первый агрегатор ИИ в России. Сравните 30+ нейросетей: ChatGPT, Midjourney, Cursor, DeepSeek, Qwen, Kimi. Цены в рублях, что работает без VPN, как оплатить картой РФ.",
  keywords: [
    "аналог chatgpt россия",
    "нейросети без vpn",
    "midjourney купить россия",
    "cursor ai оплата рф",
    "ai без впн",
    "нейросети для россиян",
    "chatgpt альтернатива",
    "купить подписку нейросеть рублях",
    "runway midjourney цена рублях",
    "yandexgpt gigachat сравнение",
    "qwen alibaba россия",
    "deepseek бесплатный",
    "китайские нейросети без vpn",
    "windsurf cursor сравнение",
    "heygen аватар видео",
  ],
  openGraph: {
    title: "ИИ Сравни — 30+ нейросетей для россиян",
    description: "Цены на ИИ-подписки в рублях. Что работает без VPN? Как оплатить из РФ?",
    type: "website",
    locale: "ru_RU",
  },
  alternates: {
    types: { "application/rss+xml": "/rss.xml" },
  },
};

// ── JSON-LD schema.org ItemList ───────────────────────────────────────────

function JsonLd({ items }: { items: { name: string; url: string; position: number }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Сравнение ИИ-сервисов для России 2026",
    description: "Топ нейросетей с ценами в рублях",
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      url: item.url,
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

// ── Fetch данных на сервере ───────────────────────────────────────────────
async function getCompareData() {
  try {
    const res = await fetch("https://cbr-xml-daily.ru/daily_json.js", {
      next: { revalidate: 43200 },
    });
    const usdRate: number = res.ok ? (await res.json())?.Valute?.USD?.Value ?? 92 : 92;
    const items = buildHardcodedServices(usdRate);
    return { items, usdRate };
  } catch {
    const usdRate = 92;
    return { items: buildHardcodedServices(usdRate), usdRate };
  }
}

// ── Компонент Hero ────────────────────────────────────────────────────────
function Hero({ usdRate }: { usdRate: number }) {
  return (
    <div className="py-10 md:py-12">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-slate-400 text-xs mb-5">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        Курс ЦБ РФ: <span className="text-white font-semibold tabular-nums">{usdRate.toFixed(2)} ₽/$</span>
        <span className="text-slate-600">· Обновлено сегодня</span>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold text-white tracking-tight leading-tight mb-3">
        ИИ Рейтинг для России
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400 mt-1">
          Без VPN. Цены в рублях.
        </span>
      </h1>
      <p className="text-slate-500 text-base max-w-lg leading-relaxed">
        30+ нейросетей: ChatGPT, Midjourney, Cursor, DeepSeek, Qwen и другие.
        Официальная цена в долларах, перевод в рубли по курсу ЦБ РФ с учётом комиссии посредника.
      </p>
    </div>
  );
}

// ── Блоки-ссылки на смежные разделы ──────────────────────────────────────
function RelatedLinks() {
  return (
    <section className="mt-12 mb-10 grid sm:grid-cols-2 gap-4">
      <Link
        href="/compare-ai/faq"
        className="group flex items-start gap-4 rounded-2xl bg-slate-800/50 border border-slate-700/40 hover:border-blue-500/50 hover:bg-slate-800 p-5 transition-all duration-200"
      >
        <div className="shrink-0 h-10 w-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
          <HelpCircle className="h-5 w-5 text-blue-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Частые вопросы</h3>
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Как купить Midjourney, Cursor и ChatGPT из России? Что работает без VPN?
          </p>
        </div>
      </Link>

      <Link
        href="/blog"
        className="group flex items-start gap-4 rounded-2xl bg-slate-800/50 border border-slate-700/40 hover:border-violet-500/50 hover:bg-slate-800 p-5 transition-all duration-200"
      >
        <div className="shrink-0 h-10 w-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-violet-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Гиды и статьи</h3>
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Гиды по нейросетям для россиян, сравнения, лайфхаки и советы по использованию ИИ.
          </p>
        </div>
      </Link>
    </section>
  );
}

// ── Главная страница ──────────────────────────────────────────────────────
export default async function CompareAIPage() {
  const { items, usdRate } = await getCompareData();

  const jsonLdItems = items.slice(0, 10).map((item, i) => ({
    name: item.name,
    url: `https://masmarket.vercel.app/compare-ai/${item.slug}`,
    position: i + 1,
  }));

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <JsonLd items={jsonLdItems} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero usdRate={usdRate} />

        <Suspense fallback={<div className="h-96 flex items-center justify-center text-slate-500">Загрузка...</div>}>
          <CompareClient initialItems={items} usdRate={usdRate} />
        </Suspense>

        <RelatedLinks />
      </div>
    </main>
  );
}
