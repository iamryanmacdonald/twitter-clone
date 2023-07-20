import { MouseEventHandler, useState } from "react";
import Link from "next/link";
import type { inferRouterOutputs } from "@trpc/server";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";

import { Avatar } from "~/components/avatar";
import type { AppRouter } from "~/server/api/root";
import { api } from "~/utils/api";

type TweetInput =
  inferRouterOutputs<AppRouter>["tweets"]["getInfiniteByUsername"]["tweets"][number];

export const Tweet = ({ tweet }: { tweet: TweetInput }) => {
  const { content, createdAt, creator, id, likes } = tweet;
  const { data: session } = useSession();
  const { mutate } = api.tweets.like.useMutation({
    onSuccess: (userLiked) => {
      if (liked && !userLiked) setLikesCount(likesCount - 1);
      if (!liked && userLiked) setLikesCount(likesCount + 1);

      setLiked(userLiked);
    },
  });

  const [liked, setLiked] = useState(
    session && likes.map((like) => like.userId).includes(session.user.id)
  );
  const [likesCount, setLikesCount] = useState(likes.length);

  const likeOnClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();

    mutate({ id, like: !liked });
  };

  return (
    <Link
      href={`/@${creator.username ?? ""}/${id}`}
      className="flex items-center gap-4 border-b border-slate-500/50 p-4 hover:bg-slate-900"
    >
      <Link href={`/@${creator.username ?? ""}`}>
        <Avatar src={creator.image ?? ""} />
      </Link>
      <div className="flex flex-col">
        <div className="flex gap-2 text-slate-400">
          <Link href={`/@${creator.username ?? ""}`}>
            <span className="font-bold text-slate-100 hover:underline">
              {creator.name ?? ""}
            </span>
            <span className="ml-2">@{creator.username ?? ""}</span>
          </Link>
          <span>·</span>
          <span className="hover:underline">
            {createdAt.toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>
        <div>{content}</div>
        <div className="mt-2 flex gap-4">
          <div className="flex gap-2" onClick={likeOnClick}>
            <Heart
              className={
                liked
                  ? "fill-red-500 text-red-500 hover:fill-inherit hover:text-inherit"
                  : "hover:fill-red-500 hover:text-red-500"
              }
            />
            <span>{likesCount}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
