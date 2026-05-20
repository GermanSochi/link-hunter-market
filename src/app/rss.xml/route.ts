import { NextResponse } from "next/server";
import { buildHardcodedServices } from "@/data/ai-services";

export const revalidate = 43200;

async function getUsdRate(): Promise<number> {
  try {
    const res = await fetch("https://cbr-xml-daily.ru/daily_json.js", { next: { revalidate: 43200 } });
    if (!res.ok) return 92;
    return (await res.json())?.Valute?.USD?.Value ?? 92;
  } catch {
    return 92;
  }
}

export async function GET() {
  const usdRate = await getUsdRate();
  const items = buildHardcodedServices(usdRate);
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://masmarket.vercel.app";
  const now = new Date().toUTCString();

  const rssItems = items
    .map(
      (item) => `
    <item>
      <title><![CDATA[${item.name} — ${item.monthlyPriceRUB > 0 ? `${item.monthlyPriceRUB.toLocaleString("ru")} ₽/мес` : "Бесплатно"} | Актуальная цена ${new Date().toLocaleDateString("ru")}]]></title>
      <link>${siteUrl}/compare-ai/${item.slug}</link>
      <description><![CDATA[${item.bestFor}. ${item.rfpStatus === "ru_ok" ? "✅ Без VPN." : "🌐 Нужен VPN."} ${item.paymentStatus === "ru_cards" ? "💳 Карты РФ." : "❌ Зарубежная карта — оплатим за вас."} Цена: ${item.monthlyPriceRUB > 0 ? `${item.monthlyPriceRUB.toLocaleString("ru")} ₽/мес` : "Бесплатно"}.]]></description>
      <pubDate>${now}</pubDate>
      <guid isPermaLink="true">${siteUrl}/compare-ai/${item.slug}</guid>
      <category>${item.category}</category>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ИИ Сравни — Цены на нейросети в рублях</title>
    <link>${siteUrl}/compare-ai</link>
    <description>Актуальные цены на ИИ-подписки для россиян: ChatGPT, Midjourney, Cursor AI, DeepSeek, YandexGPT и другие нейросети в рублях.</description>
    <language>ru</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=43200, stale-while-revalidate=86400",
    },
  });
}
