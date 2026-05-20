import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const ARTICLE_PROMPTS: Record<string, string> = {
  "лучшие-ai-россия":
    "Напиши SEO-статью на русском языке: «Лучшие AI-сервисы для России в 2026 году». Структура: H1 → краткое введение → таблица сервисов (Название | Категория | Цена | VPN нужен?) → H2 «Без VPN» → топ-5 списком → H2 «Нужен VPN но стоит того» → топ-5 → H2 «Как оплатить из РФ» → CTA «Сравнить все сервисы». Длина: 800–1000 слов. Ключевые слова: нейросети без vpn, аналог chatgpt россия, deepseek qwen бесплатно.",
  "аналоги-chatgpt":
    "Напиши SEO-статью: «7 лучших аналогов ChatGPT для россиян в 2026». Структура: H1 → введение (2 абзаца, почему ChatGPT недоступен) → 7 блоков каждый: H2 название → краткое описание → плюсы/минусы → цена → CTA кнопка. Финал: сравнительная таблица + CTA. 900–1100 слов. Ключи: chatgpt альтернатива, deepseek россия, yandexgpt отзывы.",
  "нейросети-без-vpn":
    "Напиши гайд: «Нейросети без VPN в России — полный список 2026». Структура: H1 → дата обновления → введение → H2 «Текстовые ИИ» список → H2 «Генераторы изображений» → H2 «Видео ИИ» → H2 «Кодинг» → FAQ (3 вопроса) → CTA. 700–900 слов. Ключи: нейросети без vpn, kling без vpn, deepseek скачать.",
  "midjourney-россия":
    "Напиши инструкцию: «Как купить и пользоваться Midjourney в России в 2026». Структура: H1 → введение (1 абзац) → H2 «Проблема с доступом» → H2 «Способы оплаты из РФ» (с нашим сервисом как вариант 1) → H2 «Пошаговая инструкция» → H2 «Цены и тарифы» → H2 «Альтернативы Midjourney без VPN» → CTA. 800–1000 слов.",
  "cursor-ai-россия":
    "Напиши гайд: «Cursor AI для российских разработчиков — цена, установка, оплата». H1 → введение → H2 «Что такое Cursor» → H2 «Cursor vs GitHub Copilot» (таблица сравнения) → H2 «Как оплатить из России» → H2 «Бесплатные альтернативы» (Windsurf, Codeium) → CTA → FAQ. 800–1000 слов. Ключи: cursor ai купить россия, windsurf codeium бесплатно.",
  "видео-нейросети":
    "Напиши обзор: «Лучшие ИИ для генерации видео в 2026 — Runway, Kling, Sora». H1 → введение → сравнительная таблица (Сервис | Цена | VPN | Длина видео | Качество) → 5 детальных обзоров каждый по: описание, цена, плюсы/минусы, кому подойдёт → H2 «Без VPN в России» → CTA. 900–1100 слов.",
  "deepseek-обзор":
    "Напиши обзор: «DeepSeek R1 — бесплатный ChatGPT из Китая для россиян». H1 → что это → история создания → H2 «Возможности» → H2 «DeepSeek vs ChatGPT» (таблица) → H2 «Как пользоваться в России» → H2 «Ограничения и цензура» → H2 «API для разработчиков» → CTA. 800–1000 слов.",
};

interface YandexGPTResponse {
  result?: {
    alternatives?: Array<{
      message?: {
        role?: string;
        text?: string;
      };
      status?: string;
    }>;
    usage?: {
      inputTextTokens?: number;
      completionTokens?: number;
    };
  };
  error?: {
    code?: number;
    message?: string;
  };
}

async function generateWithYandexGPT(prompt: string): Promise<string> {
  const apiKey = process.env.YANDEX_API_KEY;
  const folderId = process.env.YANDEX_FOLDER_ID;

  if (!apiKey || !folderId) {
    throw new Error("YANDEX_API_KEY or YANDEX_FOLDER_ID not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 55_000);

  try {
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
          completionOptions: {
            stream: false,
            temperature: 0.6,
            maxTokens: 3000,
          },
          messages: [
            {
              role: "system",
              text: "Ты — SEO-копирайтер. Пиши структурированные статьи на русском языке с заголовками H1/H2/H3 в формате Markdown. Включай ключевые слова естественно. Добавляй таблицы и списки где уместно.",
            },
            { role: "user", text: prompt },
          ],
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Yandex API error ${response.status}: ${text}`);
    }

    const data = (await response.json()) as YandexGPTResponse;

    if (data.error) {
      throw new Error(`Yandex GPT error: ${data.error.message}`);
    }

    const text = data.result?.alternatives?.[0]?.message?.text;
    if (!text) throw new Error("Empty response from Yandex GPT");

    return text;
  } finally {
    clearTimeout(timeout);
  }
}

function buildSlug(topic: string): string {
  return topic
    .toLowerCase()
    .replace(/[а-яё]/g, (c) => {
      const map: Record<string, string> = {
        а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh",
        з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
        п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
        ч: "ch", ш: "sh", щ: "shch", ы: "y", э: "e", ю: "yu", я: "ya",
      };
      return map[c] ?? c;
    })
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function POST(req: NextRequest) {
  // Только для ADMIN и SUPERADMIN
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { topic?: string; customPrompt?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { topic, customPrompt } = body;

  let prompt: string;
  let slug: string;
  let title: string;

  if (customPrompt && typeof customPrompt === "string") {
    if (customPrompt.length > 2000) {
      return NextResponse.json({ error: "customPrompt too long (max 2000 chars)" }, { status: 400 });
    }
    prompt = customPrompt;
    slug = `ai-article-${Date.now()}`;
    title = "AI-статья";
  } else if (topic && typeof topic === "string" && ARTICLE_PROMPTS[topic]) {
    prompt = ARTICLE_PROMPTS[topic];
    slug = buildSlug(topic);
    title = topic.replace(/-/g, " ");
  } else {
    return NextResponse.json(
      {
        error: "Specify a valid topic or customPrompt",
        availableTopics: Object.keys(ARTICLE_PROMPTS),
      },
      { status: 400 }
    );
  }

  try {
    const content = await generateWithYandexGPT(prompt);

    return NextResponse.json({
      success: true,
      slug,
      title,
      content,
      charCount: content.length,
      topic: topic ?? "custom",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[generate-seo]", message);

    if (message.includes("not configured")) {
      return NextResponse.json(
        { error: "Yandex API not configured. Set YANDEX_API_KEY and YANDEX_FOLDER_ID in .env.local" },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET — список доступных тем
export async function GET() {
  return NextResponse.json({
    availableTopics: Object.keys(ARTICLE_PROMPTS).map((key) => ({
      key,
      description: ARTICLE_PROMPTS[key].slice(0, 80) + "...",
    })),
    usage: {
      method: "POST",
      body: { topic: "лучшие-ai-россия" },
      orCustom: { customPrompt: "Напиши статью про..." },
    },
  });
}
