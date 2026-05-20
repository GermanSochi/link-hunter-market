"use client";

import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, Ghost } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const TelegramLoginButton = dynamic(() => import("@/components/TelegramLoginButton"), {
  ssr: false,
  loading: () => null,
});

const SignInSchema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(8, "Минимум 8 символов"),
});
type SignInForm = z.infer<typeof SignInSchema>;

type OAuthProvider = "google" | "github" | "yandex";

function SignIn() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<OAuthProvider | null>(null);
  const [guestLoading, setGuestLoading] = useState(false);
  const isGuestMode = searchParams.get("guest") === "1";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({ resolver: zodResolver(SignInSchema) });

  const onSubmit = async ({ email, password }: SignInForm) => {
    setIsLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setIsLoading(false);
    if (result?.error) {
      toast.error("Неверный email или пароль");
      return;
    }
    toast.success("Добро пожаловать!");
    router.push(callbackUrl);
    router.refresh();
  };

  const handleOAuth = async (provider: OAuthProvider) => {
    setOauthLoading(provider);
    await signIn(provider, { callbackUrl });
  };

  const disabled = isLoading || !!oauthLoading || guestLoading;

  const handleGuest = async () => {
    setGuestLoading(true);
    try {
      const res = await fetch("/api/auth/guest", { method: "POST" });
      if (!res.ok) { toast.error("Не удалось создать гостевой аккаунт"); return; }
      const { email, password } = await res.json();
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) { toast.error("Ошибка входа гостя"); return; }
      toast.success("Вы вошли как гость! +50 монет на счёт 🎁");
      router.push(callbackUrl);
      router.refresh();
    } finally {
      setGuestLoading(false);
    }
  };

  // Auto-trigger guest flow if arrived via NavBar ghost button
  useEffect(() => {
    if (isGuestMode) handleGuest();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex flex-col items-center space-y-2 text-center">
        <Icons.aiMarketLogo className="h-16 w-auto" />
        <h1 className="text-2xl font-semibold tracking-tight">Войти в аккаунт</h1>
        <Link
          className={buttonVariants({ variant: "link", className: "gap-1.5" })}
          href="/sign-up"
        >
          Нет аккаунта? Зарегистрироваться
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4">
        {/* OAuth — 3 кнопки */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            onClick={() => handleOAuth("google")}
            disabled={disabled}
            className="gap-1.5"
            title="Google"
          >
            {oauthLoading === "google" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Google</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => handleOAuth("github")}
            disabled={disabled}
            className="gap-1.5"
            title="GitHub"
          >
            {oauthLoading === "github" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Icons.github className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">GitHub</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => handleOAuth("yandex")}
            disabled={disabled}
            className="gap-1.5"
            title="Яндекс"
          >
            {oauthLoading === "yandex" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Icons.yandex className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Яндекс</span>
          </Button>
        </div>

        {/* Telegram виджет */}
        <TelegramLoginButton callbackUrl={callbackUrl} />

        {/* Guest button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGuest}
          disabled={disabled}
          className="w-full gap-2 border-dashed border-gray-300 text-gray-500 hover:border-[#005BFF]/50 hover:text-[#005BFF] hover:bg-blue-50/50"
        >
          {guestLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Ghost className="h-4 w-4" />
          )}
          Войти как гость
          <span className="ml-auto text-[10px] bg-green-100 text-green-700 font-semibold px-1.5 py-0.5 rounded-full">
            +50 монет
          </span>
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">или email</span>
          </div>
        </div>

        {/* Email / Password */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-1 py-1">
              <Label htmlFor="email">Email</Label>
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="you@example.com"
                className={cn({ "focus-visible:ring-red-500": errors.email })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-1 py-1">
              <Label htmlFor="password">Пароль</Label>
              <Input
                {...register("password")}
                id="password"
                type="password"
                placeholder="Минимум 8 символов"
                className={cn({ "focus-visible:ring-red-500": errors.password })}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button disabled={disabled}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Войти
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default SignIn;
