"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

const CATEGORIES = [
  { value: "work",  label: "Работа", emoji: "💼", desc: "Скрипты, боты, автоматизация для бизнеса" },
  { value: "study", label: "Учёба",  emoji: "📚", desc: "Курсы, тесты, конспекты, репетиторы" },
  { value: "home",  label: "Дом",    emoji: "🏠", desc: "Умный дом, бюджет, быт и рецепты" },
  { value: "hobby", label: "Хобби",  emoji: "🎨", desc: "Музыка, фото, творчество, спорт" },
  { value: "ai",    label: "AI/Tech",emoji: "🤖", desc: "Промпты, модели, инструменты ИИ" },
  { value: "general", label: "Общее", emoji: "✨", desc: "Всё подряд без категории" },
];

export default function InterestsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/user/interests")
      .then((r) => r.json())
      .then((d) => { setSelected(d.interests ?? []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggle = (cat: string) => {
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/interests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: selected }),
      });
      if (!res.ok) throw new Error();
      toast.success("Интересы сохранены — лента обновится");
      router.push("/");
    } catch {
      toast.error("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          На главную
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#005BFF] to-[#00BFFF] flex items-center justify-center shadow-sm">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Ваши интересы</h1>
          </div>
          <p className="text-gray-500 text-sm ml-13">
            Выберите темы — лента на главной будет показывать только нужное.
            Если ничего не выбрано, показывается всё.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-[#005BFF]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {CATEGORIES.map((cat) => {
              const active = selected.includes(cat.value);
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => toggle(cat.value)}
                  className={cn(
                    "relative flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200",
                    active
                      ? "border-[#005BFF] bg-blue-50/60 shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  )}
                >
                  <span className="text-2xl leading-none mt-0.5">{cat.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className={cn("font-semibold text-sm", active ? "text-[#005BFF]" : "text-gray-800")}>
                      {cat.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{cat.desc}</p>
                  </div>
                  {active && (
                    <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-[#005BFF] flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {selected.length === 0
              ? "Не выбрано — показываем всё"
              : `Выбрано: ${selected.length} из ${CATEGORIES.length}`}
          </p>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#005BFF] to-[#0070ff] text-white font-semibold text-sm rounded-xl hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
