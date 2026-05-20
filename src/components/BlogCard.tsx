"use client";

import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import Link from "next/link";
import { ThumbsUp, ThumbsDown, Eye, Star } from "lucide-react";

interface BlogCardAuthor {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
  isGoldSeller: boolean;
}

interface BlogCardProps {
  post: {
    id: string;
    slug: string;
    title: string;
    content: string;
    voteCount: number;
    positiveVotes: number;
    viewCount: number;
    isGold: boolean;
    createdAt: string;
    author: BlogCardAuthor;
  };
}

export default function BlogCard({ post }: BlogCardProps) {
  const excerpt = post.content.slice(0, 280).replace(/[#*`]/g, "");
  const negativeVotes = post.voteCount - post.positiveVotes;
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { locale: ru, addSuffix: true });

  return (
    <article
      className={`border-b border-gray-100 py-5 px-2 hover:bg-gray-50/50 transition-colors ${
        post.isGold ? "border-l-4 border-l-yellow-400 pl-4" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Голоса */}
        <div className="flex flex-col items-center gap-1 min-w-[48px] text-center">
          <span className="text-lg font-bold text-gray-700">{post.voteCount}</span>
          <div className="flex gap-1">
            <ThumbsUp size={13} className="text-green-500" />
            <ThumbsDown size={13} className="text-red-400" />
          </div>
          <span className="text-xs text-gray-400">{post.positiveVotes}/{negativeVotes}</span>
        </div>

        {/* Контент */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {post.isGold && (
              <Star size={14} className="text-yellow-500 fill-yellow-400" />
            )}
            <Link
              href={`/blog/${post.slug}`}
              className={`font-semibold text-gray-900 hover:text-[#005BFF] transition-colors line-clamp-2 ${
                post.isGold ? "text-yellow-900" : ""
              }`}
            >
              {post.title}
            </Link>
          </div>

          <p className="text-sm text-gray-500 line-clamp-2 mb-2">{excerpt}</p>

          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <span
                className={`font-medium ${post.author.isGoldSeller ? "text-yellow-600" : "text-gray-600"}`}
              >
                {post.author.username ?? post.author.name ?? "Аноним"}
              </span>
              {post.author.isGoldSeller && <Star size={11} className="text-yellow-500 fill-yellow-400" />}
            </span>
            <span>{timeAgo}</span>
            <span className="flex items-center gap-1">
              <Eye size={12} /> {post.viewCount}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
