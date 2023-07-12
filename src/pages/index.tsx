import type { NextPage } from "next";

import { Feed } from "~/components/feed";
import { Footer } from "~/components/footer";
import { Layout } from "~/components/layout";
import { TweetForm } from "~/components/tweet-form";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data, fetchNextPage, hasNextPage, isLoading } =
    api.tweets.getInfinitePublicFeed.useInfiniteQuery(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  return (
    <Layout>
      <TweetForm placeholder="What's on your mind?" />
      <Feed
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        tweets={data?.pages.flatMap((page) => page.tweets)}
      />
      <Footer />
    </Layout>
  );
};

export default Home;
