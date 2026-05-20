"use client";

import { useState } from "react";
import { Star, CheckCircle2, UserCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type ReviewAuthor = { name: string; image: string | null };

export type ReviewItem = {
  id: string;
  rating: number;
  text: string | null;
  isVerified: boolean;
  createdAt: string;
  author: ReviewAuthor;
};

interface ReviewSectionProps {
  productId: string;
  reviews: ReviewItem[];
  totalCount: number;
  averageRating: number;
}

const StarRating = ({
  value,
  interactive = false,
  onChange,
}: {
  value: number;
  interactive?: boolean;
  onChange?: (v: number) => void;
}) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = interactive ? (hovered || value) >= star : value >= star;
        return (
          <Star
            key={star}
            className={cn(
              "h-5 w-5 transition-colors",
              filled ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200",
              interactive && "cursor-pointer hover:fill-amber-400 hover:text-amber-400"
            )}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => interactive && onChange?.(star)}
          />
        );
      })}
    </div>
  );
};

const RatingBar = ({ star, count, total }: { star: number; count: number; total: number }) => (
  <div className="flex items-center gap-2 text-sm">
    <span className="w-4 text-right text-muted-foreground">{star}</span>
    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-amber-400 rounded-full transition-all duration-500"
        style={{ width: total > 0 ? `${(count / total) * 100}%` : "0%" }}
      />
    </div>
    <span className="w-6 text-right text-muted-foreground">{count}</span>
  </div>
);

const ReviewCard = ({ review }: { review: ReviewItem }) => {
  const date = new Date(review.createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="py-6 border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {review.author.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={review.author.image}
              alt={review.author.name}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <UserCircle2 className="h-9 w-9 text-gray-300" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-gray-900">{review.author.name}</span>
              {review.isVerified && (
                <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3 w-3" />
                  Подтверждённая покупка
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{date}</span>
          </div>
          <div className="mt-1">
            <StarRating value={review.rating} />
          </div>
          {review.text && (
            <p className="mt-2 text-sm text-gray-700 leading-relaxed">{review.text}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const ReviewSection = ({ productId, reviews, totalCount, averageRating }: ReviewSectionProps) => {
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newText, setNewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Распределение звёзд (из имеющихся отзывов)
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating: newRating, text: newText }),
      });
      if (res.ok) {
        setSubmitted(true);
        setShowForm(false);
        setNewRating(0);
        setNewText("");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section aria-label="Отзывы">
      <div className="border-t border-gray-200 pt-10">
        <h2 className="text-xl font-bold text-gray-900">
          Отзывы{totalCount > 0 && <span className="ml-2 text-muted-foreground font-normal text-base">({totalCount})</span>}
        </h2>

        {totalCount > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row gap-8">
            {/* Средний рейтинг */}
            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl px-8 py-6 min-w-[140px]">
              <span className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
              <StarRating value={Math.round(averageRating)} />
              <span className="mt-1 text-xs text-muted-foreground">из 5</span>
            </div>

            {/* Полоски по звёздам */}
            <div className="flex-1 space-y-2 justify-center flex flex-col">
              {distribution.map(({ star, count }) => (
                <RatingBar key={star} star={star} count={count} total={totalCount} />
              ))}
            </div>
          </div>
        )}

        {/* Кнопка оставить отзыв */}
        <div className="mt-8">
          {submitted ? (
            <p className="text-sm text-green-600 font-medium">
              ✓ Ваш отзыв отправлен на модерацию. Спасибо!
            </p>
          ) : showForm ? (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ваша оценка</label>
                <StarRating value={newRating} interactive onChange={setNewRating} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Комментарий <span className="text-muted-foreground font-normal">(необязательно)</span>
                </label>
                <textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  rows={4}
                  maxLength={1000}
                  className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Расскажите о своём опыте использования..."
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={submitting || newRating === 0}>
                  {submitting ? "Отправка..." : "Отправить отзыв"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowForm(false);
                    setNewRating(0);
                    setNewText("");
                  }}
                >
                  Отмена
                </Button>
              </div>
            </form>
          ) : (
            <Button variant="outline" onClick={() => setShowForm(true)}>
              Написать отзыв
            </Button>
          )}
        </div>

        {/* Список отзывов */}
        {reviews.length > 0 ? (
          <div className="mt-8">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted-foreground">
            Отзывов пока нет. Будьте первым!
          </p>
        )}
      </div>
    </section>
  );
};

export default ReviewSection;
