"use client";

import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useState } from "react";

const SignUpSchema = z.object({
  name: z.string().min(2, "Минимум 2 символа").max(50).optional(),
  email: z.string().email("Некорректный email"),
  password: z.string().min(8, "Минимум 8 символов").max(72),
});
type SignUpForm = z.infer<typeof SignUpSchema>;

function SignUp() {
  const router = useRouter();
  const [oauthLoading, setOauthLoading] = useState<"google" | "yandex" | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({ resolver: zodResolver(SignUpSchema) });

  const { mutate, isPending: isLoading } = trpc.auth.register.useMutation({
    onError: (err) => {
      if (err.data?.code === "CONFLICT") {
        toast.error("Email уже занят. Войдите в аккаунт.");
        return;
      }
      toast.error("Ошибка регистрации. Попробуйте ещё раз.");
    },
    onSuccess: async (_, vars) => {
      // После регистрации — автовход через NextAuth Credentials
      const result = await signIn("credentials", {
        email: vars.email,
        password: vars.password,
        redirect: false,
      });
      if (!result?.error) {
        toast.success("Аккаунт создан! Добро пожаловать!");
        router.push("/");
        router.refresh();
      } else {
        toast.success("Аккаунт создан! Теперь войдите.");
        router.push("/sign-in");
      }
    },
  });

  function onSubmit({ email, password, name }: SignUpForm) {
    mutate({ email, password, name });
  }

  const handleOAuth = async (provider: "google" | "yandex") => {
    setOauthLoading(provider);
    await signIn(provider, { callbackUrl: "/" });
  };

  return (
    <>
      <div className="flex flex-col items-center space-y-2 text-center">
        <Icons.aiMarketLogo className="h-16 w-auto" />
        <h1 className="text-2xl font-semibold tracking-tight">Создать аккаунт</h1>
        <Link
          className={buttonVariants({ variant: "link", className: "gap-1.5" })}
          href="/sign-in"
        >
          Уже есть аккаунт? Войти
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4">
        {/* OAuth */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => handleOAuth("google")}
            disabled={!!oauthLoading}
            className="gap-2"
          >
            {oauthLoading === "google" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="h-4 w-4" />
            )}
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOAuth("yandex")}
            disabled={!!oauthLoading}
            className="gap-2"
          >
            {oauthLoading === "yandex" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Icons.yandex className="h-4 w-4" />
            )}
            Яндекс
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">или</span>
          </div>
        </div>

        {/* Email / Password */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-1 py-1">
              <Label htmlFor="name">Имя (необязательно)</Label>
              <Input
                {...register("name")}
                id="name"
                placeholder="Иван Иванов"
                className={cn({ "focus-visible:ring-red-500": errors.name })}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

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

            <Button disabled={isLoading || !!oauthLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Зарегистрироваться
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default SignUp;
