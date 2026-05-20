import { type ClassValue, clsx } from "clsx";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  value: number | string,
  options: {
    currency?: "RUB" | "USD" | "EUR";
    notation?: Intl.NumberFormatOptions["notation"];
  } = {}
) {
  const { currency = "RUB", notation = "standard" } = options;
  const numericValue = typeof value === "string" ? parseFloat(value) : value;

  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 0,
  }).format(numericValue);
}

/** Форматирует центы в рубли: 9900 → "99 ₽" */
export function formatCoins(coins: number): string {
  return formatCurrency(coins);
}

export function constructMetadata({
  title = "AI MARKET — маркетплейс AI-инструментов и цифровых товаров",
  description = "Покупайте и продавайте AI-инструменты, скрипты, библиотеки. Категории: Дом, Работа, Учёба, Хобби.",
  image = "/thumbnail.jpg",
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    icons,
    // metadataBase: new URL(""),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
