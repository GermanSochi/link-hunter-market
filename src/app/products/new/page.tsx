"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const CATEGORIES = [
  { id: "work",  label: "💼 Работа",    desc: "Промпты, скрипты автоматизации, бизнес-инструменты" },
  { id: "study", label: "📚 Учёба",     desc: "Образовательные AI-наборы, конспекты, тьюториалы" },
  { id: "home",  label: "🏠 Дом",       desc: "Home Assistant, умный дом, бытовые скрипты" },
  { id: "hobby", label: "🎨 Хобби",     desc: "Midjourney, Suno, Stable Diffusion, творчество" },
  { id: "ai",    label: "🤖 AI/Tech",   desc: "Нейросети, LLM-паки, dev-утилиты" },
];

export default function NewProductPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    priceCents: 0,
    aiModel: "",
    trialUrl: "",
    tags: [] as string[],
    tagInput: "",
  });

  const set = (key: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addTag = () => {
    const tag = form.tagInput.trim().toLowerCase().replace(/[^a-zа-яё0-9-]/gi, "");
    if (!tag || form.tags.includes(tag) || form.tags.length >= 8) return;
    set("tags", [...form.tags, tag]);
    set("tagInput", "");
  };

  const removeTag = (t: string) => set("tags", form.tags.filter((x) => x !== t));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.category) {
      toast.error("Заполните все обязательные поля");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          priceCents: form.priceCents,
          aiModel: form.aiModel,
          trialUrl: form.trialUrl,
          tags: form.tags,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Ошибка"); return; }
      toast.success("Товар отправлен на модерацию!");
      router.push("/account?tab=seller");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f7f8fc] min-h-screen py-8">
      <MaxWidthWrapper className="max-w-2xl">
        <div className="mb-6">
          <Link href="/account?tab=seller" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft size={15} /> Назад
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900">Загрузить товар</h1>
            <p className="text-sm text-gray-500 mt-1">После отправки товар проходит модерацию (обычно до 24 часов)</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Название <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Например: GPT-4 промпты для маркетологов"
                maxLength={120}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BFF]/30"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Описание <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Что входит в набор? Для кого? Какие результаты?"
                rows={5}
                maxLength={2000}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BFF]/30 resize-none"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{form.description.length}/2000</p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категория <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => set("category", cat.id)}
                    className={`text-left px-3.5 py-2.5 rounded-xl border text-sm transition-all ${
                      form.category === cat.id
                        ? "border-[#005BFF] bg-blue-50 text-[#005BFF]"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className="font-medium">{cat.label}</span>
                    <span className="block text-xs text-gray-400 mt-0.5 leading-snug">{cat.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Цена (₽)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={form.priceCents / 100}
                  onChange={(e) => set("priceCents", Math.round(parseFloat(e.target.value || "0") * 100))}
                  placeholder="0"
                  className="w-36 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BFF]/30"
                />
                <span className="text-sm text-gray-500">0 = бесплатно</span>
              </div>
            </div>

            {/* AI Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">AI-модель (необязательно)</label>
              <input
                type="text"
                value={form.aiModel}
                onChange={(e) => set("aiModel", e.target.value)}
                placeholder="GPT-4o, Stable Diffusion XL, Midjourney v6..."
                maxLength={80}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BFF]/30"
              />
            </div>

            {/* Trial URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ссылка демо (необязательно)</label>
              <input
                type="url"
                value={form.trialUrl}
                onChange={(e) => set("trialUrl", e.target.value)}
                placeholder="https://..."
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BFF]/30"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Теги (до 8)</label>
              <div className="flex gap-2 flex-wrap mb-2">
                {form.tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 bg-blue-50 text-[#005BFF] text-xs px-2.5 py-1 rounded-full font-medium">
                    #{t}
                    <button type="button" onClick={() => removeTag(t)} className="ml-0.5 hover:text-blue-800">&times;</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.tagInput}
                  onChange={(e) => set("tagInput", e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
                  placeholder="Введите тег и нажмите Enter"
                  maxLength={30}
                  className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BFF]/30"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#005BFF] to-[#0070ff] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity shadow-sm"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {submitting ? "Отправка..." : "Отправить на модерацию"}
              </button>
              <Link
                href="/account?tab=seller"
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Отмена
              </Link>
            </div>
          </form>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
