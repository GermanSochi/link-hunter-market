import { NextRequest, NextResponse } from "next/server";

export const revalidate = 86400; // 24 часа

interface Keyword {
  query: string;
  frequency: "high" | "medium" | "low";
  competition: "low" | "medium" | "high";
  intent: "info" | "commercial";
  cluster: string;
}

// 100+ ключевых запросов по теме AI для россиян (Яндекс + Google)
const HARDCODED_KEYWORDS: Keyword[] = [
  // ── СРАВНЕНИЕ AI ──
  { query: "сравнение нейросетей", frequency: "high", competition: "medium", intent: "info", cluster: "compare" },
  { query: "какой ии лучше 2026", frequency: "high", competition: "medium", intent: "info", cluster: "compare" },
  { query: "лучшие ai сервисы россия", frequency: "high", competition: "high", intent: "commercial", cluster: "compare" },
  { query: "нейросети сравнение таблица", frequency: "medium", competition: "low", intent: "info", cluster: "compare" },
  { query: "топ нейросетей 2026", frequency: "high", competition: "medium", intent: "info", cluster: "compare" },
  { query: "рейтинг нейросетей россия", frequency: "medium", competition: "medium", intent: "info", cluster: "compare" },
  { query: "deepseek vs chatgpt", frequency: "high", competition: "medium", intent: "info", cluster: "compare" },
  { query: "chatgpt vs claude сравнение", frequency: "high", competition: "medium", intent: "info", cluster: "compare" },
  { query: "qwen vs deepseek", frequency: "medium", competition: "low", intent: "info", cluster: "compare" },
  { query: "cursor vs copilot какой лучше", frequency: "medium", competition: "medium", intent: "info", cluster: "compare" },

  // ── ЦЕНЫ ──
  { query: "сколько стоит chatgpt в рублях", frequency: "high", competition: "medium", intent: "commercial", cluster: "prices" },
  { query: "цена midjourney 2026", frequency: "high", competition: "medium", intent: "commercial", cluster: "prices" },
  { query: "сколько стоит cursor ai", frequency: "high", competition: "medium", intent: "commercial", cluster: "prices" },
  { query: "дешевые нейросети россия", frequency: "medium", competition: "low", intent: "commercial", cluster: "prices" },
  { query: "бесплатные ai сервисы список", frequency: "high", competition: "medium", intent: "info", cluster: "prices" },
  { query: "стоимость claude pro рублей", frequency: "medium", competition: "low", intent: "commercial", cluster: "prices" },
  { query: "github copilot цена россия", frequency: "medium", competition: "medium", intent: "commercial", cluster: "prices" },
  { query: "runway gen3 цена рублей", frequency: "medium", competition: "low", intent: "commercial", cluster: "prices" },
  { query: "heygen стоимость подписки", frequency: "medium", competition: "low", intent: "commercial", cluster: "prices" },
  { query: "нейросети цены 2026 рубли", frequency: "high", competition: "medium", intent: "commercial", cluster: "prices" },

  // ── РФ ДОСТУПНОСТЬ ──
  { query: "нейросети без vpn россия", frequency: "high", competition: "high", intent: "info", cluster: "russia_access" },
  { query: "ai работает в России", frequency: "high", competition: "medium", intent: "info", cluster: "russia_access" },
  { query: "аналоги chatgpt в рф", frequency: "high", competition: "high", intent: "info", cluster: "russia_access" },
  { query: "deepseek без vpn", frequency: "high", competition: "medium", intent: "info", cluster: "russia_access" },
  { query: "kling ai россия без vpn", frequency: "medium", competition: "low", intent: "info", cluster: "russia_access" },
  { query: "qwen alibaba россия", frequency: "medium", competition: "low", intent: "info", cluster: "russia_access" },
  { query: "chatgpt заблокирован россия", frequency: "high", competition: "medium", intent: "info", cluster: "russia_access" },
  { query: "нейросеть без регистрации россия", frequency: "medium", competition: "medium", intent: "info", cluster: "russia_access" },
  { query: "stable diffusion без vpn", frequency: "medium", competition: "low", intent: "info", cluster: "russia_access" },
  { query: "kimi moonshot россия", frequency: "low", competition: "low", intent: "info", cluster: "russia_access" },

  // ── VPN ──
  { query: "какие ai требуют vpn", frequency: "medium", competition: "low", intent: "info", cluster: "vpn" },
  { query: "как пользоваться midjourney из России", frequency: "high", competition: "medium", intent: "info", cluster: "vpn" },
  { query: "chatgpt через vpn", frequency: "high", competition: "medium", intent: "info", cluster: "vpn" },
  { query: "cursor ai без vpn возможно", frequency: "medium", competition: "low", intent: "info", cluster: "vpn" },
  { query: "лучший vpn для нейросетей", frequency: "high", competition: "high", intent: "commercial", cluster: "vpn" },
  { query: "runway без vpn россия", frequency: "medium", competition: "low", intent: "info", cluster: "vpn" },
  { query: "openai заблокирован россия обход", frequency: "high", competition: "medium", intent: "info", cluster: "vpn" },

  // ── ОПЛАТА ──
  { query: "купить chatgpt плюс россия", frequency: "high", competition: "high", intent: "commercial", cluster: "payment" },
  { query: "оплатить midjourney из рф", frequency: "high", competition: "high", intent: "commercial", cluster: "payment" },
  { query: "cursor ai оплата картой рф", frequency: "medium", competition: "medium", intent: "commercial", cluster: "payment" },
  { query: "купить нейросеть рублями", frequency: "high", competition: "high", intent: "commercial", cluster: "payment" },
  { query: "подписка ai через россию", frequency: "medium", competition: "medium", intent: "commercial", cluster: "payment" },
  { query: "midjourney оплата mir card", frequency: "medium", competition: "low", intent: "commercial", cluster: "payment" },
  { query: "купить claude pro россия", frequency: "medium", competition: "medium", intent: "commercial", cluster: "payment" },
  { query: "heygen купить рублями", frequency: "low", competition: "low", intent: "commercial", cluster: "payment" },
  { query: "chatgpt подписка для россиян", frequency: "high", competition: "high", intent: "commercial", cluster: "payment" },

  // ── СКИДКИ ──
  { query: "скидки на ai сервисы", frequency: "medium", competition: "medium", intent: "commercial", cluster: "deals" },
  { query: "акции нейросети 2026", frequency: "medium", competition: "low", intent: "commercial", cluster: "deals" },
  { query: "midjourney скидка студент", frequency: "low", competition: "low", intent: "commercial", cluster: "deals" },
  { query: "github copilot бесплатно студент", frequency: "medium", competition: "medium", intent: "commercial", cluster: "deals" },
  { query: "cursor бесплатная версия", frequency: "high", competition: "medium", intent: "commercial", cluster: "deals" },
  { query: "chatgpt бесплатный тариф", frequency: "high", competition: "medium", intent: "info", cluster: "deals" },

  // ── КОД ──
  { query: "ai для программирования россия", frequency: "high", competition: "medium", intent: "info", cluster: "code" },
  { query: "лучший ai для кода 2026", frequency: "high", competition: "medium", intent: "info", cluster: "code" },
  { query: "cursor ai обзор", frequency: "high", competition: "medium", intent: "info", cluster: "code" },
  { query: "windsurf codeium сравнение", frequency: "medium", competition: "low", intent: "info", cluster: "code" },
  { query: "github copilot альтернатива", frequency: "high", competition: "medium", intent: "info", cluster: "code" },
  { query: "tabnine vs copilot", frequency: "medium", competition: "low", intent: "info", cluster: "code" },
  { query: "jetbrains ai assistant", frequency: "medium", competition: "low", intent: "info", cluster: "code" },
  { query: "ai для python россия", frequency: "medium", competition: "medium", intent: "info", cluster: "code" },
  { query: "нейросеть пишет код бесплатно", frequency: "high", competition: "medium", intent: "info", cluster: "code" },
  { query: "deepseek для программирования", frequency: "medium", competition: "low", intent: "info", cluster: "code" },

  // ── ВИДЕО ──
  { query: "ai генерация видео россия", frequency: "high", competition: "medium", intent: "info", cluster: "video" },
  { query: "runway gen3 обзор", frequency: "medium", competition: "low", intent: "info", cluster: "video" },
  { query: "kling ai обзор", frequency: "medium", competition: "low", intent: "info", cluster: "video" },
  { query: "heygen аватар видео", frequency: "medium", competition: "low", intent: "commercial", cluster: "video" },
  { query: "нейросеть создание видео бесплатно", frequency: "high", competition: "medium", intent: "info", cluster: "video" },
  { query: "sora openai россия", frequency: "medium", competition: "medium", intent: "info", cluster: "video" },
  { query: "pika labs обзор", frequency: "low", competition: "low", intent: "info", cluster: "video" },
  { query: "лума дрим машин цена", frequency: "low", competition: "low", intent: "commercial", cluster: "video" },

  // ── ДИЗАЙН / ИЗОБРАЖЕНИЯ ──
  { query: "нейросеть для дизайна россия", frequency: "high", competition: "medium", intent: "info", cluster: "image" },
  { query: "midjourney обзор 2026", frequency: "high", competition: "medium", intent: "info", cluster: "image" },
  { query: "kandinsky 3 бесплатно", frequency: "medium", competition: "low", intent: "info", cluster: "image" },
  { query: "шедеврум яндекс обзор", frequency: "medium", competition: "low", intent: "info", cluster: "image" },
  { query: "stable diffusion установка", frequency: "high", competition: "medium", intent: "info", cluster: "image" },
  { query: "ideogram ai логотипы", frequency: "medium", competition: "low", intent: "commercial", cluster: "image" },
  { query: "dall-e 3 vs midjourney", frequency: "medium", competition: "medium", intent: "info", cluster: "image" },
  { query: "adobe firefly россия купить", frequency: "medium", competition: "medium", intent: "commercial", cluster: "image" },
  { query: "leonardo ai бесплатно", frequency: "medium", competition: "low", intent: "info", cluster: "image" },
  { query: "генератор изображений без vpn", frequency: "high", competition: "medium", intent: "info", cluster: "image" },

  // ── БИЗНЕС ──
  { query: "ai для бизнеса россия", frequency: "high", competition: "high", intent: "commercial", cluster: "business" },
  { query: "нейросети для маркетинга", frequency: "high", competition: "medium", intent: "commercial", cluster: "business" },
  { query: "chatgpt для работы", frequency: "high", competition: "medium", intent: "commercial", cluster: "business" },
  { query: "ai ассистент для продаж", frequency: "medium", competition: "medium", intent: "commercial", cluster: "business" },
  { query: "нейросеть для копирайтинга", frequency: "high", competition: "medium", intent: "commercial", cluster: "business" },
  { query: "ai для переводов россия", frequency: "medium", competition: "medium", intent: "commercial", cluster: "business" },
  { query: "gigachat бизнес тариф", frequency: "low", competition: "low", intent: "commercial", cluster: "business" },
  { query: "yandexgpt api интеграция", frequency: "medium", competition: "low", intent: "info", cluster: "business" },

  // ── ОБУЧЕНИЕ ──
  { query: "как пользоваться chatgpt новичок", frequency: "high", competition: "medium", intent: "info", cluster: "education" },
  { query: "deepseek обучение", frequency: "medium", competition: "low", intent: "info", cluster: "education" },
  { query: "prompt engineering курс", frequency: "high", competition: "high", intent: "commercial", cluster: "education" },
  { query: "нейросети для студентов", frequency: "medium", competition: "low", intent: "info", cluster: "education" },
  { query: "ai для написания текстов", frequency: "high", competition: "medium", intent: "info", cluster: "education" },

  // ── КИТАЙСКИЕ МОДЕЛИ ──
  { query: "qwen alibaba обзор", frequency: "medium", competition: "low", intent: "info", cluster: "china" },
  { query: "deepseek r1 что это", frequency: "high", competition: "medium", intent: "info", cluster: "china" },
  { query: "kimi moonshot обзор", frequency: "low", competition: "low", intent: "info", cluster: "china" },
  { query: "doubao bytedance нейросеть", frequency: "low", competition: "low", intent: "info", cluster: "china" },
  { query: "китайские нейросети без vpn", frequency: "high", competition: "medium", intent: "info", cluster: "china" },
  { query: "chatglm zhipu россия", frequency: "low", competition: "low", intent: "info", cluster: "china" },
  { query: "baidu ernie bot россия", frequency: "low", competition: "low", intent: "info", cluster: "china" },
];

interface GroupedKeywords {
  [cluster: string]: Keyword[];
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const cluster = url.searchParams.get("cluster");
  const intent = url.searchParams.get("intent") as Keyword["intent"] | null;
  const frequency = url.searchParams.get("frequency") as Keyword["frequency"] | null;
  const format = url.searchParams.get("format"); // "grouped" | "flat"
  const generateNew = url.searchParams.get("generate"); // Yandex GPT generation

  // Фильтрация
  let keywords = HARDCODED_KEYWORDS;
  if (cluster) keywords = keywords.filter((k) => k.cluster === cluster);
  if (intent) keywords = keywords.filter((k) => k.intent === intent);
  if (frequency) keywords = keywords.filter((k) => k.frequency === frequency);

  // Если запрошена генерация через Yandex GPT
  if (generateNew === "1") {
    const topic = url.searchParams.get("topic") ?? "нейросети россия";
    const generated = await generateKeywordsWithYandex(topic);
    return NextResponse.json({
      source: "yandex-gpt",
      topic,
      count: generated.length,
      keywords: generated,
    });
  }

  // Формат вывода
  if (format === "grouped") {
    const grouped: GroupedKeywords = {};
    for (const kw of keywords) {
      if (!grouped[kw.cluster]) grouped[kw.cluster] = [];
      grouped[kw.cluster].push(kw);
    }
    return NextResponse.json({
      source: "hardcoded",
      total: keywords.length,
      clusters: Object.keys(grouped).map((c) => ({
        name: c,
        count: grouped[c].length,
        keywords: grouped[c],
      })),
    });
  }

  // Flat list
  return NextResponse.json({
    source: "hardcoded",
    total: keywords.length,
    filters: { cluster, intent, frequency },
    keywords,
  });
}

async function generateKeywordsWithYandex(topic: string): Promise<Keyword[]> {
  const apiKey = process.env.YANDEX_API_KEY;
  const folderId = process.env.YANDEX_FOLDER_ID;

  if (!apiKey || !folderId) {
    // Fallback: возвращаем отфильтрованные хардкодные ключи
    return HARDCODED_KEYWORDS.filter((k) =>
      k.query.toLowerCase().includes(topic.toLowerCase().split(" ")[0])
    ).slice(0, 20);
  }

  try {
    const prompt = `Сгенерируй 20 поисковых запросов для Яндекса по теме "${topic}" в контексте AI-сервисов для россиян. Формат ответа — строго JSON массив объектов: [{"query": "...", "frequency": "high|medium|low", "competition": "low|medium|high", "intent": "info|commercial"}]. Только JSON, без пояснений.`;

    const response = await fetch(
      "https://llm.api.cloud.yandex.net/foundationModels/v1/completion",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Api-Key ${apiKey}`,
          "x-folder-id": folderId,
        },
        body: JSON.stringify({
          modelUri: `gpt://${folderId}/yandexgpt-lite/latest`,
          completionOptions: { stream: false, temperature: 0.4, maxTokens: 800 },
          messages: [
            { role: "system", text: "Ты — SEO-специалист по русскоязычному рынку. Отвечай только валидным JSON." },
            { role: "user", text: prompt },
          ],
        }),
        signal: AbortSignal.timeout(30_000),
      }
    );

    if (!response.ok) {
      throw new Error(`Yandex API ${response.status}`);
    }

    const data = await response.json();
    const text: string = data?.result?.alternatives?.[0]?.message?.text ?? "[]";

    // Извлекаем JSON из ответа
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON in Yandex response");

    const parsed = JSON.parse(jsonMatch[0]) as Partial<Keyword>[];
    return parsed
      .filter((k) => k.query)
      .map((k) => ({
        query: String(k.query),
        frequency: (["high", "medium", "low"].includes(k.frequency ?? "") ? k.frequency : "medium") as Keyword["frequency"],
        competition: (["low", "medium", "high"].includes(k.competition ?? "") ? k.competition : "medium") as Keyword["competition"],
        intent: (["info", "commercial"].includes(k.intent ?? "") ? k.intent : "info") as Keyword["intent"],
        cluster: "generated",
      }));
  } catch {
    // Fallback при ошибке Yandex
    return HARDCODED_KEYWORDS.slice(0, 20);
  }
}
