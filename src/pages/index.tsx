import type { NextPage } from "next";

import { Feed } from "~/components/feed";
import { Footer } from "~/components/footer";
import { Layout } from "~/components/layout";
import { TweetForm } from "~/components/tweet-form";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data: tweets, isLoading } = api.tweets.getAll.useQuery({});

  return (
    <Layout>
      <TweetForm placeholder="What's on your mind?" />
      <Feed isLoading={isLoading} tweets={tweets} />
      <Footer />
    </Layout>
  );
};

export default Home;
