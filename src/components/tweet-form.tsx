import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Avatar } from "~/components/avatar";
import { Retweet, type RetweetType } from "~/components/retweet";
import { api } from "~/utils/api";

export const TweetForm = ({
  className,
  parentId,
  placeholder,
  retweet,
}: {
  className?: string;
  parentId?: string;
  placeholder: string;
  retweet?: RetweetType;
}) => {
  const session = useSession();
  const router = useRouter();

  const [content, setContent] = useState("");

  const { isLoading, mutate } = api.tweets.create.useMutation({
    onSuccess: (tweet) => {
      setContent("");

      router.push(`/@${tweet.creator.username ?? ""}/${tweet.id}`);
    },
  });

  if (session.status !== "authenticated") return null;

  return (
    <div
      className={`flex w-full items-center border-b border-slate-600/75 p-4 ${
        className ?? ""
      }`}
    >
      <Avatar src={session.data.user.image ?? ""} />
      <div className="ml-4 flex grow flex-col">
        <input
          className=" mr-8 h-full  bg-inherit px-1 py-2 text-lg focus:outline-none"
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyUp={(e) => {
            if (e.code === "Enter") {
              e.preventDefault();

              if (retweet) {
                mutate({ content, parentId, retweetedId: retweet.id });
              } else {
                if (content !== "") mutate({ content, parentId });
              }
            }
          }}
          disabled={isLoading}
        />
        {retweet && <Retweet retweet={retweet} />}
      </div>
    </div>
  );
};
