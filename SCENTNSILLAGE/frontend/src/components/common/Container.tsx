import type { PropsWithChildren } from "react";

export function Container({ children }: PropsWithChildren) {
  return <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">{children}</div>;
}
