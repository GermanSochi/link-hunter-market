"use client";

import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { CheckCircle } from "lucide-react";

function VerifyEmail() {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <CheckCircle className="h-12 w-12 text-green-500" />
      <h3 className="font-semibold text-2xl">Аккаунт создан!</h3>
      <p className="text-muted-foreground text-center">
        Регистрация прошла успешно. Войдите в аккаунт.
      </p>
      <Link className={buttonVariants({ className: "mt-4" })} href="/sign-in">
        Войти
      </Link>
    </div>
  );
}

export default VerifyEmail;
