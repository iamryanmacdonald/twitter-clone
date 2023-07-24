import { useState } from "react";
import { X } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import ReactModal from "react-modal";

import { LoadingSpinner } from "~/components/loading";
import { Tweet, type TweetType } from "~/components/tweet";
import { TweetForm } from "~/components/tweet-form";

export const Feed = ({
  fetchNextPage,
  hasNextPage,
  isLoading,
  tweets,
}: {
  fetchNextPage: () => Promise<unknown>;
  hasNextPage: boolean | undefined;
  isLoading: boolean;
  tweets: TweetType[] | undefined;
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalTweet, setModalTweet] = useState<TweetType | null>(null);

  if (isLoading)
    return (
      <div className="grow overflow-y-scroll">
        <LoadingSpinner />
      </div>
    );

  if (!tweets || tweets.length === 0)
    return <div className="grow pt-4 text-center text-lg">No Tweets Found</div>;

  const closeModal = () => setModalIsOpen(false);

  const openModal = (tweet: TweetType) => {
    setModalTweet(tweet);
    setModalIsOpen(true);
  };

  return (
    <>
      <div className="grow overflow-y-scroll" id="scrollable">
        <InfiniteScroll
          dataLength={tweets.length}
          endMessage={
            <div className="font-lg py-4 text-center">
              No more tweets found!
            </div>
          }
          hasMore={hasNextPage ?? false}
          loader={<LoadingSpinner />}
          next={fetchNextPage}
          scrollableTarget="scrollable"
        >
          {tweets.map((tweet) => (
            <Tweet
              key={tweet.id}
              openModal={() => openModal(tweet)}
              tweet={tweet}
            />
          ))}
        </InfiniteScroll>
      </div>
      <ReactModal
        isOpen={modalIsOpen}
        className="absolute left-1/2 top-1/2 h-fit w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-slate-950"
        onRequestClose={closeModal}
        style={{ overlay: { backgroundColor: "rgba(30, 41, 59, 0.5)" } }}
      >
        <X
          className="absolute right-1 top-1 h-8 w-8 hover:cursor-pointer"
          onClick={() => closeModal()}
        />
        <TweetForm placeholder="What are your thoughts?" retweet={modalTweet} />
      </ReactModal>
    </>
  );
};
