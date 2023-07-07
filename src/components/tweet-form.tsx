import { useState } from "react";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";

import { Avatar } from "./avatar";

export const TweetForm = () => {
  const session = useSession();

  const [content, setContent] = useState("");

  const utils = api.useContext();

  const { mutate } = api.tweets.create.useMutation({
    onSuccess: () => {
      setContent("");
      void utils.tweets.getAll.invalidate();
    },
  });

  if (session.status !== "authenticated") return null;

  return (
    <div className="flex w-full items-center border-b border-slate-600/75 p-4">
      <Avatar src={session.data.user.image ?? ""} />
      <input
        className="ml-4 mr-8 h-full grow bg-inherit px-1 py-2 text-lg focus:outline-none"
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyUp={(e) => {
          if (e.code === "Enter") {
            e.preventDefault();

            if (content !== "") mutate({ content });
          }
        }}
      />
    </div>
  );
};
