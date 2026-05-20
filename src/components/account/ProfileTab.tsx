"use client";

import { useState } from "react";
import { Save, Send } from "lucide-react";
import { Icons } from "@/components/Icons";

type Provider = { provider: string };

type ProfileUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  accounts: Provider[];
};

export default function ProfileTab({ user }: { user: ProfileUser }) {
  const [name, setName] = useState(user.name ?? "");
  const [saved, setSaved] = useState(false);

  const providers = user.accounts.map((a) => a.provider);
  const isOAuthEmail = providers.some((p) => ["google", "github", "yandex"].includes(p));
  const hasTelegram = providers.includes("telegram");

  const handleSave = async () => {
    // TODO: PATCH /api/account/profile { name }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-lg space-y-5">
      {/* Аватар */}
      <div className="flex items-center gap-4">
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt={user.name ?? ""} className="h-16 w-16 rounded-full object-cover border border-gray-200" />
        ) : (
          <div className="h-16 w-16 rounded-full bg-[#005BFF]/10 flex items-center justify-center text-[#005BFF] text-2xl font-bold">
            {(user.name ?? user.email)[0].toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-semibold text-[#242424]">{user.name ?? "Без имени"}</p>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
      </div>

      {/* Имя */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Имя</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#005BFF] focus:ring-2 focus:ring-[#005BFF]/20 transition-colors"
          placeholder="Ваше имя"
        />
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
        <input
          value={user.email}
          disabled={isOAuthEmail}
          className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
        />
        {isOAuthEmail && (
          <p className="text-[11px] text-gray-400">Email привязан через OAuth — изменить нельзя</p>
        )}
      </div>

      {/* Привязанные провайдеры */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Способы входа</p>
        <div className="flex flex-wrap gap-2">
          {providers.map((p) => (
            <span key={p} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-700">
              {p === "github" && <Icons.github className="h-3.5 w-3.5" />}
              {p === "yandex" && <Icons.yandex className="h-3.5 w-3.5" />}
              {p === "telegram" && <Icons.telegram className="h-3.5 w-3.5" />}
              {p === "credentials" ? "Email / пароль" : p.charAt(0).toUpperCase() + p.slice(1)}
            </span>
          ))}
        </div>
      </div>

      {/* Привязать Telegram */}
      {!hasTelegram && (
        <div className="flex items-center justify-between p-3 border border-dashed border-gray-300 rounded-xl">
          <div>
            <p className="text-sm font-medium text-[#242424]">Привязать Telegram</p>
            <p className="text-xs text-gray-400">Для входа и уведомлений</p>
          </div>
          <a
            href="/sign-in"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2AABEE] text-white text-xs font-medium rounded-lg hover:bg-[#229ED9] transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
            Привязать
          </a>
        </div>
      )}

      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-4 py-2 bg-[#005BFF] text-white text-sm font-medium rounded-lg hover:bg-[#004DE0] transition-colors"
      >
        <Save className="h-4 w-4" />
        {saved ? "Сохранено ✓" : "Сохранить"}
      </button>
    </div>
  );
}
