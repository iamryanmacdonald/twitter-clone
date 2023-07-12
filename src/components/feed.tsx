import type { Tweet as TweetType } from "@prisma/client";

import { LoadingSpinner } from "~/components/loading";
import { Tweet } from "~/components/tweet";

type FeedTweet = TweetType & {
  creator: {
    image: string | null;
    name: string | null;
    username: string | null;
  };
};

export const Feed = ({
  isLoading,
  tweets,
}: {
  isLoading: boolean;
  tweets: FeedTweet[] | undefined;
}) => {
  return (
    <div className="grow overflow-y-scroll">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        tweets && tweets.map((tweet) => <Tweet key={tweet.id} tweet={tweet} />)
      )}
    </div>
  );
};
