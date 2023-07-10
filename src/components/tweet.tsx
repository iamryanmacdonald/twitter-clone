import Link from "next/link";
import type { inferRouterOutputs } from "@trpc/server";

import { Avatar } from "~/components/avatar";
import type { AppRouter } from "~/server/api/root";

type TweetInput = inferRouterOutputs<AppRouter>["tweets"]["getAll"][number];

export const Tweet = ({ tweet }: { tweet: TweetInput }) => {
  const { content, createdAt, creator } = tweet;

  return (
    <div className="flex items-center gap-4 border-b border-slate-500/50 p-4">
      <Avatar src={creator.image ?? ""} />
      <div className="flex flex-col">
        <div className="flex gap-2 text-slate-400">
          <Link href={`/@${creator.username ?? ""}`}>
            <span className="font-bold text-slate-300">
              {creator.name ?? ""}
            </span>
            <span className="ml-2">@{creator.username ?? ""}</span>
          </Link>
          <span>·</span>
          <span>
            {createdAt.toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>
        <div>{content}</div>
      </div>
    </div>
  );
};
