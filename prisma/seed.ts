import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const sellers = [
  { email: "alexk@aimarket.dev", name: "Алексей Козлов", username: "alexk_dev", rating: 4.8, karma: 120 },
  { email: "marina_ai@aimarket.dev", name: "Марина Ибрагимова", username: "marina_ai", rating: 4.6, karma: 85 },
  { email: "dmitry_pro@aimarket.dev", name: "Дмитрий Верещагин", username: "dmitry_pro", rating: 4.9, karma: 200 },
  { email: "asel_kz@aimarket.dev", name: "Асель Нурланова", username: "asel_kz", rating: 4.3, karma: 60 },
  { email: "rustam_uz@aimarket.dev", name: "Рустам Юсупов", username: "rustam_uz", rating: 4.7, karma: 95 },
];

const products = [
  // Работа
  {
    title: "GPT-Ассистент для резюме",
    slug: "gpt-resume-assistant",
    description: "Автоматически улучшает ваше резюме под вакансию. Анализирует требования и адаптирует текст за 30 секунд.",
    category: "work",
    priceCents: 49900,
    type: "PAID" as const,
    aiModel: "GPT-4o",
    trialUrl: "https://demo.aimarket.dev/resume",
    tags: ["резюме", "HR", "карьера"],
    rating: 4.8,
    salesCount: 312,
    sellerIdx: 0,
  },
  {
    title: "Email-автоответчик на Python",
    slug: "python-email-autoresponder",
    description: "Скрипт на Python для автоматических ответов на входящие письма с классификацией по теме.",
    category: "work",
    priceCents: 29900,
    type: "PAID" as const,
    aiModel: "GPT-3.5",
    tags: ["python", "email", "автоматизация"],
    rating: 4.5,
    salesCount: 189,
    sellerIdx: 2,
  },
  {
    title: "Шаблоны коммерческих предложений",
    slug: "commercial-proposals-templates",
    description: "15 готовых шаблонов КП в DOCX. Просто подставьте данные — и отправляйте клиентам.",
    category: "work",
    priceCents: 19900,
    type: "PAID" as const,
    tags: ["документы", "бизнес", "шаблоны"],
    rating: 4.3,
    salesCount: 540,
    sellerIdx: 1,
  },
  {
    title: "Таймер Помодоро — CLI",
    slug: "pomodoro-cli-timer",
    description: "Простой таймер Помодоро для терминала. Bash-скрипт, работает на Linux/macOS/WSL.",
    category: "work",
    priceCents: 0,
    type: "FREE" as const,
    tags: ["продуктивность", "bash", "таймер"],
    rating: 4.7,
    salesCount: 0,
    sellerIdx: 3,
  },

  // Учёба
  {
    title: "Флэш-карточки по английскому (Anki)",
    slug: "english-anki-flashcards",
    description: "5000 карточек Anki с примерами из фильмов и книг. Уровни A1–C1. Обновляется каждый месяц.",
    category: "study",
    priceCents: 39900,
    type: "PAID" as const,
    tags: ["английский", "anki", "словарный запас"],
    rating: 4.9,
    salesCount: 820,
    sellerIdx: 1,
  },
  {
    title: "Конспекты по математике (ЕГЭ 2025)",
    slug: "math-ege-2025-notes",
    description: "Структурированные конспекты по всем темам ЕГЭ по математике. PDF + Mind-map.",
    category: "study",
    priceCents: 24900,
    type: "PAID" as const,
    tags: ["ЕГЭ", "математика", "конспекты"],
    rating: 4.6,
    salesCount: 410,
    sellerIdx: 4,
  },
  {
    title: "Генератор тестов по Python",
    slug: "python-quiz-generator",
    description: "Скрипт, который создаёт тесты по любой теме Python. Использует GPT для генерации вопросов.",
    category: "study",
    priceCents: 0,
    type: "FREE" as const,
    aiModel: "GPT-4o-mini",
    trialUrl: "https://demo.aimarket.dev/quiz",
    tags: ["python", "тесты", "обучение"],
    rating: 4.4,
    salesCount: 0,
    sellerIdx: 2,
  },

  // Дом
  {
    title: "Планировщик бюджета (Google Sheets)",
    slug: "budget-planner-sheets",
    description: "Готовая таблица Google Sheets для планирования семейного бюджета. Графики, категории, прогноз.",
    category: "home",
    priceCents: 14900,
    type: "PAID" as const,
    tags: ["финансы", "google sheets", "бюджет"],
    rating: 4.7,
    salesCount: 670,
    sellerIdx: 0,
  },
  {
    title: "AI-рецепты из холодильника",
    slug: "ai-fridge-recipes",
    description: "Телеграм-бот: сфотографируй холодильник — получи рецепт. Исходный код бота на Python.",
    category: "home",
    priceCents: 59900,
    type: "PAID" as const,
    aiModel: "GPT-4o Vision",
    trialUrl: "https://t.me/aifridge_demo_bot",
    tags: ["telegram bot", "python", "рецепты", "кулинария"],
    rating: 4.9,
    salesCount: 203,
    sellerIdx: 2,
  },
  {
    title: "Список покупок — Notion шаблон",
    slug: "shopping-list-notion",
    description: "Умный шаблон Notion для списка покупок с категориями, ценами и автосуммой.",
    category: "home",
    priceCents: 0,
    type: "FREE" as const,
    tags: ["notion", "список покупок", "шаблон"],
    rating: 4.5,
    salesCount: 0,
    sellerIdx: 3,
  },

  // Хобби
  {
    title: "Генератор идей для фото (ИИ)",
    slug: "ai-photo-ideas-generator",
    description: "Вводишь стиль и тему — получаешь 10 идей для съёмки. Промпты для Midjourney и Stable Diffusion.",
    category: "hobby",
    priceCents: 34900,
    type: "PAID" as const,
    aiModel: "GPT-4o + Midjourney",
    trialUrl: "https://demo.aimarket.dev/photo-ideas",
    tags: ["фотография", "midjourney", "промпты"],
    rating: 4.6,
    salesCount: 287,
    sellerIdx: 1,
  },
  {
    title: "Табы для гитары — скрипт парсера",
    slug: "guitar-tabs-parser",
    description: "Python-скрипт для скачивания и форматирования гитарных табулатур в PDF.",
    category: "hobby",
    priceCents: 19900,
    type: "PAID" as const,
    tags: ["гитара", "python", "музыка"],
    rating: 4.2,
    salesCount: 91,
    sellerIdx: 4,
  },
  {
    title: "Трекер тренировок — Excel",
    slug: "workout-tracker-excel",
    description: "Excel-таблица для отслеживания тренировок: веса, повторения, прогресс за месяц.",
    category: "hobby",
    priceCents: 0,
    type: "FREE" as const,
    tags: ["фитнес", "excel", "тренировки"],
    rating: 4.8,
    salesCount: 0,
    sellerIdx: 0,
  },
];

async function main() {
  console.log("🌱 Сидирование базы данных...");

  // Очистка (в обратном порядке FK)
  await prisma.postVote.deleteMany();
  await prisma.productVote.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.userInterest.deleteMany();
  await prisma.post.deleteMany();
  await prisma.review.deleteMany();
  await prisma.order.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.product.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.karmaEvent.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();

  // Создание продавцов
  const hash = await bcrypt.hash("password123", 10);
  const createdSellers = await Promise.all(
    sellers.map((s) =>
      prisma.user.create({
        data: {
          email: s.email,
          name: s.name,
          username: s.username,
          passwordHash: hash,
          role: "SELLER",
          rating: s.rating,
          karma: s.karma,
          balanceCoins: Math.floor(Math.random() * 50000) + 5000,
          salesSum: Math.floor(Math.random() * 500000) + 10000,
        },
      })
    )
  );

  console.log(`✅ Создано ${createdSellers.length} продавцов`);

  // Создание продуктов
  const createdProducts = await Promise.all(
    products.map((p) =>
      prisma.product.create({
        data: {
          sellerId: createdSellers[p.sellerIdx].id,
          title: p.title,
          slug: p.slug,
          description: p.description,
          category: p.category,
          priceCents: p.priceCents,
          type: p.type,
          status: "APPROVED",
          aiModel: p.aiModel ?? null,
          trialUrl: p.trialUrl ?? null,
          tags: p.tags,
          rating: p.rating,
          salesCount: p.salesCount,
          images: JSON.stringify([
            { url: `https://picsum.photos/seed/${p.slug}/400/300`, alt: p.title },
          ]),
        },
      })
    )
  );

  console.log(`✅ Создано ${createdProducts.length} продуктов`);

  // Тестовый покупатель
  await prisma.user.create({
    data: {
      email: "test@aimarket.dev",
      name: "Тестовый Пользователь",
      username: "testuser",
      passwordHash: hash,
      role: "USER",
      balanceCoins: 100000,
    },
  });

  console.log("✅ Создан тестовый пользователь: test@aimarket.dev / password123");

  // SUPERADMIN German
  const superadminHash = await bcrypt.hash("r00tr00t", 12);
  await prisma.user.create({
    data: {
      email: "german@aimarket.dev",
      name: "German",
      username: "German",
      passwordHash: superadminHash,
      role: "SUPERADMIN",
      balanceCoins: 0,
      isActive: true,
      karma: 9999,
    },
  });

  console.log("✅ Создан SUPERADMIN: german@aimarket.dev / r00tr00t");
  console.log("🎉 Сидирование завершено!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
