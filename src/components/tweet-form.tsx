import { useState } from "react";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";

import { Avatar } from "./avatar";

export const TweetForm = ({
  parentId,
  placeholder,
}: {
  parentId?: string;
  placeholder: string;
}) => {
  const session = useSession();

  const [content, setContent] = useState("");

  const utils = api.useContext();

  const { isLoading, mutate } = api.tweets.create.useMutation({
    onSuccess: () => {
      setContent("");
      if (parentId) {
        void utils.tweets.getById.invalidate({ id: parentId });
      } else {
        void utils.tweets.getInfinitePublicFeed.invalidate();
      }
    },
  });

  if (session.status !== "authenticated") return null;

  return (
    <div className="flex w-full items-center border-b border-slate-600/75 p-4">
      <Avatar src={session.data.user.image ?? ""} />
      <input
        className="ml-4 mr-8 h-full grow bg-inherit px-1 py-2 text-lg focus:outline-none"
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyUp={(e) => {
          if (e.code === "Enter") {
            e.preventDefault();

            if (content !== "") mutate({ content, parentId });
          }
        }}
        disabled={isLoading}
      />
    </div>
  );
};
