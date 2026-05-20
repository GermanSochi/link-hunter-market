import AddToCart from "@/components/AddToCart";
import ImageSlider from "@/components/ImageSlider";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductReel from "@/components/ProductReel";
import ReviewSection from "@/components/ReviewSection";
import { PRODUCT_CATEGORIES } from "@/config";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Check, Shield, Star, ExternalLink, Bot, Tag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

interface IPageProps {
  params: Promise<{ productId: string }>;
}

const BREADCRUMBS = [
  { id: 1, name: "Главная", href: "/" },
  { id: 2, name: "Товары", href: "/products" },
];

const StarRating = ({ rating, count }: { rating: number; count?: number }) => (
  <div className="flex items-center gap-1.5">
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
    <span className="text-sm text-muted-foreground">
      {rating > 0 ? rating.toFixed(1) : "Нет оценок"}
      {count != null && count > 0 && ` · ${count} отзыв${count === 1 ? "" : count < 5 ? "а" : "ов"}`}
    </span>
  </div>
);

const Page = async ({ params }: IPageProps) => {
  const { productId } = await params;

  const product = await prisma.product.findFirst({
    where: { id: productId, status: "APPROVED" },
    include: {
      seller: { select: { id: true, name: true, rating: true } },
      reviews: {
        include: { author: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: { select: { reviews: true } },
    },
  });

  if (!product) return notFound();

  const label = PRODUCT_CATEGORIES.find(({ value }) => value === product.category)?.label;
  const images = (
    typeof product.images === "string"
      ? JSON.parse(product.images)
      : (product.images ?? [])
  ) as { url: string; alt?: string }[];
  const validUrls = images.map((img) => img.url).filter(Boolean) as string[];

  const cartProduct = {
    id: product.id,
    title: product.title,
    priceCents: product.priceCents,
    category: product.category,
    images,
    slug: product.slug,
  };

  return (
    <MaxWidthWrapper className="bg-white">
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          {/* Левая колонка — текст */}
          <div className="lg:max-w-lg lg:self-end">
            {/* Хлебные крошки */}
            <ol className="flex items-center space-x-2">
              {BREADCRUMBS.map((breadcrumb, i) => (
                <li key={breadcrumb.href}>
                  <div className="flex items-center text-sm">
                    <Link
                      href={breadcrumb.href}
                      className="font-medium text-sm text-muted-foreground hover:text-gray-900"
                    >
                      {breadcrumb.name}
                    </Link>
                    {i !== BREADCRUMBS.length - 1 ? (
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className="ml-2 h-5 w-5 flex-shrink-0 text-gray-300"
                      >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                      </svg>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>

            {/* Заголовок */}
            <div className="mt-4">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {product.title}
              </h1>
            </div>

            <section className="mt-4 space-y-4">
              {/* Цена + категория */}
              <div className="flex items-center gap-4">
                <p className="text-2xl font-bold text-gray-900">
                  {product.type === "FREE" ? (
                    <span className="text-green-600">Бесплатно</span>
                  ) : (
                    formatCurrency(product.priceCents)
                  )}
                </p>
                <div className="border-l border-gray-300 pl-4 text-sm text-muted-foreground">
                  {label}
                </div>
              </div>

              {/* Рейтинг */}
              <StarRating rating={product.rating} count={product._count.reviews} />

              {/* AI-модель и теги */}
              {(product.aiModel || product.tags.length > 0) && (
                <div className="flex flex-wrap gap-2">
                  {product.aiModel && (
                    <span className="inline-flex items-center gap-1.5 text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                      <Bot className="h-3.5 w-3.5" />
                      {product.aiModel}
                    </span>
                  )}
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Описание */}
              <div className="mt-4 space-y-3">
                <p className="text-base text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Продавец */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Продавец:</span>
                <span className="font-medium text-gray-800">{product.seller.name ?? "Аноним"}</span>
                {product.seller.rating > 0 && (
                  <span className="text-amber-500">★ {product.seller.rating.toFixed(1)}</span>
                )}
              </div>

              {/* Гарантии */}
              <div className="flex items-center">
                <Check aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-green-500" />
                <p className="ml-2 text-sm text-muted-foreground">
                  Мгновенная доставка после оплаты
                </p>
              </div>
            </section>
          </div>

          {/* Правая колонка — галерея */}
          <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
            <div className="aspect-square rounded-2xl overflow-hidden">
              <ImageSlider urls={validUrls} />
            </div>
          </div>

          {/* Кнопки покупки */}
          <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
            <div className="space-y-3">
              {/* Кнопка «Запустить демо» */}
              {product.trialUrl && (
                <a href={product.trialUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg" className="w-full gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Запустить демо
                  </Button>
                </a>
              )}

              {/* Кнопка «Купить / Скачать» */}
              {product.type === "PAID" ? (
                <AddToCart product={cartProduct} />
              ) : (
                <Button size="lg" className="w-full">
                  Скачать бесплатно
                </Button>
              )}

              {/* Защита покупателя */}
              <div className="text-center">
                <div className="group inline-flex text-sm">
                  <Shield aria-hidden="true" className="mr-2 h-5 w-5 flex-shrink-0 text-gray-400" />
                  <span className="text-muted-foreground hover:text-gray-700">
                    Защита покупателя — возврат в течение 30 дней
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Секция отзывов */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <ReviewSection
          productId={product.id}
          reviews={product.reviews.map((r) => ({
            id: r.id,
            rating: r.rating,
            text: r.text ?? null,
            isVerified: r.isVerified,
            createdAt: r.createdAt.toISOString(),
            author: { name: r.author.name ?? "Аноним", image: r.author.image ?? null },
          }))}
          totalCount={product._count.reviews}
          averageRating={product.rating}
        />
      </div>

      {/* Похожие товары */}
      <ProductReel
        href="/products"
        query={{ category: product.category, limit: 4 }}
        title={`Похожие товары — ${label}`}
        subtitle={`Другие товары в категории «${label}»`}
      />
    </MaxWidthWrapper>
  );
};

export default Page;
