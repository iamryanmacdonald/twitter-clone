import { useRef } from "react";
import type { Tweet as TweetType } from "@prisma/client";
import InfiniteScroll from "react-infinite-scroll-component";

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
  fetchNextPage,
  hasNextPage,
  isLoading,
  tweets,
}: {
  fetchNextPage: () => Promise<unknown>;
  hasNextPage: boolean | undefined;
  isLoading: boolean;
  tweets: FeedTweet[] | undefined;
}) => {
  if (isLoading)
    return (
      <div className="grow overflow-y-scroll">
        <LoadingSpinner />
      </div>
    );

  if (!tweets || tweets.length === 0)
    return <div className="grow pt-4 text-center text-lg">No Tweets Found</div>;

  return (
    <div className="grow overflow-y-scroll" id="scrollable">
      <InfiniteScroll
        dataLength={tweets.length}
        endMessage={
          <div className="font-lg py-4 text-center">No more tweets found!</div>
        }
        hasMore={hasNextPage ?? false}
        loader={<LoadingSpinner />}
        next={fetchNextPage}
        scrollableTarget="scrollable"
      >
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} />
        ))}
      </InfiniteScroll>
    </div>
  );
};
