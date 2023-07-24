import { useState, type MouseEventHandler } from "react";
import Link from "next/link";
import type { inferRouterOutputs } from "@trpc/server";
import { Heart, Repeat } from "lucide-react";
import { useSession } from "next-auth/react";

import { Avatar } from "~/components/avatar";
import type { AppRouter } from "~/server/api/root";
import { api } from "~/utils/api";

import { Retweet } from "./retweet";

export type TweetType =
  inferRouterOutputs<AppRouter>["tweets"]["getInfiniteByUsername"]["tweets"][number];

export const Tweet = ({
  openModal,
  tweet,
}: {
  openModal: () => void;
  tweet: TweetType;
}) => {
  const { content, createdAt, creator, id, likes, retweeted, retweets } = tweet;
  const { data: session } = useSession();
  const { mutate } = api.tweets.like.useMutation({
    onSuccess: (userLiked) => {
      if (liked && !userLiked) setLikesCount(likesCount - 1);
      if (!liked && userLiked) setLikesCount(likesCount + 1);

      setLiked(userLiked);
    },
  });

  const hasLiked =
    session && likes.map((like) => like.userId).includes(session.user.id);
  const hasRetweeted =
    session &&
    retweets.map((retweet) => retweet.creatorId).includes(session.user.id);

  const [liked, setLiked] = useState(hasLiked);
  const [likesCount, setLikesCount] = useState(likes.length);

  const likeOnClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();

    mutate({ id, like: !liked });
  };

  const retweetOnClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();

    if (!hasRetweeted) openModal();
  };

  return (
    <Link
      href={`/@${creator.username ?? ""}/${id}`}
      className="flex items-center gap-4 border-b border-slate-500/50 p-4 hover:bg-slate-900"
    >
      <Link href={`/@${creator.username ?? ""}`}>
        <Avatar src={creator.image ?? ""} />
      </Link>
      <div className="flex w-full flex-col">
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
        {retweeted && <Retweet retweet={tweet.retweeted} />}
        <div className="mt-2 flex gap-4">
          <div className="group flex gap-2" onClick={likeOnClick}>
            <Heart
              className={
                liked
                  ? "fill-red-500 text-red-500 group-hover:fill-inherit group-hover:text-inherit"
                  : "group-hover:fill-red-500 group-hover:text-red-500"
              }
            />
            <span>{likesCount}</span>
          </div>
          <div className="group flex gap-2" onClick={retweetOnClick}>
            <Repeat
              className={
                hasRetweeted
                  ? "fill-green-500 text-green-500"
                  : "group-hover:fill-green-500 group-hover:text-green-500"
              }
            />
            <span>{retweets.length}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
