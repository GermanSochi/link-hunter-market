"use client";

import { useEffect, useRef, useCallback } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";

type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

declare global {
  interface Window {
    onTelegramAuth: (user: TelegramUser) => void;
  }
}

interface Props {
  callbackUrl?: string;
}

const TelegramLoginButton = ({ callbackUrl = "/" }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;

  const handleAuth = useCallback(
    async (user: TelegramUser) => {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error ?? "Ошибка верификации");
        }

        const { token } = await res.json();
        const result = await signIn("telegram", { token, redirect: false });

        if (result?.error) throw new Error("Ошибка входа");

        toast.success("Добро пожаловать через Telegram!");
        window.location.href = callbackUrl;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Ошибка входа через Telegram");
        setLoading(false);
      }
    },
    [callbackUrl]
  );

  useEffect(() => {
    if (!botUsername || botUsername === "YOUR_BOT_USERNAME") return;
    if (!containerRef.current) return;

    window.onTelegramAuth = handleAuth;

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "8");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");

    const container = containerRef.current;
    container.appendChild(script);

    return () => {
      if (container.contains(script)) container.removeChild(script);
      window.onTelegramAuth = undefined as unknown as (user: TelegramUser) => void;
    };
  }, [botUsername, handleAuth]);

  // Не показывать кнопку если бот не настроен
  if (!botUsername || botUsername === "YOUR_BOT_USERNAME") return null;

  return (
    <div className="relative w-full flex flex-col items-center">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg z-10">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      )}
      <div ref={containerRef} className="flex justify-center" />
    </div>
  );
};

export default TelegramLoginButton;
