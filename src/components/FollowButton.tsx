"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserPlus, UserMinus } from "lucide-react";

interface FollowButtonProps {
  followingId: string;
}

export default function FollowButton({ followingId }: FollowButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch(`/api/follow?followingId=${followingId}`)
      .then((r) => r.json())
      .then((d) => setFollowing(d.following ?? false));
  }, [session, followingId]);

  const toggle = async () => {
    if (!session) {
      router.push("/sign-in");
      return;
    }
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followingId }),
      });
      if (res.ok) {
        const data = await res.json();
        setFollowing(data.following);
      }
    } finally {
      setLoading(false);
    }
  };

  if (session?.user?.id === followingId) return null;

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
        following
          ? "border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-600"
          : "border-[#005BFF] text-[#005BFF] hover:bg-[#005BFF] hover:text-white"
      }`}
    >
      {following ? (
        <>
          <UserMinus size={13} /> Отписаться
        </>
      ) : (
        <>
          <UserPlus size={13} /> Подписаться
        </>
      )}
    </button>
  );
}
