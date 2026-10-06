import type { ReactNode } from "react";
import Loader from "./Loader";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      <Loader />
      <div className="site-content">{children}</div>
    </>
  );
}
