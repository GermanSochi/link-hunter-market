"use client";

import { signOut as nextAuthSignOut } from "next-auth/react";
import { toast } from "sonner";

export const useAuth = () => {
  const signOut = async () => {
    try {
      await nextAuthSignOut({ callbackUrl: "/sign-in" });
      toast.success("Вы вышли из аккаунта");
    } catch {
      toast.error("Не удалось выйти. Попробуйте ещё раз.");
    }
  };

  return { signOut };
};
