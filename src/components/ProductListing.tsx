"use client";

import { ProductItem } from "@/types/product";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";
import { PRODUCT_CATEGORIES } from "@/config";
import ImageSlider from "./ImageSlider";
import { Star, ExternalLink, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "@/hooks/useCart";

interface ProductListingProps {
  product: ProductItem | null;
  index: number;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={cn(
          "h-3.5 w-3.5",
          star <= Math.round(rating)
            ? "fill-amber-400 text-amber-400"
            : "fill-gray-200 text-gray-200"
        )}
      />
    ))}
    {rating > 0 && (
      <span className="ml-1 text-xs text-muted-foreground">{rating.toFixed(1)}</span>
    )}
  </div>
);

const ProductListing = ({ product, index }: ProductListingProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 75);
    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    if (!addedToCart) return;
    const t = setTimeout(() => setAddedToCart(false), 2000);
    return () => clearTimeout(t);
  }, [addedToCart]);

  if (!product || !isVisible) return <ProductPlaceholder />;

  const label = PRODUCT_CATEGORIES.find(({ value }) => value === product.category)?.label;
  const validUrls = product.images.map((img) => img.url).filter(Boolean) as string[];

  const cartProduct = {
    id: product.id,
    title: product.title,
    priceCents: product.priceCents,
    category: product.category,
    images: product.images,
    slug: product.slug,
  };

  return (
    <div
      className={cn(
        "invisible h-full w-full flex flex-col group/card rounded-xl",
        "transition-[box-shadow,transform] duration-200",
        "hover:shadow-[0_4px_20px_rgba(0,91,255,0.12)] hover:-translate-y-0.5",
        { "visible animate-in fade-in-5": isVisible }
      )}
    >
      {/* Изображение — клик ведёт на страницу товара */}
      <Link href={`/product/${product.id}`} className="block overflow-hidden rounded-xl">
        <div className="card-image-hover group-hover/card:scale-[1.02]">
          <ImageSlider urls={validUrls} />
        </div>
      </Link>

      {/* Контент */}
      <div className="flex flex-col flex-1 pt-3 px-1">
        {/* Категория + AI-модель */}
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-xs text-muted-foreground dark:text-slate-500">{label}</span>
          {product.aiModel && (
            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium leading-none">
              {product.aiModel}
            </span>
          )}
        </div>

        {/* Название */}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-sm text-gray-800 dark:text-slate-200 leading-snug line-clamp-2 hover:text-primary transition-colors duration-150">
            {product.title}
          </h3>
        </Link>

        {/* Рейтинг */}
        <div className="mt-1.5">
          <StarRating rating={product.rating} />
        </div>

        {/* Цена */}
        <div className="mt-2">
          <p className="font-bold text-base">
            {product.type === "FREE" ? (
              <span className="text-green-600 dark:text-green-400">Бесплатно</span>
            ) : (
              <span className="text-gray-900 dark:text-white">{formatCurrency(product.priceCents)}</span>
            )}
          </p>
        </div>

        {/* Кнопки действий */}
        <div className="mt-3 flex gap-2">
          {product.trialUrl && (
            <a
              href={product.trialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs h-8">
                <ExternalLink className="h-3 w-3" />
                Запустить демо
              </Button>
            </a>
          )}

          {product.type === "PAID" ? (
            <Button
              size="sm"
              className={cn("gap-1.5 text-xs h-8", product.trialUrl ? "flex-1" : "w-full")}
              onClick={() => {
                addItem(cartProduct);
                setAddedToCart(true);
              }}
            >
              {addedToCart ? (
                "Добавлено ✓"
              ) : (
                <>
                  <ShoppingCart className="h-3 w-3" />
                  В корзину
                </>
              )}
            </Button>
          ) : (
            <Button size="sm" className="w-full gap-1.5 text-xs h-8">
              Скачать бесплатно
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductPlaceholder = () => (
  <div className="flex flex-col w-full">
    <div className="relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl">
      <Skeleton className="h-full w-full" />
    </div>
    <div className="pt-3 px-1 space-y-2">
      <Skeleton className="w-1/3 h-3 rounded" />
      <Skeleton className="w-3/4 h-4 rounded" />
      <Skeleton className="w-20 h-3 rounded" />
      <Skeleton className="w-16 h-5 rounded" />
      <Skeleton className="w-full h-8 rounded-lg" />
    </div>
  </div>
);

export default ProductListing;
