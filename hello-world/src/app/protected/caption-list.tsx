"use client";

import { useState } from "react";
import { createClient } from "../utils/supabase/client";

type Caption = {
  id: number;
  content: string;
  like_count: number;
  images: { url: string }[] | null;
};

export default function CaptionList({
  captions,
  userId,
}: {
  captions: Caption[];
  userId: string;
}) {
  const supabase = createClient();
  const [voted, setVoted] = useState<Record<number, number | null>>({});
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>(
    () => Object.fromEntries(captions.map((c) => [c.id, c.like_count]))
  );
  const [message, setMessage] = useState<{ captionId: number; text: string; type: "success" | "error" } | null>(null);

  const handleVote = async (captionId: number, voteValue: number) => {
    if (voted[captionId] === voteValue) return;

    const { error } = await supabase.from("caption_votes").insert({
      caption_id: captionId,
      profile_id: userId,
      vote_value: voteValue,
      created_datetime_utc: new Date().toISOString(),
    });

    if (error) {
      setMessage({ captionId, text: `Vote failed: ${error.message}`, type: "error" });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setVoted((prev) => ({ ...prev, [captionId]: voteValue }));
      setLikeCounts((prev) => ({
        ...prev,
        [captionId]: prev[captionId] + voteValue,
      }));
      setMessage({ captionId, text: voteValue === 1 ? "Upvoted!" : "Downvoted!", type: "success" });
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const captionsWithImages = captions.filter((c) => c.images?.[0]?.url);

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {captionsWithImages.map((caption) => (
        <li
          key={caption.id}
          className="bg-white/10 text-white rounded-xl overflow-hidden backdrop-blur-sm"
        >
          <img
            src={caption.images![0].url}
            alt={caption.content}
            className="w-full aspect-square object-contain bg-black/20"
          />
          <div className="p-3">
            <p className="text-sm leading-snug mb-3">{caption.content}</p>
            {message?.captionId === caption.id && (
              <p className={`text-xs mb-2 ${message.type === "success" ? "text-green-300" : "text-red-300"}`}>
                {message.text}
              </p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-xs">{likeCounts[caption.id]} likes</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleVote(caption.id, 1)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    voted[caption.id] === 1
                      ? "bg-green-500 text-white scale-105"
                      : "bg-white/10 hover:bg-green-500/30 text-white/70 hover:text-white"
                  }`}
                >
                  Up
                </button>
                <button
                  onClick={() => handleVote(caption.id, -1)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    voted[caption.id] === -1
                      ? "bg-red-500 text-white scale-105"
                      : "bg-white/10 hover:bg-red-500/30 text-white/70 hover:text-white"
                  }`}
                >
                  Down
                </button>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
