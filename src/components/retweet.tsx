import Link from "next/link";

import { Avatar } from "~/components/avatar";
import type { TweetType } from "~/components/tweet";

export type RetweetType = TweetType["retweeted"];

export const Retweet = ({
  retweet,
}: {
  retweet: RetweetType | TweetType | null;
}) => {
  if (!retweet) return null;

  return (
    <div className="m-2 flex flex-col rounded-sm border border-slate-400 p-2 hover:bg-slate-900">
      <div className="flex gap-2">
        <Avatar src={retweet.creator.image ?? ""} size="micro" />
        <Link href={`/@${retweet.creator.username ?? ""}`}>
          <span className="font-bold text-slate-100 hover:underline">
            {retweet.creator.name ?? ""}
          </span>
          <span className="ml-2">@{retweet.creator.username ?? ""}</span>
        </Link>
        <span>·</span>
        <span className="hover:underline">
          {retweet.createdAt.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          })}
        </span>
      </div>
      <div className="px-2 pt-2">{retweet.content}</div>
    </div>
  );
};
