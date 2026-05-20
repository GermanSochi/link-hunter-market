import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Частые вопросы о нейросетях для России — Cursor, Midjourney, ChatGPT без VPN",
  description:
    "Ответы на 20+ вопросов: как купить Midjourney в России, чем заменить ChatGPT, какие ИИ работают без VPN, как оплатить Cursor AI картой РФ.",
  keywords: [
    "как купить midjourney россия",
    "chatgpt без vpn россия",
    "cursor ai оплата рублями",
    "нейросети без vpn 2026",
    "аналог chatgpt бесплатный",
    "deepseek vs chatgpt",
    "qwen alibaba россия",
  ],
  openGraph: {
    title: "FAQ: нейросети для россиян — ответы на частые вопросы",
    description: "Как купить Midjourney, Cursor, ChatGPT в России? Какие ИИ без VPN?",
    type: "article",
    locale: "ru_RU",
  },
};

const FAQ_GROUPS = [
  {
    group: "Доступность в России",
    items: [
      {
        q: "Какие нейросети работают в России без VPN в 2026 году?",
        a: "Без VPN в России работают: DeepSeek, YandexGPT 4, GigaChat Pro (от Сбера), Шедеврум, Kandinsky 3.1, Kling AI, Qwen (Alibaba), Kimi (Moonshot), Doubao (ByteDance), Zhipu GLM-4, Baidu ERNIE Bot и Stable Diffusion (локальный запуск). Это китайские и российские сервисы, которые не блокируют доступ из РФ.",
      },
      {
        q: "Чем заменить ChatGPT в России бесплатно?",
        a: "Лучшие бесплатные аналоги без VPN: DeepSeek (качество уровня GPT-4o), Qwen Plus от Alibaba (128K контекст), Kimi от Moonshot AI (отлично читает документы), Doubao от ByteDance. Из российских — YandexGPT 4 с бесплатным тарифом и GigaChat от Сбера.",
      },
      {
        q: "Какие ИИ требуют VPN в России?",
        a: "VPN требуют: ChatGPT / GPT-4o (OpenAI), Claude Pro (Anthropic), Gemini (Google), Midjourney, Runway Gen-3, Sora, HeyGen, Pika Labs, DALL-E 3, Adobe Firefly, Cursor AI, GitHub Copilot, Windsurf, JetBrains AI, Tabnine, Amazon Q, Ideogram. Большинство западных сервисов блокируют доступ с российских IP.",
      },
    ],
  },
  {
    group: "Оплата из России",
    items: [
      {
        q: "Как купить Midjourney в России картой?",
        a: "Midjourney блокирует карты РФ и требует зарубежную карту + VPN. Через наш сервис вы можете оформить подписку, оплатив через СБП или карту Мир в рублях. Менеджер свяжется в течение 15 минут и оформит доступ.",
      },
      {
        q: "Как оплатить Cursor AI из России?",
        a: "Cursor AI ($20/мес) требует иностранную карту. Через наш сервис можно оформить подписку в рублях — оплата картой Мир или СБП. Доступ через 30 минут после оплаты.",
      },
      {
        q: "Как купить ChatGPT Plus в России?",
        a: "ChatGPT Plus ($20/мес) не принимает российские карты. Варианты: 1) Через наш сервис — оплачиваете в рублях, мы оформляем доступ. 2) Виртуальная карта иностранного банка (Wise, Revolut). 3) Гифт-карты OpenAI через посредников.",
      },
      {
        q: "Какие ИИ принимают карты РФ напрямую?",
        a: "Карты РФ принимают: YandexGPT 4, GigaChat Pro, Шедеврум — напрямую через российские платёжные системы. Также принимают карты РФ: Qwen, Kimi, Doubao, GLM-4 (через международные платёжные системы Alipay/UnionPay, доступные в части банков РФ).",
      },
    ],
  },
  {
    group: "Сравнение сервисов",
    items: [
      {
        q: "DeepSeek или ChatGPT — что лучше?",
        a: "DeepSeek R1 сопоставим с GPT-4o по многим задачам, особенно в математике, коде и рассуждении. ChatGPT Plus ($20/мес) лучше в творческих задачах, понимании контекста диалога и плагинах. DeepSeek полностью бесплатен и работает без VPN — отличный выбор для большинства задач.",
      },
      {
        q: "Cursor AI или GitHub Copilot — что выбрать?",
        a: "Cursor AI ($20/мес) — лучший выбор для большинства разработчиков. Он понимает контекст всего проекта, имеет агентный режим, быстрое автодополнение. GitHub Copilot ($10/мес) дешевле и лучше интегрирован с GitHub, но слабее по контексту. Студентам — Copilot бесплатно.",
      },
      {
        q: "Какой ИИ лучший для генерации изображений в 2026?",
        a: "Для художественных работ — Midjourney (лучшее качество). Для фотореализма — Stable Diffusion XL. Для работы с текстом на картинках — Ideogram. Бесплатно без VPN — Kandinsky 3.1 (Сбер) или Шедеврум (Яндекс). Для дизайнеров с Photoshop — Adobe Firefly.",
      },
      {
        q: "Какой ИИ лучший для генерации видео?",
        a: "Runway Gen-3 — лучшее качество, но дорого и нужен VPN. Kling AI — работает без VPN, создаёт видео до 5 минут. Sora (OpenAI) — фотореализм. HeyGen — лучший для аватаров и перевода видео. Pika Labs — бюджетный вариант.",
      },
      {
        q: "Qwen vs DeepSeek — в чём разница?",
        a: "DeepSeek — силён в аналитике, математике и коде, есть режим «мышления» (Reasoning). Qwen Plus — лучше в многоязычных задачах, поддерживает изображения и имеет огромный контекст (1M токенов). Оба работают без VPN и бесплатны. Для кода — DeepSeek, для работы с документами — Qwen.",
      },
    ],
  },
  {
    group: "Технические вопросы",
    items: [
      {
        q: "Что такое «токены» в ИИ?",
        a: "Токен — минимальная единица текста (примерно 3–4 символа или одно короткое слово). 1 000 токенов ≈ 750 слов. 1 миллион токенов — примерно 5 толстых книг (750 000 слов). API-тарифы считаются за токены. Например, API DeepSeek стоит ~$0.27 за 1M input-токенов.",
      },
      {
        q: "Что такое «контекстное окно» ИИ?",
        a: "Контекстное окно — максимальный объём текста, который ИИ «помнит» за один диалог. Чем больше — тем лучше для работы с длинными документами. Claude Pro: 200K токенов (~150К слов). Qwen Plus: 1M токенов. ChatGPT-4o: 128K токенов. GPT-4o mini: 128K токенов.",
      },
      {
        q: "Как работает режим Reasoning (рассуждение) у DeepSeek и ChatGPT o1?",
        a: "Режим Reasoning — это когда ИИ сначала «думает» вслух, разбивая задачу на шаги, а потом даёт ответ. Это улучшает качество на сложных задачах: математика, логика, программирование. DeepSeek R1 использует этот режим бесплатно. ChatGPT o1/o3 — в рамках платного тарифа.",
      },
      {
        q: "Можно ли запустить нейросеть локально без интернета?",
        a: "Да. Stable Diffusion — для изображений (нужна видеокарта от 6 GB VRAM). Для текстовых моделей: Ollama + Llama 3 или DeepSeek-R1 (от 8B параметров — нужно ~16 GB RAM). Программа LM Studio упрощает локальный запуск. Открытые модели: Llama 3, Mistral, Gemma 2.",
      },
    ],
  },
];

function JsonLdFaq() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_GROUPS.flatMap((g) =>
      g.items.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      }))
    ),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-2xl bg-slate-800/50 border border-slate-700/40 overflow-hidden">
      <summary className="flex items-center justify-between gap-3 p-5 cursor-pointer list-none select-none hover:bg-slate-800 transition-colors">
        <h3 className="text-sm font-semibold text-white leading-snug">{q}</h3>
        <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 group-open:rotate-180 transition-transform duration-200" />
      </summary>
      <div className="px-5 pb-5">
        <p className="text-sm text-slate-400 leading-relaxed">{a}</p>
      </div>
    </details>
  );
}

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <JsonLdFaq />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back */}
        <Link
          href="/compare-ai"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ChevronLeft className="h-4 w-4" />
          Назад к сравнению
        </Link>

        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Частые вопросы
          </h1>
          <p className="text-slate-400 text-base">
            20+ ответов на вопросы о нейросетях для России — доступность, оплата, сравнение сервисов.
          </p>
        </div>

        {/* Groups */}
        <div className="space-y-10">
          {FAQ_GROUPS.map((group) => (
            <section key={group.group}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
                {group.group}
              </h2>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-slate-800/50 border border-slate-700/40 p-6 text-center">
          <p className="text-white font-semibold mb-2">Остались вопросы?</p>
          <p className="text-slate-400 text-sm mb-4">
            Наши менеджеры помогут с покупкой любой ИИ-подписки из России
          </p>
          <Link
            href="/compare-ai"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            Сравнить сервисы и купить
          </Link>
        </div>
      </div>
    </main>
  );
}
