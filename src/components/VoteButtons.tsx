"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface VoteButtonsProps {
  targetId: string;
  type: "product" | "post";
  initialVoteCount: number;
  initialPositiveVotes: number;
}

export default function VoteButtons({
  targetId,
  type,
  initialVoteCount,
  initialPositiveVotes,
}: VoteButtonsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [positiveVotes, setPositiveVotes] = useState(initialPositiveVotes);
  const [loading, setLoading] = useState(false);

  const negativeVotes = voteCount - positiveVotes;

  const vote = async (isPositive: boolean) => {
    if (!session) {
      router.push("/sign-in");
      return;
    }
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/vote/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [`${type}Id`]: targetId, isPositive }),
      });
      if (res.ok) {
        const data = await res.json();
        setVoteCount(data.voteCount);
        setPositiveVotes(data.positiveVotes);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => vote(true)}
        disabled={loading}
        className="flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-green-50 text-green-600 border border-green-200 hover:border-green-400 transition-colors disabled:opacity-50"
      >
        <ThumbsUp size={13} />
        <span>{positiveVotes}</span>
      </button>
      <button
        onClick={() => vote(false)}
        disabled={loading}
        className="flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-red-50 text-red-500 border border-red-200 hover:border-red-400 transition-colors disabled:opacity-50"
      >
        <ThumbsDown size={13} />
        <span>{negativeVotes}</span>
      </button>
    </div>
  );
}
