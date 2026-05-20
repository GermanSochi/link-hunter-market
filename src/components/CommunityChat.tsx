"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Star, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

interface ChatAuthor {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
  isGoldSeller: boolean;
}

interface ChatMessage {
  id: string;
  text: string;
  createdAt: string;
  author: ChatAuthor;
}

export default function CommunityChat() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(0);
  const shouldScrollRef = useRef(false);

  const isNearBottom = () => {
    const el = containerRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  // Scroll ONLY within the chat container — never scrollIntoView (scrolls whole page)
  const scrollToBottom = (instant = false) => {
    const el = containerRef.current;
    if (!el) return;
    if (instant) {
      el.scrollTop = el.scrollHeight;
    } else {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  };

  const fetchMessages = async () => {
    const res = await fetch("/api/chat/community");
    if (res.ok) {
      const data = await res.json();
      setMessages(data);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to bottom only when new messages arrive AND user was already at bottom
  useEffect(() => {
    if (messages.length > prevCountRef.current) {
      if (shouldScrollRef.current || isNearBottom()) {
        scrollToBottom(prevCountRef.current === 0); // instant on first load
      }
      shouldScrollRef.current = false;
      prevCountRef.current = messages.length;
    }
  }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    setLoading(true);
    setError("");
    shouldScrollRef.current = true;

    try {
      const res = await fetch("/api/chat/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Ошибка");
        shouldScrollRef.current = false;
        return;
      }
      setText("");
      await fetchMessages();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[420px] border border-gray-200 rounded-xl overflow-hidden bg-white">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700">Чат сообщества</h3>
        <p className="text-xs text-gray-400">Обновляется каждые 10 секунд</p>
      </div>

      {/* Сообщения */}
      <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-2.5">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
              {msg.author.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={msg.author.image} alt="" className="w-7 h-7 rounded-full object-cover" />
              ) : (
                (msg.author.username ?? msg.author.name ?? "?")[0].toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={`text-xs font-semibold ${msg.author.isGoldSeller ? "text-yellow-700" : "text-gray-700"}`}>
                  {msg.author.username ?? msg.author.name ?? "Аноним"}
                </span>
                {msg.author.isGoldSeller && <Star size={11} className="text-yellow-500 fill-yellow-400" />}
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(msg.createdAt), { locale: ru, addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-gray-800 break-words">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Форма отправки */}
      {session ? (
        <form onSubmit={send} className="border-t border-gray-100 px-3 py-2 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Написать сообщение..."
            maxLength={500}
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#005BFF]/30"
          />
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="bg-[#005BFF] text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Send size={15} />
          </button>
        </form>
      ) : (
        <div className="border-t border-gray-100 px-4 py-2 text-xs text-gray-500 text-center">
          <a href="/sign-in" className="text-[#005BFF] hover:underline">Войдите</a>, чтобы писать в чат
        </div>
      )}

      {error && (
        <div className="px-4 pb-2 text-xs text-red-500">{error}</div>
      )}
    </div>
  );
}
