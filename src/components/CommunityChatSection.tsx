"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, ChevronDown, Radio } from "lucide-react";
import CommunityChat from "./CommunityChat";

export default function CommunityChatSection() {
  const [open, setOpen] = useState(false);
  const [online, setOnline] = useState<number | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  /* Measure real height for smooth transition */
  useEffect(() => {
    if (!bodyRef.current) return;
    const observer = new ResizeObserver(() => {
      setHeight(bodyRef.current?.scrollHeight ?? 0);
    });
    observer.observe(bodyRef.current);
    return () => observer.disconnect();
  }, []);

  /* Fake online counter — just cosmetic */
  useEffect(() => {
    setOnline(Math.floor(Math.random() * 40) + 8);
  }, []);

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200/80 bg-white shadow-sm">
      {/* Header — always visible, acts as toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/60 transition-colors group"
      >
        <div className="flex items-center gap-3">
          {/* Pulsing dot */}
          <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#005BFF] to-[#0099FF] shadow-sm">
            <MessageSquare className="h-4 w-4 text-white" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-white animate-pulse" />
          </span>

          <div className="text-left">
            <p className="text-sm font-bold text-gray-900 leading-none mb-0.5">Чат сообщества</p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Radio className="h-3 w-3 text-green-500" />
              {online !== null ? `${online} онлайн` : "Загрузка..."}
              &nbsp;·&nbsp;Живое общение
            </p>
          </div>
        </div>

        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Animated body */}
      <div
        className="overflow-hidden transition-all duration-500 ease-drawer"
        style={{ maxHeight: open ? `${height || 500}px` : "0px", opacity: open ? 1 : 0 }}
      >
        <div ref={bodyRef}>
          {/* Slide-in inner content */}
          <div
            className="transition-transform duration-500 ease-drawer border-t border-gray-100"
            style={{ transform: open ? "translateY(0)" : "translateY(-12px)" }}
          >
            <CommunityChat />
          </div>
        </div>
      </div>
    </div>
  );
}
