import { NextRequest, NextResponse } from "next/server";
import { createHmac, createHash, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";
import { storeTelegramToken } from "@/lib/telegram-tokens";

type TelegramAuthData = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

function verifyTelegramHash(data: TelegramAuthData): boolean {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken || botToken === "DEV_PLACEHOLDER") return false;

  const { hash, ...rest } = data;

  // Строка для проверки: поля по алфавиту, каждое на новой строке
  const checkString = Object.entries(rest)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  // Ключ = SHA-256 от токена бота
  const secretKey = createHash("sha256").update(botToken).digest();
  const expected = createHmac("sha256", secretKey).update(checkString).digest("hex");

  // timingSafeEqual — защита от timing attacks
  return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(hash, "hex"));
}

export async function POST(req: NextRequest) {
  let body: TelegramAuthData;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  if (!body?.hash || !body?.id || !body?.auth_date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Данные свежие? Максимум 5 минут
  if (Date.now() / 1000 - body.auth_date > 300) {
    return NextResponse.json({ error: "Auth data expired" }, { status: 400 });
  }

  if (!verifyTelegramHash(body)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const telegramId = String(body.id);
  const name = [body.first_name, body.last_name].filter(Boolean).join(" ").trim() || null;

  // Ищем существующий аккаунт Telegram
  const existingAccount = await prisma.account.findFirst({
    where: { provider: "telegram", providerAccountId: telegramId },
    include: { user: true },
  });

  let userId: string;

  if (existingAccount) {
    // Обновляем имя и фото если изменились
    await prisma.user.update({
      where: { id: existingAccount.userId },
      data: {
        ...(name && { name }),
        ...(body.photo_url && { image: body.photo_url }),
      },
    });
    userId = existingAccount.userId;
  } else {
    // Создаём пользователя и привязываем Telegram
    const email = `tg_${telegramId}@telegram.local`;
    const user = await prisma.user.upsert({
      where: { email },
      create: { email, name, image: body.photo_url ?? null },
      update: {
        ...(name && { name }),
        ...(body.photo_url && { image: body.photo_url }),
      },
    });
    await prisma.account.upsert({
      where: {
        provider_providerAccountId: { provider: "telegram", providerAccountId: telegramId },
      },
      create: {
        userId: user.id,
        type: "oauth",
        provider: "telegram",
        providerAccountId: telegramId,
      },
      update: {},
    });
    userId = user.id;
  }

  // Одноразовый токен — клиент использует его для signIn("telegram")
  const token = storeTelegramToken(userId);
  return NextResponse.json({ token }, { status: 200 });
}
