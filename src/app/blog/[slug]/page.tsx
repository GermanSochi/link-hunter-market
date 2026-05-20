"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronLeft, Sparkles, Eye, ThumbsUp, Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  voteCount: number;
  positiveVotes: number;
  viewCount: number;
  isGold: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
    isGoldSeller: boolean;
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  general: "Общее", ai: "AI/Tech", work: "Работа",
  study: "Учёба", home: "Дом", hobby: "Хобби",
};

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!params.slug) return;
    fetch(`/api/blog/${params.slug}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => { if (data) setPost(data); })
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] dark:bg-slate-950 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-[#005BFF] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] dark:bg-slate-950 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 dark:text-slate-400 text-lg">Статья не найдена</p>
        <Link href="/blog" className="text-[#005BFF] hover:underline text-sm">← Вернуться в блог</Link>
      </div>
    );
  }

  const ago = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ru });

  return (
    <div className="min-h-screen bg-[#f7f8fc] dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-slate-400 hover:text-[#005BFF] dark:hover:text-blue-400 transition-colors mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Назад
        </button>

        {/* Article card */}
        <article className={cn(
          "bg-white dark:bg-slate-900 rounded-2xl border shadow-card overflow-hidden",
          post.isGold
            ? "border-amber-200/60 dark:border-amber-500/30 shadow-gold"
            : "border-gray-100 dark:border-white/[0.08]"
        )}>

          {/* Header */}
          <div className="p-6 pb-4 border-b border-gray-100 dark:border-white/[0.06]">
            {post.isGold && (
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-3">
                <Sparkles className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                Gold пост
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Author */}
              <div className="flex items-center gap-2.5">
                <div className="relative h-9 w-9 rounded-full overflow-hidden bg-gray-100 dark:bg-slate-700 shrink-0">
                  {post.author.image ? (
                    <Image src={post.author.image} alt={post.author.name ?? "Автор"} fill sizes="36px" className="object-cover" unoptimized />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-500 dark:text-slate-400 text-sm font-semibold">
                      {(post.author.name ?? "?")[0].toUpperCase()}
                    </div>
                  )}
                  {post.author.isGoldSeller && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-amber-400 border border-white dark:border-slate-900 flex items-center justify-center">
                      <Sparkles className="h-2 w-2 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 leading-none">
                    {post.author.name ?? post.author.username ?? "Аноним"}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Calendar className="h-3 w-3 text-gray-400 dark:text-slate-500" />
                    <span className="text-[11px] text-gray-400 dark:text-slate-500">{ago}</span>
                  </div>
                </div>
              </div>

              {/* Category */}
              {post.category && post.category !== "general" && (
                <span className="text-xs bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 px-2.5 py-1 rounded-full">
                  {CATEGORY_LABELS[post.category] ?? post.category}
                </span>
              )}

              {/* Stats */}
              <div className="flex items-center gap-3 ml-auto text-xs text-gray-400 dark:text-slate-500">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-3.5 w-3.5" />
                  {post.positiveVotes}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {post.viewCount}
                </span>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                <Tag className="h-3.5 w-3.5 text-gray-400 dark:text-slate-500 shrink-0 mt-0.5" />
                {post.tags.map((tag) => (
                  <span key={tag} className="text-[11px] bg-blue-50 dark:bg-blue-500/10 text-[#005BFF] dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="prose prose-gray dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
              prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
              prose-p:text-gray-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed
              prose-a:text-[#005BFF] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 dark:prose-strong:text-white
              prose-code:text-[#005BFF] dark:prose-code:text-blue-400 prose-code:bg-blue-50 dark:prose-code:bg-blue-500/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal
              prose-pre:bg-slate-900 dark:prose-pre:bg-slate-950 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-white/[0.08]
              prose-blockquote:border-l-[#005BFF] prose-blockquote:text-gray-600 dark:prose-blockquote:text-slate-400
              prose-table:text-sm prose-th:text-gray-900 dark:prose-th:text-white prose-th:bg-gray-50 dark:prose-th:bg-slate-800
              prose-td:text-gray-700 dark:prose-td:text-slate-300
              prose-li:text-gray-700 dark:prose-li:text-slate-300
              prose-hr:border-gray-200 dark:prose-hr:border-white/[0.08]">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </div>
        </article>

        {/* Back to blog */}
        <div className="mt-6 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 hover:text-[#005BFF] dark:hover:text-blue-400 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Все статьи
          </Link>
        </div>
      </div>
    </div>
  );
}
