"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import NewPostForm from "./NewPostForm";
import { PenLine, Loader2, ChevronDown, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { Sparkles, ThumbsUp, ThumbsDown, Eye } from "lucide-react";

const CATEGORIES = [
  { value: "", label: "Все" },
  { value: "general", label: "Общее" },
  { value: "ai", label: "AI/Tech" },
  { value: "work", label: "Работа" },
  { value: "study", label: "Учёба" },
  { value: "home", label: "Дом" },
  { value: "hobby", label: "Хобби" },
];

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

function PostCard({ post }: { post: Post }) {
  const preview = post.content.replace(/[#*`>_~\[\]()]/g, "").slice(0, 220);
  const ago = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ru });

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
    <article className={cn(
      "bg-white dark:bg-slate-800/60 rounded-2xl border p-5 group-hover:shadow-card-hover transition-shadow duration-200",
      post.isGold ? "border-amber-200/60 dark:border-amber-500/30 shadow-gold" : "border-gray-100 dark:border-white/[0.08] shadow-card"
    )}>
      {post.isGold && (
        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-3">
          <Sparkles className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          Gold пост
        </div>
      )}

      {/* Author */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-100 dark:bg-slate-700 shrink-0">
          {post.author.image ? (
            <Image
              src={post.author.image}
              alt={post.author.name ?? "Автор"}
              fill
              sizes="32px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400 dark:text-slate-400 text-sm font-semibold">
              {(post.author.name ?? "?")[0].toUpperCase()}
            </div>
          )}
          {post.author.isGoldSeller && (
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-amber-400 border border-white dark:border-slate-800 flex items-center justify-center">
              <Sparkles className="h-2 w-2 text-white" />
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 leading-none">
            {post.author.name ?? post.author.username ?? "Аноним"}
          </p>
          <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">{ago}</p>
        </div>
        {post.category && post.category !== "general" && (
          <span className="ml-auto text-xs bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 px-2.5 py-1 rounded-full">
            {CATEGORIES.find((c) => c.value === post.category)?.label ?? post.category}
          </span>
        )}
      </div>

      {/* Title */}
      <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2 leading-snug group-hover:text-[#005BFF] dark:group-hover:text-blue-400 transition-colors line-clamp-2">
        {post.title}
      </h2>

      {/* Preview text */}
      <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed line-clamp-3 mb-3">
        {preview}
        {post.content.length > 220 && "..."}
      </p>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map((tag) => (
            <span key={tag} className="text-[11px] bg-blue-50 dark:bg-blue-500/10 text-[#005BFF] dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-slate-600 pt-2 border-t border-gray-50 dark:border-white/[0.06]">
        <span className="flex items-center gap-1">
          <ThumbsUp className="h-3.5 w-3.5" />
          {post.positiveVotes}
        </span>
        <span className="flex items-center gap-1">
          <ThumbsDown className="h-3.5 w-3.5" />
          {post.voteCount - post.positiveVotes}
        </span>
        <span className="flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" />
          {post.viewCount}
        </span>
      </div>
    </article>
    </Link>
  );
}

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = useCallback(async (cat: string, pg: number, append = false) => {
    if (pg === 1) setLoading(true); else setLoadingMore(true);
    try {
      const params = new URLSearchParams({ page: String(pg) });
      if (cat) params.set("category", cat);
      const res = await fetch(`/api/blog?${params}`);
      const data = await res.json();
      if (append) {
        setPosts((prev) => [...prev, ...(data.posts ?? [])]);
      } else {
        setPosts(data.posts ?? []);
      }
      setTotalPages(data.totalPages ?? 1);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchPosts(category, 1);
  }, [category, fetchPosts]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchPosts(category, next, true);
  };

  const handlePostCreated = () => {
    setShowForm(false);
    fetchPosts(category, 1);
  };

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Category filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="h-3.5 w-3.5 text-gray-400 dark:text-slate-500 shrink-0" />
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(c.value)}
              className={cn(
                "text-xs px-3 py-1.5 rounded-full font-medium transition-all",
                category === c.value
                  ? "bg-[#005BFF] text-white shadow-sm"
                  : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className={cn(
            "flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all",
            showForm
              ? "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
              : "bg-gradient-to-r from-[#005BFF] to-[#0070ff] text-white shadow-sm hover:opacity-90"
          )}
        >
          <PenLine className="h-4 w-4" />
          {showForm ? "Отмена" : "Написать"}
        </button>
      </div>

      {showForm && <NewPostForm onSuccess={handlePostCreated} onCancel={() => setShowForm(false)} />}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[#005BFF]" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-slate-500">
          <p className="text-lg font-medium text-gray-700 dark:text-slate-300">Постов пока нет</p>
          <p className="text-sm mt-1">Будьте первым — напишите топик!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {page < totalPages && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-white/10 px-5 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {loadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronDown className="h-4 w-4" />}
            Загрузить ещё
          </button>
        </div>
      )}
    </div>
  );
}
