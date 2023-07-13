import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";

import { Avatar } from "~/components/avatar";
import { BackButton } from "~/components/back-button";
import { Feed } from "~/components/feed";
import { Layout } from "~/components/layout";
import { LoadingSpinner } from "~/components/loading";
import { TweetForm } from "~/components/tweet-form";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

const Page: NextPage<{ id: string }> = ({ id }) => {
  const { data: tweet, isLoading: isLoadingTweet } =
    api.tweets.getById.useQuery({ id });
  const {
    data: replies,
    fetchNextPage,
    hasNextPage,
    isLoading: isLoadingReplies,
  } = api.tweets.getRepliesById.useInfiniteQuery({ id });

  if (isLoadingTweet)
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );

  if (!tweet)
    return (
      <Layout>
        <div className="mx-auto mt-8 text-2xl">Tweet not found</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="flex items-center gap-8 p-2">
        <BackButton type="light" />
        <span className="text-xl font-bold">Tweet</span>
      </div>
      <div className="flex w-fit items-center gap-1 p-4">
        <Link href={`/@${tweet.creator.username ?? ""}`}>
          <Avatar src={tweet.creator.image ?? ""} />
        </Link>
        <div className="ml-4 flex flex-col">
          <Link
            href={`/@${tweet.creator.username ?? ""}`}
            className="font-bold hover:underline"
          >
            {tweet.creator.name}
          </Link>
          <Link href={`/@${tweet.creator.username ?? ""}`}>
            @{tweet.creator.username}
          </Link>
        </div>
      </div>
      <div className="border-b border-slate-600/75 px-4 pb-4 text-lg">
        {tweet.content}
      </div>
      <TweetForm placeholder="Tweet your reply!" parentId={tweet.id} />
      <Feed
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isLoading={isLoadingReplies}
        tweets={replies?.pages.flatMap((page) => page.replies)}
      />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id as string;

  const helpers = createServerSideHelpers({
    ctx: { prisma, session: null },
    router: appRouter,
    transformer: superjson,
  });

  await helpers.tweets.getById.prefetch({ id });

  return { props: { id }, revalidate: 1 };
};

export const getStaticPaths = () => {
  return {
    fallback: "blocking",
    paths: [],
  };
};

export default Page;
