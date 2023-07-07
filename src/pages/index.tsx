import type { NextPage } from "next";

import { Footer } from "~/components/footer";
import { Layout } from "~/components/layout";
import { Tweet } from "~/components/tweet";
import { TweetForm } from "~/components/tweet-form";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data } = api.tweets.getAll.useQuery({});

  return (
    <Layout>
      <TweetForm />
      <div className="grow overflow-y-scroll">
        {data && data.map((tweet) => <Tweet key={tweet.id} tweet={tweet} />)}
      </div>
      <Footer />
    </Layout>
  );
};

export default Home;
