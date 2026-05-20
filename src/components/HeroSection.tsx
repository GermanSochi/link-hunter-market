import Link from "next/link";
import { Sparkles, ArrowRight, Zap, Star, Shield, MessageCircle, Users } from "lucide-react";

const STATS = [
  { value: "5 000+", label: "Групп Telegram/WhatsApp" },
  { value: "25 000+", label: "Пользователей" },
  { value: "4.9", label: "Средний рейтинг", icon: Star },
  { value: "100%", label: "Модерация", icon: Shield },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white border-b border-gray-100">
      {/* Animated background blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-[0.07] animate-blob"
          style={{ background: "radial-gradient(circle, #005BFF, transparent)" }}
        />
        <div
          className="absolute -top-16 right-0 h-[400px] w-[400px] rounded-full opacity-[0.05] animate-blob animation-delay-3s"
          style={{ background: "radial-gradient(circle, #0099FF, transparent)" }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full opacity-[0.04] animate-blob animation-delay-6s"
          style={{ background: "radial-gradient(circle, #005BFF, transparent)" }}
        />
        {/* Grid pattern */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#005BFF" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 md:pt-16 md:pb-12">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="animate-fade-in inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-[#005BFF] text-xs font-semibold px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Маркетплейс групп №1 в СНГ
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-in-up text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.08] mb-5"
            style={{ animationDelay: "80ms" }}
          >
            <span className="text-[#1a1a1a]">Найди лучшие</span>
            <br />
            <span className="text-gradient-hero">группы Telegram/WhatsApp</span>
            <br />
            <span className="text-[#1a1a1a]">для работы и общения</span>
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fade-in-up text-gray-500 text-lg md:text-xl leading-relaxed mb-8 max-w-xl mx-auto"
            style={{ animationDelay: "160ms" }}
          >
            Тысячи проверенных групп по любым темам. Покупай, меняй, зарабатывай.
          </p>

          {/* CTA Buttons */}
          <div
            className="animate-fade-in-up flex flex-col sm:flex-row gap-3 justify-center mb-10"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              href="/products"
              className="group inline-flex items-center justify-center gap-2 bg-gradient-blue text-white font-semibold text-base px-7 py-3 rounded-2xl shadow-sm hover:shadow-blue-glow hover:opacity-90 transition-all duration-200 press"
            >
              <MessageCircle className="h-4 w-4" />
              Смотреть каталог
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold text-base px-7 py-3 rounded-2xl hover:border-[#005BFF]/40 hover:text-[#005BFF] transition-all duration-200 press shadow-sm"
            >
              <Users className="h-4 w-4" />
              Добавить свою группу
            </Link>
          </div>

          {/* Stats row */}
          <div
            className="animate-fade-in-up grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto"
            style={{ animationDelay: "320ms" }}
          >
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="bg-white/80 rounded-2xl border border-gray-100 p-3 shadow-sm hover:shadow-card-hover transition-shadow duration-200">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  {Icon && <Icon className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />}
                  <span className="text-xl font-bold text-[#1a1a1a] tabular-nums">{value}</span>
                </div>
                <p className="text-[11px] text-gray-500 text-center leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
