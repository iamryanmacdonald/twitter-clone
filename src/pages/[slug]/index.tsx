import { MouseEventHandler } from "react";
import type { GetStaticProps, NextPage } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { Loader2 } from "lucide-react";
import superjson from "superjson";

import { Avatar } from "~/components/avatar";
import { BackButton } from "~/components/back-button";
import { Feed } from "~/components/feed";
import { Layout } from "~/components/layout";
import { LoadingSpinner } from "~/components/loading";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

const Page: NextPage<{ username: string }> = ({ username }) => {
  const { data: userData, isLoading: isLoadingUser } =
    api.users.getByUsername.useQuery({
      username,
    });
  const {
    data: tweetData,
    fetchNextPage,
    hasNextPage,
    isLoading: isLoadingTweets,
  } = api.tweets.getInfiniteByUsername.useInfiniteQuery({ username });
  const { isLoading: isMutating, mutate } = api.users.follow.useMutation({
    onSuccess: () => {
      void utils.users.getByUsername.invalidate({ username });
    },
  });
  const utils = api.useContext();

  if (isLoadingUser)
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );

  if (!userData || !userData.user)
    return (
      <Layout>
        <div className="mx-auto mt-8 text-2xl">User not found</div>
      </Layout>
    );

  const followOnClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    if (userData.user) mutate({ follow: !following, id: userData.user.id });
  };

  const { following, user } = userData;

  return (
    <Layout>
      <div className="h-32 bg-slate-900">
        <BackButton className="ml-2 mt-2" />
      </div>
      <div className="-mt-16 flex h-32 items-center justify-between  px-8">
        <Avatar
          size="large"
          src={user.image ?? ""}
          className="border-2 border-slate-950"
        />
        <div className="flex items-center gap-8 bg-slate-950/75 px-4 py-2">
          <div className="flex flex-col">
            <span className="text-lg font-semibold">{user.name}</span>
            <span className="text-slate-500">@{user.username}</span>
          </div>
          <button
            className={`h-fit rounded-md px-2 py-1 ${
              following ? "bg-red-700" : "bg-slate-500"
            }`}
            onClick={followOnClick}
            disabled={isMutating}
          >
            {isMutating ? (
              <Loader2 className="animate-spin" />
            ) : following ? (
              "Unfollow"
            ) : (
              "Follow"
            )}
          </button>
        </div>
      </div>
      <Feed
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isLoading={isLoadingTweets}
        tweets={tweetData?.pages.flatMap((page) => page.tweets)}
      />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug as string;

  if (!slug.startsWith("@"))
    return { props: {}, redirect: { destination: "/" } };

  const helpers = createServerSideHelpers({
    ctx: { prisma, session: null },
    router: appRouter,
    transformer: superjson,
  });

  const username = slug.slice(1);

  await helpers.users.getByUsername.prefetch({ username });

  return { props: { username }, revalidate: 1 };
};

export const getStaticPaths = () => {
  return {
    fallback: "blocking",
    paths: [],
  };
};

export default Page;
