"use client";

import { useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import {
  Bold, Italic, Underline, Strikethrough, Link2, Quote,
  Code, List, ListOrdered, Heading4, Heading5, Heading6,
  Image as ImageIcon, Minus, Eye, EyeOff, Tag, X, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface NewPostFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CATEGORIES = [
  { value: "general", label: "Общее" },
  { value: "ai",      label: "AI / Tech" },
  { value: "work",    label: "Работа" },
  { value: "study",   label: "Учёба" },
  { value: "home",    label: "Дом" },
  { value: "hobby",   label: "Хобби" },
];

type ToolbarAction = {
  icon: React.ReactNode;
  title: string;
  action: () => void;
  separator?: false;
} | { separator: true; icon?: never; title?: never; action?: never };

function wrapSelection(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
  placeholder = "текст"
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.slice(start, end) || placeholder;
  const newText =
    textarea.value.slice(0, start) +
    before + selected + after +
    textarea.value.slice(end);
  return { newText, cursor: start + before.length + selected.length + after.length };
}

function insertLine(
  textarea: HTMLTextAreaElement,
  prefix: string
) {
  const start = textarea.selectionStart;
  const val = textarea.value;
  const lineStart = val.lastIndexOf("\n", start - 1) + 1;
  const lineEnd = val.indexOf("\n", start);
  const end = lineEnd === -1 ? val.length : lineEnd;
  const line = val.slice(lineStart, end);
  const newLine = line.startsWith(prefix) ? line.slice(prefix.length) : prefix + line;
  const newText = val.slice(0, lineStart) + newLine + val.slice(end);
  return { newText, cursor: lineStart + newLine.length };
}

export default function NewPostForm({ onSuccess, onCancel }: NewPostFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyWrap = useCallback((before: string, after: string, placeholder?: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const { newText, cursor } = wrapSelection(ta, before, after, placeholder);
    setContent(newText);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(cursor, cursor);
    });
  }, []);

  const applyLine = useCallback((prefix: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const { newText, cursor } = insertLine(ta, prefix);
    setContent(newText);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(cursor, cursor);
    });
  }, []);

  const insertRaw = useCallback((text: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const newText = content.slice(0, start) + text + content.slice(start);
    setContent(newText);
    const pos = start + text.length;
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(pos, pos);
    });
  }, [content]);

  const toolbarActions: ToolbarAction[] = [
    { icon: <Heading4 className="h-3.5 w-3.5" />, title: "H4", action: () => applyLine("#### ") },
    { icon: <Heading5 className="h-3.5 w-3.5" />, title: "H5", action: () => applyLine("##### ") },
    { icon: <Heading6 className="h-3.5 w-3.5" />, title: "H6", action: () => applyLine("###### ") },
    { separator: true },
    { icon: <List className="h-3.5 w-3.5" />, title: "Список", action: () => applyLine("- ") },
    { icon: <ListOrdered className="h-3.5 w-3.5" />, title: "Нум. список", action: () => applyLine("1. ") },
    { icon: <Minus className="h-3.5 w-3.5" />, title: "Разделитель", action: () => insertRaw("\n\n---\n\n") },
    { separator: true },
    { icon: <Bold className="h-3.5 w-3.5" />, title: "Жирный", action: () => applyWrap("**", "**", "жирный") },
    { icon: <Italic className="h-3.5 w-3.5" />, title: "Курсив", action: () => applyWrap("*", "*", "курсив") },
    { icon: <Underline className="h-3.5 w-3.5" />, title: "Подчёркнутый", action: () => applyWrap("<u>", "</u>", "текст") },
    { icon: <Strikethrough className="h-3.5 w-3.5" />, title: "Зачёркнутый", action: () => applyWrap("~~", "~~", "текст") },
    { separator: true },
    { icon: <Link2 className="h-3.5 w-3.5" />, title: "Ссылка", action: () => applyWrap("[", "](https://)", "текст ссылки") },
    { icon: <Quote className="h-3.5 w-3.5" />, title: "Цитата", action: () => applyLine("> ") },
    { icon: <Code className="h-3.5 w-3.5" />, title: "Код", action: () => applyWrap("`", "`", "код") },
    { separator: true },
    { icon: <ImageIcon className="h-3.5 w-3.5" />, title: "Изображение", action: () => applyWrap("![", "](https://)", "описание") },
  ];

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/[^а-яёa-z0-9\-_]/gi, "");
    if (t && !tags.includes(t) && tags.length < 8) {
      setTags((prev) => [...prev, t]);
      setTagInput("");
    }
  };

  const submit = async (status: "PUBLISHED" | "DRAFT") => {
    if (!title.trim() || !content.trim()) {
      toast.error("Заполните заголовок и текст");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          category,
          tags,
          status,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Ошибка"); return; }
      toast.success(status === "DRAFT" ? "Сохранено в черновики" : "Пост опубликован!");
      onSuccess();
    } catch {
      toast.error("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/[0.08] rounded-2xl shadow-sm overflow-hidden mb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-white/[0.08] bg-gray-50/60 dark:bg-slate-800/50">
        <h2 className="font-semibold text-gray-800 dark:text-slate-200 text-sm">Создание топика</h2>
        <button type="button" title="Закрыть" onClick={onCancel} className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-white transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Category (Club) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Тема / Клуб:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            title="Выберите тему"
            aria-label="Тема / Клуб"
            className="w-full border border-gray-200 dark:border-white/[0.08] rounded-xl px-3 py-2 text-sm bg-white dark:bg-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#005BFF]/30 focus:border-[#005BFF]/40"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Заголовок:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Заголовок должен быть наполнен смыслом..."
            maxLength={200}
            className="w-full border border-gray-200 dark:border-white/[0.08] rounded-xl px-3 py-2 text-sm bg-white dark:bg-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#005BFF]/30 focus:border-[#005BFF]/40"
          />
          <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1">
            Заголовок должен быть наполнен смыслом, чтобы можно было понять, о чём будет топик.
          </p>
        </div>

        {/* Editor */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Текст:</label>
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400 hover:text-[#005BFF] dark:hover:text-blue-400 transition-colors"
            >
              {preview ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              {preview ? "Редактор" : "Предпросмотр"}
            </button>
          </div>

          {/* Toolbar */}
          {!preview && (
            <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-white/[0.08] rounded-t-xl border-b-0">
              {toolbarActions.map((item, i) =>
                item.separator ? (
                  <div key={i} className="w-px h-4 bg-gray-200 dark:bg-slate-600 mx-1" />
                ) : (
                  <button
                    key={i}
                    type="button"
                    title={item.title}
                    onClick={item.action}
                    className="h-7 w-7 flex items-center justify-center rounded-lg text-gray-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-600 hover:text-gray-900 dark:hover:text-white hover:shadow-sm transition-all duration-150 text-[11px] font-semibold"
                  >
                    {item.icon}
                  </button>
                )
              )}
            </div>
          )}

          {preview ? (
            <div className="min-h-[200px] border border-gray-200 dark:border-white/[0.08] rounded-xl px-4 py-3 prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-slate-200 text-sm leading-relaxed dark:bg-slate-900">
              {content ? (
                <ReactMarkdown>{content}</ReactMarkdown>
              ) : (
                <p className="text-gray-400 dark:text-slate-500 italic">Нет текста для предпросмотра...</p>
              )}
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Текст топика... (поддерживается Markdown)"
              rows={10}
              className="w-full border border-gray-200 dark:border-white/[0.08] rounded-b-xl px-3 py-3 text-sm font-mono leading-relaxed bg-white dark:bg-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#005BFF]/30 focus:border-[#005BFF]/40 resize-y"
            />
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
            <Tag className="h-3.5 w-3.5 text-[#005BFF]" />
            Метки:
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-500/10 text-[#005BFF] dark:text-blue-400 text-xs px-2.5 py-1 rounded-full font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                  className="hover:text-red-500 transition-colors leading-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); }
              }}
              placeholder="Добавить метку, нажмите Enter или ,"
              maxLength={30}
              className="flex-1 border border-gray-200 dark:border-white/[0.08] rounded-xl px-3 py-2 text-sm bg-white dark:bg-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#005BFF]/30"
            />
            <button
              type="button"
              title="Добавить метку"
              onClick={addTag}
              disabled={!tagInput.trim()}
              className="px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 text-sm rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors"
            >
              +
            </button>
          </div>
          <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1">
            Разделяйте запятой или Enter. Например: ai, python, автоматизация
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/[0.08]">
          <button
            type="button"
            onClick={() => submit("DRAFT")}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Сохранить в черновики
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="px-4 py-2 text-sm text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white border border-gray-200 dark:border-white/[0.08] rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              {preview ? "← Редактор" : "Предпросмотр"}
            </button>
            <button
              type="button"
              onClick={() => submit("PUBLISHED")}
              disabled={loading || !title.trim() || !content.trim()}
              className={cn(
                "flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white rounded-xl transition-all",
                "bg-gradient-to-r from-[#005BFF] to-[#0070ff] hover:opacity-90 shadow-sm",
                "disabled:opacity-40 disabled:cursor-not-allowed"
              )}
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Опубликовать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
