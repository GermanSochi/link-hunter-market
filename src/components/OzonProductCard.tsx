"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Star, Check, Zap, Sparkles, Users, ShieldCheck, ExternalLink, Lock } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

export type OzonProduct = {
  id: string;
  slug: string;
  title: string;
  priceCents: number;
  oldPriceCents?: number | null;
  rating: number;
  reviewCount?: number;
  image: string;
  href?: string;
  category?: string;
  isGold?: boolean;
  images?: { url: string; alt?: string }[];
  platform?: "TELEGRAM" | "WHATSAPP" | "VK" | "DISCORD";
  membersCount?: number;
  isVerified?: boolean;
  groupUrl?: string;
};

interface Props {
  product: OzonProduct;
}

const StarsRow = ({ rating, count }: { rating: number; count?: number }) => (
  <div className="flex items-center gap-1">
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn(
            "h-3 w-3 transition-colors",
            s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"
          )}
        />
      ))}
    </div>
    {count != null && count > 0 && (
      <span className="text-[11px] text-gray-400 tabular-nums">
        ({count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count})
      </span>
    )}
  </div>
);

const OzonProductCard = ({ product }: Props) => {
  const [liked, setLiked] = useState(false);
  const [isLoadingLink, setIsLoadingLink] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isHidden = product.groupUrl === "hidden";

  const handleGetLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isHidden) {
      window.open(product.groupUrl, "_blank");
      return;
    }

    setIsLoadingLink(true);
    setError(null);

    try {
      const res = await fetch("/api/get-group-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Ошибка доступа");
        return;
      }

      const data = await res.json();
      if (data.groupUrl) {
        window.open(data.groupUrl, "_blank");
      }
    } catch (err) {
      setError("Произошла ошибка");
    } finally {
      setIsLoadingLink(false);
    }
  };

  const getPlatformIcon = () => {
    switch (product.platform) {
      case "TELEGRAM":
        return "📱";
      case "WHATSAPP":
        return "💬";
      case "VK":
        return "🔵";
      case "DISCORD":
        return "🎮";
      default:
        return "📱";
    }
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-white rounded-2xl overflow-hidden",
        "transition-all duration-300 ease-out will-change-transform",
        "hover:-translate-y-1.5 hover:shadow-card-hover",
        "shadow-card border border-gray-100/80",
        product.isGold && "shadow-gold border-amber-200/60 animate-glow-gold"
      )}
    >
      {product.isGold && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-gold z-10" />
      )}

      {product.isGold && (
        <span className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 bg-gradient-gold text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
          <Sparkles className="h-2.5 w-2.5" />
          Топ
        </span>
      )}

      <button
        type="button"
        onClick={(e) => { e.preventDefault(); setLiked((v) => !v); }}
        className={cn(
          "absolute top-2.5 right-2.5 z-10 h-7 w-7 flex items-center justify-center rounded-full",
          "glass shadow-sm transition-all duration-200",
          "hover:scale-110 active:scale-95",
          liked ? "bg-red-50/90" : "bg-white/80"
        )}
        aria-label="В избранное"
        title="В избранное"
      >
        <Heart
          className={cn(
            "h-3.5 w-3.5 transition-all duration-200",
            liked ? "fill-[#FF0032] text-[#FF0032] scale-110" : "text-gray-400"
          )}
        />
      </button>

      <div className="block aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50/30 relative">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          className={cn(
            "object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]",
            isHidden && "blur-sm"
          )}
          loading="lazy"
          unoptimized={product.image.includes("picsum.photos")}
        />
      </div>

      <div className="flex flex-col flex-1 p-3 gap-2">
        <div className="flex items-center justify-between">
          <StarsRow rating={product.rating} count={product.reviewCount} />
          <span className="text-lg">{getPlatformIcon()}</span>
        </div>

        <Link href="#" onClick={handleGetLink}>
          <p className="text-[13px] leading-snug text-[#1a1a1a] font-medium line-clamp-2 hover:text-[#005BFF] transition-colors duration-150">
            {product.title}
          </p>
        </Link>

        <div className="flex items-center gap-2 text-[11px] text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {product.membersCount ? (
              <span>{product.membersCount >= 1000 ? `${(product.membersCount / 1000).toFixed(1)}k` : product.membersCount} участников</span>
            ) : (
              <span>0 участников</span>
            )}
          </div>
          {product.isVerified && (
            <div className="flex items-center gap-1 text-green-600">
              <ShieldCheck className="h-3 w-3" />
              <span>Проверено</span>
            </div>
          )}
        </div>

        {error && (
          <p className="text-[11px] text-red-500">{error}</p>
        )}

        <div className="mt-auto pt-1">
          <button
            type="button"
            onClick={handleGetLink}
            disabled={isLoadingLink}
            className={cn(
              "mt-2.5 w-full h-8 rounded-xl text-white text-xs font-semibold",
              "flex items-center justify-center gap-1.5",
              "transition-all duration-200 press",
              isHidden
                ? "bg-gradient-blue hover:opacity-90 shadow-sm hover:shadow-blue-glow"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-sm hover:shadow-md"
            )}
          >
            {isLoadingLink ? (
              <span>Загрузка...</span>
            ) : isHidden ? (
              <><Lock className="h-3.5 w-3.5" />Получить ссылку</>
            ) : (
              <><ExternalLink className="h-3.5 w-3.5" />Перейти в группу</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OzonProductCard;
