import type { PropsWithChildren } from "react";

export const Layout = (props: PropsWithChildren) => {
  return (
    <main className="mx-auto flex h-screen w-1/3 flex-col border-x border-slate-600/75">
      {props.children}
    </main>
  );
};
