import { signIn, signOut, useSession } from "next-auth/react";

import { Avatar } from "~/components/avatar";

export const Footer = () => {
  const session = useSession();

  const loggedIn = session.status === "authenticated";

  return (
    <div className="flex items-center justify-between border-t border-slate-600/75 p-4">
      <div className="flex items-center gap-1">
        {loggedIn && (
          <>
            <Avatar src={session.data?.user.image ?? ""} />
            <div className="ml-4 flex flex-col">
              <span className="font-bold">{session.data.user.name}</span>
              <span>@{session.data.user.username}</span>
            </div>
          </>
        )}
      </div>

      <button
        className="h-fit rounded-full bg-blue-300 px-3 py-1 text-blue-950"
        onClick={() => void (loggedIn ? signOut() : signIn())}
      >
        {loggedIn ? "Sign Out" : "Sign In"}
      </button>
    </div>
  );
};
