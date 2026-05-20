"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { COMMISSION_PCT } from "@/data/ai-services";
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
  AreaChart, Area, CartesianGrid, XAxis, YAxis,
  BarChart, Bar,
} from "recharts";
import {
  CheckCircle2, XCircle, CreditCard, Zap, Code2,
  ImageIcon, Video, MessageSquare, X, Send, Flame, BadgeCheck,
  Layers, ExternalLink, Search, TrendingUp,
  BarChart2, Trophy,
} from "lucide-react";
import type { AIItem, AICategory } from "@/types/ai-compare";

type Tab = "rankings" | "market" | "metrics";
type FilterCategory = AICategory | "all";

interface Props {
  initialItems: AIItem[];
  usdRate: number;
}

// ── Константы ──────────────────────────────────────────────────────────────

const CAT_COLOR: Record<string, string> = {
  text: "#3b82f6",
  code: "#f59e0b",
  image: "#8b5cf6",
  video: "#ec4899",
};

const CAT_LABEL: Record<string, string> = {
  text: "Текст",
  code: "Код",
  image: "Фото",
  video: "Видео",
  all: "Все",
};

const BRAND: Record<string, string> = {
  // OpenAI
  "chatgpt-plus": "#10a37f",
  "gpt-4o-api": "#10a37f",
  "gpt-4o-mini-api": "#10a37f",
  "o3-mini": "#10a37f",
  "dalle3": "#10a37f",
  "sora": "#10a37f",
  // Anthropic
  "claude-pro": "#d97706",
  // Google
  "gemini-25-pro": "#4285f4",
  "gemini-25-flash": "#4285f4",
  "gemini-20-flash": "#4285f4",
  "gemma-3-27b": "#34a853",
  // xAI
  "grok-3": "#1a1a1a",
  "grok-3-mini": "#1a1a1a",
  // Meta
  "llama-4-maverick": "#0668e1",
  "llama-33-70b": "#0668e1",
  // DeepSeek
  "deepseek": "#4D6BFE",
  "deepseek-r1": "#6d28d9",
  // Mistral
  "mistral-large-2": "#ff7000",
  "mistral-small-31": "#ff7000",
  "codestral": "#ff7000",
  // Cohere
  "command-a": "#39594d",
  // Perplexity
  "sonar-pro": "#20bdff",
  "sonar": "#20bdff",
  // Amazon
  "nova-pro": "#ff9900",
  "nova-lite": "#ff9900",
  "amazon-q": "#ff9900",
  // Microsoft
  "phi-4": "#0078d4",
  // Nvidia
  "nemotron-70b": "#76b900",
  // Russian
  "yandexgpt": "#d62d20",
  "gigachat-pro": "#00a651",
  // Chinese
  "qwen-plus": "#ff6a00",
  "kimi-moonshot": "#06b6d4",
  "doubao": "#1d4ed8",
  "zhipu-glm4": "#7c3aed",
  "baidu-ernie": "#2563eb",
  // Code
  "cursor-ai": "#0070f3",
  "github-copilot": "#6e7681",
  "windsurf": "#06b6d4",
  "tabnine": "#4f46e5",
  "jetbrains-ai": "#e10050",
  // Image
  "midjourney": "#1a1a2e",
  "leonardo-ai": "#d97706",
  "shedevrum": "#9333ea",
  "kandinsky": "#10b981",
  "photoshop-ai": "#fa0f00",
  "ideogram": "#f97316",
  "stable-diffusion": "#7c3aed",
  // Video
  "runway-gen3": "#111111",
  "kling-ai": "#0891b2",
  "luma-dream": "#7c3aed",
  "heygen": "#6366f1",
  "pika-labs": "#db2777",
};

const MARKET_SHARE_DATA = [
  { month: "Янв", google: 28, openai: 25, anthropic: 18, deepseek: 8, chinese: 12, other: 9 },
  { month: "Фев", google: 27, openai: 24, anthropic: 19, deepseek: 10, chinese: 12, other: 8 },
  { month: "Мар", google: 26, openai: 24, anthropic: 20, deepseek: 12, chinese: 13, other: 5 },
  { month: "Апр", google: 28, openai: 23, anthropic: 21, deepseek: 13, chinese: 11, other: 4 },
  { month: "Май", google: 30, openai: 22, anthropic: 20, deepseek: 14, chinese: 10, other: 4 },
];

const MARKET_PROVIDERS = [
  { key: "google", label: "Google (Gemini)", color: "#4285f4" },
  { key: "openai", label: "OpenAI", color: "#10a37f" },
  { key: "anthropic", label: "Anthropic", color: "#d97706" },
  { key: "deepseek", label: "DeepSeek", color: "#3b82f6" },
  { key: "chinese", label: "Китайские (Qwen/Kimi)", color: "#7c3aed" },
  { key: "other", label: "Прочие", color: "#6b7280" },
];

// ── Маленькие компоненты ──────────────────────────────────────────────────

function CatIcon({ cat, size = 12 }: { cat: FilterCategory; size?: number }) {
  const s = size;
  if (cat === "text") return <MessageSquare style={{ width: s, height: s }} />;
  if (cat === "code") return <Code2 style={{ width: s, height: s }} />;
  if (cat === "image") return <ImageIcon style={{ width: s, height: s }} />;
  if (cat === "video") return <Video style={{ width: s, height: s }} />;
  return <Layers style={{ width: s, height: s }} />;
}

function VPNBadge({ status }: { status: AIItem["rfpStatus"] }) {
  if (status === "ru_ok")
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <CheckCircle2 className="h-2.5 w-2.5 shrink-0" />Без VPN
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-500 border border-slate-700/50">
      VPN
    </span>
  );
}

function PayBadge({ status }: { status: AIItem["paymentStatus"] }) {
  if (status === "ru_cards")
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
        <CreditCard className="h-2.5 w-2.5 shrink-0" />Карты РФ
      </span>
    );
  return null;
}

// ── BuyModal ──────────────────────────────────────────────────────────────
function BuyModal({ item, onClose }: { item: AIItem; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", contact: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    setSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-[#111113] border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Оформить доступ</p>
            <h3 className="font-semibold text-white text-base">{item.name}</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Закрыть" className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/8 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">
          {sent ? (
            <div className="text-center py-6">
              <div className="h-14 w-14 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-7 w-7 text-emerald-400" />
              </div>
              <p className="text-white font-semibold mb-1">Заявка принята!</p>
              <p className="text-slate-400 text-sm">Менеджер свяжется в течение 15 минут</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="rounded-xl bg-white/5 border border-white/8 p-3.5 flex items-center justify-between">
                <span className="text-slate-400 text-sm">Стоимость</span>
                <span className="text-white font-bold tabular-nums">
                  {item.monthlyPriceRUB > 0 ? `${item.monthlyPriceRUB.toLocaleString("ru")} ₽/мес` : "Бесплатно"}
                </span>
              </div>
              <input
                required
                placeholder="Ваше имя"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/60 transition"
              />
              <input
                required
                placeholder="Telegram (@username) или Email"
                value={form.contact}
                onChange={(e) => setForm((p) => ({ ...p, contact: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/60 transition"
              />
              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm disabled:opacity-50 transition-colors"
              >
                {sending
                  ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><Send className="h-3.5 w-3.5" />Оставить заявку</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Donut chart сверху + статистика ────────────────────────────────────────
function SummarySection({
  items,
  usdRate,
  onRefresh,
  refreshing,
}: {
  items: AIItem[];
  usdRate: number;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  const byCategory = useMemo(() => {
    const counts: Record<string, number> = { text: 0, code: 0, image: 0, video: 0 };
    items.forEach((i) => { if (counts[i.category] !== undefined) counts[i.category]++; });
    return Object.entries(counts).map(([cat, count]) => ({
      name: CAT_LABEL[cat],
      value: count,
      color: CAT_COLOR[cat],
    }));
  }, [items]);

  const stats = useMemo(() => [
    { label: "Сервисов", value: items.length, color: "text-white" },
    { label: "Без VPN", value: items.filter((i) => i.rfpStatus === "ru_ok").length, color: "text-emerald-400" },
    { label: "Бесплатных", value: items.filter((i) => i.hasFreeTier).length, color: "text-blue-400" },
    { label: "Карты РФ", value: items.filter((i) => i.paymentStatus === "ru_cards").length, color: "text-violet-400" },
  ], [items]);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 p-5 rounded-2xl bg-white/[0.03] border border-white/8">
      {/* Курс + кнопка обновления */}
      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        title="Обновить цены по текущему курсу ЦБ РФ"
        className="absolute top-5 right-5 sm:hidden inline-flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-blue-400 transition-colors disabled:opacity-50"
      >
        {refreshing
          ? <span className="h-2.5 w-2.5 border border-slate-500 border-t-blue-400 rounded-full animate-spin" />
          : <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
        {usdRate.toFixed(2)} ₽/$
      </button>

      {/* Donut chart */}
      <div className="shrink-0 w-[90px] h-[90px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={byCategory} cx="50%" cy="50%" innerRadius={28} outerRadius={42} dataKey="value" strokeWidth={0}>
              {byCategory.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const d = payload[0].payload as { name: string; value: number; color: string };
                return (
                  <div className="bg-[#111113] border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl">
                    <span style={{ color: d.color }} className="font-semibold">{d.name}</span>
                    <span className="text-slate-400 ml-2">{d.value} шт.</span>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 flex-1">
        {byCategory.map((c) => (
          <div key={c.name} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ background: c.color }} />
            <span className="text-xs text-slate-400">{c.name}</span>
            <span className="text-xs font-bold tabular-nums" style={{ color: c.color }}>{c.value}</span>
          </div>
        ))}
      </div>

      {/* Stats + курс + refresh */}
      <div className="flex flex-col gap-3 sm:border-l sm:border-white/8 sm:pl-6">
        <div className="flex gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className={`text-2xl font-extrabold tabular-nums leading-none ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
        {/* Rate + refresh */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          title="Нажмите для обновления цен по текущему курсу ЦБ РФ"
          className="flex items-center gap-2 text-[11px] text-slate-500 hover:text-blue-400 transition-colors disabled:opacity-50 group w-fit"
        >
          {refreshing ? (
            <span className="h-3 w-3 border border-slate-500 border-t-blue-400 rounded-full animate-spin shrink-0" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-emerald-400 group-hover:bg-blue-400 transition-colors shrink-0" />
          )}
          <span>
            Курс ЦБ РФ: <span className="text-slate-300 font-semibold tabular-nums">{usdRate.toFixed(2)} ₽/$</span>
            {" "}· <span className="underline underline-offset-2 group-hover:text-blue-400">обновить цены</span>
          </span>
        </button>
      </div>
    </div>
  );
}

// ── Rankings tab ──────────────────────────────────────────────────────────
function RankingsTab({ items, onBuy }: { items: AIItem[]; onBuy: (item: AIItem) => void }) {
  const [category, setCategory] = useState<FilterCategory>("all");
  const [rfOnly, setRfOnly] = useState(false);
  const [freeOnly, setFreeOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"powerScore" | "monthlyPriceRUB">("powerScore");
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    let list = items;
    if (category !== "all") list = list.filter((i) => i.category === category);
    if (rfOnly) list = list.filter((i) => i.rfpStatus === "ru_ok");
    if (freeOnly) list = list.filter((i) => i.hasFreeTier);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((i) => i.name.toLowerCase().includes(q) || i.bestFor.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      const diff = ((a[sortBy] as number) ?? 0) - ((b[sortBy] as number) ?? 0);
      return sortAsc ? diff : -diff;
    });
  }, [items, category, rfOnly, freeOnly, search, sortBy, sortAsc]);

  const maxScore = useMemo(() => Math.max(...filtered.map((i) => i.powerScore), 1), [filtered]);

  const cats: { value: FilterCategory; label: string }[] = [
    { value: "all", label: "Все" },
    { value: "text", label: "Текст" },
    { value: "code", label: "Код" },
    { value: "image", label: "Картинки" },
    { value: "video", label: "Видео" },
  ];

  const toggleSort = (col: "powerScore" | "monthlyPriceRUB") => {
    if (sortBy === col) setSortAsc((v) => !v);
    else { setSortBy(col); setSortAsc(false); }
  };

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition"
          />
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-1 flex-wrap">
          {cats.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(c.value)}
              className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                category === c.value
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-slate-500 hover:text-slate-300 border border-transparent"
              }`}
            >
              {c.value !== "all" && (
                <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: CAT_COLOR[c.value] ?? "#fff" }} />
              )}
              {c.label}
            </button>
          ))}
        </div>

        {/* Toggle filters */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={() => setRfOnly((v) => !v)}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
              rfOnly ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "text-slate-500 border-white/10 hover:text-white hover:border-white/20"
            }`}
          >
            <CheckCircle2 className="h-3 w-3" />Без VPN
          </button>
          <button
            type="button"
            onClick={() => setFreeOnly((v) => !v)}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
              freeOnly ? "bg-blue-500/10 text-blue-400 border-blue-500/30" : "text-slate-500 border-white/10 hover:text-white hover:border-white/20"
            }`}
          >
            <Zap className="h-3 w-3" />Бесплатные
          </button>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-600">
          <Search className="h-8 w-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Ничего не найдено</p>
          <button
            type="button"
            onClick={() => { setCategory("all"); setRfOnly(false); setFreeOnly(false); setSearch(""); }}
            className="mt-3 text-blue-400 text-xs hover:underline"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden md:block rounded-xl border border-white/8 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 bg-white/[0.02]">
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-600 uppercase tracking-widest w-10">#</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Сервис</th>
                  <th
                    className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-center cursor-pointer transition-colors select-none"
                    style={{ color: sortBy === "powerScore" ? "#60a5fa" : "#475569" }}
                    onClick={() => toggleSort("powerScore")}
                  >
                    Мощность {sortBy === "powerScore" ? (sortAsc ? "↑" : "↓") : ""}
                  </th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-600 uppercase tracking-widest text-center">Доступ</th>
                  <th
                    className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-right cursor-pointer transition-colors select-none"
                    style={{ color: sortBy === "monthlyPriceRUB" ? "#60a5fa" : "#475569" }}
                    onClick={() => toggleSort("monthlyPriceRUB")}
                  >
                    Цена/мес {sortBy === "monthlyPriceRUB" ? (sortAsc ? "↑" : "↓") : ""}
                  </th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-600 uppercase tracking-widest text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {filtered.map((item, idx) => {
                  const barWidth = Math.max(4, Math.round((item.powerScore / maxScore) * 100));
                  const brandColor = BRAND[item.id] ?? CAT_COLOR[item.category] ?? "#6b7280";
                  return (
                    <tr key={item.id} className="hover:bg-white/[0.025] transition-colors group">
                      {/* Rank + bar */}
                      <td className="px-4 py-2.5">
                        <div className="flex flex-col items-center gap-1 w-6">
                          <span className="text-[11px] text-slate-600 font-mono tabular-nums leading-none">{idx + 1}</span>
                          <div className="w-1 rounded-full overflow-hidden bg-white/10" style={{ height: 18 }}>
                            <div className="w-full rounded-full" style={{ height: `${barWidth}%`, background: brandColor }} />
                          </div>
                        </div>
                      </td>

                      {/* Service name */}
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2.5">
                          {/* Logo */}
                          <div className="h-7 w-7 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-white/5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.logoUrl}
                              alt=""
                              width={28}
                              height={28}
                              className="h-7 w-7 object-cover rounded-lg"
                              onError={(e) => {
                                const el = e.currentTarget;
                                el.style.display = "none";
                                if (el.parentElement) {
                                  el.parentElement.style.background = brandColor;
                                  el.parentElement.innerHTML = `<span style="color:white;font-size:10px;font-weight:700">${item.name[0]}</span>`;
                                }
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-100 font-medium text-sm leading-tight">{item.name}</span>
                              {item.isPopular && <Flame className="h-3 w-3 text-orange-400 shrink-0" />}
                              {item.isBestChoice && <BadgeCheck className="h-3 w-3 text-blue-400 shrink-0" />}
                              {item.isRussian && (
                                <span className="text-[9px] bg-red-500/15 text-red-400 border border-red-500/20 px-1 rounded font-semibold shrink-0">РФ</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span
                                className="inline-flex items-center gap-0.5 text-[9px] font-medium px-1 py-0.5 rounded"
                                style={{
                                  background: `${CAT_COLOR[item.category]}15`,
                                  color: CAT_COLOR[item.category],
                                }}
                              >
                                <CatIcon cat={item.category} size={9} />
                                {CAT_LABEL[item.category]}
                              </span>
                              <span className="text-slate-600 text-[11px] truncate max-w-[220px]">{item.bestFor}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Power score */}
                      <td className="px-4 py-2.5 text-center">
                        <div className="inline-flex items-center gap-2">
                          <div className="h-1 w-16 rounded-full bg-white/8 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${item.powerScore}%`, background: brandColor }}
                            />
                          </div>
                          <span className="text-xs tabular-nums text-slate-400 font-mono w-6 text-right">{item.powerScore}</span>
                        </div>
                      </td>

                      {/* Access badges */}
                      <td className="px-4 py-2.5 text-center">
                        <div className="flex items-center justify-center gap-1 flex-wrap">
                          <VPNBadge status={item.rfpStatus} />
                          <PayBadge status={item.paymentStatus} />
                          {item.hasFreeTier && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700/50">
                              Бесплатный тариф
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-2.5 text-right">
                        {item.monthlyPriceRUB > 0 ? (
                          <div className="space-y-0.5">
                            <div className="text-white font-bold tabular-nums text-sm">
                              {item.monthlyPriceRUB.toLocaleString("ru")} ₽/мес
                            </div>
                            {item.officialPriceUSD > 0 && (
                              <div className="text-[10px] text-slate-600 tabular-nums">
                                ${item.officialPriceUSD} + {Math.round(COMMISSION_PCT * 100)}% = $
                                {(item.officialPriceUSD * (1 + COMMISSION_PCT)).toFixed(2)}
                              </div>
                            )}
                          </div>
                        ) : item.tokenPriceRUB ? (
                          <div className="space-y-0.5">
                            <div className="text-emerald-400 font-semibold text-sm">Бесплатно</div>
                            <div className="text-[10px] text-slate-600 tabular-nums">{item.tokenPriceRUB} ₽/M ток.</div>
                          </div>
                        ) : (
                          <span className="text-emerald-400 font-semibold text-sm">Бесплатно</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-2.5 text-right">
                        {item.paymentStatus === "foreign_only" ? (
                          <button
                            type="button"
                            onClick={() => onBuy(item)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                          >
                            Купить из РФ
                          </button>
                        ) : (
                          <a
                            href={item.affiliateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:border-white/25 hover:text-white transition-colors"
                          >
                            Открыть <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {filtered.map((item, idx) => {
              const brandColor = BRAND[item.id] ?? CAT_COLOR[item.category] ?? "#6b7280";
              return (
                <div
                  key={item.id}
                  className="rounded-xl bg-white/[0.03] border border-white/8 p-4"
                  style={{ borderLeftColor: brandColor, borderLeftWidth: 2 }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-slate-600 text-xs font-mono shrink-0 w-5">{idx + 1}.</span>
                      <div className="h-7 w-7 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-white/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.logoUrl}
                          alt=""
                          width={28}
                          height={28}
                          className="h-7 w-7 object-cover rounded-lg"
                          onError={(e) => {
                            const el = e.currentTarget;
                            el.style.display = "none";
                            if (el.parentElement) {
                              el.parentElement.style.background = brandColor;
                              el.parentElement.innerHTML = `<span style="color:white;font-size:10px;font-weight:700">${item.name[0]}</span>`;
                            }
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-slate-100 font-semibold text-sm">{item.name}</span>
                          {item.isPopular && <Flame className="h-3 w-3 text-orange-400 shrink-0" />}
                          {item.isBestChoice && <BadgeCheck className="h-3 w-3 text-blue-400 shrink-0" />}
                        </div>
                        <p className="text-slate-600 text-[11px] leading-snug mt-0.5 line-clamp-1">{item.bestFor}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {item.monthlyPriceRUB > 0 ? (
                        <span className="text-white font-bold text-sm tabular-nums">{item.monthlyPriceRUB.toLocaleString("ru")}₽</span>
                      ) : (
                        <span className="text-emerald-400 font-bold text-sm">Free</span>
                      )}
                    </div>
                  </div>

                  {/* Power bar */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 h-1 rounded-full bg-white/8 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${item.powerScore}%`, background: brandColor }} />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 tabular-nums w-6 text-right">{item.powerScore}</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap mb-3">
                    <VPNBadge status={item.rfpStatus} />
                    <PayBadge status={item.paymentStatus} />
                    {item.hasFreeTier && (
                      <span className="text-[10px] bg-white/5 text-slate-500 border border-white/10 px-1.5 py-0.5 rounded font-medium">Бесплатный тариф</span>
                    )}
                  </div>

                  {item.paymentStatus === "foreign_only" ? (
                    <button
                      type="button"
                      onClick={() => onBuy(item)}
                      className="w-full text-xs font-semibold py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                    >
                      Купить из РФ
                    </button>
                  ) : (
                    <a
                      href={item.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 w-full text-xs font-medium py-2 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors"
                    >
                      Перейти <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ── Market tab ────────────────────────────────────────────────────────────
function MarketTab({ items }: { items: AIItem[] }) {
  const topByScore = useMemo(() => [...items].sort((a, b) => b.powerScore - a.powerScore).slice(0, 10), [items]);

  const customTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; fill: string }>;
    label?: string;
  }) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-[#111113] border border-white/10 rounded-xl p-3 shadow-2xl text-xs">
        <p className="text-slate-500 mb-2">{label}</p>
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ background: p.fill }} />
            <span className="text-slate-400">{p.name}:</span>
            <span className="text-white font-bold">{p.value}%</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-sm font-semibold text-slate-300 mb-1">Доля рынка по провайдерам</h2>
        <p className="text-xs text-slate-600 mb-4">Примерное распределение токенов глобально, 2026</p>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MARKET_SHARE_DATA} stackOffset="expand" margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1f" />
              <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v: number) => `${Math.round(v * 100)}%`} tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <RechartsTooltip content={customTooltip as any} />
              {MARKET_PROVIDERS.map((p) => (
                <Area key={p.key} type="monotone" dataKey={p.key} stackId="1" stroke={p.color} fill={p.color} fillOpacity={0.8} name={p.label} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-3 mt-4">
          {MARKET_PROVIDERS.map((p) => (
            <div key={p.key} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full shrink-0" style={{ background: p.color }} />
              <span className="text-xs text-slate-500">{p.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-300 mb-4">Топ-10 по рейтингу мощности</h2>
        <div className="space-y-1.5">
          {topByScore.map((item, idx) => {
            const brandColor = BRAND[item.id] ?? CAT_COLOR[item.category] ?? "#6b7280";
            return (
              <div key={item.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/8 hover:border-white/15 transition-colors">
                <span className="text-slate-600 text-xs font-mono w-5 shrink-0 tabular-nums">{idx + 1}.</span>
                <span className="h-2 w-2 rounded-full shrink-0" style={{ background: brandColor }} />
                <span className="text-slate-300 text-sm font-medium flex-1 truncate">{item.name}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1 w-20 rounded-full bg-white/8 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${item.powerScore}%`, background: brandColor }} />
                  </div>
                  <span className="text-xs tabular-nums text-slate-500 font-mono w-6 text-right">{item.powerScore}</span>
                </div>
                <VPNBadge status={item.rfpStatus} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Metrics tab ────────────────────────────────────────────────────────────
function MetricsTab({ items }: { items: AIItem[] }) {
  const [selCat, setSelCat] = useState<FilterCategory>("all");
  const filtered = selCat === "all" ? items : items.filter((i) => i.category === selCat);
  const sorted = useMemo(() => [...filtered].sort((a, b) => b.powerScore - a.powerScore).slice(0, 15), [filtered]);

  const chartData = sorted.map((i) => ({
    name: i.name.length > 15 ? i.name.slice(0, 13) + "…" : i.name,
    fullName: i.name,
    score: i.powerScore,
    fill: BRAND[i.id] ?? CAT_COLOR[i.category] ?? "#6b7280",
  }));

  const customBar = (props: { x?: number; y?: number; width?: number; height?: number; fill?: string; value?: number | [number, number] }) => {
    const { x = 0, y = 0, width = 0, height = 0, fill, value } = props;
    const numValue = Array.isArray(value) ? value[1] - value[0] : value;
    return (
      <g>
        <rect x={x} y={y} width={width} height={height} fill={fill} rx={3} />
        {numValue !== undefined && numValue > 0 && (
          <text x={x + width + 6} y={y + height / 2 + 4} fill="#64748b" fontSize={10} fontFamily="monospace">{numValue}</text>
        )}
      </g>
    );
  };

  const cats: { value: FilterCategory; label: string }[] = [
    { value: "all", label: "Все" },
    { value: "text", label: "Текст" },
    { value: "code", label: "Код" },
    { value: "image", label: "Картинки" },
    { value: "video", label: "Видео" },
  ];

  return (
    <div className="space-y-6">
      {/* Category filter */}
      <div className="flex items-center gap-1 flex-wrap">
        {cats.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => setSelCat(c.value)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
              selCat === c.value
                ? "bg-white/10 text-white border border-white/20"
                : "text-slate-500 hover:text-slate-300 border border-transparent"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Bar chart */}
      <div>
        <h2 className="text-sm font-semibold text-slate-300 mb-4">Рейтинг мощности (0–100)</h2>
        <div style={{ height: sorted.length * 36 + 20 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={chartData} margin={{ top: 0, right: 60, left: 0, bottom: 0 }} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1f" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <RechartsTooltip
                cursor={{ fill: "#ffffff06" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null;
                  const d = payload[0].payload as { fullName: string; score: number };
                  return (
                    <div className="bg-[#111113] border border-white/10 rounded-xl p-3 shadow-xl text-xs">
                      <p className="text-white font-semibold">{d.fullName}</p>
                      <p className="text-slate-500">Мощность: <span className="text-white font-bold">{d.score}/100</span></p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="score" radius={3} shape={customBar} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison grid */}
      <div>
        <h2 className="text-sm font-semibold text-slate-300 mb-4">Детальное сравнение</h2>
        <div className="overflow-x-auto rounded-xl border border-white/8">
          <table className="w-full min-w-[580px] text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-white/[0.02]">
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-600 uppercase tracking-widest w-40">Сервис</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-600 uppercase tracking-widest text-center">Мощность</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-600 uppercase tracking-widest text-center">Без VPN</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-600 uppercase tracking-widest text-center">Карты РФ</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-600 uppercase tracking-widest text-center">Бесплатно</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-600 uppercase tracking-widest text-right">Цена</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {sorted.map((item) => {
                const brandColor = BRAND[item.id] ?? CAT_COLOR[item.category] ?? "#6b7280";
                return (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ background: brandColor }} />
                        <span className="text-slate-300 font-medium text-xs truncate max-w-[130px]">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className="text-white font-bold tabular-nums text-xs font-mono">{item.powerScore}</span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {item.rfpStatus === "ru_ok"
                        ? <CheckCircle2 className="h-4 w-4 text-emerald-400 mx-auto" />
                        : <XCircle className="h-4 w-4 text-white/10 mx-auto" />}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {item.paymentStatus === "ru_cards"
                        ? <CheckCircle2 className="h-4 w-4 text-emerald-400 mx-auto" />
                        : <XCircle className="h-4 w-4 text-white/10 mx-auto" />}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {item.hasFreeTier
                        ? <CheckCircle2 className="h-4 w-4 text-emerald-400 mx-auto" />
                        : <XCircle className="h-4 w-4 text-white/10 mx-auto" />}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="text-slate-400 text-xs tabular-nums">
                        {item.monthlyPriceRUB > 0 ? `${item.monthlyPriceRUB.toLocaleString("ru")} ₽` : <span className="text-emerald-400">Бесплатно</span>}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Главный компонент ─────────────────────────────────────────────────────
export default function CompareClient({ initialItems, usdRate: initialRate }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>((searchParams.get("tab") as Tab) ?? "rankings");
  const [buyItem, setBuyItem] = useState<AIItem | null>(null);
  const [items, setItems] = useState<AIItem[]>(initialItems);
  const [usdRate, setUsdRate] = useState(initialRate);
  const [refreshing, setRefreshing] = useState(false);

  const setTab = (tab: Tab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/compare-models");
      if (!res.ok) throw new Error("fetch error");
      const data = await res.json();
      if (data.items) setItems(data.items);
      if (data.usdRate) setUsdRate(data.usdRate);
    } catch {
      // тихо игнорируем — показываем прежние данные
    } finally {
      setRefreshing(false);
    }
  }, []);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "rankings", label: "Рейтинг", icon: <Trophy className="h-3.5 w-3.5" /> },
    { id: "market", label: "Рынок", icon: <BarChart2 className="h-3.5 w-3.5" /> },
    { id: "metrics", label: "Метрики", icon: <TrendingUp className="h-3.5 w-3.5" /> },
  ];

  return (
    <>
      {/* Summary donut + stats */}
      <SummarySection items={items} usdRate={usdRate} onRefresh={handleRefresh} refreshing={refreshing} />

      {/* Tabs */}
      <div className="flex items-center gap-0.5 border-b border-white/8 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all relative ${
              activeTab === tab.id ? "text-white" : "text-slate-600 hover:text-slate-400"
            }`}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-px bg-blue-500" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "rankings" && <RankingsTab items={items} onBuy={setBuyItem} />}
      {activeTab === "market" && <MarketTab items={items} />}
      {activeTab === "metrics" && <MetricsTab items={items} />}

      {buyItem && <BuyModal item={buyItem} onClose={() => setBuyItem(null)} />}
    </>
  );
}
