import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Сидирование базы данных для Link Hunter Market...");

  // Очистка (в обратном порядке FK)
  await prisma.exchangeRequest.deleteMany();
  await prisma.userAccess.deleteMany();
  await prisma.subscription.deleteMany();
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

  // Создание админа (German)
  const adminHash = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.create({
    data: {
      email: "admin@linkhunter.ru",
      name: "Администратор",
      username: "admin",
      passwordHash: adminHash,
      role: "SUPERADMIN",
      balanceCoins: 0,
      isActive: true,
      karma: 9999,
    },
  });

  console.log("✅ Создан SUPERADMIN: admin@linkhunter.ru / admin123");

  // Загрузка групп из links_extracted.json
  const linksPath = path.join(process.cwd(), "links_extracted.json");
  let groupsData: { url: string; type: string }[] = [];
  
  try {
    if (fs.existsSync(linksPath)) {
      const fileContent = fs.readFileSync(linksPath, "utf8");
      groupsData = JSON.parse(fileContent);
      console.log(`✅ Загружено ${groupsData.length} групп из links_extracted.json`);
    } else {
      console.log("⚠️ Файл links_extracted.json не найден, создаем тестовые группы");
      groupsData = [
        { url: "https://t.me/test_group_1", type: "tg" },
        { url: "https://t.me/test_group_2", type: "tg" },
        { url: "https://chat.whatsapp.com/test_group_3", type: "wa" },
      ];
    }
  } catch (error) {
    console.error("❌ Ошибка чтения links_extracted.json:", error);
    groupsData = [
      { url: "https://t.me/test_group_1", type: "tg" },
      { url: "https://t.me/test_group_2", type: "tg" },
      { url: "https://chat.whatsapp.com/test_group_3", type: "wa" },
    ];
  }

  // Категории для групп
  const categories = ["work", "study", "hobby", "home"];
  const titlesWork = ["Работа в Москве", "Вакансии для узбеков", "Работа в Таиланде", "Вакансии в Москве", "Работа для мигрантов"];
  const titlesStudy = ["Учёба в РФ", "Курсы программирования", "Обучение английскому", "Подготовка к ЕГЭ", "Студенческие группы"];
  const titlesHobby = ["Хобби и увлечения", "Фотография", "Музыка", "Игры", "Туризм"];
  const titlesHome = ["Дом и быт", "Ремонт квартиры", "Сад и огород", "Дизайн интерьера", "Кулинария"];

  // Создание групп (продуктов)
  const createdProducts = await Promise.all(
    groupsData.slice(0, 50).map((group, index) => {
      const category = categories[index % categories.length];
      let title;
      if (category === "work") title = titlesWork[index % titlesWork.length];
      else if (category === "study") title = titlesStudy[index % titlesStudy.length];
      else if (category === "hobby") title = titlesHobby[index % titlesHobby.length];
      else title = titlesHome[index % titlesHome.length];

      const platform = group.type === "tg" ? "TELEGRAM" : "WHATSAPP";
      const slug = `group-${platform.toLowerCase()}-${index + 1}`;
      const membersCount = Math.floor(Math.random() * 10000) + 100;
      const rating = 4 + Math.random() * 1;
      const isVerified = Math.random() > 0.7;
      const isGold = Math.random() > 0.9;

      return prisma.product.create({
        data: {
          sellerId: admin.id,
          title: `${title} #${index + 1}`,
          slug,
          description: `Группа по теме "${title}". Платформа: ${platform}. Количество участников: ${membersCount}.`,
          category,
          priceCents: 0,
          oldPriceCents: null,
          type: "FREE",
          status: "APPROVED",
          platform,
          groupUrl: group.url,
          membersCount,
          isVerified,
          isGold,
          rating,
          reviewCount: Math.floor(Math.random() * 500),
          images: JSON.stringify([
            { url: `https://picsum.photos/seed/${slug}/400/300`, alt: title },
          ]),
          tags: [platform.toLowerCase(), category],
        },
      });
    })
  );

  console.log(`✅ Создано ${createdProducts.length} групп`);

  console.log("🎉 Сидирование завершено!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
