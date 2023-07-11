import type { GetStaticProps, NextPage } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";

import { Avatar } from "~/components/avatar";
import { BackButton } from "~/components/back-button";
import { Layout } from "~/components/layout";
import { LoadingSpinner } from "~/components/loading";
import { Tweet } from "~/components/tweet";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

const Page: NextPage<{ username: string }> = ({ username }) => {
  const { data: user, isLoading } = api.users.getByUsername.useQuery({
    username,
  });

  if (isLoading)
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );

  if (!user)
    return (
      <Layout>
        <div className="mx-auto mt-8 text-2xl">User not found</div>
      </Layout>
    );

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
        <div className="flex flex-col bg-slate-950/75 px-4 py-2">
          <span className="text-lg font-semibold">{user.name}</span>
          <span className="text-slate-500">@{user.username}</span>
        </div>
      </div>
      <div className="flex flex-col border-t border-slate-500/50">
        {user.tweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} />
        ))}
      </div>
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
